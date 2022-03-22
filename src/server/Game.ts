import GameManager from '../game-state/GameManager';
import Player from './ConnectedPlayer';
import GameSettings from '../config/GameSettings';

export default class Game {
    private players: {[key: number]: Player};
    private id: string;

    constructor(settings: GameSettings, player1: Player, player2: Player) {
        this.id = Math.random().toString();
        if(Math.random() < 0.5) {
            this.players = {
                0: player1,
                1: player2,
            }
        }
        else {
            this.players = {
                0: player2,
                1: player1,
            }
        }

        const gameManager = new GameManager(settings, (playerId, state) => {
            this.players[playerId].send('update-state', state);

            if(state.gameWon || state.gameLost) {
                for(const id in this.players) {
                    this.players[id].removeListeners(this.id);
                }
            }
        });

        for(const id in this.players) {
            const player = this.players[id];
            player.on('set-ships', this.id, ships => gameManager.setShips(+id, ships));
            player.on('fire-shot', this.id, target => gameManager.fireShot(+id, target));
            player.on('disconnect', this.id, () => gameManager.leaveGame(+id));
            player.on('leave-game', this.id, () => gameManager.leaveGame(+id));
            player.send('quick-match-found', settings);
        }
    }
}