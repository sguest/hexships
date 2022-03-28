import 'jest-canvas-mock';
import { render, screen } from '@testing-library/react'
import Field from './Field'

test('Should render grid lines', () => {
    render(<Field uiScale={1} gridSize={1} gridDimensions={{ x: 1, y: 1 }} />)
    const canvas = screen.getByTestId('field-canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const events = context!.__getEvents();
    expect(events).toMatchSnapshot();
})