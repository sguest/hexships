import GameManager from '../game-state/GameManager';
import ConnectedPlayer from './ConnectedPlayer';
import GameSettings from '../config/GameSettings';
import LocalState from '../game-state/LocalState';

const disconnectTimeMs = 30000;

interface PlayerWrapper {
    connectionId: string
    player: ConnectedPlayer
    disconnectTimeout?: ReturnType<typeof setTimeout>
}

const gameLookup: {[connectionId: string]: GameWrapper} = {};

export interface GameWrapper {
    playerId: number
    game: ServerGame
}

export default class ServerGame {
    private players: {[key: number]: PlayerWrapper}
    private gameManager: GameManager;

    constructor(readonly settings: GameSettings, player1: ConnectedPlayer, player2: ConnectedPlayer) {
        if(Math.random() < 0.5) {
            this.players = {
                0: { player: player1, connectionId: Math.random().toString() },
                1: { player: player2, connectionId: Math.random().toString() },
            }
        }
        else {
            this.players = {
                0: { player: player2, connectionId: Math.random().toString() },
                1: { player: player1, connectionId: Math.random().toString() },
            }
        }

        this.gameManager = new GameManager(settings, this.onStateChange.bind(this));

        for(const id in this.players) {
            gameLookup[this.players[id].connectionId] = { playerId: +id, game: this };
            this.players[id].player.joinGame(this.gameManager, +id, this.players[id].connectionId, this);
        }
    }

    public playerDisconnected(playerId: number) {
        const playerWrapper = this.players[playerId];
        if(playerWrapper.disconnectTimeout) {
            clearTimeout(playerWrapper.disconnectTimeout);
        }
        playerWrapper.disconnectTimeout = setTimeout(() => {
            this.gameManager.leaveGame(playerId);
        }, disconnectTimeMs);
    }

    public playerReconnected(playerId: number, player: ConnectedPlayer) {
        const playerWrapper = this.players[playerId];
        if(playerWrapper.disconnectTimeout) {
            clearTimeout(playerWrapper.disconnectTimeout);
        }
        playerWrapper.player.removeActiveGame();
        this.players[playerId] = { player, connectionId: playerWrapper.connectionId };
        this.players[playerId].player.joinGame(this.gameManager, playerId, playerWrapper.connectionId, this);
    }

    private onStateChange(playerId: number, state: LocalState) {
        this.players[playerId].player.updateState(state);

        if(state.gameWon || state.gameLost) {
            for(const id in this.players) {
                this.players[id].player.leaveGame();
                delete gameLookup[this.players[id].connectionId];
            }
        }
    }
}

export function findGame(connectionId: string) {
    return gameLookup[connectionId];
}