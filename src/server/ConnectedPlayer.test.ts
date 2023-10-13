import { EventEmitter } from 'events';
import GameManager from '../game-state/GameManager';
import LocalState from '../game-state/LocalState';
import ConnectedPlayer from './ConnectedPlayer';
import { ServerSocket } from './ServerSocket';
import * as GameMode from '../config/GameMode';
import * as lobby from './lobby';
import ServerGame from './ServerGame';

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
        const serverGame = new ServerGame(GameMode.Basic.settings, subject, new ConnectedPlayer(new EventEmitter() as ServerSocket));
        const connectionId = Math.random().toString();
        subject.joinGame(gameManager, 0, connectionId, serverGame);
        expect(subscriber).toBeCalledWith(GameMode.Basic.settings, connectionId);
    });
});

describe('registerListeners', () => {
    test('should register quick-connect listener', () => {
        const socket = new EventEmitter();
        const subject = new ConnectedPlayer(socket as ServerSocket);
        const spy = jest.spyOn(lobby, 'requestQuickConnect');
        subject.registerListeners();
        socket.emit('quick-connect', GameMode.GameModeId.Basic);
        expect(spy).toBeCalledWith(subject, GameMode.GameModeId.Basic);
    });

    test('should register ship listener', () => {
        const socket = new EventEmitter();
        const subject = new ConnectedPlayer(socket as ServerSocket);
        subject.registerListeners();
        const gameManager = new GameManager(GameMode.Basic.settings, () => {});
        const spy = jest.spyOn(gameManager, 'setFleet');
        const serverGame = new ServerGame(GameMode.Basic.settings, subject, new ConnectedPlayer(new EventEmitter() as ServerSocket));
        subject.joinGame(gameManager, 0, '', serverGame);
        socket.emit('set-fleet', { ships: [], fleet: [] });
        expect(spy).toBeCalledWith(0, { ships: [], fleet: [] });
    })

    test('should register shot listener', () => {
        const socket = new EventEmitter();
        const subject = new ConnectedPlayer(socket as ServerSocket);
        subject.registerListeners();
        const gameManager = new GameManager(GameMode.Basic.settings, () => {});
        const spy = jest.spyOn(gameManager, 'fireShots')
        const serverGame = new ServerGame(GameMode.Basic.settings, subject, new ConnectedPlayer(new EventEmitter() as ServerSocket));
        subject.joinGame(gameManager, 0, '', serverGame);
        const target = { x: 0, y: 0 };
        socket.emit('fire-shots', [target]);
        expect(spy).toBeCalledWith(0, [target]);
    });

    test('should register leave game listener', () => {
        const socket = new EventEmitter();
        const subject = new ConnectedPlayer(socket as ServerSocket);
        subject.registerListeners();
        const gameManager = new GameManager(GameMode.Basic.settings, () => {});
        const spy = jest.spyOn(gameManager, 'leaveGame');
        const serverGame = new ServerGame(GameMode.Basic.settings, subject, new ConnectedPlayer(new EventEmitter() as ServerSocket));
        subject.joinGame(gameManager, 0, '', serverGame);
        socket.emit('leave-game');
        expect(spy).toBeCalled();
    });

    describe('disconnect handler', () => {
        test('should clean up lobby and quick connect', () => {
            const socket = new EventEmitter();
            const subject = new ConnectedPlayer(socket as ServerSocket);
            subject.registerListeners();
            const leaveLobbySpy = jest.spyOn(lobby, 'leaveLobby');
            const cancelQuickConnectSpy = jest.spyOn(lobby, 'cancelQuickConnect');
            const removePlayerLobbyGamesSpy = jest.spyOn(lobby, 'removePlayerLobbyGames');
            socket.emit('disconnect');
            expect(leaveLobbySpy).toBeCalled();
            expect(cancelQuickConnectSpy).toBeCalled();
            expect(removePlayerLobbyGamesSpy).toBeCalled();
        });
    });
});