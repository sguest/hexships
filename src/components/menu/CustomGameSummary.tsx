import { createUseStyles } from 'react-jss';
import * as GameMode from '../../config/GameMode';
import GameSettings, { ShipDefinition } from '../../config/GameSettings';

export interface CustomGameSummaryProps {
    settings: GameSettings
}

const useStyles = createUseStyles({
    item: {
        fontSize: '1rem',
        margin: {
            top: 4,
            bottom: 4,
        },
    },
})

export default function CustomGameSummary(props: CustomGameSummaryProps) {
    const classes = useStyles();
    const shipsEqual = (a: ShipDefinition, b: ShipDefinition) => {
        return a.name === b.name && a.size === b.size;
    }

    const standardShips = props.settings.ships.length === 5 &&
        props.settings.ships.every((ship, index) => shipsEqual(ship, GameMode.Basic.settings.ships[index]));

    return <>
        <p className={classes.item}>Differences from basic rules:</p>
        {props.settings.shotPerShip && <p className={classes.item}>1 shot per surviving ship</p>}
        {!props.settings.shotPerShip && props.settings.shots > 1 && <p className={classes.item}>{props.settings.shots} shots per turn</p>}
        {props.settings.streak && <p className={classes.item}>Fire again after a hit</p>}
        {props.settings.mines > 0 && <p className={classes.item}>{props.settings.mines} mine{props.settings.mines > 1 && 's'}</p>}
        {props.settings.gridSize !== GameMode.Basic.settings.gridSize && <p className={classes.item}>Field size {props.settings.gridSize} from center to corner</p>}
        {!standardShips && <div className={classes.item}>
            Ships
            <ul>
                {props.settings.ships.map(s => <li key={s.id}>{s.name} (size {s.size})</li>)}
            </ul>
        </div>}
    </>
}