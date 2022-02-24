import { useEffect, useState } from 'react';
import UiSettings from '../../config/UiSettings';
import GameManager from '../../game-state/GameManager';
import LocalState from '../../game-state/LocalState';
import Board from '../board/Board';

export interface GameProps {
    uiSettings: UiSettings
    gameManager: GameManager
}

export default function Game(props: GameProps) {
    const [localState, setLocalState] = useState<LocalState>(props.gameManager.getLocalState());

    useEffect(() => {
        const subscriber = (state: LocalState) => {
            setLocalState(state);
        }

        props.gameManager.onStateChange(subscriber);

        return () => {
            props.gameManager.offStateChange(subscriber);
        }
    }, [props.gameManager]);

    return <>
        <Board
            uiSettings={props.uiSettings}
            gridSize={props.gameManager.gameSettings.gridSize}
            ships={localState.ownShips}
            hits={localState.opponentHits}
            misses={localState.opponentMisses} />
        <Board
            uiSettings={props.uiSettings}
            gridSize={props.gameManager.gameSettings.gridSize}
            ships={[]}
            hits={localState.ownHits}
            misses={localState.ownMisses} />
    </>
}