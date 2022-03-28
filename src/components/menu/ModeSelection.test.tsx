import { fireEvent, render, screen } from '@testing-library/react'
import { Basic, listGameModes } from '../../config/GameMode';
import ModeSelection from './ModeSelection';

test('should render modes', () => {
    render(<ModeSelection onSelection={() => {}} onCancel={() => {}} />);
    for(const mode of listGameModes()) {
        expect(screen.getByRole('button', { name: mode.title })).not.toBeNull();
    }
});

test('should select mode on click', () => {
    const listener = jest.fn();
    render(<ModeSelection onSelection={listener} onCancel={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: Basic.title }));
    expect(listener).toHaveBeenCalledWith(Basic);
});

test('should call cancel on back click', () => {
    const listener = jest.fn();
    render(<ModeSelection onSelection={() => {}} onCancel={listener} />);
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(listener).toHaveBeenCalled();
})