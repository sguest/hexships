import GameSettings from './GameSettings';

const defaultSettings: GameSettings = {
    ships: [
        { id: 1, size: 2, name: 'Patrol Boat' },
        { id: 2, size: 3, name: 'Destroyer' },
        { id: 3, size: 3, name: 'Submarine' },
        { id: 4, size: 4, name: 'Battleship' },
        { id: 5, size: 5, name: 'Aircraft Carrier' },
    ],
    gridSize: 7,
    streak: false,
}

export enum GameModeId {
    Basic,
    Streak,
}

export const Basic: ModeSettings = {
    title: 'Basic',
    id: GameModeId.Basic,
    description: 'Basic rules with no modifications',
    settings: defaultSettings,
}

export const Streak: ModeSettings = {
    title: 'Streak',
    id: GameModeId.Streak,
    description: 'Fire again after landing a hit',
    settings: {
        ...defaultSettings,
        streak: true,
    },
}

const gameModes: {[key in GameModeId]: ModeSettings } = {
    [GameModeId.Basic]: Basic,
    [GameModeId.Streak]: Streak,
}

export function getGameMode(id: GameModeId) {
    return gameModes[id];
}

export function listGameModes() {
    return Object.values(gameModes);
}

export interface ModeSettings {
    title: string
    id: GameModeId
    description: string
    settings: GameSettings
}