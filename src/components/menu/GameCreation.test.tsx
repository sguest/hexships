import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { GameModeId, getGameMode } from '../../config/GameMode';
import { ClientSocket } from '../../game-interface/RemoteGameInterface';
import GameCreation from './GameCreation';
import { EventEmitter } from 'events';
import * as GameMode from '../../config/GameMode';

describe('clicking the create button', () => {
    test('should call the callback', async() => {
        const createdFn = jest.fn();
        render(<GameCreation onCreated={createdFn} onCancel={jest.fn()} socket={new EventEmitter() as unknown as ClientSocket} />);
        fireEvent.change(screen.getByLabelText('Game Name'), { target: { value: 'Name' } });
        fireEvent.change(screen.getByTestId('gamemode'), { target: { value: GameModeId.Salvo } });
        fireEvent.click(screen.getByRole('button', { name: 'Create' }));
        expect(createdFn).toBeCalled();
    });

    test('should create a standard game on the server', () => {
        const socket = new EventEmitter();
        const lobbyListener = jest.fn();
        render(<GameCreation onCreated={jest.fn()} onCancel={jest.fn()} socket={socket as unknown as ClientSocket} />);
        socket.on('add-standard-lobby-game', lobbyListener);
        fireEvent.change(screen.getByLabelText('Game Name'), { target: { value: 'Name' } });
        fireEvent.change(screen.getByTestId('gamemode'), { target: { value: GameModeId.Minefield } });
        fireEvent.click(screen.getByRole('button', { name: 'Create' }));
        expect(lobbyListener).toBeCalledWith('Name', GameModeId.Minefield);
    });

    test('should create a custom game on the server', () => {
        const socket = new EventEmitter();
        const customLobbyListener = jest.fn();
        render(<GameCreation onCreated={jest.fn()} onCancel={jest.fn()} socket={socket as unknown as ClientSocket} />);
        socket.on('add-custom-lobby-game', customLobbyListener);
        fireEvent.change(screen.getByLabelText('Game Name'), { target: { value: 'Name' } });
        fireEvent.change(screen.getByTestId('gamemode'), { target: { value: GameModeId.Custom } });
        fireEvent.click(screen.getByRole('button', { name: 'Create' }));
        expect(customLobbyListener).toBeCalledWith('Name', GameMode.Basic.settings);
    });
});

test('clicking cancel should call the cancel callback', () => {
    const cancelFn = jest.fn();
    render(<GameCreation onCreated={jest.fn()} onCancel={cancelFn} socket={new EventEmitter() as unknown as ClientSocket} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(cancelFn).toBeCalled();
});

test('create button should be disabled when name is blank', () => {
    render(<GameCreation onCreated={jest.fn()} onCancel={jest.fn()} socket={new EventEmitter() as unknown as ClientSocket} />);
    fireEvent.change(screen.getByLabelText('Game Name'), { target: { value: '' } });
    expect(screen.getByRole('button', { name: 'Create' })).toBeDisabled();
});

test('create button should be disabled with custom mode and invalid settings', () => {
    render(<GameCreation onCreated={jest.fn()} onCancel={jest.fn()} socket={new EventEmitter() as unknown as ClientSocket} />);
    fireEvent.change(screen.getByLabelText('Game Name'), { target: { value: 'Name' } });
    fireEvent.change(screen.getByTestId('gamemode'), { target: { value: GameModeId.Custom } });
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByRole('button', { name: 'Create' })).toBeDisabled();
});

test('create button should be enabled with non-custom mode and invalid settings', () => {
    render(<GameCreation onCreated={jest.fn()} onCancel={jest.fn()} socket={new EventEmitter() as unknown as ClientSocket} />);
    fireEvent.change(screen.getByLabelText('Game Name'), { target: { value: 'Name' } });
    fireEvent.change(screen.getByTestId('gamemode'), { target: { value: GameModeId.Custom } });
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.change(screen.getByTestId('gamemode'), { target: { value: GameModeId.Barrage } });
    expect(screen.getByRole('button', { name: 'Create' })).not.toBeDisabled();
});

test('tooltip should show description for currently selected mode', async() => {
    render(<GameCreation onCreated={jest.fn()} onCancel={jest.fn()} socket={new EventEmitter() as unknown as ClientSocket} />);
    const mode = GameModeId.Salvo;
    fireEvent.change(screen.getByTestId('gamemode'), { target: { value: mode } });
    fireEvent.click(screen.getByText('(?)'));
    const description = getGameMode(mode).description;
    expect(screen.getByText(description)).not.toBeNull();
})

test('should show custom fields when mode is set to custom', () => {
    render(<GameCreation onCreated={jest.fn()} onCancel={jest.fn()} socket={new EventEmitter() as unknown as ClientSocket} />);
    fireEvent.change(screen.getByTestId('gamemode'), { target: { value: GameModeId.Custom } });
    expect(screen.getByText('Number of shots per turn')).not.toBeNull();
});

test('should not show custom fields when mode is not set to custom', () => {
    render(<GameCreation onCreated={jest.fn()} onCancel={jest.fn()} socket={new EventEmitter() as unknown as ClientSocket} />);
    fireEvent.change(screen.getByTestId('gamemode'), { target: { value: GameModeId.Minefield } });
    expect(screen.queryByText('Number of shots per turn')).toBeNull();
});
