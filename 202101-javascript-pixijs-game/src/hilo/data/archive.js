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

        const monthAgo = new Date(new Date().setDate(new Date().getDate() - 30));
        const games = await Promise.all(
          archiveData.gameIds.map(gameId => {
            return Game.Repository(localforage).load(gameId);
          });
        );

        const loadedGames =  games.filter(game => {
          return game !== null && game.time > monthAgo;
        });
        return new Archive(loadedGames);
      },
      save: async (archive) => {
        const archiveKey = 'Archive';
        await localforage.setItem(archiveKey, {
          gameIds: archive.games.map(game => game.id);
        });
        return archive;
      }
    };
  }

  recentGames(count) {
    return [...this.games.slice(0, count + 1)];
  }

  get currentGame() {
    return this.recentGames(1)[0] || null;
  }

  get gameIds() {
    return this.games.map(g => g.id);
  }

  registerGame(game) {
    if (this.currentGame === null) return new Archive([game]);
    if (this.gameIds.includes(game.id)) return this;
    return new Archive([game, ...this.games]);
  }
}
