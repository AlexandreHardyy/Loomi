import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Party } from '../utils/Party';
import { Player } from '../utils/User';
import {
  CreatePartyDataInterface,
  JoinPartyDataInterface,
} from './interface/party.interface';
import { QuizzesService } from './quizzes.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class QuizzesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  parties = new Map<string, Party>();
  usersInParties = new Map<string, string>();

  constructor(private quizzesService: QuizzesService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    const roomId = this.usersInParties.get(client.id);
    if (roomId) {
      const party = this.parties.get(roomId);
      if (party) {
        const player = party.players.get(client.id);
        if (player) {
          party.leaveTheParty(player);
          if (party.players.size === 0) this.parties.delete(roomId);
          this.server.to(roomId).emit('player-left', player);
          this.usersInParties.delete(client.id);
        }
      }
    }
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('create-party')
  async handleCreateParty(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreatePartyDataInterface,
  ) {
    const party = new Party();
    party.quiz = await this.quizzesService.findOne(Number(data.quizId));
    const player = new Player(data.username, client.id, false, true);
    party.joinTheParty(player);
    client.join(party.id);
    this.usersInParties.set(client.id, party.id);

    this.parties.set(party.id, party);

    return {
      status: 'created',
      partyId: party.id,
      players: Object.fromEntries(party.players),
      maxPlayers: party.maxPlayers,
    };
  }

  @SubscribeMessage('join-party')
  handleJoinParty(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinPartyDataInterface,
  ) {
    const party = this.parties.get(data.partyId);
    const player = new Player(data.username, client.id, false);

    if (party) {
      party.joinTheParty(player);
      client.join(party.id);
      client.broadcast.to(party.id).emit('player-joined', {
        players: Object.fromEntries(party.players),
        maxPlayers: party.maxPlayers,
      });
      this.usersInParties.set(client.id, party.id);
    } else {
      return { status: 'not-found' };
    }

    return {
      status: 'joined',
      partyId: party.id,
      players: Object.fromEntries(party.players),
    };
  }

  @SubscribeMessage('start-party')
  handleStartParty(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const party = this.parties.get(data.partyId);
    if (party) {
      this.server.to(party.id).emit('party-started', { partyId: party.id });
    } else {
      return { status: 'not-found' };
    }
  }

  @SubscribeMessage('ready-for-game')
  handleReadyForGame(@ConnectedSocket() client: Socket) {
    const party = this.parties.get(this.usersInParties.get(client.id) ?? '');
    if (party) {
      party.readyPlayers += 1;
      if (party.players.size === party.readyPlayers) {
        this.sendNextQuestion(party);
        party.readyPlayers = 0;
      }
    } else {
      return { status: 'not-found' };
    }
  }

  @SubscribeMessage('play')
  handlePlay(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const party = this.parties.get(this.usersInParties.get(client.id) ?? '');
    if (party) {
      const player = party.players.get(client.id);
      if (player) {
        if (
          this.checkUserAnswer(
            party.getActualQuestion().correctResponses,
            data.response,
          )
        )
          player.incrementScore();
      }
      party.readyPlayers++;
      if (party.readyPlayers === party.players.size) {
        party.incrementQuestion();
        if (this.checkIfGameIsFinished(party)) return;
        this.sendNextQuestion(party);
        party.readyPlayers = 0;
      } else {
        this.server.to(party.id).emit('player-answered', {
          totalAnswers: party.readyPlayers,
          totalPlayers: party.players.size,
        });
      }
    } else {
      return { status: 'not-found' };
    }
  }

  setupTimer(party: Party) {
    const timer = setTimeout(() => {
      party.incrementQuestion();
      if (this.checkIfGameIsFinished(party)) return;
      this.sendNextQuestion(party);
      party.readyPlayers = 0;
    }, party.getActualQuestion().timeInSeconds * 1000);
    party.timer && clearTimeout(party.timer);
    party.timer = timer;
  }

  checkIfGameIsFinished(party: Party) {
    if (party.actualQuestion === party.quiz.questions.length) {
      this.server.to(party.id).emit('game-finished', {
        players: Object.fromEntries(party.players),
      });
      return true;
    }
    return false;
  }

  checkUserAnswer = (correctAnswers: string[], userAnswers: string[]) => {
    if (userAnswers.length !== correctAnswers.length) {
      return false;
    }
    for (let i = 0; i < correctAnswers.length; i++) {
      if (userAnswers[i] !== correctAnswers[i]) {
        return false;
      }
    }
    return true;
  };

  sendNextQuestion(party: Party) {
    this.server.to(party.id).emit('get-ready-question', {
      players: Object.fromEntries(party.players),
    });
    setTimeout(() => {
      this.server.to(party.id).emit('next-question', {
        question: party.getActualQuestion(),
      });
      this.setupTimer(party);
    }, 5000);
  }

  @SubscribeMessage('send-message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const party = this.parties.get(this.usersInParties.get(client.id) ?? '');
    if (party) {
      const player = party.players.get(client.id);
      if (player) {
        party.messages.set(data.message, player);
        this.server.to(party.id).emit('new-message', {
          player,
          message: data.message,
        });
      }
    } else {
      return { status: 'not-found' };
    }
  }

  @SubscribeMessage('all-messages')
  handleAllMessages(@ConnectedSocket() client: Socket) {
    const party = this.parties.get(this.usersInParties.get(client.id) ?? '');
    if (party) {
      return {
        messages: Object.fromEntries(party.messages),
      };
    } else {
      return { status: 'not-found' };
    }
  }

  @SubscribeMessage('change-time-for-next-question')
  handleChangeTimeForNextQuestion(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const party = this.parties.get(this.usersInParties.get(client.id) ?? '');
    if (party) {
      party.newTimer = data.timeInSeconds;
      party.votes.set(client.id, true);
      this.server.to(party.id).emit('launch-vote-new-time', data.timeInSeconds);
    } else {
      return { status: 'not-found' };
    }
  }

  @SubscribeMessage('vote-new-time')
  handleVoteNewTime(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const party = this.parties.get(this.usersInParties.get(client.id) ?? '');
    if (party) {
      party.votes.set(client.id, data.vote);
      if (party.votes.size === party.players.size) {
        const trueVotes = Array.from(party.votes.values()).filter(
          (vote) => vote === true,
        ).length;
        if (trueVotes > party.players.size / 2) {
          party.quiz.questions[party.actualQuestion + 1].timeInSeconds =
            party.newTimer;
          this.server.to(party.id).emit('time-changed');
        }
      }
    } else {
      return { status: 'not-found' };
    }
  }
}
