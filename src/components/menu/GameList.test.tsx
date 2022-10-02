import { fireEvent, render, screen } from '@testing-library/react';
import { GameModeId, getGameMode } from '../../config/GameMode';
import GameList from './GameList';

test('should display loading when list is undefined', () => {
    render(<GameList onSelected={jest.fn()} games={undefined} />);
    expect(screen.getByText('Loading game list...')).not.toBeNull();
});

test('should display no games when list is empty', () => {
    render(<GameList onSelected={jest.fn()} games={[]} />);
    expect(screen.getByText('No games found')).not.toBeNull();
});

test('should display game if found', () => {
    const mode = GameModeId.Minefield;
    render(<GameList onSelected={jest.fn()} games={[{ id: '1', definition: { name: 'X', mode } }]} />);
    expect(screen.getByText('Mode: ' + getGameMode(mode).title)).not.toBeNull();
});

test('should call selected callback when game chosen', () => {
    const game = { id: '1', definition: { name: 'X', mode: GameModeId.Streak } };
    const callback = jest.fn();
    render(<GameList onSelected={callback} games={[game]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Join' }));
    expect(callback).toBeCalledWith(game);
});