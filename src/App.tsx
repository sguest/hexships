import GameSettings from './config/GameSettings';
import { useState } from 'react';
import MainMenu from './components/menu/MainMenu';
import Game from './components/game/Game';
import GameInterface from './game-interface/GameInterface';
import LocalGameInterface from './game-interface/LocalGameInterface';
import { createUseStyles } from 'react-jss';

const settings: GameSettings = {
    gridSize: 7,
    ships: [
        { id: 1, size: 2, name: 'Patrol Boat' },
        { id: 2, size: 3, name: 'Destroyer' },
        { id: 3, size: 3, name: 'Submarine' },
        { id: 4, size: 4, name: 'Battleship' },
        { id: 5, size: 5, name: 'Aircraft Carrier' },
    ],
};

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
    const classes = useStyles();

    const onNewGame = () => {
        setGameInterface(new LocalGameInterface(settings));
    }

    const onExitGame = () => {
        setGameInterface(null);
    }

    return <div className={classes.container}>
        { gameInterface
            ? <Game gameInterface={gameInterface} gameSettings={settings} onExit={onExitGame} />
            : <MainMenu onNewGame={onNewGame} />}
    </div>
}

export default App