import { GameModeId } from './config/GameMode';
import GameSettings from './config/GameSettings';
import { FleetPlacement } from './game-state/GameManager';
import LocalState from './game-state/LocalState';
import { Point } from './utils/point-utils';
import LobbyGame from './server/LobbyGame';

export interface ClientToServerEvents {
    'quick-connect': (mode: GameModeId) => void;
    'cancel-quick-connect': () => void;
    'set-fleet': (fleet: FleetPlacement) => void;
    'fire-shots': (targets: Point[]) => void;
    'request-state': () => void;
    'leave-game': () => void;
    'add-standard-lobby-game': (name: string, mode: GameModeId) => void;
    'add-custom-lobby-game': (name: string, settings: GameSettings) => void;
    'remove-lobby-game': () => void;
    'enter-lobby': (callback: (games: LobbyGame[]) => void) => void;
    'leave-lobby': () => void;
    'join-lobby-game': (id: string) => void;
    'rejoin-game': (connectionId: string, callback: (success: boolean) => void) => void;
}

export interface ServerToClientEvents {
    'join-game': (settings: GameSettings, connectionId: string) => void;
    'update-state': (state: LocalState) => void;
    'add-lobby-game': (game: LobbyGame) => void;
    'remove-lobby-game': (id: string) => void;
    'remove-active-game': () => void;
}