import LocalState from '../game-state/LocalState';
import Ship from '../game-state/Ship';

export type StateSubscription = (state: LocalState) => void;

export default interface GameInterface {
    onStateChange: (subscriber: StateSubscription) => void
    offStateChange: (subscriber: StateSubscription) => void
    setShips: (ships: Ship[]) => void
}