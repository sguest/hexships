import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import { Server } from 'socket.io';
import ConnectedPlayer from './ConnectedPlayer';
import { ClientToServerEvents, ServerToClientEvents } from '../MessageTypes';

const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);

app.use('/hexships', express.static(path.join(__dirname, '../../dist')));

app.get('/', (req, res) => {
    res.redirect('/hexships');
})

io.on('connection', socket => {
    new ConnectedPlayer(socket).registerListeners();
})

server.listen(3000, () => {
    console.log('listening on *:3000');
})