import Direction from '../game-state/Direction';

interface BaseWeaponDefinition {
    count: number;
    name: string;
}

export interface ScatterWeaponDefinition extends BaseWeaponDefinition {
    type: 'scatter';
    center: boolean;
    directions: Direction[];
}

export interface TorpedoWeaponDefinition extends BaseWeaponDefinition {
    type: 'torpedo';
}

export type WeaponDefinition = ScatterWeaponDefinition | TorpedoWeaponDefinition;

export interface ShipDefinition {
    id: number
    size: number
    name: string
    weapon?: WeaponDefinition;
}

export default interface GameSettings {
    gridSize: number
    ships: ShipDefinition[]
    streak: boolean
    shots: number
    shotPerShip: boolean
    mines: number
    arsenal: boolean
}

export function validateSettings(settings: GameSettings) {
    if(!settings.shotPerShip && settings.shots < 1) {
        return false;
    }

    if(settings.mines < 0) {
        return false;
    }

    if(!settings.ships?.length) {
        return false;
    }

    for(const ship of settings.ships) {
        if(!ship.name?.trim()) {
            return false;
        }
        if(ship.size < 1) {
            return false;
        }
        if(ship.weapon && !settings.arsenal) {
            return false;
        }
    }

    return true;
}