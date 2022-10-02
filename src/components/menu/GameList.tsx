import { createUseStyles } from 'react-jss';
import { getGameMode } from '../../config/GameMode';
import LobbyGame from '../../server/LobbyGame';
import { standardButton, textColour } from '../CommonStyles';

export interface GameListProps {
    games: LobbyGame[] | undefined;
    onSelected: (game: LobbyGame) => void;
}

const useStyles = createUseStyles({
    button: standardButton,
    noGamesMessage: {
        color: textColour,
        size: '2rem',
        fontFamily: 'sans-serif',
        marginLeft: 20,
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 20,
    },
    game: {
        border: `1px solid ${textColour}`,
        padding: 15,
        width: '100%',
        maxWidth: 400,
        marginBottom: 10,
    },
    info: {
        margin: {
            top: 0,
            bottom: 5,
        },
        color: textColour,
        fontSize: '1.2rem',
        fontFamily: 'sans-serif',
    },
});

export default function GameList(props: GameListProps) {
    const classes = useStyles();
    return <>
        {!props.games && <p className={classes.noGamesMessage}>Loading game list...</p>}
        {!!props.games && !props.games.length && <p className={classes.noGamesMessage}>No games found</p>}
        {!!props.games?.length && <ul className={classes.list}>
            {!!props.games && props.games.map(g => <li className={classes.game} key={g.id}>
                <p className={classes.info}>Name: {g.definition.name}</p>
                <p className={classes.info}>Mode: {getGameMode(g.definition.mode).title}</p>
                <button className={classes.button} onClick={() => props.onSelected(g)}>Join</button>
            </li>)}
        </ul>}
    </>;
}