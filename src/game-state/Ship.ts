import Direction from './Direction';
import * as direction from './Direction';
import * as pointUtils from '../utils/point-utils';

export default interface Ship {
    x: number
    y: number
    size: number
    facing: Direction
}

export function getPoints(ship: Ship) {
    const delta = direction.getDelta(ship.facing);
    let point = {x: ship.x, y: ship.y};
    const points = [{x: ship.x, y: ship.y}];
    for(let i = 1; i < ship.size; i++) {
        point = pointUtils.add(point, delta);
        points.push(point);
    }
    return points;
}