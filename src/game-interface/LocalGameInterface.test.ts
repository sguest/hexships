import Direction from '../game-state/Direction';
import LocalState from '../game-state/LocalState';
import LocalGameInterface from './LocalGameInterface';
import * as GameMode from '../config/GameMode';

function getValidShips() {
    return [
        { definitionId: 1, x: -4, y: 1, facing: Direction.negativeZ },
        { definitionId: 2, x: 1, y: 0, facing: Direction.positiveZ },
        { definitionId: 3, x: 3, y: -5, facing: Direction.positiveZ },
        { definitionId: 4, x: 4, y: -3, facing: Direction.positiveY },
        { definitionId: 5, x: -4, y: 5, facing: Direction.positiveX },
    ];
}

jest.useFakeTimers();

test('setShips calls subscribers', () => {
    const subject = new LocalGameInterface(GameMode.Basic.settings);
    const states: LocalState[] = [];
    subject.onStateChange(state => states.push(state));
    subject.setShips(getValidShips());
    const testShip = states[0].ownShips[0];
    expect(testShip.size).toBe(GameMode.Basic.settings.ships[0].size);
});

test('fireShots calls subscribers', () => {
    const subject = new LocalGameInterface(GameMode.Basic.settings);
    const states: LocalState[] = [];
    subject.setShips(getValidShips());
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
    subject.setShips(getValidShips());
    subject.onStateChange(subscriber);
    subject.offStateChange(subscriber);
    subject.fireShots([{ x: 1, y: 1 }]);
    expect(states.length).toBe(0);
});