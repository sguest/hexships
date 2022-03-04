import { useState } from 'react';
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
    const [placedShips, setPlacedShips] = useState<{ [key: number]: Ship }>([]);
    const [placingShip, setPlacingShip] = useState<{ id: number, ship: Ship | undefined } | undefined>(undefined);
    const [highlightTile, setHighlightTile] = useState<Point | undefined>(undefined);
    const classes = useStyles();

    const displayedShips = Object.values(placedShips);
    if(placingShip?.ship) {
        displayedShips.push(placingShip.ship);
    }
    const isShipValid = !!placingShip?.ship && shipFuncs.isShipValid(placingShip.ship, Object.values(placedShips), props.gameSettings.gridSize);
    const isPlacementValid = displayedShips.length === props.gameSettings.ships.length &&
        shipFuncs.isPlacementValid(displayedShips, props.gameSettings.gridSize);
    const highlightTileStyle = isShipValid ? 'green' : 'red';
    const displayedTargets = highlightTile ? [{ x: highlightTile.x, y: highlightTile.y, style: highlightTileStyle }] : [];

    const onSelectShip = (id: number) => {
        if(id !== placingShip?.id) {
            const placed = { ...placedShips };
            if(placingShip?.ship) {
                placed[placingShip.id] = placingShip.ship;
            }
            if(placedShips[id]) {
                setPlacingShip({ id, ship: placedShips[id] });
                setHighlightTile(placedShips[id]);
                delete placed[id];
            }
            else {
                setPlacingShip({ id, ship: undefined });
                setHighlightTile(undefined)
            }
            setPlacedShips(placed);
        }
    }

    const onRotateShip = () => {
        if(placingShip?.ship) {
            setPlacingShip({
                id: placingShip.id,
                ship: {
                    ...placingShip.ship,
                    facing: (placingShip.ship.facing + 1) % 6,
                },
            });
        }
    }

    const onPlaceShip = () => {
        if(isPlacementValid) {
            props.onShipsPlaced(displayedShips);
        }
    }

    const onSelectTile = (tile: Point) => {
        if(placingShip) {
            if(placingShip.ship) {
                setPlacingShip({
                    id: placingShip.id,
                    ship: {
                        ...placingShip.ship,
                        x: tile.x,
                        y: tile.y,
                    },
                });
            }
            else {
                const shipInfo = props.gameSettings.ships.find(s => s.id === placingShip.id)
                if(shipInfo) {
                    setPlacingShip({
                        id: placingShip.id,
                        ship: {
                            x: tile.x,
                            y: tile.y,
                            size: shipInfo.size,
                            facing: Direction.positiveX,
                            hits: 0,
                            name: shipInfo.name,
                            definitionId: shipInfo.id,
                        },
                    });
                }
            }
            setHighlightTile(tile);
        }
    }

    const checkMouseHighlight = () => {
        return placingShip?.id ? 'orange' : undefined;
    }

    return <div className={classes.wrapper}>
        <Board
            gridSize={props.gameSettings.gridSize}
            ships={displayedShips}
            onSelectTile={onSelectTile}
            highlightTiles={displayedTargets}
            mouseHighlightStyle={checkMouseHighlight} />
        <SelectorPanel
            ships={props.gameSettings.ships}
            placedIds={Object.keys(placedShips).map(Number)}
            selectedId={placingShip?.id}
            placementValid={isPlacementValid}
            canRotate={!!placingShip}
            onSelected={onSelectShip}
            onRotated={onRotateShip}
            onPlace={onPlaceShip} />
    </div>
}