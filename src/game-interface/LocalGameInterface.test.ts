import Direction from '../game-state/Direction';
import LocalState from '../game-state/LocalState';
import LocalGameInterface, { loadFromStorage } from './LocalGameInterface';
import * as GameMode from '../config/GameMode';
import { encodeLocalStorage } from '../utils/storage-utils';
import { AiState } from './AiPlayer';
import { GameState } from '../game-state/GameManager';

const storageKeyLocalState = 'localgamestate';
const storageKeyLocalSettings = 'localgamesettings';
const storageKeyLocalAi = 'localaisettings';

function getValidFleet() {
    return {
        ships: [
            { definitionId: 1, x: -4, y: 1, facing: Direction.negativeZ },
            { definitionId: 2, x: 1, y: 0, facing: Direction.positiveZ },
            { definitionId: 3, x: 3, y: -5, facing: Direction.positiveZ },
            { definitionId: 4, x: 4, y: -3, facing: Direction.positiveY },
            { definitionId: 5, x: -4, y: 5, facing: Direction.positiveX },
        ],
        mines: [],
    };
}

jest.useFakeTimers();

test('setFleet calls subscribers', () => {
    const subject = new LocalGameInterface(GameMode.Basic.settings);
    const states: LocalState[] = [];
    subject.onStateChange(state => states.push(state));
    subject.setFleet(getValidFleet());
    const testShip = states[0].ownShips[0];
    expect(testShip.size).toBe(GameMode.Basic.settings.ships[0].size);
});

test('fireShots calls subscribers', () => {
    const subject = new LocalGameInterface(GameMode.Basic.settings);
    const states: LocalState[] = [];
    subject.setFleet(getValidFleet());
    subject.onStateChange(state => states.push(state));
    subject.fireShots([{ x: 1, y: 1 }]);
    const marker = states[0].ownMarkers[0];
    expect(marker.x).toBe(1);
    expect(marker.y).toBe(1);
});

test('offStateChange removes subscribers', () => {
    const subject = new LocalGameInterface(GameMode.Basic.settings);
    const states: LocalState[] = [];
    const subscriber = (state: LocalState) => states.push(state);
    subject.setFleet(getValidFleet());
    subject.onStateChange(subscriber);
    subject.offStateChange(subscriber);
    subject.fireShots([{ x: 1, y: 1 }]);
    expect(states.length).toBe(0);
});

test('leaveGame clears storage', () => {
    const subject = new LocalGameInterface(GameMode.Basic.settings);
    localStorage.setItem(storageKeyLocalAi, 'test');
    localStorage.setItem(storageKeyLocalSettings, 'test');
    localStorage.setItem(storageKeyLocalState, 'test');
    subject.leaveGame();
    expect(localStorage.getItem(storageKeyLocalAi)).toBeNull();
    expect(localStorage.getItem(storageKeyLocalSettings)).toBeNull();
    expect(localStorage.getItem(storageKeyLocalState)).toBeNull();
});

test('after state loaded, send on first subscription', () => {
    const subject = new LocalGameInterface(GameMode.Basic.settings);
    const aiState: AiState = {
        ownShots: {},
        ownShotCount: 0,
        priorityHits: [],
        trackedHits: [],
        sunkShips: [],
    };
    const state: GameState = {
        players: [{
            ships: [],
            mines: [],
            markers: [],
            active: true,
        },
        {
            ships: [],
            mines: [],
            markers: [],
            active: true,
        }],
        activePlayerId: 0,
    };
    subject.loadState(state, aiState);
    const subscriber = jest.fn();
    subject.onStateChange(subscriber);
    expect(subscriber).toBeCalled();
});

describe('loadFromStorage', () => {
    test('with empty storage, returns undefined', () => {
        localStorage.removeItem(storageKeyLocalAi);
        localStorage.removeItem(storageKeyLocalSettings);
        localStorage.removeItem(storageKeyLocalState);
        expect(loadFromStorage()).not.toBeDefined();
    });

    test('with invalid storage, returns undefined', () => {
        localStorage.setItem(storageKeyLocalAi, 'test');
        localStorage.setItem(storageKeyLocalSettings, 'test');
        localStorage.setItem(storageKeyLocalState, 'test');
        expect(loadFromStorage()).not.toBeDefined();
    });

    test('with object in storage, returns interface', () => {
        const aiState: AiState = {
            ownShots: {},
            ownShotCount: 0,
            priorityHits: [],
            trackedHits: [],
            sunkShips: [],
        };
        const state: GameState = {
            players: [{
                ships: [],
                mines: [],
                markers: [],
                active: true,
            },
            {
                ships: [],
                mines: [],
                markers: [],
                active: true,
            }],
            activePlayerId: 0,
        };
        encodeLocalStorage(storageKeyLocalAi, aiState);
        encodeLocalStorage(storageKeyLocalSettings, GameMode.Basic.settings);
        encodeLocalStorage(storageKeyLocalState, state);
        expect(loadFromStorage()).toBeDefined();
    })
})