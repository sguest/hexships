import { useState } from 'react';
import { createUseStyles } from 'react-jss'
import GameInterface from '../../game-interface/GameInterface';
import LocalGameInterface from '../../game-interface/LocalGameInterface';
import RemoteGameInterface, { ClientSocket } from '../../game-interface/RemoteGameInterface';
import GameSettings from '../../config/GameSettings';
import { GameModeId } from '../../config/GameMode';
import Menu from './Menu';
import ModeSelection from './ModeSelection';
export interface MainMenuProps {
    onNewGame: (gameInterface: GameInterface) => void
    socket: ClientSocket | undefined
    isConnected: boolean
}

const useStyles = createUseStyles({
    heading: {
        fontFamily: ['Big Shoulders Stencil Text', 'sans-serif'],
        color: '#ccc',
        fontSize: '3rem',
        margin: 0,
        padding: {
            top: 10,
            bottom: 10,
            left: 20,
        },
    },
    statusText: {
        fontFamily: ['Big Shoulders Stencil Text', 'sans-serif'],
        color: '#ccc',
        fontSize: '1.5rem',
        padding: {
            left: 20,
        },
    },
    buttonStyle: {
        fontSize: '1.2rem',
        border: '2px solid black',
        padding: {
            top: 4,
            bottom: 4,
            left: 10,
            right: 10,
        },
        margin: {
            left: 20,
        },
        cursor: 'pointer',
        color: '#ccc',
        backgroundColor: '#333',
        '&:hover': {
            backgroundColor: '#555',
        },
    },
})

enum CurrentMenu {
    MainMenu,
    SinglePlayerMode,
    MultiplayerMode,
}

export default function MainMenu(props: MainMenuProps) {
    const classes = useStyles();
    const [isQuickMatchSearch, setIsquickMatchSearch] = useState(false);
    const [currentMenu, setCurrentMenu] = useState(CurrentMenu.MainMenu);

    const enterQuickMatch = (mode: GameModeId) => {
        setIsquickMatchSearch(true);
        props.socket?.once('join-game', (settings: GameSettings) => {
            props.onNewGame(new RemoteGameInterface(props.socket!, settings));
        })
        props.socket?.emit('quick-connect', mode);
    }

    const cancelQuickConnect = () => {
        props.socket?.emit('cancel-quick-connect');
        props.socket?.off('join-game');
        setIsquickMatchSearch(false);
    }

    const startAiGame = (settings: GameSettings) => {
        props.onNewGame(new LocalGameInterface(settings));
    }

    return <>
        <h1 className={classes.heading}>Hexships</h1>
        {isQuickMatchSearch && <>
            <p className={classes.statusText}>Searching for opponent...</p>
            <button className={classes.buttonStyle} onClick={cancelQuickConnect}>Cancel</button>
        </>}
        {!isQuickMatchSearch && <>
            { currentMenu === CurrentMenu.MainMenu &&
                <Menu items={[
                    { text: 'Versus AI', onClick: () => setCurrentMenu(CurrentMenu.SinglePlayerMode) },
                    { text: 'Find Opponent', onClick: () => setCurrentMenu(CurrentMenu.MultiplayerMode), condition: props.isConnected },
                ]} />
            }
            { currentMenu === CurrentMenu.SinglePlayerMode &&
                <ModeSelection
                    onSelection={mode => startAiGame(mode.settings)}
                    onCancel={() => setCurrentMenu(CurrentMenu.MainMenu)}
                />
            }
            { currentMenu === CurrentMenu.MultiplayerMode &&
                <ModeSelection
                    onSelection={mode => enterQuickMatch(mode.id)}
                    onCancel={() => setCurrentMenu(CurrentMenu.MainMenu)}
                />
            }
        </>}
    </>
}