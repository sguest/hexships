import { Socket } from 'socket.io-client';
import GameSettings from '../config/GameSettings';
import { ShipPlacement } from '../game-state/GameManager';
import LocalState from '../game-state/LocalState';
import { ClientToServerEvents, ServerToClientEvents } from '../MessageTypes';
import { Point } from '../utils/point-utils';
import GameInterface, { StateSubscription } from './GameInterface';

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
export default class RemoteGameInterface implements GameInterface {
    private stateSubscriptions: StateSubscription[];

    constructor(private socket: ClientSocket, private gameSettings: GameSettings) {
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

    public setShips(ships: ShipPlacement[]) {
        this.socket.emit('set-ships', ships);
    }

    public fireShots(targets: Point[]) {
        this.socket.emit('fire-shots', targets);
    }

    public leaveGame() {
        this.socket.emit('leave-game');
    }

    public getSettings() {
        return this.gameSettings;
    }
}