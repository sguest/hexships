import { allDirections, getDelta } from '../game-state/Direction';
import { Point } from './point-utils';
import * as pointUtils from './point-utils';

// https://www.redblobgames.com/grids/hexagons/
const sqrt3 = Math.sqrt(3);

export function getCellSize(gridSize: number) {
    return 140 / gridSize;
}

export function getCenter(cell: Point, gridSize: number) {
    return {
        x: 1.5 * cell.x * getCellSize(gridSize), // 0.75 * 2 * x * size
        y: (cell.y + 0.5 * cell.x) * getCellSize(gridSize) * sqrt3,
    }
}

export function getCorners(cell: Point, gridSize: number) {
    const center = getCenter(cell, gridSize);
    return [...Array(6).keys()].map(i => {
        const angle = Math.PI / 3 * i; // Math.PI / 180 * 60 * i === i * 60deg converted to radians
        return {
            x: center.x + getCellSize(gridSize) * Math.cos(angle),
            y: center.y + getCellSize(gridSize) * Math.sin(angle),
        }
    })
}

export function getGridDimensions(gridSize: number) {
    return {
        x: gridSize * 3 * getCellSize(gridSize),
        y: gridSize * 2 * getCellSize(gridSize) * sqrt3,
    };
}

export function roundFractional(coords: Point) {
    const zCoord = -coords.x - coords.y;
    let x = Math.round(coords.x);
    let y = Math.round(coords.y);
    const z = Math.round(zCoord);

    const xDiff = Math.abs(x - coords.x);
    const yDiff = Math.abs(y - coords.y);
    const zDiff = Math.abs(z - zCoord);

    if(xDiff > yDiff && xDiff > zDiff) {
        x = -y - z;
    }
    else if(yDiff > zDiff) {
        y = -x - z;
    }

    return { x, y };
}

export function getCellFromCoords(hit: Point, gridSize: number) {
    return roundFractional({
        x: hit.x * 2 / 3 / getCellSize(gridSize),
        y: (hit.x * -1 / 3 + hit.y * sqrt3 / 3) / getCellSize(gridSize),
    });
}

export function isInGrid(cell: Point, gridSize: number) {
    const z = -cell.x - cell.y;
    return cell.x > -gridSize &&
        cell.x < gridSize &&
        cell.y > -gridSize &&
        cell.y < gridSize &&
        z > -gridSize &&
        z < gridSize;
}

export function getGridCells(gridSize: number) {
    const cells: Array<{x: number, y: number}> = [];

    for(let x = -gridSize + 1; x < gridSize; x++) {
        for(let y = -gridSize + 1; y < gridSize; y++) {
            if(isInGrid({ x, y }, gridSize)) {
                cells.push({ x, y });
            }
        }
    }

    return cells;
}

export function getNeighbours(cell: Point, gridSize: number) {
    return allDirections().map(d => {
        const delta = getDelta(d);
        return pointUtils.add(cell, delta);
    }).filter(c => isInGrid(c, gridSize));
}