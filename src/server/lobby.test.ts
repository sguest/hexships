import * as events from 'events';
import { GameModeId } from '../config/GameMode';
import * as GameMode from '../config/GameMode';
import ConnectedPlayer from './ConnectedPlayer';
import { cancelQuickConnect, requestQuickConnect } from './lobby';
import { ServerSocket } from './ServerSocket';
import * as ServerGame from './ServerGame';

let startGameSpy: jest.SpyInstance;

beforeEach(() => {
    startGameSpy = jest.spyOn(ServerGame, 'startGame').mockImplementation();
});

afterEach(() => {
    startGameSpy.mockRestore();
})

describe('requestQuickConnect', () => {
    test('should not start when no other player waiting', () => {
        const player = new ConnectedPlayer(new events.EventEmitter() as ServerSocket);
        requestQuickConnect(player, GameModeId.Basic);
        expect(startGameSpy).not.toHaveBeenCalled();
        cancelQuickConnect(player);
    });

    test('should start when other player waiting', () => {
        const player1 = new ConnectedPlayer(new events.EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new events.EventEmitter() as ServerSocket);
        requestQuickConnect(player1, GameModeId.Basic);
        requestQuickConnect(player2, GameModeId.Basic);
        expect(startGameSpy).toHaveBeenCalledWith(GameMode.Basic.settings, player2, player1);
    });

    test('should remove waiting player from queue', () => {
        const player1 = new ConnectedPlayer(new events.EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new events.EventEmitter() as ServerSocket);
        const player3 = new ConnectedPlayer(new events.EventEmitter() as ServerSocket);
        requestQuickConnect(player1, GameModeId.Basic);
        requestQuickConnect(player2, GameModeId.Basic);
        startGameSpy.mockReset();
        requestQuickConnect(player3, GameModeId.Basic);
        expect(startGameSpy).not.toHaveBeenCalled();
        cancelQuickConnect(player3);
    });

    test('should not start when players request different game types', () => {
        const player1 = new ConnectedPlayer(new events.EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new events.EventEmitter() as ServerSocket);
        requestQuickConnect(player1, GameModeId.Basic);
        requestQuickConnect(player2, GameModeId.Streak);
        expect(startGameSpy).not.toHaveBeenCalled();
        cancelQuickConnect(player1);
        cancelQuickConnect(player2);
    });
});

describe('cancelQuickConnect', () => {
    test('should remove user from queue', () => {
        const player1 = new ConnectedPlayer(new events.EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new events.EventEmitter() as ServerSocket);
        requestQuickConnect(player1, GameModeId.Basic);
        cancelQuickConnect(player1);
        requestQuickConnect(player2, GameModeId.Basic);
        expect(startGameSpy).not.toHaveBeenCalled();
        cancelQuickConnect(player2);
    })
});