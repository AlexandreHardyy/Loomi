export class Player {
  constructor(
    public username: string,
    public id: string,
    public ready: boolean = false,
    public score: number = 0,
  ) {}

  incrementScore() {
    this.score++;
  }
}
