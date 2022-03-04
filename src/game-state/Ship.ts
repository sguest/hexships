import Direction from './Direction';
import * as direction from './Direction';
import * as pointUtils from '../utils/point-utils';
import * as hexUtils from '../utils/hex-utils';

export default interface Ship {
    x: number
    y: number
    size: number
    facing: Direction
    hits: number
    name: string
    definitionId: number
}

export function getPoints(ship: Ship) {
    const delta = direction.getDelta(ship.facing);
    let point = { x: ship.x, y: ship.y };
    const points = [{ x: ship.x, y: ship.y }];
    for(let i = 1; i < ship.size; i++) {
        point = pointUtils.add(point, delta);
        points.push(point);
    }
    return points;
}

export function isShipValid(ship: Ship, otherShips: Ship[], gridSize: number) {
    const shipPoints = getPoints(ship);
    const otherPoints = otherShips.map(s => getPoints(s)).flat();
    for(const point of shipPoints) {
        if(!hexUtils.isInGrid(point, gridSize)) {
            return false;
        }
        for(const otherPoint of otherPoints) {
            if(pointUtils.equal(point, otherPoint)) {
                return false;
            }
        }
    }

    return true;
}

export function isPlacementValid(ships: Ship[], gridSize: number) {
    for(let i = 0; i < ships.length; i++) {
        if(!isShipValid(ships[i], ships.slice(i + 1), gridSize)) {
            return false;
        }
    }

    return true;
}