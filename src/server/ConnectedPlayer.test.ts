import { EventEmitter } from 'events';
import GameManager from '../game-state/GameManager';
import LocalState from '../game-state/LocalState';
import ConnectedPlayer from './ConnectedPlayer';
import { ServerSocket } from './ServerSocket';
import * as GameMode from '../config/GameMode';
import * as lobby from './lobby';

describe('updateState', () => {
    test('should emit state update', () => {
        const socket = new EventEmitter();
        const subject = new ConnectedPlayer(socket as ServerSocket);
        const subscriber = jest.fn();
        socket.on('update-state', subscriber);
        const localState: LocalState = {
            ownShips: [],
            ownMarkers: [],
            opponentShips: [],
            opponentMarkers: [],
            isOwnTurn: true,
            sunkEnemies: [],
            gameWon: false,
            gameLost: false,
            opponentShipsPlaced: true,
            opponentLeft: false,
            ownMines: [],
            opponentMines: [],
        };
        subject.updateState(localState);
        expect(subscriber).toBeCalledWith(localState);
    });
});

describe('joinGame', () => {
    test('should emit join-game', () => {
        const socket = new EventEmitter();
        const subject = new ConnectedPlayer(socket as ServerSocket);
        const subscriber = jest.fn();
        socket.on('join-game', subscriber);
        const gameManager = new GameManager(GameMode.Basic.settings, () => {});
        subject.joinGame(gameManager, 0);
        expect(subscriber).toBeCalledWith(GameMode.Basic.settings);
    });

    test('should register ship listener', () => {
        const socket = new EventEmitter();
        const subject = new ConnectedPlayer(socket as ServerSocket);
        const gameManager = new GameManager(GameMode.Basic.settings, () => {});
        const spy = jest.spyOn(gameManager, 'setFleet');
        subject.joinGame(gameManager, 0);
        socket.emit('set-fleet', { ships: [], fleet: [] });
        expect(spy).toBeCalledWith(0, { ships: [], fleet: [] });
    })

    test('should register shot listener', () => {
        const socket = new EventEmitter();
        const subject = new ConnectedPlayer(socket as ServerSocket);
        const gameManager = new GameManager(GameMode.Basic.settings, () => {});
        const spy = jest.spyOn(gameManager, 'fireShots')
        subject.joinGame(gameManager, 0);
        const target = { x: 0, y: 0 };
        socket.emit('fire-shots', [target]);
        expect(spy).toBeCalledWith(0, [target]);
    });

    test('should register disconnect listener', () => {
        const socket = new EventEmitter();
        const subject = new ConnectedPlayer(socket as ServerSocket);
        const gameManager = new GameManager(GameMode.Basic.settings, () => {});
        const spy = jest.spyOn(gameManager, 'leaveGame');
        subject.joinGame(gameManager, 0);
        socket.emit('disconnect');
        expect(spy).toBeCalled();
    });

    test('should register leave game listener', () => {
        const socket = new EventEmitter();
        const subject = new ConnectedPlayer(socket as ServerSocket);
        const gameManager = new GameManager(GameMode.Basic.settings, () => {});
        const spy = jest.spyOn(gameManager, 'leaveGame');
        subject.joinGame(gameManager, 0);
        socket.emit('leave-game');
        expect(spy).toBeCalled();
    });
});

describe('leaveGame', () => {
    test('should remove all game-related handlers', () => {
        const socket = new EventEmitter();
        const subject = new ConnectedPlayer(socket as ServerSocket);
        const gameManager = new GameManager(GameMode.Basic.settings, () => {});
        subject.joinGame(gameManager, 0);
        subject.leaveGame();
        expect(socket.eventNames().length).toEqual(0);
    });
});

describe('registerLobbyListeners', () => {
    test('should register quick-connect listener', () => {
        const socket = new EventEmitter();
        const subject = new ConnectedPlayer(socket as ServerSocket);
        const spy = jest.spyOn(lobby, 'requestQuickConnect');
        subject.registerLobbyListeners();
        socket.emit('quick-connect', GameMode.GameModeId.Basic);
        expect(spy).toBeCalledWith(subject, GameMode.GameModeId.Basic);
    });
});

describe('joining quick connect', () => {
    let socket: EventEmitter;
    let subject: ConnectedPlayer;
    let spy: jest.SpyInstance;

    beforeEach(() => {
        socket = new EventEmitter();
        subject = new ConnectedPlayer(socket as ServerSocket);
        spy = jest.spyOn(lobby, 'requestQuickConnect').mockImplementation(() => {});
        subject.registerLobbyListeners();
        socket.emit('quick-connect', GameMode.GameModeId.Basic);
    });

    test('should request quick connect', () => {
        expect(spy).toBeCalledWith(subject, GameMode.GameModeId.Basic);
    })

    test('should register cancel-quick-connect listener', () => {
        const spy = jest.spyOn(lobby, 'cancelQuickConnect');
        socket.emit('cancel-quick-connect');
        expect(spy).toBeCalledWith(subject);
    });

    test('should register disconnect listener', () => {
        const spy = jest.spyOn(lobby, 'cancelQuickConnect');
        socket.emit('disconnect');
        expect(spy).toBeCalledWith(subject);
    });
});