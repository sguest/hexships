import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss'
import GameInterface from '../../game-interface/GameInterface';
import LocalGameInterface from '../../game-interface/LocalGameInterface';
import RemoteGameInterface, { ClientSocket } from '../../game-interface/RemoteGameInterface';
import GameSettings from '../../config/GameSettings';
import { GameModeId, listGameModes, ModeSettings } from '../../config/GameMode';
import Menu, { MenuItem } from './Menu';
import GameCreation from './GameCreation';
import GameDefinition from '../../config/GameDefinition';
import LobbyGame from '../../server/LobbyGame';
import GameList from './GameList';
import { standardButton, stencilFont, textColour } from '../CommonStyles';
export interface MainMenuProps {
    onNewGame: (gameInterface: GameInterface) => void
    socket: ClientSocket | undefined
    isConnected: boolean
}

const useStyles = createUseStyles({
    heading: {
        fontFamily: stencilFont,
        color: textColour,
        fontSize: '3rem',
        margin: 0,
        padding: {
            top: 10,
            bottom: 10,
            left: 20,
        },
    },
    statusText: {
        fontFamily: stencilFont,
        color: textColour,
        fontSize: '1.5rem',
        padding: {
            left: 20,
        },
    },
    buttonStyle: {
        ...standardButton,
        margin: {
            left: 20,
        },
    },
})

enum CurrentMenu {
    MainMenu,
    SinglePlayerMode,
    MultiplayerMode,
    MultiplayerQuickMatchMode,
    QuickMatchSearch,
    GameCreation,
    LobbyWaiting,
    GameList,
}

export default function MainMenu(props: MainMenuProps) {
    const classes = useStyles();
    const [currentMenu, setCurrentMenu] = useState(CurrentMenu.MainMenu);
    const [lobbyGames, setLobbyGames] = useState<LobbyGame[] | undefined>(undefined);
    const { socket, onNewGame } = props;

    useEffect(() => {
        socket?.on('join-game', settings => {
            onNewGame(new RemoteGameInterface(socket!, settings));
        });

        return () => {
            socket?.removeAllListeners('join-game');
        }
    }, [onNewGame, socket]);

    useEffect(() => {
        socket?.on('add-lobby-game', game => {
            if(lobbyGames) {
                if(lobbyGames.findIndex(g => g.id === game.id) === -1) {
                    setLobbyGames([...lobbyGames, game]);
                }
            }
            else {
                setLobbyGames([game]);
            }
        });

        socket?.on('remove-lobby-game', id => {
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
            socket?.removeAllListeners('add-lobby-game');
            socket?.removeAllListeners('remove-lobby-game');
        }
    }, [socket, lobbyGames]);

    const enterQuickMatch = (mode: GameModeId) => {
        setCurrentMenu(CurrentMenu.QuickMatchSearch);
        socket?.emit('quick-connect', mode);
    }

    const cancelQuickConnect = () => {
        socket?.emit('cancel-quick-connect');
        setCurrentMenu(CurrentMenu.MultiplayerQuickMatchMode);
    }

    const createLobbyGame = (game: GameDefinition) => {
        setCurrentMenu(CurrentMenu.LobbyWaiting);
        socket?.emit('add-lobby-game', game);
    }

    const cancelLobbyGame = () => {
        socket?.emit('remove-lobby-game');
        setCurrentMenu(CurrentMenu.MultiplayerMode);
    }

    const loadGameList = () => {
        socket?.emit('enter-lobby', games => {
            setLobbyGames(games);
        });
        setCurrentMenu(CurrentMenu.GameList)
    }

    const joinLobbyGame = (game: LobbyGame) => {
        socket?.emit('join-lobby-game', game.id);
    }

    const startAiGame = (settings: GameSettings) => {
        props.onNewGame(new LocalGameInterface(settings));
    }

    const getModeSelectionItems = (onSelect: (mode: ModeSettings) => void) => {
        return listGameModes().map(m => ({ text: m.title, onClick: () => onSelect(m), tooltip: m.description }));
    }

    let items: MenuItem[] = [];

    if(currentMenu === CurrentMenu.MainMenu) {
        items = [
            { text: 'Versus AI', onClick: () => setCurrentMenu(CurrentMenu.SinglePlayerMode) },
            { text: 'Multiplayer', onClick: () => setCurrentMenu(CurrentMenu.MultiplayerMode), condition: props.isConnected },
        ];
    }
    else if(currentMenu === CurrentMenu.SinglePlayerMode) {
        items = [
            ...getModeSelectionItems(m => startAiGame(m.settings)),
            { text: 'Back', onClick: () => setCurrentMenu(CurrentMenu.MainMenu) },
        ];
    }
    else if(currentMenu === CurrentMenu.MultiplayerMode) {
        items = [
            { text: 'Quick Match', onClick: () => setCurrentMenu(CurrentMenu.MultiplayerQuickMatchMode) },
            { text: 'Create Game', onClick: () => setCurrentMenu(CurrentMenu.GameCreation) },
            { text: 'Find Game', onClick: loadGameList },
            { text: 'Back', onClick: () => setCurrentMenu(CurrentMenu.MainMenu) },
        ];
    }
    else if(currentMenu === CurrentMenu.MultiplayerQuickMatchMode) {
        items = [
            ...getModeSelectionItems(m => enterQuickMatch(m.id)),
            { text: 'Back', onClick: () => setCurrentMenu(CurrentMenu.MultiplayerMode) },
        ];
    }

    return <>
        <h1 className={classes.heading}>Hexships</h1>
        {!!items.length && <Menu items={items} />}
        {currentMenu === CurrentMenu.QuickMatchSearch && <>
            <p className={classes.statusText}>Searching for opponent...</p>
            <button className={classes.buttonStyle} onClick={cancelQuickConnect}>Cancel</button>
        </>}
        {currentMenu === CurrentMenu.GameCreation && <GameCreation onCreated={createLobbyGame} onCancel={() => setCurrentMenu(CurrentMenu.MultiplayerMode)} />}
        {currentMenu === CurrentMenu.LobbyWaiting && <>
            <p className={classes.statusText}>Waiting for opponent...</p>
            <button className={classes.buttonStyle} onClick={cancelLobbyGame}>Cancel</button>
        </>}
        {currentMenu === CurrentMenu.GameList && <>
            <button className={classes.buttonStyle} onClick={() => setCurrentMenu(CurrentMenu.MultiplayerMode)}>Back</button>
            <GameList games={lobbyGames} onSelected={game => joinLobbyGame(game)} />
        </>}
    </>
}