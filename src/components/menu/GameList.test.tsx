import { fireEvent, render, screen } from '@testing-library/react';
import { GameModeId, getGameMode } from '../../config/GameMode';
import * as GameMode from '../../config/GameMode';
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
    render(<GameList onSelected={jest.fn()} games={[{ id: '1', definition: { name: 'X', mode, settings: GameMode.Minefield.settings } }]} />);
    expect(screen.getByText('Mode: ' + getGameMode(mode).title)).not.toBeNull();
});

test('should show tooltip with mode description for non-custom', () => {
    const mode = GameModeId.Barrage;
    render(<GameList onSelected={jest.fn()} games={[{ id: '1', definition: { name: 'X', mode, settings: GameMode.Barrage.settings } }]} />);
    fireEvent.click(screen.getByRole('button', { name: '(?)' }));
    expect(screen.getByText(GameMode.Barrage.description)).not.toBeNull();
});

test('should show tooltip with custom summary for custom games', () => {
    const mode = GameModeId.Custom;
    render(<GameList onSelected={jest.fn()} games={[{ id: '1', definition: { name: 'X', mode, settings: GameMode.Barrage.settings } }]} />);
    fireEvent.click(screen.getByRole('button', { name: '(?)' }));
    expect(screen.getByText('Differences from basic rules:')).not.toBeNull();
});

test('should call selected callback when game chosen', () => {
    const game = { id: '1', definition: { name: 'X', mode: GameModeId.Streak, settings: GameMode.Streak.settings } };
    const callback = jest.fn();
    render(<GameList onSelected={callback} games={[game]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Join' }));
    expect(callback).toBeCalledWith(game);
});