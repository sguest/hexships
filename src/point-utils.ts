export interface Point {
    x: number
    y: number
}

export function add(a: Point, b: Point) {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    }
}

export function multiplyScalar(point: Point, scalar: number) {
    return {
        x: point.x * scalar,
        y: point.y * scalar,
    }
}

export function moveTo(context: CanvasRenderingContext2D, point: Point) {
    context.moveTo(point.x, point.y);
}

export function lineTo(context: CanvasRenderingContext2D, point: Point) {
    context.lineTo(point.x, point.y);
}