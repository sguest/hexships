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

export function isPlacementValid(ships: Ship[], gridSize: number) {
    const points = ships.map(s => getPoints(s));
    for(let i = 0; i < ships.length; i++) {
        for(const point of points[i]) {
            if(!hexUtils.isInGrid(point, gridSize)) {
                return false;
            }
            for(let j = i + 1; j < ships.length; j++) {
                for(const point2 of points[j]) {
                    if(pointUtils.equal(point, point2)) {
                        return false;
                    }
                }
            }
        }
    }

    return true;
}