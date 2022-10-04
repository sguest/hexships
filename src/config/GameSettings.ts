export interface ShipDefinition {
    id: number
    size: number
    name: string
}

export default interface GameSettings {
    gridSize: number
    ships: ShipDefinition[]
    streak: boolean
    shots: number
    shotPerShip: boolean
    mines: number
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
    }

    return true;
}