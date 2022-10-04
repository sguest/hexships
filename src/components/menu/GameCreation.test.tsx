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
    expect(createdFn).toBeCalledWith(name, parseInt(mode), expect.anything());
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

test('create button should be disabled with custom mode and invalid settings', () => {
    render(<GameCreation onCreated={jest.fn()} onCancel={jest.fn()} />);
    fireEvent.change(screen.getByLabelText('Game Name'), { target: { value: 'Name' } });
    fireEvent.change(screen.getByTestId('gamemode'), { target: { value: GameModeId.Custom } });
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByRole('button', { name: 'Create' })).toBeDisabled();
});

test('create button should be enabled with non-custom mode and invalid settings', () => {
    render(<GameCreation onCreated={jest.fn()} onCancel={jest.fn()} />);
    fireEvent.change(screen.getByLabelText('Game Name'), { target: { value: 'Name' } });
    fireEvent.change(screen.getByTestId('gamemode'), { target: { value: GameModeId.Custom } });
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.change(screen.getByTestId('gamemode'), { target: { value: GameModeId.Barrage } });
    expect(screen.getByRole('button', { name: 'Create' })).not.toBeDisabled();
});

test('tooltip should show description for currently selected mode', async() => {
    render(<GameCreation onCreated={jest.fn()} onCancel={jest.fn()} />);
    const mode = GameModeId.Salvo;
    fireEvent.change(screen.getByTestId('gamemode'), { target: { value: mode } });
    fireEvent.click(screen.getByText('(?)'));
    const description = getGameMode(mode).description;
    expect(screen.getByText(description)).not.toBeNull();
})

test('should show custom fields when mode is set to custom', () => {
    render(<GameCreation onCreated={jest.fn()} onCancel={jest.fn()} />);
    fireEvent.change(screen.getByTestId('gamemode'), { target: { value: GameModeId.Custom } });
    expect(screen.getByText('Number of shots per turn')).not.toBeNull();
});

test('should not show custom fields when mode is not set to custom', () => {
    render(<GameCreation onCreated={jest.fn()} onCancel={jest.fn()} />);
    fireEvent.change(screen.getByTestId('gamemode'), { target: { value: GameModeId.Minefield } });
    expect(screen.queryByText('Number of shots per turn')).toBeNull();
});
