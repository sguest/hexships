import GameSettings from '../config/GameSettings';
import LocalState from './LocalState';
import Ship from './Ship';

export function getSunkShips(ships: Ship[]) {
    return ships.filter(s => s.hits === s.size);
}

export function getNumShots(settings: GameSettings, state: LocalState) {
    if(settings.shotPerShip) {
        return state.ownShips.length - getSunkShips(state.ownShips).length;
    }
    else {
        return settings.shots;
    }
}