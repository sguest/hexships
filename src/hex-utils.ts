// https://www.redblobgames.com/grids/hexagons/
const sqrt3 = Math.sqrt(3);

export function getCenter(x: number, y: number, size: number) {
    return {
        x: 1.5 * x * size,  // 0.75 * 2 * x * size
        y: (y + 0.5 * x) * size * sqrt3,
    }
}

export function getCorners(x: number, y: number, size: number) {
    const center = getCenter(x, y, size);
    return [...Array(6).keys()].map(i => {
        const angle = Math.PI / 3 * i;  // Math.PI / 180 * 60 * i === i * 60deg converted to radians
        return {
            x: center.x + size * Math.cos(angle),
            y: center.y + size * Math.sin(angle),
        }
    })
}

export function isInGrid(x: number, y: number, gridSize: number) {
    const z = -x - y;
    return x > -gridSize
        && x < gridSize
        && y > -gridSize
        && y < gridSize
        && z > -gridSize
        && z < gridSize;
}

export function getGridCells(gridSize: number) {
    const cells: Array<{x: number, y: number}> = [];

    for(let x = -gridSize + 1; x < gridSize; x++) {
        for(let y = -gridSize + 1; y < gridSize; y++) {
            if(isInGrid(x, y, gridSize)) {
                cells.push({x, y});
            }
        }
    }

    return cells;
}