import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { GameModeId, getGameMode } from '../../config/GameMode';
import { ClientSocket } from '../../game-interface/RemoteGameInterface';
import LobbyGame from '../../server/LobbyGame';
import { standardButton, textColour } from '../CommonStyles';
import CustomGameSummary from './CustomGameSummary';
import Tooltip from './Tooltip';

export interface GameListProps {
    socket: ClientSocket | undefined;
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
    const [lobbyGames, setLobbyGames] = useState<LobbyGame[] | undefined>(undefined);

    useEffect(() => {
        if(lobbyGames === undefined) {
            props.socket?.emit('enter-lobby', games => {
                setLobbyGames(games);
            });
        }
    });

    useEffect(() => {
        props.socket?.on('add-lobby-game', game => {
            if(lobbyGames) {
                if(lobbyGames.findIndex(g => g.id === game.id) === -1) {
                    setLobbyGames([...lobbyGames, game]);
                }
            }
            else {
                setLobbyGames([game]);
            }
        });

        props.socket?.on('remove-lobby-game', id => {
            if(lobbyGames) {
                const gameIndex = lobbyGames.findIndex(g => g.id === id);
                if(gameIndex >= 0) {
                    const games = lobbyGames.slice();
                    games.splice(gameIndex);
                    setLobbyGames(games);
                }
            }
        });

        return () => {
            props.socket?.removeAllListeners('add-lobby-game');
            props.socket?.removeAllListeners('remove-lobby-game');
        }
    }, [props.socket, lobbyGames]);

    const onSelected = (gameId: string) => {
        props.socket?.emit('join-lobby-game', gameId);
    }

    return <>
        {!lobbyGames && <p className={classes.noGamesMessage}>Loading game list...</p>}
        {!!lobbyGames && !lobbyGames.length && <p className={classes.noGamesMessage}>No games found</p>}
        {!!lobbyGames?.length && <ul className={classes.list}>
            {!!lobbyGames && lobbyGames.map(g => <li className={classes.game} key={g.id}>
                <p className={classes.info}>Name: {g.definition.name}</p>
                <p className={classes.info}>Mode: {getGameMode(g.definition.mode).title}
                    <Tooltip>{
                        g.definition.mode === GameModeId.Custom
                            ? <CustomGameSummary settings={g.definition.settings} />
                            : getGameMode(g.definition.mode).description
                    }</Tooltip>
                </p>
                <button className={classes.button} onClick={() => onSelected(g.id)}>Join</button>
            </li>)}
        </ul>}
    </>;
}