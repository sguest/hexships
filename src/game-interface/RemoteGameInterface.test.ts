import RemoteGameInterface, { ClientSocket } from './RemoteGameInterface';
import LocalState from '../game-state/LocalState';
import Ship from '../game-state/Ship';
import Direction from '../game-state/Direction';
import { EventEmitter } from 'events';
import * as GameMode from '../config/GameMode';

const testLocalState: LocalState = {
    ownShips: [],
    ownMarkers: [],
    opponentShips: [],
    opponentMarkers: [],
    isOwnTurn: false,
    sunkEnemies: [],
    gameWon: false,
    gameLost: false,
    opponentShipsPlaced: false,
    opponentLeft: false,
}

test('onStateChange adds subscriber', () => {
    const socket = new EventEmitter();
    const subject = new RemoteGameInterface(socket as unknown as ClientSocket, GameMode.Basic.settings);
    let receivedState: LocalState | undefined;
    subject.onStateChange(s => {
        receivedState = s
    });
    socket.emit('update-state', testLocalState);
    expect(receivedState).toEqual(testLocalState);
});

test('offStateChange removes subscriber', () => {
    const socket = new EventEmitter();
    const subject = new RemoteGameInterface(socket as unknown as ClientSocket, GameMode.Basic.settings);
    const subscriber = jest.fn();
    subject.onStateChange(subscriber);
    subject.offStateChange(subscriber);
    socket.emit('update-state', testLocalState);
    expect(subscriber).not.toBeCalled();
});

test('setShips sends message', () => {
    const socket = new EventEmitter();
    const subject = new RemoteGameInterface(socket as unknown as ClientSocket, GameMode.Basic.settings);
    const ships: Ship[] = [{ x: 1, y: 1, facing: Direction.positiveY, size: 1, hits: 0, name: 'Test', definitionId: 1 }];
    const subscriber = jest.fn();
    socket.on('set-ships', subscriber);
    subject.setShips(ships);
    expect(subscriber).toBeCalledWith(ships);
});

test('fireShots sends message', () => {
    const socket = new EventEmitter();
    const subject = new RemoteGameInterface(socket as unknown as ClientSocket, GameMode.Basic.settings);
    const target = { x: 1, y: 2 };
    const subscriber = jest.fn();
    socket.on('fire-shots', subscriber);
    subject.fireShots([target]);
    expect(subscriber).toBeCalledWith([target]);
});

test('leaveGame sends message', () => {
    const socket = new EventEmitter();
    const subject = new RemoteGameInterface(socket as unknown as ClientSocket, GameMode.Basic.settings);
    const subscriber = jest.fn();
    socket.on('leave-game', subscriber);
    subject.leaveGame();
    expect(subscriber).toBeCalled();
});