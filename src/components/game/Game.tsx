import { useEffect, useState } from 'react';
import GameSettings from '../../config/GameSettings';
import UiSettings from '../../config/UiSettings';
import GameInterface from '../../game-interface/GameInterface';
import Direction from '../../game-state/Direction';
import LocalState from '../../game-state/LocalState';
import { Point } from '../../utils/point-utils';
import Board from '../board/Board';
import ShipSelector from './ShipSelector';
import UiState, { CurrentAction } from './UiState';
import Ship, * as shipFuncs from '../../game-state/Ship';

export interface GameProps {
    uiSettings: UiSettings
    gameSettings: GameSettings
    gameInterface: GameInterface
}

export default function Game(props: GameProps) {
    const [localState, setLocalState] = useState<LocalState | null>(null);
    const [uiState, setUiState] = useState<UiState>({
        currentAction: CurrentAction.PlacingShips,
        placedShips: [],
        unplacedShips: [
            { size: 2, name: 'Patrol Boat', id: 1 },
            { size: 3, name: 'Destroyer', id: 2 },
            { size: 3, name: 'Submarine', id: 3 },
            { size: 4, name: 'Battleship', id: 4 },
            { size: 5, name: 'Aircraft Carrier', id: 5 },
        ],
    })

    useEffect(() => {
        const subscriber = (state: LocalState) => {
            setLocalState(state);
            let currentAction = CurrentAction.PlacingShips;
            if(state.ownShips?.length) {
                currentAction = CurrentAction.SelectingShot;
            }
            setUiState({ ...uiState, currentAction });
        }

        props.gameInterface.onStateChange(subscriber);

        return () => {
            props.gameInterface.offStateChange(subscriber);
        }
    }, [props.gameInterface, uiState]);

    let ownShips = localState?.ownShips || [];
    let highlightTileStyle: string | undefined;
    if(uiState.currentAction === CurrentAction.PlacingShips) {
        ownShips = uiState.placedShips.slice(0);
        if(uiState.placingShip) {
            ownShips.push(uiState.placingShip);

            highlightTileStyle = shipFuncs.isPlacementValid(ownShips, props.gameSettings.gridSize) ? 'green' : 'red';
        }
    }

    const onSelectShip = (id: number) => {
        if(uiState.placingShipId !== id) {
            setUiState({
                ...uiState,
                placingShipId: id,
                placingShip: undefined,
                highlightTile: undefined,
            });
        }
    }

    const onRotateShip = () => {
        if(uiState.placingShip) {
            setUiState({
                ...uiState,
                placingShip: {
                    ...uiState.placingShip,
                    facing: (uiState.placingShip.facing + 1) % 6,
                },
            });
        }
    }

    const onPlaceShip = () => {
        if(uiState.placingShip && shipFuncs.isPlacementValid(ownShips, props.gameSettings.gridSize)) {
            const unplacedShips = uiState.unplacedShips.slice(0);
            unplacedShips.splice(unplacedShips.findIndex(s => s.id === uiState.placingShipId), 1);
            const placedShips = [...uiState.placedShips, uiState.placingShip];
            setUiState({
                ...uiState,
                placedShips,
                placingShip: undefined,
                placingShipId: undefined,
                highlightTile: undefined,
                unplacedShips,
            });
            if(!unplacedShips.length) {
                props.gameInterface.setShips(placedShips);
            }
        }
    }

    const onSelectTile = (tile: Point) => {
        if(uiState.currentAction === CurrentAction.PlacingShips && uiState.placingShipId) {
            let placingShip: Ship | undefined;
            if(uiState.placingShip) {
                placingShip = uiState.placingShip;
                placingShip.x = tile.x;
                placingShip.y = tile.y;
            }
            else {
                const shipInfo = uiState.unplacedShips.find(s => s.id === uiState.placingShipId)
                if(shipInfo) {
                    placingShip = {
                        x: tile.x,
                        y: tile.y,
                        size: shipInfo.size,
                        facing: Direction.positiveX,
                    }
                }
            }
            setUiState({
                ...uiState,
                placingShip,
                highlightTile: tile,
            })
        }
    }

    return <>
        <Board
            uiSettings={props.uiSettings}
            gridSize={props.gameSettings.gridSize}
            ships={ownShips}
            hits={localState?.opponentHits || []}
            misses={localState?.opponentMisses || []}
            onSelectTile={onSelectTile}
            highlightTile={uiState.highlightTile}
            highlightTileStyle={highlightTileStyle} />
        { uiState.currentAction === CurrentAction.PlacingShips &&
            <ShipSelector
                ships={uiState.unplacedShips}
                selectedId={uiState.placingShipId}
                onSelected={onSelectShip}
                onRotated={onRotateShip}
                onPlace={onPlaceShip} />
        }
        { uiState.currentAction !== CurrentAction.PlacingShips &&
            <Board
                uiSettings={props.uiSettings}
                gridSize={props.gameSettings.gridSize}
                ships={[]}
                hits={localState?.ownHits || []}
                misses={localState?.ownMisses || []} /> }
    </>
}