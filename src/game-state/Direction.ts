enum Direction {
    positiveX,
    positiveY,
    positiveZ,
    negativeX,
    negativeY,
    negativeZ,
}

export default Direction

const deltas = {
    [Direction.positiveX]: { x: 1, y: 0 },
    [Direction.positiveY]: { x: 0, y: 1 },
    [Direction.positiveZ]: { x: -1, y: 1 },
    [Direction.negativeX]: { x: -1, y: 0 },
    [Direction.negativeY]: { x: 0, y: -1 },
    [Direction.negativeZ]: { x: 1, y: -1 },
}

export function getDelta(direction: Direction): { x: number, y: number } {
    return deltas[direction];
}

export function allDirections() {
    return [Direction.positiveX, Direction.positiveY, Direction.positiveZ, Direction.negativeX, Direction.negativeY, Direction.negativeZ];
}