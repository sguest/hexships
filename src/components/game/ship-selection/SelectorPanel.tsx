import { createUseStyles } from 'react-jss'
import { ShipDefinition } from '../../../config/GameSettings';

export interface SelectorPanelProps {
    ships: ShipDefinition[]
    mines?: number
    placedIds: number[]
    selectedId?: number
    placementValid: boolean
    canRotate: boolean
    onSelected: (id: number) => void
    onRotated: () => void
    onConfirm: () => void
}

const wrapBreakpoint = 640;

const useStyles = createUseStyles({
    container: {
        display: 'inline-block',
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
        display: 'grid',
        gridTemplateRows: 'repeat(6, 1fr)',
        [`@media (max-width: ${wrapBreakpoint}px)`]: {
            gridTemplateRows: 'repeat(2, 1fr)',
            gridTemplateColumns: 'repeat(3, 1fr)',
        },
    },
    ship: {
        border: '2px solid black',
        background: 'transparent',
        color: '#ccc',
        cursor: 'pointer',
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
        '@media (max-width: 560px)': {
            padding: {
                left: 4,
                right: 4,
                top: 2,
                bottom: 2,
            },
        },
        '& div': {
            fontSize: '1.5rem',
            '@media (max-width: 560px)': {
                fontSize: '1.1rem',
            },
        },
        '& span': {
            fontSize: '1rem',
            display: 'inline-block',
            '@media (max-width: 560px)': {
                fontSize: '0.8rem',
            },
        },
    },
    selectedShip: {
        backgroundColor: '#0050d4',
    },
    mines: {
        color: '#ccc',
        fontSize: '1.5rem',
        fontFamily: 'sans-serif',
    },
    placedShip: {
        borderColor: '#ccc',
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
            fontSize: '1rem',
        },
    },
})

export default function SelectorPanel(props: SelectorPanelProps) {
    const classes = useStyles();

    return <div className={classes.container}>
        {props.mines === undefined
            ? <div className={classes.shipList}>
                {props.ships.map(s => {
                    return <button
                        key={s.id}
                        onClick={() => props.onSelected(s.id)}
                        className={`${classes.ship} ${s.id === props.selectedId ? classes.selectedShip : ''} ${props.placedIds.indexOf(s.id) === -1 ? '' : classes.placedShip}`}
                    >
                        <div>{s.name}</div>
                        <span>Size: {s.size}</span>
                    </button>
                })}
            </div>
            : <p className={classes.mines}>{props.mines} Mine{props.mines === 1 ? '' : 's'} remaining</p>
        }
        <div className={classes.actionContainer}>
            {props.mines === undefined && <button className={classes.actionButton} onClick={props.onRotated} disabled={!props.canRotate}>Rotate</button>}
            <button className={classes.actionButton} onClick={props.onConfirm} disabled={!props.placementValid}>Confirm</button>
        </div>
    </div>
}