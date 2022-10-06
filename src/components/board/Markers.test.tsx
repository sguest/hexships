import 'jest-canvas-mock';
import { render, screen } from '@testing-library/react'
import { MarkerType } from '../../game-state/Marker'
import Markers from './Markers'

test('Should render markers', () => {
    const markers = [
        { x: 3, y: 2, type: MarkerType.Hit },
        { x: -2, y: 1, type: MarkerType.Miss },
    ]
    render(<Markers markers={markers} uiScale={1} gridDimensions={{ x: 1, y: 1 }} gridSize={7} />)
    const canvas = screen.getByTestId('marker-canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const events = context!.__getEvents();
    expect(events).toMatchSnapshot();
})