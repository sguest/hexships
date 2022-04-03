import { GameModeId } from './config/GameMode';
import GameSettings from './config/GameSettings';
import { ShipPlacement } from './game-state/GameManager';
import LocalState from './game-state/LocalState';
import { Point } from './utils/point-utils';

export interface ClientToServerEvents {
    'quick-connect': (mode: GameModeId) => void;
    'cancel-quick-connect': () => void;
    'set-ships': (ships: ShipPlacement[]) => void;
    'fire-shots': (targets: Point[]) => void;
    'leave-game': () => void;
}

export interface ServerToClientEvents {
    'join-game': (settings: GameSettings) => void;
    'update-state': (state: LocalState) => void;
}