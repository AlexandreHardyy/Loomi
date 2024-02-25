import { Player } from './User';

export class Party {
  id: string = Math.random().toString(36);
  players = new Map<string, Player>();
  readyPlayers = 0;
  quiz: any;
  actualQuestion = 0;
  messages = new Map<string, Player>();
  timer: NodeJS.Timeout | null = null;

  constructor() {}

  joinTheParty(player: Player) {
    this.players.set(player.id, player);
  }

  leaveTheParty(player: Player) {
    this.players.delete(player.id);
  }

  getActualQuestion() {
    return this.quiz.questions[this.actualQuestion];
  }

  incrementQuestion() {
    this.actualQuestion++;
  }
}
