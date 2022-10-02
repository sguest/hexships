import { useState } from 'react';
import { GameModeId, getGameMode, listGameModes } from '../../config/GameMode';
import GameDefinition from '../../config/GameDefinition';
import { createUseStyles } from 'react-jss';
import { standardButton, textColour, textInput } from '../CommonStyles';
import Tooltip from './Tooltip';

export interface GameCreationProps {
    onCreated: (game: GameDefinition) => void
    onCancel: () => void
}

const useStyles = createUseStyles({
    form: {
        padding: {
            left: 20,
            right: 20,
        },
        maxWidth: 400,
        '& label': {
            color: textColour,
            fontSize: '1.5rem',
            fontFamily: 'sans-serif',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            margin: { bottom: 15 },
        },
        '& input, & select': {
            ...textInput,
            width: 200,
            boxSizing: 'border-box',
            maxWidth: '100%',
            flexShrink: 0,
        },
    },
    button: {
        ...standardButton,
        '&:first-of-type': {
            marginRight: 20,
        },
    },
})

export default function GameCreation(props: GameCreationProps) {
    const classes = useStyles();
    const [selectedMode, setSelectedMode] = useState(GameModeId.Basic)
    const [name, setName] = useState('');

    const createGame = () => {
        props.onCreated({
            name,
            mode: selectedMode,
        })
    }

    return <form className={classes.form}>
        <label>
            Game Name
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label>
            Game Mode
            <Tooltip text={getGameMode(selectedMode).description} />
            <select value={selectedMode} onChange={e => setSelectedMode(e.target.value as unknown as GameModeId)} data-testid="gamemode">
                {listGameModes().map(m => <option value={m.id} key={m.id}>{m.title}</option>)}
            </select>
        </label>
        <button className={classes.button} onClick={createGame} disabled={!name} type="button">Create</button>
        <button className={classes.button} onClick={() => props.onCancel()} type="button">Cancel</button>
    </form>
}