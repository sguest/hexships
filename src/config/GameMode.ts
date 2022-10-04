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
    shots: 1,
    shotPerShip: false,
    mines: 0,
}

export enum GameModeId {
    Basic,
    Streak,
    Barrage,
    Salvo,
    Minefield,
    Custom,
}

export const Basic: NonCustomModeSettings = {
    title: 'Basic',
    id: GameModeId.Basic,
    description: 'Basic rules with no modifications',
    settings: defaultSettings,
}

export const Streak: NonCustomModeSettings = {
    title: 'Streak',
    id: GameModeId.Streak,
    description: 'Fire again after landing a hit',
    settings: {
        ...defaultSettings,
        streak: true,
    },
}

export const Barrage: NonCustomModeSettings = {
    title: 'Barrage',
    id: GameModeId.Barrage,
    description: 'Fire 4 shots each turn',
    settings: {
        ...defaultSettings,
        shots: 4,
    },
}

export const Salvo: NonCustomModeSettings = {
    title: 'Salvo',
    id: GameModeId.Salvo,
    description: 'Fire 1 shot for each surviving ship',
    settings: {
        ...defaultSettings,
        shotPerShip: true,
    },
}

export const Minefield: NonCustomModeSettings = {
    title: 'Minefield',
    id: GameModeId.Minefield,
    description: 'Place 5 mines that explode when hit by the enemy, damaging enemy ships',
    settings: {
        ...defaultSettings,
        mines: 5,
    },
}

export const Custom: ModeSettings = {
    title: 'Custom',
    id: GameModeId.Custom,
    description: 'Custom settings',
}

const gameModes: {[key in GameModeId]: ModeSettings } = {
    [GameModeId.Basic]: Basic,
    [GameModeId.Streak]: Streak,
    [GameModeId.Barrage]: Barrage,
    [GameModeId.Salvo]: Salvo,
    [GameModeId.Minefield]: Minefield,
    [GameModeId.Custom]: Custom,
}

export function getGameMode(id: GameModeId) {
    return gameModes[id];
}

export function listGameModes() {
    return Object.values(gameModes).filter(m => !!m.settings);
}

export interface ModeSettings {
    title: string
    id: GameModeId
    description: string
    settings?: GameSettings
}

interface NonCustomModeSettings extends ModeSettings {
    settings: GameSettings
}