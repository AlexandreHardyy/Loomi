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
    party.quiz = await this.quizzesService.findOne(1);
    const player = new Player(data.username, client.id, false);
    party.joinTheParty(player);
    client.join(party.id);
    this.usersInParties.set(client.id, party.id);

    this.parties.set(party.id, party);

    return {
      status: 'created',
      partyId: party.id,
      players: Object.fromEntries(party.players),
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
      client.broadcast
        .to(party.id)
        .emit('player-joined', { players: Object.fromEntries(party.players) });
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

  @SubscribeMessage('ready-to-play')
  handleReadyForGame(@ConnectedSocket() client: Socket) {
    const party = this.parties.get(this.usersInParties.get(client.id) ?? '');
    if (party) {
      party.readyPlayers++;
      if (party.readyPlayers === party.players.size) {
        if (party.actualQuestion === party.quiz.questions.length) {
          this.server.to(party.id).emit('game-finished');
          return;
        }
        this.server.to(party.id).emit('next-question', {
          question: party.getActualQuestion(),
        });
        party.readyPlayers = 0;
        party.incrementQuestion();
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
}
