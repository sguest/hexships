import { Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '../MessageTypes';

export type ServerSocket = Socket<ClientToServerEvents, ServerToClientEvents>;