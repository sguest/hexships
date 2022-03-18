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

    constructor(player1: Player, player2: Player) {
        this.players = {
            0: player1,
            1: player2,
        }

        const gameManager = new GameManager(settings, (playerId, state) => {
            this.players[playerId].send('update-state', state);
        });

        for(const id in this.players) {
            const player = this.players[id];
            player.on('set-ships', ships => gameManager.setShips(+id, ships));
            player.on('fire-shot', target => gameManager.fireShot(+id, target));
            player.send('quick-match-found');
        }
    }
}