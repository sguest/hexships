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
            if(state.sunkEnemies.length !== localState?.sunkEnemies.length) {
                for(const sunk of state.sunkEnemies) {
                    if(localState?.sunkEnemies.indexOf(sunk) === -1) {
                        alert(`${sunk} sunk!`);
                    }
                }
            }

            setLocalState({
                ownMarkers: state.ownMarkers.slice(0),
                opponentMarkers: state.opponentMarkers.slice(0),
                ownShips: state.ownShips.slice(0),
                isOwnTurn: state.isOwnTurn,
                sunkEnemies: state.sunkEnemies.slice(0),
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
        return !localState?.ownMarkers.some(marker => pointUtils.equal(target, marker));
    }

    const onSelectTile = (tile: Point) => {
        if(localState?.isOwnTurn && isValidTarget(tile)) {
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
                gameSettings={props.gameSettings}
                onShipsPlaced={onShipsPlaced} />
            : <>
                <p>It is {localState?.isOwnTurn ? 'Your' : 'Enemy\'s'} turn</p>
                <Board
                    uiSettings={props.uiSettings}
                    gridSize={props.gameSettings.gridSize}
                    ships={localState?.ownShips}
                    markers={localState?.opponentMarkers} />
                <Board
                    uiSettings={props.uiSettings}
                    gridSize={props.gameSettings.gridSize}
                    markers={localState?.ownMarkers}
                    onSelectTile={onSelectTile}
                    highlightTileStyle='red'
                    highlightTile={targetTile} />
                <button onClick={onFireClick} disabled={!targetTile || !localState?.isOwnTurn}>Fire</button>
            </>
        }
    </>
}