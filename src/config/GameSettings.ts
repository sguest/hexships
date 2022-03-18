export interface ShipDefinition {
    id: number
    size: number
    name: string
}

export default interface GameSettings {
    gridSize: number
    ships: ShipDefinition[]
}