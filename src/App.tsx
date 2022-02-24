import './App.css'
import GameSettings from './config/GameSettings';
import UiSettings from './config/UiSettings';
import { useState } from 'react';
import MainMenu from './components/menu/MainMenu';
import Game from './components/game/Game';
import GameManager from './game-state/GameManager';

const settings: GameSettings = {
    gridSize: 7,
};

const uiSettings: UiSettings = {
    cellSize: 20,
    gridOffset: { x: 200, y: 250 },
};

function App() {
    const [gameManager, setGameManager] = useState<GameManager | null>(null);

    const onNewGame = () => {
        setGameManager(new GameManager(settings));
    }

    return gameManager
        ? <Game uiSettings={uiSettings} gameManager={gameManager} />
        : <MainMenu onNewGame={onNewGame} />;
}

export default App