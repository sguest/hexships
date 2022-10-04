import GameManager from '../game-state/GameManager';
import LocalState from '../game-state/LocalState';
import * as lobby from './lobby';
import LobbyGame from './LobbyGame';
import { ServerSocket } from './ServerSocket';

export default class ConnectedPlayer {
    constructor(private socket: ServerSocket) {
    }

    public updateState(state: LocalState) {
        this.socket.emit('update-state', state);
    }

    public joinGame(gameManager: GameManager, playerId: number) {
        this.removeLobbyListeners();

        this.socket.on('set-fleet', fleet => gameManager.setFleet(playerId, fleet));
        this.socket.on('fire-shots', targets => gameManager.fireShots(playerId, targets));
        this.socket.on('disconnect', () => gameManager.leaveGame(playerId));
        this.socket.on('leave-game', () => gameManager.leaveGame(playerId));

        this.socket.emit('join-game', gameManager.gameSettings);
    }

    public leaveGame() {
        this.socket.removeAllListeners('set-fleet');
        this.socket.removeAllListeners('fire-shots');
        this.socket.removeAllListeners('disconnect');
        this.socket.removeAllListeners('leave-game');
    }

    private removeLobbyListeners() {
        this.socket.removeAllListeners('cancel-quick-connect');
        this.socket.removeAllListeners('disconnect');
        this.socket.removeAllListeners('remove-lobby-game');
        this.socket.removeAllListeners('leave-lobby');
        this.socket.removeAllListeners('join-lobby-game');
    }

    private unregisterQuickConnect() {
        this.removeLobbyListeners();
        lobby.cancelQuickConnect(this);
    }

    private unregisterLobbyGame() {
        this.removeLobbyListeners();
        lobby.removePlayerLobbyGames(this);
    }

    private exitLobby() {
        this.removeLobbyListeners();
        lobby.leaveLobby(this);
    }

    private addLobbyGameCommon() {
        this.socket.on('remove-lobby-game', () => this.unregisterLobbyGame());
        this.socket.on('disconnect', () => this.unregisterLobbyGame());
    }

    public registerLobbyListeners() {
        this.socket.on('quick-connect', mode => {
            this.socket.on('cancel-quick-connect', () => this.unregisterQuickConnect());
            this.socket.on('disconnect', () => this.unregisterQuickConnect());
            lobby.requestQuickConnect(this, mode);
        });
        this.socket.on('add-standard-lobby-game', (name, mode) => {
            if(name) {
                this.addLobbyGameCommon();
                return lobby.createStandardLobbyGame(this, name, mode);
            }
        });
        this.socket.on('add-custom-lobby-game', (name, settings) => {
            if(name) {
                this.addLobbyGameCommon();
                return lobby.createCustomLobbyGame(this, name, settings);
            }
        })
        this.socket.on('enter-lobby', callback => {
            this.socket.on('leave-lobby', () => this.exitLobby());
            this.socket.on('disconnect', () => this.exitLobby());
            this.socket.on('join-lobby-game', id => lobby.joinLobbyGame(this, id));
            callback(lobby.joinLobby(this));
        });
    }

    public sendLobbyGame(game: LobbyGame) {
        this.socket.emit('add-lobby-game', game);
    }

    public removeLobbyGame(id: string) {
        this.socket.emit('remove-lobby-game', id);
    }
}