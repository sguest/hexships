import GameSettings from '../config/GameSettings';
import { FleetPlacement } from '../game-state/GameManager';
import LocalState from '../game-state/LocalState';
import { Point } from '../utils/point-utils';

export type StateSubscription = (state: LocalState) => void;

export default interface GameInterface {
    onStateChange: (subscriber: StateSubscription) => void
    offStateChange: (subscriber: StateSubscription) => void
    setFleet: (fleet: FleetPlacement) => void
    fireShots: (targets: Point[]) => void
    leaveGame: () => void
    getSettings: () => GameSettings
}