import { createUseStyles } from 'react-jss';
import { ShipDefinition } from '../../config/GameSettings';

export interface StatusPanelProps {
    statusMessage?: string
    ships?: ShipDefinition[]
    sunkShipIds?: number[]
    fireButtonVisible: boolean
    fireButtonEnabled: boolean
    onFireClick: () => void
}

const useStyles = createUseStyles({
    statusPanel: {
        position: 'relative',
        padding: {
            top: 10,
            left: 10,
            right: 10,
            bottom: 60,
        },
        boxSizing: 'border-box',
        minHeight: 90,
        width: '100%',
        maxWidth: 200,
        gridArea: 'panel',
        '@media (max-width: 640px)': {
            padding: 0,
        },
        display: 'grid',
        gridTemplateColumns: '100%',
        gridTemplateRows: 'repeat(7, 1fr)',
    },
    info: {
        fontFamily: ['Big Shoulders Stencil Text', 'sans-serif'],
        color: '#ccc',
        fontSize: '2rem',
        margin: 0,
        '@media (max-width: 640px)': {
            fontSize: '1rem',
        },
    },
    enemyShipHeader: {
        fontFamily: ['Big Shoulders Stencil Text', 'sans-serif'],
        color: '#ccc',
        fontSize: '1.6rem',
        margin: {
            top: 10,
            bottom: 0,
        },
        '@media (max-width: 640px)': {
            fontSize: '0.8rem',
        },
    },
    enemyShips: {
        display: 'grid',
        gridTemplateColumns: '100%',
        gridTemplateRows: 'repeat(6, 1fr)',
        '@media (max-width: 640px)': {
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: 'repeat(3, 1fr)',
        },
    },
    enemyShip: {
        border: '2px solid black',
        color: '#ccc',
        fontFamily: 'sans-serif',
        fontSize: '1.2rem',
        position: 'relative',
        padding: 4,
        margin: { top: 5 },
        '@media (max-width: 640px)': {
            fontSize: '0.6rem',
            padding: 2,
        },
    },
    enemyShipSunk: {
        border: '2px solid red',
        '&:after': {
            width: '100%',
            height: '100%',
            display: 'inline-block',
            position: 'absolute',
            top: 0,
            left: 0,
            content: '""',
            background: 'linear-gradient(10deg, transparent 47%, red 47%, red 53%, transparent 53%), linear-gradient(170deg, transparent 47%, red 47%, red 53%, transparent 53%)',
        },
    },
    fire: {
        border: '2px solid #ccc',
        cursor: 'pointer',
        color: 'white',
        fontSize: '1.5rem',
        textShadow: '1px 1px 0 black',
        background: 'radial-gradient(#ff8000, #ff0000)',
        textTransform: 'uppercase',
        '&:hover': {
            background: 'radial-gradient(#ffa447, #ff4747)',
        },
        '&:disabled': {
            color: '#aaa',
            background: '#777',
            cursor: 'default',
        },
    },
});

export default function StatusPanel(props: StatusPanelProps) {
    const classes = useStyles();

    return <div className={classes.statusPanel}>
        {props.statusMessage && <p className={classes.info}>{props.statusMessage}</p>}
        {props.ships?.length && <>
            <p className={classes.enemyShipHeader}>Enemy Ships</p>
            <div className={classes.enemyShips}>
                {props.ships.map(ship => {
                    return <div className={`${classes.enemyShip} ${props.sunkShipIds && props.sunkShipIds.indexOf(ship.id) !== -1 ? classes.enemyShipSunk : ''}`} key={ship.id}>{ship.name} ({ship.size})</div>
                })}
                { props.fireButtonVisible &&
                    <button className={classes.fire} onClick={props.onFireClick} disabled={!props.fireButtonEnabled}>Fire</button> }
            </div>
        </>}
    </div>
}