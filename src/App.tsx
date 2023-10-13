import { useEffect, useState } from 'react';
import MainMenu from './components/menu/MainMenu';
import Game from './components/game/Game';
import GameInterface from './game-interface/GameInterface';
import { createUseStyles } from 'react-jss';
import { io } from 'socket.io-client';
import RemoteGameInterface, { ClientSocket, loadFromStorage as loadRemoteFromStorage } from './game-interface/RemoteGameInterface';
import { loadFromStorage as loadLocalFromStorage } from './game-interface/LocalGameInterface';
import Dialog from './components/Dialog';

const useStyles = createUseStyles({
    container: {
        backgroundColor: '#022866',
        width: '100%',
        height: '100%',
        overflow: 'auto',
    },
})

function App() {
    const [gameInterface, setGameInterface] = useState<GameInterface | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState<ClientSocket | undefined>(undefined);
    const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        const s: ClientSocket = io();
        setSocket(s);
        s.on('connect', () => {
            setIsConnected(true);
        });
        s.on('disconnect', () => {
            setIsConnected(false);
            setShowDisconnectDialog(true);
        });
    }, [])

    useEffect(() => {
        const ongoingGame = loadLocalFromStorage();
        if(ongoingGame) {
            setGameInterface(ongoingGame);
        }
    }, []);

    useEffect(() => {
        if(socket) {
            loadRemoteFromStorage(socket);
        }
    }, [socket]);

    const onNewGame = (gameInterface: GameInterface) => {
        setGameInterface(gameInterface);
    }

    useEffect(() => {
        socket?.on('join-game', (settings, connectionId) => {
            onNewGame(new RemoteGameInterface(socket!, settings, connectionId));
        });

        socket?.on('remove-active-game', () => {
            setGameInterface(null);
            setShowDisconnectDialog(true);
        });

        return () => {
            socket?.removeAllListeners('join-game');
            socket?.removeAllListeners('remove-active-game');
        }
    }, [socket]);

    const onExitGame = () => {
        setGameInterface(null);
    }

    return <div className={classes.container}>
        { showDisconnectDialog && <Dialog
            onClose={() => setShowDisconnectDialog(false)}
            okButton={true}>
            You have been disconnected
        </Dialog>}
        { gameInterface
            ? <Game gameInterface={gameInterface} onExit={onExitGame} />
            : <MainMenu onNewGame={onNewGame} socket={socket} isConnected={isConnected} />}
    </div>
}

export default App