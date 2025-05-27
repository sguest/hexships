import GameSettings, { WeaponDefinition } from './GameSettings';
import Direction, { allDirections } from '../game-state/Direction';

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
    arsenal: false,
}

export enum GameModeId {
    Basic,
    Streak,
    Barrage,
    Salvo,
    Minefield,
    Arsenal,
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

const weaponLookup: {[key: number]: WeaponDefinition} = {
    2: {
        type: 'scatter',
        count: 2,
        name: 'Apache Missile',
        center: true,
        directions: [Direction.positiveY, Direction.negativeY],
    },
    4: {
        type: 'scatter',
        count: 1,
        name: 'Tomahawk Missile',
        center: true,
        directions: allDirections(),
    },
    5: {
        type: 'scatter',
        count: 2,
        name: 'Exocet Missile',
        center: true,
        directions: [Direction.positiveX, Direction.positiveZ, Direction.negativeY],
    },
}

export const Arsenal: NonCustomModeSettings = {
    title: 'Arsenal',
    id: GameModeId.Arsenal,
    description: 'Ships gain specialized limited-use missiles',
    settings: {
        ...defaultSettings,
        arsenal: true,
        ships: [...defaultSettings.ships.map(s => ({
            ...s,
            weapon: weaponLookup[s.id],
        }))],
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
    [GameModeId.Arsenal]: Arsenal,
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