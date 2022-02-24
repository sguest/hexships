export interface Point {
    x: number
    y: number
}

export function add(...points: Point[]) {
    const point = { x: 0, y: 0 };
    for(let p of points) {
        point.x += p.x;
        point.y += p.y;
    }
    return point;
}

export function multiplyScalar(point: Point, scalar: number) {
    return {
        x: point.x * scalar,
        y: point.y * scalar,
    }
}

export function equal(a: Point, b: Point) {
    return a.x === b.x && a.y === b.y;
}

export function moveTo(context: CanvasRenderingContext2D, point: Point) {
    context.moveTo(point.x, point.y);
}

export function lineTo(context: CanvasRenderingContext2D, point: Point) {
    context.lineTo(point.x, point.y);
}