import AiPlayer from './AiPlayer';
import * as GameMode from '../config/GameMode';
import LocalState from '../game-state/LocalState';
import { MarkerType } from '../game-state/Marker';
import Ship from '../game-state/Ship';
import Direction, { getDelta } from '../game-state/Direction';
import * as pointUtils from '../utils/point-utils';

function getLocalState(): LocalState {
    return {
        ownShips: [],
        ownMarkers: [],
        ownMines: [],
        opponentShips: [],
        opponentMarkers: [],
        opponentMines: [],
        isOwnTurn: true,
        sunkEnemies: [],
        gameWon: false,
        gameLost: false,
        opponentShipsPlaced: true,
        opponentLeft: false,
    };
}

describe('updateGameState', () => {
    test('should add shots to tracked state', () => {
        const subject = new AiPlayer(GameMode.Basic.settings);
        const shots = [{ x: 2, y: 1, type: MarkerType.Miss }, { x: 3, y: -11, type: MarkerType.Miss }];
        subject.updateGameState({ ...getLocalState(), ownMarkers: shots });
        const aiState = subject.getState();
        for(const shot of shots) {
            expect(aiState.ownShots[shot.x][shot.y]).toEqual(shot.type);
        }
        expect(aiState.ownShotCount).toEqual(shots.length);
    });

    test('should add tracked and priority hits', () => {
        const subject = new AiPlayer(GameMode.Basic.settings);
        const shot = { x: 2, y: 1, type: MarkerType.Hit };
        subject.updateGameState({ ...getLocalState(), ownMarkers: [shot] });
        const aiState = subject.getState();
        expect(aiState.trackedHits).toContainEqual(shot);
        expect(aiState.priorityHits).toContainEqual(shot);
    });

    test('should record ship being sunk', () => {
        const subject = new AiPlayer(GameMode.Basic.settings);
        const ship: Ship = {
            x: 1,
            y: 1,
            size: 2,
            facing: Direction.positiveX,
            hits: 1,
            name: '',
            definitionId: 1,
        }
        const delta = getDelta(ship.facing);
        const shots = [{ x: ship.x, y: ship.y, type: MarkerType.Hit }];
        const localState = { ...getLocalState(), opponentShips: [ship], ownMarkers: shots };
        subject.updateGameState(localState);

        localState.ownMarkers.push({ ...pointUtils.add(shots[0], delta), type: MarkerType.Hit });
        ship.hits = 2;
        localState.sunkEnemies.push(ship.definitionId);
        subject.updateGameState(localState);

        const aiState = subject.getState();
        expect(aiState.sunkShips.length).toEqual(1);
    });

    test('should clear tracked and priority hits when ship sunk', () => {
        const subject = new AiPlayer(GameMode.Basic.settings);
        const ship: Ship = {
            x: 1,
            y: 1,
            size: 2,
            facing: Direction.positiveX,
            hits: 1,
            name: '',
            definitionId: 1,
        }
        const delta = getDelta(ship.facing);
        const shots = [{ x: ship.x, y: ship.y, type: MarkerType.Hit }];
        const localState = { ...getLocalState(), opponentShips: [ship], ownMarkers: shots };
        subject.updateGameState(localState);

        localState.ownMarkers.push({ ...pointUtils.add(shots[0], delta), type: MarkerType.Hit });
        ship.hits = 2;
        localState.sunkEnemies.push(ship.definitionId);
        subject.updateGameState(localState);

        const aiState = subject.getState();
        expect(aiState.priorityHits.length).toEqual(0);
        expect(aiState.trackedHits.length).toEqual(0);
    });
});