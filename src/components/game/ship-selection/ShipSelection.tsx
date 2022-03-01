import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import GameSettings from '../../../config/GameSettings';
import Direction from '../../../game-state/Direction';
import Ship, * as shipFuncs from '../../../game-state/Ship';
import { Point } from '../../../utils/point-utils';
import Board from '../../board/Board';
import SelectorPanel from './SelectorPanel';

export interface ShipSelectionProps {
    gameSettings: GameSettings
    onShipsPlaced: (ships: Ship[]) => void
}

const useStyles = createUseStyles({
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
})

export default function ShipSelection(props: ShipSelectionProps) {
    const [placedShips, setPlacedShips] = useState<Ship[]>([]);
    const [unplacedShips, setUnplacedShips] = useState<Array<{size: number, name: string, id: number}>>([]);
    const [placingShip, setPlacingShip] = useState<Ship | undefined>(undefined);
    const [placingShipId, setPlacingShipId] = useState<number | undefined>(undefined);
    const [highlightTile, setHighlightTile] = useState<Point | undefined>(undefined);
    const classes = useStyles();

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
    const displayedTargets = highlightTile ? [{ x: highlightTile.x, y: highlightTile.y, style: highlightTileStyle }] : [];

    const onSelectShip = (id: number) => {
        setPlacingShipId(id === placingShipId ? undefined : id);
        setPlacingShip(undefined);
        setHighlightTile(undefined)
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
                        definitionId: shipInfo.id,
                    });
                }
            }
            setHighlightTile(tile);
        }
    }

    const checkMouseHighlight = () => {
        return placingShipId ? 'orange' : undefined;
    }

    return <div className={classes.wrapper}>
        <Board
            gridSize={props.gameSettings.gridSize}
            ships={displayedShips}
            onSelectTile={onSelectTile}
            highlightTiles={displayedTargets}
            mouseHighlightStyle={checkMouseHighlight} />
        <SelectorPanel
            ships={unplacedShips}
            selectedId={placingShipId}
            placementValid={isPlacementValid}
            canRotate={!!placingShip}
            onSelected={onSelectShip}
            onRotated={onRotateShip}
            onPlace={onPlaceShip} />
    </div>
}