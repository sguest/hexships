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
        const spy = jest.spyOn(gameManager, 'setShips');
        subject.joinGame(gameManager, 0);
        socket.emit('set-ships', []);
        expect(spy).toBeCalledWith(0, []);
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

describe('registerQuickConnect', () => {
    test('should register quick-connect listener', () => {
        const socket = new EventEmitter();
        const subject = new ConnectedPlayer(socket as ServerSocket);
        const spy = jest.spyOn(lobby, 'requestQuickConnect');
        subject.registerQuickConnect();
        socket.emit('quick-connect', GameMode.GameModeId.Basic);
        expect(spy).toBeCalledWith(subject, GameMode.GameModeId.Basic);
    });

    test('should register cancel-quick-connect listener', () => {
        const socket = new EventEmitter();
        const subject = new ConnectedPlayer(socket as ServerSocket);
        const spy = jest.spyOn(lobby, 'cancelQuickConnect');
        subject.registerQuickConnect();
        socket.emit('cancel-quick-connect');
        expect(spy).toBeCalledWith(subject);
    });

    test('should register disconnect listener', () => {
        const socket = new EventEmitter();
        const subject = new ConnectedPlayer(socket as ServerSocket);
        const spy = jest.spyOn(lobby, 'cancelQuickConnect');
        subject.registerQuickConnect();
        socket.emit('disconnect');
        expect(spy).toBeCalledWith(subject);
    });
});