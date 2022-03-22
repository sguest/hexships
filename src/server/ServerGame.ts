import GameManager from '../game-state/GameManager';
import Player from './ConnectedPlayer';
import GameSettings from '../config/GameSettings';

export function startGame(settings: GameSettings, player1: Player, player2: Player) {
    let players: {[key: number]: Player}
    if(Math.random() < 0.5) {
        players = {
            0: player1,
            1: player2,
        }
    }
    else {
        players = {
            0: player2,
            1: player1,
        }
    }

    const gameManager = new GameManager(settings, (playerId, state) => {
        players[playerId].updateState(state);

        if(state.gameWon || state.gameLost) {
            for(const id in players) {
                players[id].leaveGame();
            }
        }
    });

    for(const id in players) {
        players[id].joinGame(gameManager, +id);
    }
}