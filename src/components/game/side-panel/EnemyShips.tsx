import { createUseStyles } from 'react-jss';
import { ShipDefinition } from '../../../config/GameSettings';
import { standardButton, stencilFont, textColour } from '../../CommonStyles';

export interface EnemyShipsProps {
    ships?: ShipDefinition[]
    sunkShipIds?: number[]
    arsenalButtonVisible: boolean
    onArsenalClick: () => void
}

const useStyles = createUseStyles({
    enemyShipHeader: {
        fontFamily: stencilFont,
        color: textColour,
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
        color: textColour,
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
    arsenal: {
        ...standardButton,
        maxHeight: '3rem',
        margin: {
            top: 10,
        },
    },
});

export default function StatusPanel(props: EnemyShipsProps) {
    const classes = useStyles();

    return <>
        {props.ships?.length && <>
            <p className={classes.enemyShipHeader}>Enemy Ships</p>
            <div className={classes.enemyShips}>
                {props.ships.map(ship => {
                    return <div className={`${classes.enemyShip} ${props.sunkShipIds && props.sunkShipIds.indexOf(ship.id) !== -1 ? classes.enemyShipSunk : ''}`} key={ship.id}>{ship.name} ({ship.size})</div>
                })}
            </div>
        </>}
        { props.arsenalButtonVisible && <>
            <button className={classes.arsenal} onClick={props.onArsenalClick}>Arsenal</button>
        </>}
    </>
}