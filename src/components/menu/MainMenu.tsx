import { createUseStyles } from 'react-jss'

export interface MainMenuProps {
    onNewGame: () => void
}

const useStyles = createUseStyles({
    menu: {
        margin: 0,
    },
})

export default function MainMenu(props: MainMenuProps) {
    const classes = useStyles();
    return <ul className={classes.menu}>
        <li><button onClick={props.onNewGame}>New Game</button></li>
    </ul>
}