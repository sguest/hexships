import { useState } from 'react';
import * as GameMode from '../../config/GameMode';
import { GameModeId, getGameMode, listGameModes, Custom } from '../../config/GameMode';
import { createUseStyles } from 'react-jss';
import { standardButton, textColour, textInput } from '../CommonStyles';
import Tooltip from './Tooltip';
import GameSettings, { validateSettings } from '../../config/GameSettings';
import CustomGameSettings from './CustomGameSettings';

export interface GameCreationProps {
    onCreated: (name: string, mode: GameModeId, settings?: GameSettings) => void
    onCancel: () => void
}

const useStyles = createUseStyles({
    form: {
        padding: {
            left: 20,
            right: 20,
        },
        maxWidth: 500,
    },
    label: {
        color: textColour,
        fontSize: '1.1rem',
        fontFamily: 'sans-serif',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        margin: { bottom: 15 },
    },
    input: {
        ...textInput,
        width: 200,
        boxSizing: 'border-box',
        maxWidth: '100%',
        flexShrink: 0,
    },
    button: {
        ...standardButton,
        '&:first-of-type': {
            marginRight: 20,
        },
    },
});

export default function GameCreation(props: GameCreationProps) {
    const classes = useStyles();
    const [selectedMode, setSelectedMode] = useState(GameModeId.Basic);
    const [customSettings, setCustomSettings] = useState(GameMode.Basic.settings);
    const [name, setName] = useState('');

    const createGame = () => {
        props.onCreated(name, selectedMode, customSettings);
    }

    let isValid = true;
    if(!name.trim()) {
        isValid = false;
    }
    if(selectedMode === GameModeId.Custom && !validateSettings(customSettings)) {
        isValid = false;
    }

    return <form className={classes.form}>
        <label className={classes.label}>
            Game Name
            <input className={classes.input} type="text" value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label className={classes.label}>
            Game Mode
            <Tooltip>{getGameMode(selectedMode).description}</Tooltip>
            <select className={classes.input} value={selectedMode} onChange={e => setSelectedMode(parseInt(e.target.value) as GameModeId)} data-testid="gamemode">
                {[...listGameModes(), Custom].map(m => <option value={m.id} key={m.id}>{m.title}</option>)}
            </select>
        </label>
        {selectedMode === GameModeId.Custom && <>
            <CustomGameSettings onSettingsChanged={setCustomSettings} settings={customSettings} />
        </>}
        <button className={classes.button} onClick={createGame} disabled={!isValid} type="button">Create</button>
        <button className={classes.button} onClick={() => props.onCancel()} type="button">Cancel</button>
    </form>
}