import { Socket } from 'socket.io-client';
import GameSettings from '../config/GameSettings';
import LocalState from '../game-state/LocalState';
import Ship from '../game-state/Ship';
import { Point } from '../utils/point-utils';
import GameInterface, { StateSubscription } from './GameInterface';

export default class RemoteGameInterface implements GameInterface {
    private stateSubscriptions: StateSubscription[];

    constructor(private socket: Socket, private gameSettings: GameSettings) {
        this.stateSubscriptions = [];

        this.socket.on('update-state', (state: LocalState) => {
            this.stateSubscriptions.forEach(s => s(state));
        })
    }

    public onStateChange(subscriber: StateSubscription) {
        this.stateSubscriptions.push(subscriber);
    }

    public offStateChange(subscriber: StateSubscription) {
        const index = this.stateSubscriptions.indexOf(subscriber);
        if(index >= 0) {
            this.stateSubscriptions.splice(index, 1);
        }
    }

    public setShips(ships: Ship[]) {
        this.socket.emit('set-ships', ships);
    }

    public fireShot(target: Point) {
        this.socket.emit('fire-shot', target);
    }

    public leaveGame() {
        this.socket.emit('leave-game');
    }

    public getSettings() {
        return this.gameSettings;
    }
}