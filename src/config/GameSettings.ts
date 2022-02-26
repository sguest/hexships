export default interface GameSettings {
    gridSize: number
    ships: Array<{
        size: number,
        name: string,
    }>
}