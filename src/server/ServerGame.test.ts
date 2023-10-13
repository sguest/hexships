import { EventEmitter } from 'events';
import ConnectedPlayer from './ConnectedPlayer';
import ServerGame from './ServerGame';
import { ServerSocket } from './ServerSocket';
import * as GameMode from '../config/GameMode';
import GameManager from '../game-state/GameManager';
import GameSettings from '../config/GameSettings';
import LocalState from '../game-state/LocalState';

jest.mock('../game-state/GameManager');

describe('creating a new ServerGame', () => {
    test('should call joinGame for players', () => {
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const spy1 = jest.spyOn(player1, 'joinGame').mockImplementation();
        const spy2 = jest.spyOn(player2, 'joinGame').mockImplementation();
        // eslint-disable-next-line no-new
        new ServerGame(GameMode.Basic.settings, player1, player2);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    test('should update state', () => {
        let subscriber: (playerId: number, state: LocalState) => void;
        (GameManager as jest.Mock).mockImplementation((_: GameSettings, sub: (playerId: number, state: LocalState) => void) => {
            subscriber = sub;
            return {}
        })
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const spy = jest.spyOn(player1, 'updateState').mockImplementation();
        // eslint-disable-next-line no-new
        new ServerGame(GameMode.Basic.settings, player1, player2);
        subscriber!(0, {} as LocalState);
        subscriber!(1, {} as LocalState);
        expect(spy).toBeCalledWith({});
    });

    test('should remove players after game over', () => {
        let subscriber: (playerId: number, state: LocalState) => void;
        (GameManager as jest.Mock).mockImplementation((_: GameSettings, sub: (playerId: number, state: LocalState) => void) => {
            subscriber = sub;
            return {}
        })
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const spy1 = jest.spyOn(player1, 'leaveGame').mockImplementation();
        const spy2 = jest.spyOn(player2, 'leaveGame').mockImplementation();
        // eslint-disable-next-line no-new
        new ServerGame(GameMode.Basic.settings, player1, player2);
        subscriber!(0, { gameWon: true } as LocalState);
        subscriber!(1, { gameLost: true } as LocalState);
        expect(spy1).toBeCalled();
        expect(spy2).toBeCalled();
    });

    test('should make disconnected player leave after timeout', () => {
        jest.useFakeTimers();
        const spy = jest.fn();
        (GameManager as jest.Mock).mockImplementation(() => {
            return { leaveGame: spy };
        })
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const subject = new ServerGame(GameMode.Basic.settings, player1, player2);

        const playerId = 1;
        subject.playerDisconnected(playerId)
        jest.runAllTimers();

        expect(spy).toBeCalledWith(playerId);
        jest.useRealTimers();
    });

    test('should not make reconnected player leave after timeout', () => {
        jest.useFakeTimers();
        const spy = jest.fn();
        (GameManager as jest.Mock).mockImplementation(() => {
            return { leaveGame: spy };
        })
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const subject = new ServerGame(GameMode.Basic.settings, player1, player2);

        const playerId = 1;
        subject.playerDisconnected(playerId)
        subject.playerReconnected(playerId, player2);
        jest.runAllTimers();

        expect(spy).not.toBeCalled();
        jest.useRealTimers();
    });

    test('should call joinGame for player after reconnect', () => {
        jest.useFakeTimers();
        const player1 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const player2 = new ConnectedPlayer(new EventEmitter() as ServerSocket);
        const spy = jest.spyOn(player2, 'joinGame').mockImplementation();

        const subject = new ServerGame(GameMode.Basic.settings, player1, player2);

        const playerId = 1;
        subject.playerDisconnected(playerId)
        subject.playerReconnected(playerId, player2);
        jest.runAllTimers();

        expect(spy).toHaveBeenCalled();
        jest.useRealTimers();
    });
});