import { createUseStyles } from 'react-jss';
import GameSettings, { ShipDefinition } from '../../config/GameSettings';
import { textColour, textInput } from '../CommonStyles';

export interface CustomGameSettingsProps {
    settings: GameSettings
    onSettingsChanged: (settings: GameSettings) => void
}

const useStyles = createUseStyles({
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
    checkbox: {
        width: 20,
        height: 20,
    },
    addButton: {
        background: 'transparent',
        border: 'none',
        color: 'green',
        fontSize: '1.5rem',
        cursor: 'pointer',
        display: 'block',
        marginBottom: 10,
    },
    deleteButton: {
        background: 'transparent',
        border: 'none',
        color: 'red',
        fontSize: '1.1rem',
        cursor: 'pointer',
    },
    shipsHeader: {
        color: textColour,
        fontSize: '1.4rem',
        fontFamily: 'sans-serif',
    },
    shipList: {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
        color: textColour,
        fontFamily: 'sans-serif',
        fontSize: '1.1rem',
        '& li': {
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
        },
        '& input': textInput,
    },
    sizeInput: {
        maxWidth: 100,
    },
    nameInput: {
        marginRight: 20,
    },
});

export default function CustomGameSettings(props: CustomGameSettingsProps) {
    const classes = useStyles();

    const updateShips = (ship: ShipDefinition) => {
        const index = props.settings.ships.findIndex(s => s.id === ship.id);
        const ships = props.settings.ships.slice();
        ships[index] = ship;
        props.onSettingsChanged({ ...props.settings, ships });
    }

    const addShip = () => {
        props.onSettingsChanged({
            ...props.settings,
            ships: [
                ...props.settings.ships,
                {
                    id: Math.max(...props.settings.ships.map(s => s.id)) + 1,
                    name: '',
                    size: 2,
                },
            ],
        })
    }

    const deleteShip = (id: number) => {
        const ships = props.settings.ships.slice();
        ships.splice(ships.findIndex(s => s.id === id), 1);
        props.onSettingsChanged({ ...props.settings, ships });
    }

    return <>
        <label className={classes.label}>
            Number of shots per turn
            <input className={classes.input}
                type="number"
                min="1"
                value={props.settings.shots}
                onChange={e => props.onSettingsChanged({ ...props.settings, shots: parseInt(e.target.value) })}
                disabled={props.settings.shotPerShip} />
        </label>
        <label className={classes.label}>
            One shot per remaining ship
            <input className={classes.checkbox}
                type="checkbox"
                checked={props.settings.shotPerShip}
                onChange={e => props.onSettingsChanged({ ...props.settings, shotPerShip: e.target.checked }) } />
        </label>
        <label className={classes.label}>
            Fire again on hit
            <input className={classes.checkbox}
                type="checkbox"
                checked={props.settings.streak}
                onChange={e => props.onSettingsChanged({ ...props.settings, streak: e.target.checked }) } />
        </label>
        <label className={classes.label}>
            Number of mines
            <input className={classes.input}
                type="number"
                min="0"
                value={props.settings.mines}
                onChange={e => props.onSettingsChanged({ ...props.settings, mines: parseInt(e.target.value) }) } />
        </label>
        <label className={classes.label}>
            Field size - tiles from center to corner
            <input className={classes.input}
                type="number"
                min="1"
                value={props.settings.gridSize}
                onChange={e => props.onSettingsChanged({ ...props.settings, gridSize: parseInt(e.target.value) })} />
        </label>
        <p className={classes.shipsHeader}>Ships</p>
        <ul className={classes.shipList}>
            {props.settings.ships.map(s => <li key={s.id}>
                <label>Name <input className={classes.nameInput} type="text" value={s.name} onChange={e => updateShips({ ...s, name: e.target.value })} /></label>
                <label>Size <input className={classes.sizeInput} type="number" value={s.size} min={1} onChange={e => updateShips({ ...s, size: parseInt(e.target.value) })} /></label>
                <button className={classes.deleteButton} type="button" onClick={() => deleteShip(s.id)}>X</button>
            </li>)}
        </ul>
        <button className={classes.addButton} type="button" onClick={addShip}>+</button>
    </>
}