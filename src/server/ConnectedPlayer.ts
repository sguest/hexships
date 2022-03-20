import { Socket } from 'socket.io';

export default class ConnectedPlayer {
    private listeners: {[key: string]: Array<{name: string, listener:(...args: any[]) => void}>} = {};
    constructor(private socket: Socket) {
    }

    public startGame() {
        this.socket.broadcast.to(this.socket.id).emit('start-game');
    }

    public send(message: string, data?: any) {
        this.socket.emit(message, data);
    }

    public on(message: string, room: string, listener: (val: any) => void) {
        this.socket.on(message, listener);
        this.listeners[room] = this.listeners[room] || [];
        this.listeners[room].push({ name: message, listener });
    }

    public removeListeners(room: string) {
        if(this.listeners[room]) {
            for(const listener of this.listeners[room]) {
                this.socket.off(listener.name, listener.listener);
            }
        }
    }
}