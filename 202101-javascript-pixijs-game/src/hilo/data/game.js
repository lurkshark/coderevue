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
      load: async (seed) => {
        const gameKey = `Game:${seed}`;
        const gameData = await localforage.getItem(gameKey);
        if (gameData === null) return null;
        return new Game(
          gameData.seed,
          gameData.picks
        );
      },
      save: async (game) => {
        const gameKey = `Game:${game.seed}`;
        await localforage.setItem(gameKey, {
          seed: game.seed,
          picks: game.picks
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

  // The value for a given step; the "current" value
  // is going to be the number of picks made so far.
  // The first value is at offset zero because no
  // picks have been made. Then after the first pick
  // the current value will be that at offset one
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
