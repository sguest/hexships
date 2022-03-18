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
import Dialog from '../Dialog';
import { MarkerType } from '../../game-state/Marker';

enum CurrentAction {
    PlacingShips,
    EnemyPlacingShips,
    SelectingShot,
    GameOver,
}

export interface GameProps {
    gameSettings: GameSettings
    gameInterface: GameInterface
    onExit: () => void
}

const useStyles = createUseStyles({
    wrapper: {
        display: 'grid',
        gridTemplateRows: '100%',
        gridTemplateColumns: '4fr 4fr 1fr',
        width: '100%',
        height: '100%',
        gridTemplateAreas: '"friend enemy panel"',
        '@media (max-width: 640px)': {
            gridTemplateColumns: '8fr 1fr',
            gridTemplateRows: '4fr 3fr',
            gridTemplateAreas: '"enemy enemy" "friend panel"',
        },
    },
    menuButton: {
        position: 'absolute',
        left: 10,
        top: 10,
        zIndex: 10,
        border: '2px solid white',
        background: '#333',
        color: '#ccc',
        fontSize: '1rem',
    },
    statusPanel: {
        position: 'relative',
        padding: {
            top: 10,
            left: 10,
            right: 10,
            bottom: 60,
        },
        boxSizing: 'border-box',
        minHeight: 90,
        width: '100%',
        maxWidth: 200,
        gridArea: 'panel',
        '@media (max-width: 640px)': {
            padding: 0,
        },
        display: 'grid',
        gridTemplateColumns: '100%',
        gridTemplateRows: 'repeat(7, 1fr)',
    },
    info: {
        fontFamily: ['Big Shoulders Stencil Text', 'sans-serif'],
        color: '#ccc',
        fontSize: '2rem',
        margin: 0,
        '@media (max-width: 640px)': {
            fontSize: '1rem',
        },
    },
    enemyShipHeader: {
        fontFamily: ['Big Shoulders Stencil Text', 'sans-serif'],
        color: '#ccc',
        fontSize: '1.6rem',
        margin: {
            top: 10,
            bottom: 0,
        },
        '@media (max-width: 640px)': {
            fontSize: '0.8rem',
        },
    },
    enemyShips: {
        display: 'grid',
        gridTemplateColumns: '100%',
        gridTemplateRows: 'repeat(6, 1fr)',
        '@media (max-width: 640px)': {
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: 'repeat(3, 1fr)',
        },
    },
    enemyShip: {
        border: '2px solid black',
        color: '#ccc',
        fontFamily: 'sans-serif',
        fontSize: '1.2rem',
        position: 'relative',
        padding: 4,
        margin: { top: 5 },
        '@media (max-width: 640px)': {
            fontSize: '0.6rem',
            padding: 2,
        },
    },
    enemyShipSunk: {
        border: '2px solid red',
        '&:after': {
            width: '100%',
            height: '100%',
            display: 'inline-block',
            position: 'absolute',
            top: 0,
            left: 0,
            content: '""',
            background: 'linear-gradient(10deg, transparent 47%, red 47%, red 53%, transparent 53%), linear-gradient(170deg, transparent 47%, red 47%, red 53%, transparent 53%)',
        },
    },
    fire: {
        border: '2px solid #ccc',
        cursor: 'pointer',
        color: 'white',
        fontSize: '1.5rem',
        textShadow: '1px 1px 0 black',
        background: 'radial-gradient(#ff8000, #ff0000)',
        textTransform: 'uppercase',
        '&:hover': {
            background: 'radial-gradient(#ffa447, #ff4747)',
        },
        '&:disabled': {
            color: '#aaa',
            background: '#777',
            cursor: 'default',
        },
    },
})

export default function Game(props: GameProps) {
    const [localState, setLocalState] = useState<LocalState | undefined>(undefined);
    const [currentAction, setCurrentAction] = useState(CurrentAction.PlacingShips);
    const [targetTile, setTargetTile] = useState<Point | undefined>(undefined);
    const [showDialog, setShowDialog] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        const subscriber = (state: LocalState) => {
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
                if(state.opponentShipsPlaced) {
                    currentAction = CurrentAction.SelectingShot;
                }
                else {
                    currentAction = CurrentAction.EnemyPlacingShips;
                }
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
        setShowDialog(true);
    }

    const onDialogOk = () => {
        props.gameInterface.leaveGame();
        props.onExit();
    }

    const onDialogCancel = () => {
        setShowDialog(false);
    }

    const lastOpponentShot = localState?.opponentMarkers[localState?.opponentMarkers.length - 1];

    let statusMessage: string | undefined;

    if(currentAction === CurrentAction.SelectingShot) {
        statusMessage = localState?.isOwnTurn ? 'Take your shot' : 'Enemy\'s turn';
    }
    else if(currentAction === CurrentAction.GameOver) {
        if(localState?.opponentLeft) {
            statusMessage = 'Your opponent left';
        }
        else {
            statusMessage = `You have ${localState?.gameWon ? 'Won' : 'Lost'}`;
        }
    }
    else if(currentAction === CurrentAction.EnemyPlacingShips) {
        statusMessage = 'Enemy placing ships';
    }

    let displayedTargets: Array<{x: number, y: number, style: string | CanvasGradient | CanvasPattern}> | undefined;
    if(localState?.gameWon) {
        displayedTargets = localState.ownMarkers.filter(m => m.type === MarkerType.Hit).map(m => ({ x: m.x, y: m.y, style: 'red' }));
    }
    else if(targetTile) {
        displayedTargets = [{ x: targetTile.x, y: targetTile.y, style: 'red' }];
    }

    let overlayStyle: string | undefined;
    if(localState?.gameWon) {
        overlayStyle = 'rgba(0, 255, 0, 0.3)';
    }
    else if(localState?.gameLost) {
        overlayStyle = 'rgba(255, 0, 0, 0.3)';
    }

    return <>
        {showDialog && <Dialog
            text="Are you sure you want to end the game?"
            onOk={onDialogOk}
            onCancel={onDialogCancel}
        />}
        <button className={classes.menuButton} onClick={onMenuClick}>Menu</button>
        { currentAction === CurrentAction.PlacingShips
            ? <ShipSelection
                gameSettings={props.gameSettings}
                onShipsPlaced={onShipsPlaced} />
            : <div className={classes.wrapper}>
                <Board
                    gridSize={props.gameSettings.gridSize}
                    ships={localState?.ownShips}
                    markers={localState?.opponentMarkers}
                    highlightTiles={lastOpponentShot ? [{ x: lastOpponentShot.x, y: lastOpponentShot.y, style: 'orange' }] : undefined}
                    gridArea="friend"
                    overlayStyle={overlayStyle} />
                <Board
                    gridSize={props.gameSettings.gridSize}
                    ships={localState?.opponentShips}
                    markers={localState?.ownMarkers}
                    onSelectTile={onSelectTile}
                    highlightTiles={displayedTargets}
                    mouseHighlightStyle={checkMouseHighlight}
                    gridArea="enemy"
                    overlayStyle={overlayStyle} />
                <div className={classes.statusPanel}>
                    {statusMessage && <p className={classes.info}>{statusMessage}</p>}
                    <p className={classes.enemyShipHeader}>Enemy Ships</p>
                    <div className={classes.enemyShips}>
                        {props.gameSettings.ships.map(ship => {
                            return <div className={`${classes.enemyShip} ${localState?.sunkEnemies.indexOf(ship.id) !== -1 ? classes.enemyShipSunk : ''}`} key={ship.id}>{ship.name} ({ship.size})</div>
                        })}
                        { currentAction === CurrentAction.SelectingShot &&
                            <button className={classes.fire} onClick={onFireClick} disabled={!targetTile || !localState?.isOwnTurn}>Fire</button> }
                    </div>
                </div>
            </div>
        }
    </>
}