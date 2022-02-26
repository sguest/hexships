import { useEffect, useState } from 'react';
import GameSettings from '../../config/GameSettings';
import UiSettings from '../../config/UiSettings';
import GameInterface from '../../game-interface/GameInterface';
import LocalState from '../../game-state/LocalState';
import Board from '../board/Board';
import Ship from '../../game-state/Ship';
import ShipSelection from './ship-selection/ShipSelection';
import { Point } from '../../utils/point-utils';
import * as pointUtils from '../../utils/point-utils';

enum CurrentAction {
    PlacingShips,
    SelectingShot,
}

export interface GameProps {
    uiSettings: UiSettings
    gameSettings: GameSettings
    gameInterface: GameInterface
}

export default function Game(props: GameProps) {
    const [localState, setLocalState] = useState<LocalState | undefined>(undefined);
    const [currentAction, setCurrentAction] = useState(CurrentAction.PlacingShips);
    const [targetTile, setTargetTile] = useState<Point | undefined>(undefined);

    useEffect(() => {
        const subscriber = (state: LocalState) => {
            setLocalState({
                ownHits: state.ownHits.slice(0),
                ownMisses: state.ownMisses.slice(0),
                opponentHits: state.opponentHits.slice(0),
                opponentMisses: state.opponentMisses.slice(0),
                ownShips: state.ownShips.slice(0),
            })
            let currentAction = CurrentAction.PlacingShips;
            if(state.ownShips?.length) {
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
        if(localState?.ownHits.some(hit => pointUtils.equal(target, hit))) {
            return false;
        }
        if(localState?.ownMisses.some(hit => pointUtils.equal(target, hit))) {
            return false;
        }
        return true;
    }

    const onSelectTile = (tile: Point) => {
        if(isValidTarget(tile)) {
            setTargetTile(tile);
        }
    }

    const onFireClick = () => {
        if(targetTile && isValidTarget(targetTile)) {
            props.gameInterface.fireShot(targetTile);
            setTargetTile(undefined);
        }
    }

    return <>
        { currentAction === CurrentAction.PlacingShips
            ? <ShipSelection
                uiSettings={props.uiSettings}
                gridSize={props.gameSettings.gridSize}
                onShipsPlaced={onShipsPlaced} />
            : <>
                <Board
                    uiSettings={props.uiSettings}
                    gridSize={props.gameSettings.gridSize}
                    ships={localState?.ownShips}
                    hits={localState?.opponentHits}
                    misses={localState?.opponentMisses} />
                <Board
                    uiSettings={props.uiSettings}
                    gridSize={props.gameSettings.gridSize}
                    hits={localState?.ownHits}
                    misses={localState?.ownMisses}
                    onSelectTile={onSelectTile}
                    highlightTileStyle='red'
                    highlightTile={targetTile} />
                <button onClick={onFireClick} disabled={!targetTile}>Fire</button>
            </>
        }
    </>
}