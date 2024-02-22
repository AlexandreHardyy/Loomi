import { Player } from './User';

export class Party {
  id: string = Math.random().toString(36);
  players = new Map<string, Player>();
  constructor() {}

  joinTheParty(player: Player) {
    this.players.set(player.id, player);
  }

  leaveTheParty(player: Player) {
    this.players.delete(player.id);
  }
}
