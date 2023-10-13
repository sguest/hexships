import { Socket } from 'socket.io-client';
import GameSettings from '../config/GameSettings';
import { FleetPlacement } from '../game-state/GameManager';
import LocalState from '../game-state/LocalState';
import { ClientToServerEvents, ServerToClientEvents } from '../MessageTypes';
import { Point } from '../utils/point-utils';
import GameInterface, { StateSubscription } from './GameInterface';

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const storageKeyConnectionId = 'connectionid';

export default class RemoteGameInterface implements GameInterface {
    private stateSubscriptions: StateSubscription[];
    private staleSubscriber = true;

    constructor(private socket: ClientSocket, private gameSettings: GameSettings, connectionId: string) {
        this.stateSubscriptions = [];

        this.socket.on('update-state', (state: LocalState) => {
            this.stateSubscriptions.forEach(s => s(state, false));
        })

        localStorage.setItem(storageKeyConnectionId, connectionId);
    }

    public onStateChange(subscriber: StateSubscription) {
        this.stateSubscriptions.push(subscriber);
        if(this.staleSubscriber) {
            this.socket.emit('request-state');
            this.staleSubscriber = false;
        }
    }

    public offStateChange(subscriber: StateSubscription) {
        const index = this.stateSubscriptions.indexOf(subscriber);
        if(index >= 0) {
            this.stateSubscriptions.splice(index, 1);
        }
    }

    public setFleet(fleet: FleetPlacement) {
        this.socket.emit('set-fleet', fleet);
    }

    public fireShots(targets: Point[]) {
        this.socket.emit('fire-shots', targets);
    }

    public leaveGame() {
        this.socket.emit('leave-game');
        localStorage.removeItem(storageKeyConnectionId);
    }

    public getSettings() {
        return this.gameSettings;
    }
}

export async function loadFromStorage(socket: ClientSocket) {
    const connectionId = localStorage.getItem(storageKeyConnectionId)
    if(connectionId) {
        socket.emit('rejoin-game', connectionId, success => {
            if(!success) {
                localStorage.removeItem(storageKeyConnectionId);
            }
        });
    }
}