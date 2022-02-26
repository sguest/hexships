import { useEffect, useState } from 'react';
import GameSettings from '../../../config/GameSettings';
import UiSettings from '../../../config/UiSettings';
import Direction from '../../../game-state/Direction';
import Ship, * as shipFuncs from '../../../game-state/Ship';
import { Point } from '../../../utils/point-utils';
import Board from '../../board/Board';
import SelectorPanel from './SelectorPanel';

export interface ShipSelectionProps {
    gameSettings: GameSettings
    uiSettings: UiSettings
    onShipsPlaced: (ships: Ship[]) => void
}

export default function ShipSelection(props: ShipSelectionProps) {
    const [placedShips, setPlacedShips] = useState<Ship[]>([]);
    const [unplacedShips, setUnplacedShips] = useState<Array<{size: number, name: string, id: number}>>([]);
    const [placingShip, setPlacingShip] = useState<Ship | undefined>(undefined);
    const [placingShipId, setPlacingShipId] = useState<number | undefined>(undefined);
    const [highlightTile, setHighlightTile] = useState<Point | undefined>(undefined);

    useEffect(() => {
        setUnplacedShips(props.gameSettings.ships.map((ship, idx) => ({
            size: ship.size,
            name: ship.name,
            id: idx + 1,
        })));
    }, [props.gameSettings.ships])

    const displayedShips = placedShips.slice(0);
    if(placingShip) {
        displayedShips.push(placingShip);
    }
    const isPlacementValid = !!placingShip && shipFuncs.isPlacementValid(displayedShips, props.gameSettings.gridSize);
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
                        hits: 0,
                        name: shipInfo.name,
                    });
                }
            }
            setHighlightTile(tile);
        }
    }

    return <>
        <Board
            uiSettings={props.uiSettings}
            gridSize={props.gameSettings.gridSize}
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