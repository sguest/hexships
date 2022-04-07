import { useState } from 'react';
import { createUseStyles } from 'react-jss';
import GameSettings from '../../../config/GameSettings';
import Direction from '../../../game-state/Direction';
import { FleetPlacement } from '../../../game-state/GameManager';
import Ship, * as shipFuncs from '../../../game-state/Ship';
import { Point } from '../../../utils/point-utils';
import * as pointUtils from '../../../utils/point-utils';
import Board from '../../board/Board';
import SelectorPanel from './SelectorPanel';

export interface ShipSelectionProps {
    gameSettings: GameSettings
    onFleetPlaced: (fleet: FleetPlacement) => void
}

const useStyles = createUseStyles({
    wrapper: {
        display: 'grid',
        gridTemplateColumns: '5fr 1fr',
        gridTemplateRows: '100%',
        width: '100%',
        height: '100%',
        columnGap: '10px',
        '@media (max-width: 640px)': {
            gridTemplateColumns: '100%',
            gridTemplateRows: '5fr 1fr',
            rowGap: '10px',
        },
    },
})

enum PlacingMode {
    Ships,
    Mines,
}

export default function ShipSelection(props: ShipSelectionProps) {
    const [placedShips, setPlacedShips] = useState<{ [key: number]: Ship }>([]);
    const [placedMines, setPlacedMines] = useState<Point[]>([]);
    const [placingShip, setPlacingShip] = useState<{ id: number, ship: Ship | undefined } | undefined>(undefined);
    const [highlightTile, setHighlightTile] = useState<Point | undefined>(undefined);
    const [currentMode, setCurrentMode] = useState(PlacingMode.Ships);
    const classes = useStyles();

    const displayedShips = Object.values(placedShips);
    if(placingShip?.ship) {
        displayedShips.push(placingShip.ship);
    }
    const isShipValid = !!placingShip?.ship && shipFuncs.isShipValid(placingShip.ship, Object.values(placedShips), props.gameSettings.gridSize);
    const isPlacementValid = currentMode === PlacingMode.Ships
        ? displayedShips.length === props.gameSettings.ships.length && shipFuncs.isPlacementValid(displayedShips, props.gameSettings.gridSize)
        : placedMines.length === props.gameSettings.mines;
    const highlightTileStyle = isShipValid ? 'green' : 'red';
    const displayedTargets = highlightTile ? [{ x: highlightTile.x, y: highlightTile.y, style: highlightTileStyle }] : [];
    const minesRemaining = currentMode === PlacingMode.Mines ? props.gameSettings.mines - placedMines.length : undefined;

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

    const onConfirm = () => {
        if(isPlacementValid) {
            if(currentMode === PlacingMode.Mines || props.gameSettings.mines === 0) {
                props.onFleetPlaced({
                    ships: displayedShips,
                    mines: placedMines,
                });
            }
            else {
                setCurrentMode(PlacingMode.Mines);
                setHighlightTile(undefined);
            }
        }
    }

    const selectTileShip = (tile: Point) => {
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

    const selectTileMine = (tile: Point) => {
        const shipPoints = displayedShips.map(shipFuncs.getPoints).flat();
        if(!shipPoints.some(p => pointUtils.equal(p, tile))) {
            const index = placedMines.findIndex(m => pointUtils.equal(m, tile));
            if(index === -1) {
                if(placedMines.length < props.gameSettings.mines) {
                    setPlacedMines([...placedMines, tile]);
                }
            }
            else {
                const mines = [...placedMines];
                mines.splice(index, 1);
                setPlacedMines(mines);
            }
        }
    }

    const onSelectTile = (tile: Point) => {
        if(currentMode === PlacingMode.Ships) {
            selectTileShip(tile);
        }
        else if(currentMode === PlacingMode.Mines) {
            selectTileMine(tile);
        }
    }

    const checkMouseHighlight = () => {
        return placingShip?.id || currentMode === PlacingMode.Mines ? 'orange' : undefined;
    }

    return <div className={classes.wrapper}>
        <Board
            gridSize={props.gameSettings.gridSize}
            ships={displayedShips}
            mines={placedMines}
            onSelectTile={onSelectTile}
            highlightTiles={displayedTargets}
            mouseHighlightStyle={checkMouseHighlight} />
        <SelectorPanel
            ships={props.gameSettings.ships}
            mines={minesRemaining}
            placedIds={Object.keys(placedShips).map(Number)}
            selectedId={placingShip?.id}
            placementValid={isPlacementValid}
            canRotate={!!placingShip}
            onSelected={onSelectShip}
            onRotated={onRotateShip}
            onConfirm={onConfirm} />
    </div>
}