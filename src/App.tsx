import './App.css'
import GameSettings from './config/GameSettings';
import UiSettings from './config/UiSettings';
import { useState } from 'react';
import MainMenu from './components/menu/MainMenu';
import Game from './components/game/Game';
import GameInterface from './game-interface/GameInterface';
import LocalGameInterface from './game-interface/LocalGameInterface';

const settings: GameSettings = {
    gridSize: 7,
    ships: [
        { size: 2, name: 'Patrol Boat' },
        { size: 3, name: 'Destroyer' },
        { size: 3, name: 'Submarine' },
        { size: 4, name: 'Battleship' },
        { size: 5, name: 'Aircraft Carrier' },
    ],
};

const uiSettings: UiSettings = {
    cellSize: 20,
    gridOffset: { x: 200, y: 250 },
};

function App() {
    const [gameInterface, setGameInterface] = useState<GameInterface | null>(null);

    const onNewGame = () => {
        setGameInterface(new LocalGameInterface(settings));
    }

    const onExitGame = () => {
        setGameInterface(null);
    }

    return gameInterface
        ? <Game uiSettings={uiSettings} gameInterface={gameInterface} gameSettings={settings} onExit={onExitGame} />
        : <MainMenu onNewGame={onNewGame} />;
}

export default App