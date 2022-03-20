import GameSettings from '../config/GameSettings';
import GameManager from '../game-state/GameManager';
import Player from './ConnectedPlayer';

const settings: GameSettings = {
    gridSize: 7,
    ships: [
        { id: 1, size: 2, name: 'Patrol Boat' },
        { id: 2, size: 3, name: 'Destroyer' },
        { id: 3, size: 3, name: 'Submarine' },
        { id: 4, size: 4, name: 'Battleship' },
        { id: 5, size: 5, name: 'Aircraft Carrier' },
    ],
};

export default class Game {
    private players: {[key: number]: Player};
    private id: string;

    constructor(player1: Player, player2: Player) {
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
            player.send('quick-match-found');
        }
    }
}