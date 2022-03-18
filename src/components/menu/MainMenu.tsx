import { useState } from 'react';
import { createUseStyles } from 'react-jss'
import { Socket } from 'socket.io-client';
import GameSettings from '../../config/GameSettings';
import GameInterface from '../../game-interface/GameInterface';
import LocalGameInterface from '../../game-interface/LocalGameInterface';
import RemoteGameInterface from '../../game-interface/RemoteGameInterface';

export interface MainMenuProps {
    onNewGame: (gameInterface: GameInterface) => void
    gameSettings: GameSettings
    socket: Socket
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
    menu: {
        margin: 0,
        padding: {
            left: 20,
        },
        listStyleType: 'none',
    },
    menuButton: {
        background: 'transparent',
        border: 'none',
        fontFamily: ['Big Shoulders Stencil Text', 'sans-serif'],
        color: '#ccc',
        fontSize: '1.5rem',
        cursor: 'pointer',
        '&:hover': {
            color: '#fff',
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

export default function MainMenu(props: MainMenuProps) {
    const classes = useStyles();
    const [isQuickMatchSearch, setIsquickMatchSearch] = useState(false);

    const enterQuickMatch = () => {
        setIsquickMatchSearch(true);
        props.socket.once('quick-match-found', () => {
            props.onNewGame(new RemoteGameInterface(props.socket));
        })
        props.socket.emit('quick-connect');
    }

    const cancelQuickConnect = () => {
        props.socket.emit('cancel-quick-connect');
        props.socket.off('quick-match-found');
        setIsquickMatchSearch(false);
    }

    return <>
        <h1 className={classes.heading}>Hexships</h1>
        {isQuickMatchSearch && <>
            <p className={classes.statusText}>Searching for opponent...</p>
            <button className={classes.buttonStyle} onClick={cancelQuickConnect}>Cancel</button>
        </>}
        {!isQuickMatchSearch &&
            <ul className={classes.menu}>
                <li><button className={classes.menuButton} onClick={() => props.onNewGame(new LocalGameInterface(props.gameSettings))}>Versus AI</button></li>
                <li><button className={classes.menuButton} onClick={enterQuickMatch}>Find Opponent</button></li>
            </ul>
        }
    </>
}