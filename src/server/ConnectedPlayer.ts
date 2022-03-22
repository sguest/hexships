import GameManager from '../game-state/GameManager';
import LocalState from '../game-state/LocalState';
import { cancelQuickConnect, requestQuickConnect } from './lobby';
import { ServerSocket } from './ServerSocket';

export default class ConnectedPlayer {
    constructor(private socket: ServerSocket) {
    }

    public updateState(state: LocalState) {
        this.socket.emit('update-state', state);
    }

    public joinGame(gameManager: GameManager, playerId: number) {
        this.socket.on('set-ships', ships => gameManager.setShips(playerId, ships));
        this.socket.on('fire-shot', target => gameManager.fireShot(playerId, target));
        this.socket.on('disconnect', () => gameManager.leaveGame(playerId));
        this.socket.on('leave-game', () => gameManager.leaveGame(playerId));

        this.socket.emit('join-game', gameManager.gameSettings);
    }

    public leaveGame() {
        this.socket.removeAllListeners('set-ships');
        this.socket.removeAllListeners('fire-shot');
        this.socket.removeAllListeners('disconnect');
        this.socket.removeAllListeners('leave-game');
    }

    public registerQuickConnect() {
        this.socket.on('quick-connect', mode => requestQuickConnect(this, mode));
        this.socket.on('cancel-quick-connect', () => cancelQuickConnect(this))
        this.socket.on('disconnect', () => cancelQuickConnect(this));
    }
}