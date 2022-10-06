import { act, fireEvent, render, screen } from '@testing-library/react';
import { GameModeId, getGameMode } from '../../config/GameMode';
import * as GameMode from '../../config/GameMode';
import GameList from './GameList';
import { ClientSocket } from '../../game-interface/RemoteGameInterface';
import { EventEmitter } from 'events';
import LobbyGame from '../../server/LobbyGame';

function loadGames(socket: EventEmitter, games: LobbyGame[]) {
    socket.on('enter-lobby', (callback: (g: LobbyGame[]) => void) => {
        callback(games);
    })
}

test('should display loading messages before list is loaded', () => {
    render(<GameList socket={new EventEmitter() as unknown as ClientSocket} />);
    expect(screen.getByText('Loading game list...')).not.toBeNull();
});

test('should display no games when list is empty', () => {
    const socket = new EventEmitter();
    loadGames(socket, []);
    render(<GameList socket={socket as unknown as ClientSocket} />);
    expect(screen.getByText('No games found')).not.toBeNull();
});

test('should display game if found', () => {
    const socket = new EventEmitter();
    const mode = GameModeId.Minefield;
    loadGames(socket, [{ id: '1', definition: { name: 'X', mode, settings: GameMode.Minefield.settings } }]);
    render(<GameList socket={socket as unknown as ClientSocket} />);
    expect(screen.getByText('Mode: ' + getGameMode(mode).title)).not.toBeNull();
});

test('should add game post-load', async() => {
    const socket = new EventEmitter();
    const mode = GameModeId.Barrage;
    render(<GameList socket={socket as unknown as ClientSocket} />);
    await act(async() => {
        socket.emit('add-lobby-game', { id: '1', definition: { name: 'X', mode, settings: GameMode.Barrage.settings } });
    });
    expect(screen.getByText('Mode: ' + getGameMode(mode).title)).not.toBeNull();
});

test('should remove game when no longer exists', async() => {
    const socket = new EventEmitter();
    const mode = GameModeId.Salvo;
    const id = '3'
    loadGames(socket, [{ id, definition: { name: 'X', mode, settings: GameMode.Salvo.settings } }]);
    render(<GameList socket={socket as unknown as ClientSocket} />);
    await act(async() => {
        socket.emit('remove-lobby-game', id);
    });
    expect(screen.queryByText('Mode: ' + getGameMode(mode).title)).toBeNull();
});

test('should show tooltip with mode description for non-custom', () => {
    const socket = new EventEmitter();
    const mode = GameModeId.Barrage;
    loadGames(socket, [{ id: '1', definition: { name: 'X', mode, settings: GameMode.Barrage.settings } }]);
    render(<GameList socket={socket as unknown as ClientSocket} />);
    fireEvent.click(screen.getByRole('button', { name: '(?)' }));
    expect(screen.getByText(GameMode.Barrage.description)).not.toBeNull();
});

test('should show tooltip with custom summary for custom games', () => {
    const mode = GameModeId.Custom;
    const socket = new EventEmitter();
    loadGames(socket, [{ id: '1', definition: { name: 'X', mode, settings: GameMode.Barrage.settings } }]);
    render(<GameList socket={socket as unknown as ClientSocket} />);
    fireEvent.click(screen.getByRole('button', { name: '(?)' }));
    expect(screen.getByText('Differences from basic rules:')).not.toBeNull();
});

test('should notify server when game chosen', () => {
    const id = '5'
    const socket = new EventEmitter();
    const callback = jest.fn();
    socket.on('join-lobby-game', callback);
    loadGames(socket, [{ id, definition: { name: 'X', mode: GameModeId.Streak, settings: GameMode.Streak.settings } }]);
    render(<GameList socket={socket as unknown as ClientSocket} />);
    fireEvent.click(screen.getByRole('button', { name: 'Join' }));
    expect(callback).toBeCalledWith(id);
});