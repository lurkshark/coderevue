import Game from './game';

export default class Archive {

  constructor(games = []) {
    this.games = games;
  }

  static Repository(localforage) {
    return {
      load: async () => {
        const archiveKey = 'Archive';
        const archiveData = await localforage.getItem(archiveKey);
        if (archiveData === null) {
          return Archive.Repository(localforage).save(new Archive());
        }

        const games = await Promise.all(
          archiveData.gameSeeds.map(gameSeed => {
            return Game.Repository(localforage).load(gameSeed);
          })
        );

        return new Archive(games);
      },
      save: async (archive) => {
        const archiveKey = 'Archive';
        await localforage.setItem(archiveKey, {
          gameSeeds: archive.games.map(game => game.seed)
        });
        return archive;
      }
    };
  }

  recentGames(count) {
    return this.games.slice(0, count + 1);
  }

  currentGame() {
    return this.recentGames(1)[0];
  }

  registerGame(game) {
    if (!this.currentGame()) return new Archive([game]);
    if (this.games.map(game => game.seed).includes(game.seed)) return this;
    return new Archive([game, ...this.games]);
  }
}
