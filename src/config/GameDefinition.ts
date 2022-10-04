import { GameModeId } from './GameMode';
import GameSettings from './GameSettings';

export default interface GameDefinition {
    name: string
    mode: GameModeId,
    settings: GameSettings,
}