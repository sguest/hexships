import GameSettings from '../config/GameSettings';
import { FleetPlacement } from '../game-state/GameManager';
import LocalState from '../game-state/LocalState';
import { Point } from '../utils/point-utils';

export type StateSubscription = (state: LocalState, initialLoad: boolean) => void;

export interface StandardTurnAction
{
    type: 'standard',
    targets: Point[],
}

export interface WeaponTurnAction
{
    type: 'weapon'
}

export type TurnAction = StandardTurnAction;

export default interface GameInterface {
    onStateChange: (subscriber: StateSubscription) => void
    offStateChange: (subscriber: StateSubscription) => void
    setFleet: (fleet: FleetPlacement) => void
    takeTurn: (action: TurnAction) => void
    leaveGame: () => void
    getSettings: () => GameSettings
}