import { EventEmitter } from 'events';
import { GameModeId } from '../config/GameMode';
import * as GameMode from '../config/GameMode';
import ConnectedPlayer from './ConnectedPlayer';
import { cancelQuickConnect, createLobbyGame, joinLobby, joinLobbyGame, leaveLobby, removePlayerLobbyGames, requestQuickConnect } from './lobby';
import { ServerSocket } from './ServerSocket';
import * as ServerGame from './ServerGame';
import LobbyGame from './LobbyGame';

let startGameSpy: jest.SpyInstance;

beforeEach(() => {
    startGameSpy = jest.spyOn(ServerGame, 'startGame').mockImplementation();
});

afterEach(() => {
    startGameSpy.mockRestore();
})

describe('requestQuickConnect', () => {
    test('should not start when no other player waiting', () => {
        const player = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        requestQuickConnect(player, GameModeId.Basic);
        expect(startGameSpy).not.toHaveBeenCalled();
        cancelQuickConnect(player);
    });

    test('should start when other player waiting', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        requestQuickConnect(player1, GameModeId.Basic);
        requestQuickConnect(player2, GameModeId.Basic);
        expect(startGameSpy).toHaveBeenCalledWith(GameMode.Basic.settings, player2, player1);
    });

    test('should remove waiting player from queue', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player3 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        requestQuickConnect(player1, GameModeId.Basic);
        requestQuickConnect(player2, GameModeId.Basic);
        startGameSpy.mockReset();
        requestQuickConnect(player3, GameModeId.Basic);
        expect(startGameSpy).not.toHaveBeenCalled();
        cancelQuickConnect(player3);
    });

    test('should not start when players request different game types', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        requestQuickConnect(player1, GameModeId.Basic);
        requestQuickConnect(player2, GameModeId.Streak);
        expect(startGameSpy).not.toHaveBeenCalled();
        cancelQuickConnect(player1);
        cancelQuickConnect(player2);
    });
});

describe('cancelQuickConnect', () => {
    test('should remove user from queue', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        requestQuickConnect(player1, GameModeId.Basic);
        cancelQuickConnect(player1);
        requestQuickConnect(player2, GameModeId.Basic);
        expect(startGameSpy).not.toHaveBeenCalled();
        cancelQuickConnect(player2);
    })
});

describe('joinLobby', () => {
    test('should return list of games', () => {
        const player = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const name = 'Name';
        const mode = GameModeId.Basic;
        createLobbyGame(player, { name, mode });
        const games = joinLobby(player);
        expect(games).toContainEqual({ definition: { name, mode }, id: expect.any(String) });
    });
});

describe('createLobbyGame', () => {
    test('should notify other players in lobby', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2Socket = new EventEmitter();
        const listener = jest.fn();
        player2Socket.on('add-lobby-game', listener);
        const player2 = new ConnectedPlayer(player2Socket as ServerSocket);
        joinLobby(player2);
        const name = 'Name';
        const mode = GameModeId.Basic;
        createLobbyGame(player1, { name, mode });
        expect(listener).toBeCalledWith({ definition: { name, mode }, id: expect.any(String) })
    });

    test('should remove other games hosted by the same player', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        joinLobby(player2);
        const name = 'Name';
        const mode = GameModeId.Basic;
        const gameId = createLobbyGame(player1, { name, mode });
        createLobbyGame(player1, { name, mode });
        const games = joinLobby(player2);
        expect(games).not.toContainEqual((g: LobbyGame) => g.id === gameId);
    });
});

describe('removePlayerLobbyGames', () => {
    test('should notify other players in lobby', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2Socket = new EventEmitter();
        const listener = jest.fn();
        player2Socket.on('remove-lobby-game', listener);
        const player2 = new ConnectedPlayer(player2Socket as ServerSocket);
        joinLobby(player2);
        const name = 'Name';
        const mode = GameModeId.Basic;
        const gameId = createLobbyGame(player1, { name, mode });
        removePlayerLobbyGames(player1);
        expect(listener).toBeCalledWith(gameId);
    });

    test('should remove game from list of games', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const name = 'Name';
        const mode = GameModeId.Basic;
        const gameId = createLobbyGame(player1, { name, mode });
        removePlayerLobbyGames(player1);
        const games = joinLobby(player2);
        expect(games).not.toContainEqual((g: LobbyGame) => g.id === gameId);
    });
});

describe('leaveLobby', () => {
    test('should no longer notify player of games', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2Socket = new EventEmitter();
        const listener = jest.fn();
        player2Socket.on('add-lobby-game', listener);
        const player2 = new ConnectedPlayer(player2Socket as ServerSocket);
        joinLobby(player2);
        leaveLobby(player2);
        const name = 'Name';
        const mode = GameModeId.Basic;
        createLobbyGame(player1, { name, mode });
        expect(listener).not.toBeCalled();
    });
});

describe('joinLobbyGame', () => {
    test('should start a new game', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const name = 'Name';
        const mode = GameModeId.Basic;
        const gameId = createLobbyGame(player1, { name, mode });
        joinLobbyGame(player2, gameId);
        const gameSettings = GameMode.getGameMode(mode);
        expect(startGameSpy).toBeCalledWith(gameSettings.settings, player2, player1);
    });

    test('should remove the game from the lobby', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player3 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const name = 'Name';
        const mode = GameModeId.Basic;
        const gameId = createLobbyGame(player1, { name, mode });
        joinLobbyGame(player2, gameId);
        const games = joinLobby(player3);
        expect(games).not.toContainEqual((g: LobbyGame) => g.id === gameId);
    });
});