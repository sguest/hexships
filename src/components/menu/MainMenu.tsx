import { createUseStyles } from 'react-jss'

export interface MainMenuProps {
    onNewGame: () => void
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
})

export default function MainMenu(props: MainMenuProps) {
    const classes = useStyles();
    return <>
        <h1 className={classes.heading}>Hexships</h1>
        <ul className={classes.menu}>
            <li><button className={classes.menuButton} onClick={props.onNewGame}>New Game</button></li>
        </ul>
    </>
}