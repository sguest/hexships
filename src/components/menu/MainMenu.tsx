import { useState } from 'react';
import { createUseStyles } from 'react-jss'
import GameInterface from '../../game-interface/GameInterface';
import LocalGameInterface from '../../game-interface/LocalGameInterface';
import { ClientSocket } from '../../game-interface/RemoteGameInterface';
import GameSettings, { validateSettings } from '../../config/GameSettings';
import * as GameMode from '../../config/GameMode';
import { GameModeId, listGameModes, ModeSettings } from '../../config/GameMode';
import Menu, { MenuItem } from './Menu';
import GameCreation from './GameCreation';
import GameList from './GameList';
import { standardButton, stencilFont, textColour } from '../CommonStyles';
import CustomGameSettings from './CustomGameSettings';
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
    singlePlayerCustom: {
        padding: {
            left: 20,
            right: 20,
        },
        maxWidth: 500,
    },
    playButton: standardButton,
})

enum CurrentMenu {
    MainMenu,
    SinglePlayerMode,
    SinglePlayerCustom,
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
    const [customGameSettings, setCustomGameSettings] = useState(GameMode.Basic.settings);
    const { socket } = props;

    const enterQuickMatch = (mode: GameModeId) => {
        setCurrentMenu(CurrentMenu.QuickMatchSearch);
        socket?.emit('quick-connect', mode);
    }

    const cancelQuickConnect = () => {
        socket?.emit('cancel-quick-connect');
        setCurrentMenu(CurrentMenu.MultiplayerQuickMatchMode);
    }

    const cancelLobbyGame = () => {
        socket?.emit('remove-lobby-game');
        setCurrentMenu(CurrentMenu.MultiplayerMode);
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
            ...getModeSelectionItems(m => startAiGame(m.settings!)),
            { text: 'Custom', onClick: () => setCurrentMenu(CurrentMenu.SinglePlayerCustom) },
            { text: 'Back', onClick: () => setCurrentMenu(CurrentMenu.MainMenu) },
        ];
    }
    else if(currentMenu === CurrentMenu.MultiplayerMode) {
        items = [
            { text: 'Quick Match', onClick: () => setCurrentMenu(CurrentMenu.MultiplayerQuickMatchMode) },
            { text: 'Create Game', onClick: () => setCurrentMenu(CurrentMenu.GameCreation) },
            { text: 'Find Game', onClick: () => setCurrentMenu(CurrentMenu.GameList) },
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
        {currentMenu === CurrentMenu.SinglePlayerCustom && <form className={classes.singlePlayerCustom}>
            <CustomGameSettings onSettingsChanged={setCustomGameSettings} settings={customGameSettings} />
            <button className={classes.playButton} onClick={() => customGameSettings && startAiGame(customGameSettings)} disabled={!validateSettings(customGameSettings)} type="button">Play</button>
            <button className={classes.buttonStyle} onClick={() => setCurrentMenu(CurrentMenu.SinglePlayerMode)} type="button">Cancel</button>
        </form>}
        {currentMenu === CurrentMenu.QuickMatchSearch && <>
            <p className={classes.statusText}>Searching for opponent...</p>
            <button className={classes.buttonStyle} onClick={cancelQuickConnect}>Cancel</button>
        </>}
        {currentMenu === CurrentMenu.GameCreation && <GameCreation onCreated={() => setCurrentMenu(CurrentMenu.LobbyWaiting)} onCancel={() => setCurrentMenu(CurrentMenu.MultiplayerMode)} socket={socket} />}
        {currentMenu === CurrentMenu.LobbyWaiting && <>
            <p className={classes.statusText}>Waiting for opponent...</p>
            <button className={classes.buttonStyle} onClick={cancelLobbyGame}>Cancel</button>
        </>}
        {currentMenu === CurrentMenu.GameList && <>
            <button className={classes.buttonStyle} onClick={() => setCurrentMenu(CurrentMenu.MultiplayerMode)}>Back</button>
            <GameList socket={props.socket} />
        </>}
    </>
}