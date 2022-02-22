import Direction from "./Direction";

export default interface Ship {
    x: number
    y: number
    size: number
    facing: Direction
}