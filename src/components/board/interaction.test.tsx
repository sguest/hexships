import 'jest-canvas-mock';
import { render, screen, fireEvent } from '@testing-library/react';
import Interaction from './Interaction';
import * as hexUtils from '../../utils/hex-utils';

test('should render highlight tile', () => {
    render(<Interaction highlightTiles={[{ x: 1, y: 1, style: 'orange' }]} gridSize={7} uiScale={1} gridDimensions={{ x: 1, y: 1 }} />)
    const canvas = screen.getByTestId('interaction-canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const events = context!.__getEvents();
    expect(events).toMatchSnapshot();
});

test('should render overlay', () => {
    render(<Interaction overlayStyle="green" gridSize={7} uiScale={1} gridDimensions={{ x: 1, y: 1 }} />)
    const canvas = screen.getByTestId('interaction-canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const events = context!.__getEvents();
    expect(events).toMatchSnapshot();
});

test('should highlight mouseover tile', () => {
    render(<Interaction mouseHighlightStyle={() => 'yellow'} gridSize={7} uiScale={1} gridDimensions={{ x: 1, y: 1 }} />)
    const canvas = screen.getByTestId('interaction-canvas') as HTMLCanvasElement;
    fireEvent.mouseMove(canvas, { clientX: 50, clientY: 20 });

    const context = canvas.getContext('2d');
    const events = context!.__getEvents();
    expect(events).toMatchSnapshot();
});

test('should execute callback on tile click', () => {
    const callback = jest.fn();
    render(<Interaction onSelectTile={callback} gridSize={7} uiScale={1} gridDimensions={{ x: 1, y: 1 }} />)
    const canvas = screen.getByTestId('interaction-canvas') as HTMLCanvasElement;
    const mousePos = { x: 50, y: 20 };
    fireEvent.click(canvas, { clientX: mousePos.x, clientY: mousePos.y });
    expect(callback).toHaveBeenCalledWith(hexUtils.getCellFromCoords(mousePos));
});