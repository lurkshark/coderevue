export default class Game {

  constructor(
      seed = Date.now(),
      picks = []) {
    this.seed = seed;
    this.picks = [...picks];
  }

  static get Choices() {
    return {HI: 1, LO: 2, STOP: 3};
  }

  static Repository(localforage) {
    return {
      load: async (id) => {
        const gameKey = `Game:${id}`;
        const gameData = await localforage.getItem(gameKey);
        if (gameData === null) return null;
        return new Game(
          gameData.seed,
          gameData.turnRolls,
          gameData.totalDiceRolls,
          gameData.currentDice,
          gameData.scorecard,
          gameData.bonuses,
          gameData.time
        );
      },
      save: async (game) => {
        const gameKey = `Game:${game.id}`;
        await localforage.setItem(gameKey, {
          seed: game.seed,
          turnRolls: game.turnRolls,
          totalDiceRolls: game.totalDiceRolls,
          currentDice: game.currentDice,
          scorecard: game.scorecard,
          bonuses: game.bonuses,
          time: game.time
        });
        return game;
      }
    };
  }

  // A PRNG based on the 32-bit xorshift algorithm
  // https://www.jstatsoft.org/article/view/v008i14
  random(offset) {
    let y = this.seed;
    for (let i = 0; i < offset + 1; i++) {
      y ^= y << 13; y ^= y >>> 17; y ^= y << 5;
    }
    // Unsigned result divided by max uint32
    return (y >>> 0) / 4294967296;
  }

  value(offset = this.picks.length) {
    return this.random(offset);
  }

  done() {
    const last = this.picks.length - 1;
    if (this.picks.length === 0) return false;
    const wasHi = this.value(last) > this.value(last - 1);
    const wasLo = this.value(last) < this.value(last - 1);
    return this.picks[last] === Game.Choices.STOP
      || (this.picks[last] === Game.Choices.HI && wasLo)
      || (this.picks[last] === Game.Choices.LO && wasHi);
  }

  pick(choice) {
    if (this.done()) return false;

    return new Game(
      this.seed,
      [...this.picks, choice]
    );
  }
}
