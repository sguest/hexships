import { GameModeId } from './config/GameMode';
import GameSettings from './config/GameSettings';
import LocalState from './game-state/LocalState';
import Ship from './game-state/Ship';
import { Point } from './utils/point-utils';

export interface ClientToServerEvents {
    'quick-connect': (mode: GameModeId) => void;
    'cancel-quick-connect': () => void;
    'set-ships': (ships: Ship[]) => void;
    'fire-shot': (target: Point) => void;
    'leave-game': () => void;
}

export interface ServerToClientEvents {
    'join-game': (settings: GameSettings) => void;
    'update-state': (state: LocalState) => void;
}