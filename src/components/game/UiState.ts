import Ship from '../../game-state/Ship';
import { Point } from '../../utils/point-utils';

export enum CurrentAction {
    PlacingShips,
    SelectingShot,
}

export default interface UiState {
    currentAction: CurrentAction
    placedShips: Ship[]
    unplacedShips: Array<{size: number, name: string, id: number}>
    placingShip?: Ship
    placingShipId?: number
    highlightTile?: Point
}