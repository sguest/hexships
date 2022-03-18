import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import { Server } from 'socket.io';
import ConnectedPlayer from './ConnectedPlayer';
import { registerQuickConnect } from './lobby';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use('/hexships', express.static(path.join(__dirname, '../../dist')));

app.get('/', (req, res) => {
    res.redirect('/hexships');
})

io.on('connection', socket => {
    registerQuickConnect(new ConnectedPlayer(socket));
})

server.listen(3000, () => {
    console.log('listening on *:3000');
})