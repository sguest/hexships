import GameManager from '../game-state/GameManager';
import LocalState from '../game-state/LocalState';
import * as lobby from './lobby';
import LobbyGame from './LobbyGame';
import ServerGame, { findGame } from './ServerGame';
import { ServerSocket } from './ServerSocket';

export default class ConnectedPlayer {
    private currentGame?: {
        gameManager: GameManager
        serverGame: ServerGame
        playerId: number
    };

    constructor(private socket: ServerSocket) {
    }

    public updateState(state: LocalState) {
        this.socket.emit('update-state', state);
    }

    public joinGame(gameManager: GameManager, playerId: number, connectionId: string, serverGame: ServerGame) {
        this.currentGame = {
            gameManager,
            playerId,
            serverGame,
        };

        this.socket.emit('join-game', gameManager.gameSettings, connectionId);
    }

    public leaveGame() {
        this.currentGame = undefined;
    }

    public registerListeners() {
        this.socket.on('quick-connect', mode => lobby.requestQuickConnect(this, mode));
        this.socket.on('cancel-quick-connect', () => lobby.cancelQuickConnect(this));

        this.socket.on('add-standard-lobby-game', (name, mode) => {
            if(name) {
                return lobby.createStandardLobbyGame(this, name, mode);
            }
        });
        this.socket.on('add-custom-lobby-game', (name, settings) => {
            if(name) {
                return lobby.createCustomLobbyGame(this, name, settings);
            }
        })
        this.socket.on('enter-lobby', callback => callback(lobby.joinLobby(this)));
        this.socket.on('leave-lobby', () => lobby.leaveLobby(this));
        this.socket.on('disconnect', () => lobby.leaveLobby(this));
        this.socket.on('join-lobby-game', id => lobby.joinLobbyGame(this, id));
        this.socket.on('remove-lobby-game', () => lobby.removePlayerLobbyGames(this));

        this.socket.on('rejoin-game', (connectionId, callback) => {
            const gameWrapper = findGame(connectionId);
            if(gameWrapper) {
                gameWrapper.game.playerReconnected(gameWrapper.playerId, this);
                callback(true);
            }
            return callback(false);
        })

        this.socket.on('set-fleet', fleet => this.currentGame?.gameManager.setFleet(this.currentGame.playerId, fleet));
        this.socket.on('fire-shots', targets => this.currentGame?.gameManager.fireShots(this.currentGame.playerId, targets));
        this.socket.on('leave-game', () => this.currentGame?.gameManager.leaveGame(this.currentGame.playerId));
        this.socket.on('request-state', () => this.currentGame?.gameManager.sendState(this.currentGame.playerId));

        this.socket.on('disconnect', () => {
            this.currentGame?.serverGame.playerDisconnected(this.currentGame.playerId);
            lobby.leaveLobby(this);
            lobby.cancelQuickConnect(this);
            lobby.removePlayerLobbyGames(this);
        });
    }

    public sendLobbyGame(game: LobbyGame) {
        this.socket.emit('add-lobby-game', game);
    }

    public removeLobbyGame(id: string) {
        this.socket.emit('remove-lobby-game', id);
    }

    public removeActiveGame() {
        this.socket.emit('remove-active-game');
    }
}