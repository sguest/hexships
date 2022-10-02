import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { GameModeId, getGameMode } from '../../config/GameMode';
import GameCreation from './GameCreation';

test('clicking create should call the callback with selected settings', async() => {
    const createdFn = jest.fn();
    render(<GameCreation onCreated={createdFn} onCancel={jest.fn()} />);
    const name = 'Game Name';
    const mode = GameModeId.Salvo.toString();
    fireEvent.change(screen.getByLabelText('Game Name'), { target: { value: name } });
    fireEvent.change(screen.getByTestId('gamemode'), { target: { value: mode } });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(createdFn).toBeCalledWith({ name, mode });
});

test('clicking cancel should call the cancel callback', () => {
    const cancelFn = jest.fn();
    render(<GameCreation onCreated={jest.fn()} onCancel={cancelFn} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(cancelFn).toBeCalled();
});

test('create button should be disabled when name is blank', () => {
    render(<GameCreation onCreated={jest.fn()} onCancel={jest.fn()} />);
    fireEvent.change(screen.getByLabelText('Game Name'), { target: { value: '' } });
    expect(screen.getByRole('button', { name: 'Create' })).toBeDisabled();
});

test('tooltip should show description for currently selected mode', async() => {
    render(<GameCreation onCreated={jest.fn()} onCancel={jest.fn()} />);
    const mode = GameModeId.Salvo;
    fireEvent.change(screen.getByTestId('gamemode'), { target: { value: mode } });
    fireEvent.click(screen.getByText('(?)'));
    const description = getGameMode(mode).description;
    expect(screen.getByText(description)).not.toBeNull();
})