import 'jest-canvas-mock';
import { render, screen } from '@testing-library/react';
import Direction from '../../game-state/Direction';
import Ship from '../../game-state/Ship';
import Ships from './Ships';
import { Point } from '../../utils/point-utils';

test('Should render ships', () => {
    const ships: Ship[] = [
        { definitionId: 1, x: 2, y: 2, facing: Direction.positiveX, size: 3, name: 'Ship', hits: 0 },
        { definitionId: 2, x: -1, y: 3, facing: Direction.negativeZ, size: 2, name: 'Ship2', hits: 0 },
        { definitionId: 3, x: 0, y: -4, facing: Direction.negativeY, size: 4, name: 'Ship3', hits: 0 },
    ];
    render(<Ships ships={ships} uiScale={1} gridDimensions={{ x: 1, y: 1 }} mines={[]} />)
    const canvas = screen.getByTestId('ships-canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const events = context!.__getEvents();
    expect(events).toMatchSnapshot();
});

test('Should render mines', () => {
    const mines: Point[] = [
        { x: 2, y: 2 },
        { x: -1, y: 3 },
        { x: 0, y: -4 },
    ];
    render(<Ships ships={[]} uiScale={1} gridDimensions={{ x: 1, y: 1 }} mines={mines} />)
    const canvas = screen.getByTestId('ships-canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const events = context!.__getEvents();
    expect(events).toMatchSnapshot();
});