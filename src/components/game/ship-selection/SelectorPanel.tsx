import { createUseStyles } from 'react-jss'
import { ShipDefinition } from '../../../config/GameSettings';

export interface ShipSelectorProps {
    ships: ShipDefinition[]
    selectedId?: number
    placementValid: boolean
    canRotate: boolean
    onSelected: (id: number) => void
    onRotated: () => void
    onPlace: () => void
}

const wrapBreakpoint = 750;

const useStyles = createUseStyles({
    container: {
        display: 'inline-block',
        padding: 10,
        [`@media (max-width: ${wrapBreakpoint}px)`]: {
            width: '100%',
        },
    },
    panel: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
        width: '100%',
    },
    shipList: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        [`@media (max-width: ${wrapBreakpoint}px)`]: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            width: '100%',
        },
    },
    ship: {
        border: '2px solid black',
        background: 'transparent',
        color: '#ccc',
        cursor: 'pointer',
        width: 220,
        textAlign: 'left',
        boxSizing: 'border-box',
        margin: {
            bottom: 5,
        },
        padding: {
            left: 10,
            right: 10,
            top: 5,
            bottom: 5,
        },
        '& div': {
            fontSize: '1.5rem',
        },
        '& span': {
            fontSize: '1rem',
            display: 'inline-block',
        },
    },
    selectedShip: {
        backgroundColor: '#0050d4',
    },
    actionContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    actionButton: {
        border: '1px solid black',
        color: '#ccc',
        background: '#0050d4',
        fontSize: '1.5rem',
        cursor: 'pointer',
        '&:first-of-type': {
            marginRight: 20,
        },
        '&:disabled': {
            cursor: 'default',
            background: '#999',
        },
        [`@media (max-width: ${wrapBreakpoint}px)`]: {
            alignSelf: 'stretch',
        },
    },
})

export default function SelectorPanel(props: ShipSelectorProps) {
    const classes = useStyles();

    return <div className={classes.container}>
        <div className={classes.shipList}>
            {props.ships.map(s => {
                return <button key={s.id} onClick={() => props.onSelected(s.id)} className={`${classes.ship} ${s.id === props.selectedId ? classes.selectedShip : ''}`}>
                    <div>{s.name}</div>
                    <span>Size: {s.size}</span>
                </button>
            })}
        </div>
        <div className={classes.actionContainer}>
            <button className={classes.actionButton} onClick={props.onRotated} disabled={!props.canRotate}>Rotate</button>
            <button className={classes.actionButton} onClick={props.onPlace} disabled={!props.placementValid}>Place</button>
        </div>
    </div>
}