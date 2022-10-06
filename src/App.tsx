import { useEffect, useState } from 'react';
import MainMenu from './components/menu/MainMenu';
import Game from './components/game/Game';
import GameInterface from './game-interface/GameInterface';
import { createUseStyles } from 'react-jss';
import { io } from 'socket.io-client';
import RemoteGameInterface, { ClientSocket } from './game-interface/RemoteGameInterface';

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
    const classes = useStyles();

    useEffect(() => {
        const s = io();
        setSocket(s);
        s.on('connect', () => {
            setIsConnected(true);
        })
    }, [])

    const onNewGame = (gameInterface: GameInterface) => {
        setGameInterface(gameInterface);
    }

    useEffect(() => {
        socket?.on('join-game', settings => {
            onNewGame(new RemoteGameInterface(socket!, settings));
        });

        return () => {
            socket?.removeAllListeners('join-game');
        }
    }, [socket]);

    const onExitGame = () => {
        setGameInterface(null);
    }

    return <div className={classes.container}>
        { gameInterface
            ? <Game gameInterface={gameInterface} onExit={onExitGame} />
            : <MainMenu onNewGame={onNewGame} socket={socket} isConnected={isConnected} />}
    </div>
}

export default App