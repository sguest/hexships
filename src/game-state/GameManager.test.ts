import Direction from './Direction';
import GameManager, { FleetPlacement } from './GameManager'
import * as GameMode from '../config/GameMode';
import { MarkerType } from './Marker';
import GameSettings from '../config/GameSettings';
import LocalState from './LocalState';
import { Point } from '../utils/point-utils';
import * as shipFuncs from '../game-state/Ship';
import * as hexUtils from '../utils/hex-utils';

function getBasicFleet(): FleetPlacement {
    return {
        ships: [
            { definitionId: 1, x: -4, y: 1, facing: Direction.negativeZ },
            { definitionId: 2, x: 1, y: 0, facing: Direction.positiveZ },
            { definitionId: 3, x: 3, y: -5, facing: Direction.positiveZ },
            { definitionId: 4, x: 4, y: -3, facing: Direction.positiveY },
            { definitionId: 5, x: -4, y: 5, facing: Direction.positiveX },
        ],
        mines: [],
    }
}

function getValidMines() {
    return [{ x: 4, y: 2 }, { x: 2, y: -3 }, { x: -3, y: -2 }, { x: 0, y: 3 }, { x: 2, y: 3 }];
}

describe('setFleet', () => {
    function testShipState(transform: (ships: FleetPlacement) => void, valid: boolean) {
        const subject = new GameManager(GameMode.Basic.settings, () => { });
        const fleet = getBasicFleet();
        transform(fleet);
        subject.setFleet(1, fleet);
        const localState = subject.getLocalState(1);
        expect(localState.ownShips.length).toEqual(valid ? fleet.ships.length : 0);
    }

    test('should set own ships', () => {
        testShipState(() => {}, true);
    });

    test('should set ships of proper lengths', () => {
        const subject = new GameManager(GameMode.Basic.settings, () => { });
        const fleet = getBasicFleet();
        subject.setFleet(0, fleet);
        const localState = subject.getLocalState(0);
        const expectedSizes = GameMode.Basic.settings.ships.map(s => s.size).sort((a, b) => a - b);
        const foundSizes = localState.ownShips.map(s => s.size).sort((a, b) => a - b);
        expect(foundSizes).toEqual(expectedSizes);
    })

    test('should reject out-of-bounds ship', () => {
        testShipState(fleet => (fleet.ships[4].x = 5), false);
    });

    test('should reject overlapping ships', () => {
        testShipState(fleet => {
            fleet.ships[1].x = fleet.ships[0].x;
            fleet.ships[1].y = fleet.ships[0].y;
        }, false);
    });

    test('should reject unmatched ship definition ID', () => {
        testShipState(fleet => fleet.ships[1].definitionId++, false);
    });

    test('should reject missing ship', () => {
        testShipState(fleet => fleet.ships.splice(1, 1), false);
    });

    test('should reject extra ship', () => {
        testShipState(fleet => fleet.ships.push(fleet.ships[1]), false);
    });

    test('should reject invalid player id', () => {
        const subject = new GameManager(GameMode.Basic.settings, () => { });
        subject.setFleet(5, getBasicFleet());
        const localState = subject.getLocalState(1);
        expect(localState.ownShips.length).toEqual(0);
    });

    test('should notify only self when placing ships first', () => {
        const subscriber = jest.fn();
        const subject = new GameManager(GameMode.Basic.settings, subscriber);
        subject.setFleet(1, getBasicFleet());
        expect(subscriber).toBeCalledWith(1, expect.anything());
        expect(subscriber).not.toBeCalledWith(0, expect.anything());
    });

    test('should notify both when placing ships second', () => {
        const subscriber = jest.fn();
        const subject = new GameManager(GameMode.Basic.settings, subscriber);
        subject.setFleet(0, getBasicFleet());
        subject.setFleet(1, getBasicFleet());
        expect(subscriber).toBeCalledWith(1, expect.anything());
        expect(subscriber).toBeCalledWith(0, expect.anything());
    });

    test('should notify only self when placing invalid ships', () => {
        const subscriber = jest.fn();
        const subject = new GameManager(GameMode.Basic.settings, subscriber);
        subject.setFleet(0, getBasicFleet());
        subscriber.mockReset();
        const fleet = getBasicFleet();
        fleet.ships.splice(1, 1);
        subject.setFleet(1, fleet);
        expect(subscriber).toBeCalledWith(1, expect.anything());
        expect(subscriber).not.toBeCalledWith(0, expect.anything());
    });

    describe('with mines', () => {
        test('should place mines', () => {
            const subject = new GameManager(GameMode.Minefield.settings, () => { });
            const fleet = getBasicFleet();
            fleet.mines = getValidMines();
            subject.setFleet(1, fleet);
            const localState = subject.getLocalState(1);
            expect(localState.ownMines.length).toEqual(5);
        });

        test('should reject overlapping mines', () => {
            const subject = new GameManager(GameMode.Minefield.settings, () => { });
            const fleet = getBasicFleet();
            fleet.mines = getValidMines();
            fleet.mines[0] = { x: fleet.mines[1].x, y: fleet.mines[1].y };
            subject.setFleet(1, fleet);
            const localState = subject.getLocalState(1);
            expect(localState.ownMines.length).toEqual(0);
        });

        test('should reject mine overlapping ship', () => {
            const subject = new GameManager(GameMode.Minefield.settings, () => { });
            const fleet = getBasicFleet();
            fleet.mines = getValidMines();
            fleet.mines[0] = { x: fleet.ships[0].x, y: fleet.ships[0].y };
            subject.setFleet(1, fleet);
            const localState = subject.getLocalState(1);
            expect(localState.ownMines.length).toEqual(0);
        });

        test('should reject out-of-bounds mine', () => {
            const subject = new GameManager(GameMode.Minefield.settings, () => { });
            const fleet = getBasicFleet();
            fleet.mines = getValidMines();
            fleet.mines[0].x = 9;
            subject.setFleet(1, fleet);
            const localState = subject.getLocalState(1);
            expect(localState.ownMines.length).toEqual(0);
        });

        test('should reject incorrect number of mines', () => {
            const subject = new GameManager(GameMode.Minefield.settings, () => { });
            const fleet = getBasicFleet();
            fleet.mines = getValidMines();
            fleet.mines.splice(1, 1);
            subject.setFleet(1, fleet);
            const localState = subject.getLocalState(1);
            expect(localState.ownMines.length).toEqual(0);
        });
    });
});

describe('fireShots', () => {
    function setupGame(gameSettings: GameSettings = GameMode.Basic.settings, subscriber: (playerId: number, state: LocalState) => void = () => {}) {
        const subject = new GameManager(gameSettings, subscriber);
        const fleet = getBasicFleet();
        fleet.mines = getValidMines().slice(0, gameSettings.mines);
        subject.setFleet(0, fleet);
        subject.setFleet(1, fleet);
        return subject;
    }

    test('should add a new hit', () => {
        const subject = setupGame();
        const shot = getBasicFleet().ships[0];
        subject.fireShots(0, [shot]);
        const localState = subject.getLocalState(0);
        const marker = localState.ownMarkers[0];
        expect(marker.x).toEqual(shot.x);
        expect(marker.y).toEqual(shot.y);
        expect(marker.type).toEqual(MarkerType.Hit);
        const opponentState = subject.getLocalState(1);
        expect(opponentState.ownShips[0].hits).toEqual(1);
    });

    test('should add a new miss', () => {
        const subject = setupGame();
        const shot = { x: -3, y: -3 };
        subject.fireShots(0, [shot]);
        const localState = subject.getLocalState(0);
        const marker = localState.ownMarkers[0];
        expect(marker.x).toEqual(shot.x);
        expect(marker.y).toEqual(shot.x);
        expect(marker.type).toEqual(MarkerType.Miss);
    });

    test('should change player turn', () => {
        const subject = setupGame();
        const shot = { x: 0, y: 0 };
        subject.fireShots(0, [shot]);
        const localState = subject.getLocalState(0);
        expect(localState.isOwnTurn).toBe(false);
    });

    test('should reject when not own turn', () => {
        const subject = setupGame();
        const shot = { x: 0, y: 0 };
        subject.fireShots(1, [shot]);
        const localState = subject.getLocalState(1);
        expect(localState.ownMarkers.length).toEqual(0);
    });

    test('should reject when out of bounds', () => {
        const subject = setupGame();
        const shot = { x: -9, y: -3 };
        subject.fireShots(0, [shot]);
        const localState = subject.getLocalState(0);
        expect(localState.ownMarkers.length).toEqual(0);
    });

    test('should reject when game over', () => {
        const subject = setupGame();
        subject.leaveGame(1);
        const shot = { x: 0, y: 0 };
        subject.fireShots(0, [shot]);
        const localState = subject.getLocalState(0);
        expect(localState.ownMarkers.length).toEqual(0);
    });

    test('should reject when not all ships placed', () => {
        const subject = new GameManager(GameMode.Basic.settings, () => {});
        subject.setFleet(0, getBasicFleet());
        const shot = { x: 0, y: 0 };
        subject.fireShots(0, [shot]);
        const localState = subject.getLocalState(0);
        expect(localState.ownMarkers.length).toEqual(0);
    });

    test('should reject when firing at same spot', () => {
        const subject = setupGame();
        const shot = { x: 0, y: 0 };
        subject.fireShots(0, [shot]);
        subject.fireShots(1, [shot]);
        subject.fireShots(0, [shot]);
        const localState = subject.getLocalState(0);
        expect(localState.ownMarkers.length).toEqual(1);
    });

    test('should broadcast state on valid shot', () => {
        const subscriber = jest.fn();
        const subject = setupGame(GameMode.Basic.settings, subscriber);
        subscriber.mockReset();
        const shot = { x: 0, y: 0 };
        subject.fireShots(0, [shot]);
        expect(subscriber).toBeCalledWith(0, expect.anything());
        expect(subscriber).toBeCalledWith(1, expect.anything());
    });

    test('should send state to self only on invalid shot', () => {
        const subscriber = jest.fn();
        const subject = setupGame(GameMode.Basic.settings, subscriber);
        subscriber.mockReset();
        const shot = { x: -9, y: 0 };
        subject.fireShots(0, [shot]);
        expect(subscriber).toBeCalledWith(0, expect.anything());
        expect(subscriber).not.toBeCalledWith(1, expect.anything());
    });

    describe('with streak mode enabled', () => {
        test('should not change player turn on hit', () => {
            const subject = setupGame(GameMode.Streak.settings);
            const shot = getBasicFleet().ships[0];
            subject.fireShots(0, [shot]);
            const localState = subject.getLocalState(0);
            expect(localState.isOwnTurn).toBe(true);
        })

        test('should change player turn on miss', () => {
            const subject = setupGame(GameMode.Streak.settings);
            const shot = { x: -3, y: -3 };
            subject.fireShots(0, [shot]);
            const localState = subject.getLocalState(0);
            expect(localState.isOwnTurn).toBe(false);
        })
    });

    describe('multiple shots', () => {
        test('should add hits and misses', () => {
            const subject = setupGame(GameMode.Barrage.settings);
            const shot1 = getBasicFleet().ships[0];
            const shot2 = { x: -3, y: -3 };
            subject.fireShots(0, [shot1, shot2, { x: 1, y: 0 }, { x: 2, y: 0 }]);
            const localState = subject.getLocalState(0);
            expect(localState.ownMarkers).toContainEqual({ x: shot1.x, y: shot1.y, type: MarkerType.Hit });
            expect(localState.ownMarkers).toContainEqual({ x: shot2.x, y: shot2.y, type: MarkerType.Miss });
        });

        test('should reject when any shot invalid', () => {
            const subject = setupGame(GameMode.Barrage.settings);
            const shot1 = getBasicFleet().ships[0];
            const shot2 = { x: -3, y: -3 };
            subject.fireShots(0, [shot1, shot2, { x: 1, y: 0 }, { x: 9, y: 0 }]);
            const localState = subject.getLocalState(0);
            expect(localState.ownMarkers.length).toEqual(0);
        });

        test('should reject when wrong number of shots supplied', () => {
            const subject = setupGame(GameMode.Barrage.settings);
            const shot1 = getBasicFleet().ships[0];
            const shot2 = { x: -3, y: -3 };
            subject.fireShots(0, [shot1, shot2, { x: 1, y: 0 }]);
            const localState = subject.getLocalState(0);
            expect(localState.ownMarkers.length).toEqual(0);
        });

        test('should reject when duplicate shot supplied', () => {
            const subject = setupGame(GameMode.Barrage.settings);
            const shot1 = getBasicFleet().ships[0];
            const shot2 = { x: -3, y: -3 };
            subject.fireShots(0, [shot1, shot2, { x: 1, y: 0 }, { x: 1, y: 0 }]);
            const localState = subject.getLocalState(0);
            expect(localState.ownMarkers.length).toEqual(0);
        });

        describe('salvo', () => {
            test('should accept number of shots equal to remaining ships', () => {
                const subject = setupGame(GameMode.Salvo.settings);
                const shots: Point[] = [];
                for(let x = 0; x < getBasicFleet().ships.length; x++) {
                    shots.push({ x, y: 0 });
                }
                subject.fireShots(0, shots);
                const localState = subject.getLocalState(0);
                expect(localState.ownMarkers.length).toEqual(shots.length);
            });

            test('should reject when shots not equal to remaining ships', () => {
                const subject = setupGame(GameMode.Salvo.settings);
                const shots: Point[] = [];
                for(let x = 0; x < getBasicFleet().ships.length; x++) {
                    shots.push({ x, y: 0 });
                }
                shots.push({ x: 0, y: 1 });
                subject.fireShots(0, shots);
                const localState = subject.getLocalState(0);
                expect(localState.ownMarkers.length).toEqual(0);
            });

            test('should reduce shots when ships sunk', () => {
                const subject = setupGame(GameMode.Salvo.settings);
                let shots: Point[] = [];
                for(let x = 0; x < getBasicFleet().ships.length; x++) {
                    shots.push({ x, y: 0 });
                }
                subject.fireShots(0, shots);
                let localState = subject.getLocalState(0);
                shots = shipFuncs.getPoints(localState.ownShips.find(s => s.size === getBasicFleet().ships.length)!);
                subject.fireShots(1, shots);
                localState = subject.getLocalState(1);
                expect(localState.sunkEnemies.length).toEqual(1);
                shots = [];
                for(let x = 0; x < getBasicFleet().ships.length - 1; x++) {
                    shots.push({ x, y: 1 });
                }
                subject.fireShots(0, shots);
                localState = subject.getLocalState(0);
                expect(localState.ownMarkers.length).toEqual(getBasicFleet().ships.length * 2 - 1);
            });
        });

        describe('with streak mode enabled', () => {
            test('should not change player turn on at least one hit', () => {
                const subject = setupGame({ ...GameMode.Barrage.settings, streak: true });
                const shot = getBasicFleet().ships[0];
                subject.fireShots(0, [shot, { x: -3, y: -3 }, { x: 0, y: 0 }, { x: 1, y: 1 }]);
                const localState = subject.getLocalState(0);
                expect(localState.isOwnTurn).toBe(true);
            })

            test('should change player turn on all misses', () => {
                const subject = setupGame({ ...GameMode.Barrage.settings, streak: true });
                subject.fireShots(0, [{ x: -3, y: -3 }, { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }]);
                const localState = subject.getLocalState(0);
                expect(localState.isOwnTurn).toBe(false);
            })
        });
    });

    describe('hitting a mine', () => {
        test('should hit nearby targets', () => {
            const subject = setupGame(GameMode.Minefield.settings);
            const shot = getValidMines()[0];
            subject.fireShots(0, [shot]);
            const expected = [...hexUtils.getNeighbours(shot, GameMode.Minefield.settings.gridSize), shot];
            const state = subject.getLocalState(0);
            for(const e of expected) {
                expect(state.opponentMarkers).toContainEqual(expect.objectContaining(e));
            }
        });

        test('should not re-hit existing markers', () => {
            const subject = setupGame(GameMode.Minefield.settings);
            const shot = getValidMines()[1];
            subject.fireShots(0, [{ x: shot.x, y: shot.y + 1 }]);
            subject.fireShots(1, [shot]);
            const state = subject.getLocalState(0);
            expect(state.ownMarkers.length).toEqual(7);
        });
    });
});

describe('leaveGame', () => {
    test('should set player to lost', () => {
        const subject = new GameManager(GameMode.Basic.settings, () => {});
        subject.leaveGame(1);
        const localState = subject.getLocalState(1);
        expect(localState.gameLost).toBe(true);
    });

    test('should broadcast state', () => {
        const subscriber = jest.fn();
        const subject = new GameManager(GameMode.Basic.settings, subscriber);
        subject.leaveGame(1);
        expect(subscriber).toBeCalledTimes(2);
    });

    test('should be a no-op when game is already over', () => {
        const subscriber = jest.fn();
        const subject = new GameManager(GameMode.Basic.settings, subscriber);
        subject.leaveGame(1);
        subscriber.mockReset();
        subject.leaveGame(0);
        expect(subscriber).not.toBeCalled();
        const localState = subject.getLocalState(0);
        expect(localState.gameWon).toBe(true);
    });
})