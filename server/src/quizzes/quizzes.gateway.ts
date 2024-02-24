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
  constructor() {}

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
  handleCreateParty(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreatePartyDataInterface,
  ) {
    const party = new Party();
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
}
