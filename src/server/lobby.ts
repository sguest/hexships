import ConnectedPlayer from './ConnectedPlayer';
import { GameModeId, getGameMode } from '../config/GameMode';
import { startGame } from './ServerGame';
import GameDefinition from '../config/GameDefinition';
import LobbyGame from './LobbyGame';
import GameSettings, { validateSettings } from '../config/GameSettings';

let quickConnectWaiting: Array<{ player: ConnectedPlayer, mode: GameModeId }> = [];
const lobbyGames: {[key: string]: { game: LobbyGame, host: ConnectedPlayer } } = {};
let lobbyPlayers: ConnectedPlayer[] = [];

export function requestQuickConnect(player: ConnectedPlayer, mode: GameModeId) {
    const gameMode = getGameMode(mode);
    if(!gameMode.settings) {
        // This is custom mode - quick connect not supported. UI won't let you do this.
        return;
    }

    const index = quickConnectWaiting.findIndex(w => w.mode === mode);
    if(index === -1) {
        quickConnectWaiting.push({ player, mode });
    }
    else {
        const otherPlayer = quickConnectWaiting.splice(index, 1)[0];
        startGame(gameMode.settings, player, otherPlayer.player);
    }
}

export function cancelQuickConnect(player: ConnectedPlayer) {
    quickConnectWaiting = quickConnectWaiting.filter(w => w.player !== player);
}

export function removePlayerLobbyGames(player: ConnectedPlayer) {
    const gameIds: string[] = [];
    for(const gameId in lobbyGames) {
        if(lobbyGames[gameId].host === player) {
            gameIds.push(gameId);
        }
    }

    for(const gameId of gameIds) {
        delete lobbyGames[gameId];

        for(const otherPlayer of lobbyPlayers) {
            otherPlayer.removeLobbyGame(gameId);
        }
    }
}

function createLobbyGame(player: ConnectedPlayer, game: GameDefinition) {
    if(!game.name?.trim()) {
        return;
    }

    if(!validateSettings(game.settings)) {
        return;
    }

    removePlayerLobbyGames(player);
    const gameId = Math.random().toString().replace(/^0\./, '');
    const lobbyGame: LobbyGame = { definition: game, id: gameId };
    lobbyGames[gameId] = {
        game: lobbyGame,
        host: player,
    };
    for(const player of lobbyPlayers) {
        player.sendLobbyGame(lobbyGame)
    }
    return gameId;
}

export function createStandardLobbyGame(player: ConnectedPlayer, name: string, mode: GameModeId) {
    const settings = getGameMode(mode).settings;

    if(!settings) {
        // Custom - unsupported
        return;
    }

    return createLobbyGame(player, { name, mode, settings });
}

export function createCustomLobbyGame(player: ConnectedPlayer, name: string, settings: GameSettings) {
    for(let i = 0; i < settings.ships.length; i++) {
        settings.ships[i].id = i + 1;
    }
    return createLobbyGame(player, { name, mode: GameModeId.Custom, settings });
}

export function joinLobby(player: ConnectedPlayer) {
    lobbyPlayers.push(player);
    return Object.values(lobbyGames).map(g => g.game);
}

export function leaveLobby(player: ConnectedPlayer) {
    lobbyPlayers = lobbyPlayers.filter(p => p !== player);
}

export function joinLobbyGame(player: ConnectedPlayer, id: string) {
    if(lobbyGames[id]) {
        const otherPlayer = lobbyGames[id].host;
        startGame(lobbyGames[id].game.definition.settings, player, otherPlayer);
        delete lobbyGames[id];
    }
}