import { GameModeId } from './GameMode';

export default interface GameDefinition {
    name: string
    mode: GameModeId
}