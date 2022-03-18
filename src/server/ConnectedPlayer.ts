import { Socket } from 'socket.io';

export default class ConnectedPlayer {
    constructor(private socket: Socket) {
    }

    public startGame() {
        this.socket.broadcast.to(this.socket.id).emit('start-game');
    }

    public send(message: string, data?: any) {
        this.socket.emit(message, data);
    }

    public on(message: string, listener: (val: any) => void) {
        this.socket.on(message, listener);
    }
}