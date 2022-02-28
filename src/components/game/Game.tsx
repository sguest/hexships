import { useEffect, useState } from 'react';
import GameSettings from '../../config/GameSettings';
import GameInterface from '../../game-interface/GameInterface';
import LocalState from '../../game-state/LocalState';
import Board from '../board/Board';
import Ship from '../../game-state/Ship';
import ShipSelection from './ship-selection/ShipSelection';
import { Point } from '../../utils/point-utils';
import * as pointUtils from '../../utils/point-utils';
import { createUseStyles } from 'react-jss';

enum CurrentAction {
    PlacingShips,
    SelectingShot,
    GameOver,
}

export interface GameProps {
    gameSettings: GameSettings
    gameInterface: GameInterface
    onExit: () => void
}

const useStyles = createUseStyles({
    info: {
        color: '#ccc',
        fontSize: '1rem',
    },
})

export default function Game(props: GameProps) {
    const [localState, setLocalState] = useState<LocalState | undefined>(undefined);
    const [currentAction, setCurrentAction] = useState(CurrentAction.PlacingShips);
    const [targetTile, setTargetTile] = useState<Point | undefined>(undefined);
    const classes = useStyles();

    useEffect(() => {
        const subscriber = (state: LocalState) => {
            if(state.sunkEnemies.length !== localState?.sunkEnemies.length) {
                for(const sunk of state.sunkEnemies) {
                    if(localState?.sunkEnemies.indexOf(sunk) === -1) {
                        setTimeout(() => alert(`${sunk} sunk!`), 100);
                    }
                }
            }

            setLocalState({
                ...state,
                ownMarkers: state.ownMarkers.slice(0),
                opponentMarkers: state.opponentMarkers.slice(0),
                ownShips: state.ownShips.slice(0),
                isOwnTurn: state.isOwnTurn,
                sunkEnemies: state.sunkEnemies.slice(0),
            })
            let currentAction = CurrentAction.PlacingShips;
            if(state.gameWon || state.gameLost) {
                currentAction = CurrentAction.GameOver;
            }
            else if(state.ownShips?.length) {
                currentAction = CurrentAction.SelectingShot;
            }
            setCurrentAction(currentAction);
        }

        props.gameInterface.onStateChange(subscriber);

        return () => {
            props.gameInterface.offStateChange(subscriber);
        }
    }, [props.gameInterface, localState]);

    const onShipsPlaced = (ships: Ship[]) => {
        props.gameInterface.setShips(ships);
    }

    const isValidTarget = (target: Point) => {
        return !localState?.ownMarkers.some(marker => pointUtils.equal(target, marker));
    }

    const canSelect = localState?.isOwnTurn && currentAction === CurrentAction.SelectingShot;

    const onSelectTile = (tile: Point) => {
        if(canSelect && isValidTarget(tile)) {
            setTargetTile(tile);
        }
    }

    const checkMouseHighlight = (tile: Point) => {
        return (canSelect && isValidTarget(tile)) ? 'orange' : undefined;
    }

    const onFireClick = () => {
        if(targetTile && isValidTarget(targetTile)) {
            props.gameInterface.fireShot(targetTile);
            setTargetTile(undefined);
        }
    }

    const onMenuClick = () => {
        if(confirm('Are you sure you want to end the game?')) {
            props.onExit();
        }
    }

    const lastOpponentShot = localState?.opponentMarkers[localState?.opponentMarkers.length - 1];

    return <>
        <button onClick={onMenuClick}>Return to menu</button>
        { currentAction === CurrentAction.PlacingShips
            ? <ShipSelection
                gameSettings={props.gameSettings}
                onShipsPlaced={onShipsPlaced} />
            : <>
                { currentAction === CurrentAction.SelectingShot && <p className={classes.info}>It is { localState?.isOwnTurn ? 'Your' : 'Enemy\'s'} turn</p> }
                { currentAction === CurrentAction.GameOver && <p className={classes.info}>You have {localState?.gameWon ? 'Won' : 'Lost' }</p> }
                <Board
                    gridSize={props.gameSettings.gridSize}
                    ships={localState?.ownShips}
                    markers={localState?.opponentMarkers}
                    highlightTile={lastOpponentShot}
                    highlightTileStyle='orange' />
                <Board
                    gridSize={props.gameSettings.gridSize}
                    markers={localState?.ownMarkers}
                    onSelectTile={onSelectTile}
                    highlightTileStyle='red'
                    highlightTile={targetTile}
                    mouseHighlightStyle={checkMouseHighlight} />
                { currentAction === CurrentAction.SelectingShot && <button onClick={onFireClick} disabled={!targetTile || !localState?.isOwnTurn}>Fire</button> }
            </>
        }
    </>
}