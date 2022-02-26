import { useState } from 'react';
import UiSettings from '../../../config/UiSettings';
import Direction from '../../../game-state/Direction';
import Ship, * as shipFuncs from '../../../game-state/Ship';
import { Point } from '../../../utils/point-utils';
import Board from '../../board/Board';
import SelectorPanel from './SelectorPanel';

export interface ShipSelectionProps {
    gridSize: number
    uiSettings: UiSettings
    onShipsPlaced: (ships: Ship[]) => void
}

export default function ShipSelection(props: ShipSelectionProps) {
    const [placedShips, setPlacedShips] = useState<Ship[]>([]);
    const [unplacedShips, setUnplacedShips] = useState([
        { size: 2, name: 'Patrol Boat', id: 1 },
        { size: 3, name: 'Destroyer', id: 2 },
        { size: 3, name: 'Submarine', id: 3 },
        { size: 4, name: 'Battleship', id: 4 },
        { size: 5, name: 'Aircraft Carrier', id: 5 },
    ]);
    const [placingShip, setPlacingShip] = useState<Ship | undefined>(undefined);
    const [placingShipId, setPlacingShipId] = useState<number | undefined>(undefined);
    const [highlightTile, setHighlightTile] = useState<Point | undefined>(undefined);

    const displayedShips = placedShips.slice(0);
    if(placingShip) {
        displayedShips.push(placingShip);
    }
    const isPlacementValid = !!placingShip && shipFuncs.isPlacementValid(displayedShips, props.gridSize);
    const highlightTileStyle = isPlacementValid ? 'green' : 'red';

    const onSelectShip = (id: number) => {
        if(placingShipId !== id) {
            setPlacingShipId(id);
            setPlacingShip(undefined);
            setHighlightTile(undefined)
        }
    }

    const onRotateShip = () => {
        if(placingShip) {
            setPlacingShip({
                ...placingShip,
                facing: (placingShip.facing + 1) % 6,
            });
        }
    }

    const onPlaceShip = () => {
        if(isPlacementValid) {
            const unplaced = unplacedShips.slice(0);
            unplaced.splice(unplacedShips.findIndex(s => s.id === placingShipId), 1);
            const placed = [...placedShips, placingShip];
            setUnplacedShips(unplaced);
            setPlacedShips(placed);
            setPlacingShip(undefined);
            setPlacingShipId(undefined);
            setHighlightTile(undefined);
            if(!unplaced.length) {
                props.onShipsPlaced(placed);
            }
        }
    }

    const onSelectTile = (tile: Point) => {
        if(placingShipId) {
            if(placingShip) {
                setPlacingShip({
                    ...placingShip,
                    x: tile.x,
                    y: tile.y,
                });
            }
            else {
                const shipInfo = unplacedShips.find(s => s.id === placingShipId)
                if(shipInfo) {
                    setPlacingShip({
                        x: tile.x,
                        y: tile.y,
                        size: shipInfo.size,
                        facing: Direction.positiveX,
                    });
                }
            }
            setHighlightTile(tile);
        }
    }

    return <>
        <Board
            uiSettings={props.uiSettings}
            gridSize={props.gridSize}
            ships={displayedShips}
            onSelectTile={onSelectTile}
            highlightTile={highlightTile}
            highlightTileStyle={highlightTileStyle} />
        <SelectorPanel
            ships={unplacedShips}
            selectedId={placingShipId}
            placementValid={isPlacementValid}
            canRotate={!!placingShip}
            onSelected={onSelectShip}
            onRotated={onRotateShip}
            onPlace={onPlaceShip} />
    </>
}