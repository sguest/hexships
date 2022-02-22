import './App.css'
import Field from './Field'
import GameSettings from './config/GameSettings';

function App() {
    const settings: GameSettings = {
        gridSize: 7
    };
    
    return (

        <Field settings={settings} />

    )
}

export default App