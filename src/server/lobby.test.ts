import { EventEmitter } from 'events';
import { GameModeId } from '../config/GameMode';
import * as GameMode from '../config/GameMode';
import ConnectedPlayer from './ConnectedPlayer';
import { cancelQuickConnect, createCustomLobbyGame, createStandardLobbyGame, joinLobby, joinLobbyGame, leaveLobby, removePlayerLobbyGames, requestQuickConnect } from './lobby';
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

    test('should fail when requesting custom game', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        requestQuickConnect(player1, GameModeId.Custom);
        requestQuickConnect(player2, GameModeId.Custom);
        expect(startGameSpy).not.toHaveBeenCalled();
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
        createStandardLobbyGame(player, name, mode);
        const games = joinLobby(player);
        expect(games).toContainEqual({ definition: { name, mode, settings: GameMode.getGameMode(mode).settings }, id: expect.any(String) });
    });
});

describe('createStandardLobbyGame', () => {
    test('should notify other players in lobby', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2Socket = new EventEmitter();
        const listener = jest.fn();
        player2Socket.on('add-lobby-game', listener);
        const player2 = new ConnectedPlayer(player2Socket as ServerSocket);
        joinLobby(player2);
        const name = 'Name';
        const mode = GameModeId.Basic;
        createStandardLobbyGame(player1, name, mode);
        expect(listener).toBeCalledWith({ definition: { name, mode, settings: GameMode.getGameMode(mode).settings }, id: expect.any(String) })
    });

    test('should remove other games hosted by the same player', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        joinLobby(player2);
        const name = 'Name';
        const mode = GameModeId.Basic;
        const gameId = createStandardLobbyGame(player1, name, mode);
        createStandardLobbyGame(player1, name, mode);
        const games = joinLobby(player2);
        expect(games).not.toContainEqual((g: LobbyGame) => g.id === gameId);
    });

    test('should fail when no name is provided', () => {
        const player = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const gameId = createStandardLobbyGame(player, ' ', GameModeId.Basic);
        expect(gameId).not.toBeDefined();
    });

    test('should fail when type is custom', () => {
        const player = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const gameId = createStandardLobbyGame(player, 'Gamename', GameModeId.Custom);
        expect(gameId).not.toBeDefined();
    });
});

describe('createCustomLobbyGame', () => {
    test('should notify other players in lobby', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2Socket = new EventEmitter();
        const listener = jest.fn();
        player2Socket.on('add-lobby-game', listener);
        const player2 = new ConnectedPlayer(player2Socket as ServerSocket);
        joinLobby(player2);
        const name = 'Name';
        const mode = GameModeId.Custom;
        createCustomLobbyGame(player1, name, GameMode.Basic.settings);
        expect(listener).toBeCalledWith({ definition: { name, mode, settings: GameMode.Basic.settings }, id: expect.any(String) })
    });

    test('should remove other games hosted by the same player', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        joinLobby(player2);
        const name = 'Name';
        const mode = GameModeId.Basic;
        const gameId = createStandardLobbyGame(player1, name, mode);
        createCustomLobbyGame(player1, name, GameMode.Basic.settings);
        const games = joinLobby(player2);
        expect(games).not.toContainEqual((g: LobbyGame) => g.id === gameId);
    });

    test('should fail when no name is provided', () => {
        const player = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const gameId = createCustomLobbyGame(player, ' ', GameMode.Basic.settings);
        expect(gameId).not.toBeDefined();
    });

    test('should fail with invalid settings', () => {
        const player = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const gameId = createCustomLobbyGame(player, ' ', { ...GameMode.Basic.settings, ships: [] });
        expect(gameId).not.toBeDefined();
    });

    test('should override ship definition IDs', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const ships = GameMode.Basic.settings.ships.slice();
        for(let i = 0; i < ships.length; i++) {
            ships[i] = { ...ships[i], id: i * 2 };
        }
        const gameId = createCustomLobbyGame(player1, 'Name', { ...GameMode.Basic.settings, ships });
        const game = joinLobby(player2).find(g => g.id === gameId);
        for(let i = 0; i < game!.definition.settings.ships.length; i++) {
            expect(game?.definition.settings.ships[i].id).toEqual(i + 1);
        }
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
        const gameId = createStandardLobbyGame(player1, name, mode);
        removePlayerLobbyGames(player1);
        expect(listener).toBeCalledWith(gameId);
    });

    test('should remove game from list of games', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const name = 'Name';
        const mode = GameModeId.Basic;
        const gameId = createStandardLobbyGame(player1, name, mode);
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
        createStandardLobbyGame(player1, name, mode);
        expect(listener).not.toBeCalled();
    });
});

describe('joinLobbyGame', () => {
    test('should start a new game', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const name = 'Name';
        const mode = GameModeId.Basic;
        const gameId = createStandardLobbyGame(player1, name, mode);
        joinLobbyGame(player2, gameId!);
        const gameSettings = GameMode.getGameMode(mode);
        expect(startGameSpy).toBeCalledWith(gameSettings.settings, player2, player1);
    });

    test('should remove the game from the lobby', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player3 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const name = 'Name';
        const mode = GameModeId.Basic;
        const gameId = createStandardLobbyGame(player1, name, mode);
        joinLobbyGame(player2, gameId!);
        const games = joinLobby(player3);
        expect(games).not.toContainEqual((g: LobbyGame) => g.id === gameId);
    });
});