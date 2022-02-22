import './App.css'
import GameSettings from './config/GameSettings';
import Board from './components/board/Board';
import Direction from './game-state/Direction';
import UiSettings from './config/UiSettings';

function App() {
    const settings: GameSettings = {
        gridSize: 7,
    };

    const uiSettings: UiSettings = {
        cellSize: 20,
        gridOffset: { x: 200, y: 250 },
    };

    const ships = [
        {
            x: 1,
            y: 2,
            size: 2,
            facing: Direction.positiveX,
        },
        {
            x: -3,
            y: 3,
            size: 4,
            facing: Direction.positiveZ,
        }
    ]
    
    return (
        <Board gridSize={settings.gridSize} ships={ships} uiSettings={uiSettings} />
    )
}

export default App