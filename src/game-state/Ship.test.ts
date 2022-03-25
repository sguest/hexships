import Direction from './Direction'
import { getPoints, isPlacementValid, isShipValid } from './Ship'

describe('getPoints', () => {
    test('should return point array', () => {
        const points = getPoints({
            x: 1,
            y: 2,
            size: 3,
            facing: Direction.positiveZ,
            hits: 0,
            name: 'Test ship',
            definitionId: 0,
        });

        expect(points).toEqual([{ x: 1, y: 2 }, { x: 0, y: 3 }, { x: -1, y: 4 }]);
    })
});

describe('isShipValid', () => {
    test('should check validity', () => {
        const valid = isShipValid({
            x: 0,
            y: 0,
            size: 2,
            facing: Direction.positiveX,
            hits: 0,
            name: 'Test Ship',
            definitionId: 0,
        }, [], 7);
        expect(valid).toBe(true);
    });

    test('should be invalid when out of bounds', () => {
        const valid = isShipValid({
            x: 7,
            y: 0,
            size: 2,
            facing: Direction.positiveX,
            hits: 0,
            name: 'Test Ship',
            definitionId: 0,
        }, [], 7);
        expect(valid).toBe(false);
    });

    test('should be invalid when overlapping another ship', () => {
        const valid = isShipValid({
            x: 0,
            y: 0,
            size: 2,
            facing: Direction.positiveX,
            hits: 0,
            name: 'Test Ship',
            definitionId: 0,
        }, [{
            x: 1,
            y: 0,
            size: 2,
            facing: Direction.positiveX,
            hits: 0,
            name: 'Test Ship 2',
            definitionId: 0,
        }], 7);
        expect(valid).toBe(false);
    });
});

describe('isPlacementValid', () => {
    test('should check validity', () => {
        const valid = isPlacementValid([{
            x: 0,
            y: 0,
            size: 2,
            facing: Direction.positiveX,
            hits: 0,
            name: 'Test Ship',
            definitionId: 0,
        }], 7);
        expect(valid).toBe(true);
    });

    test('should be invalid when out of bounds', () => {
        const valid = isPlacementValid([{
            x: 7,
            y: 0,
            size: 2,
            facing: Direction.positiveX,
            hits: 0,
            name: 'Test Ship',
            definitionId: 0,
        }], 7);
        expect(valid).toBe(false);
    });

    test('should be invalid when overlapping another ship', () => {
        const valid = isPlacementValid([{
            x: 0,
            y: 0,
            size: 2,
            facing: Direction.positiveX,
            hits: 0,
            name: 'Test Ship',
            definitionId: 0,
        },
        {
            x: 1,
            y: 0,
            size: 2,
            facing: Direction.positiveX,
            hits: 0,
            name: 'Test Ship 2',
            definitionId: 0,
        }], 7);
        expect(valid).toBe(false);
    });
});