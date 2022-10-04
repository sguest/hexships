import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import CustomGameSettings from './CustomGameSettings';
import * as GameMode from '../../config/GameMode';

test('Changing number of shots should update game settings', () => {
    const callback = jest.fn();
    render(<CustomGameSettings settings={GameMode.Basic.settings} onSettingsChanged={callback} />);
    const numShots = 3;
    fireEvent.change(screen.getByLabelText('Number of shots per turn'), { target: { value: numShots } });
    expect(callback).toBeCalledWith({ ...GameMode.Basic.settings, shots: numShots })
});

test('Number of shots should be disabled when shot per ship is selected', () => {
    render(<CustomGameSettings settings={GameMode.Salvo.settings} onSettingsChanged={jest.fn()} />);
    expect(screen.getByLabelText('Number of shots per turn')).toBeDisabled();
});

test('Changing shot per ship checkbox should update game settings', () => {
    const callback = jest.fn();
    render(<CustomGameSettings settings={GameMode.Basic.settings} onSettingsChanged={callback} />);
    fireEvent.click(screen.getByLabelText('One shot per remaining ship'));
    expect(callback).toBeCalledWith({ ...GameMode.Basic.settings, shotPerShip: true });
});

test('Changing fire again checkbox should update game settings', () => {
    const callback = jest.fn();
    render(<CustomGameSettings settings={GameMode.Basic.settings} onSettingsChanged={callback} />);
    fireEvent.click(screen.getByLabelText('Fire again on hit'));
    expect(callback).toBeCalledWith({ ...GameMode.Basic.settings, streak: true });
});

test('Chaging number of mines should update game settings', () => {
    const callback = jest.fn();
    render(<CustomGameSettings settings={GameMode.Basic.settings} onSettingsChanged={callback} />);
    const numMines = 5;
    fireEvent.change(screen.getByLabelText('Number of mines'), { target: { value: numMines } });
    expect(callback).toBeCalledWith({ ...GameMode.Basic.settings, mines: numMines })
});

test('Changing ship name should update settings', () => {
    const callback = jest.fn();
    render(<CustomGameSettings settings={GameMode.Basic.settings} onSettingsChanged={callback} />);
    const oldName = 'Submarine'
    const newName = 'New ship name';
    fireEvent.change(screen.getByDisplayValue(oldName), { target: { value: newName } });
    const ships = [...GameMode.Basic.settings.ships];
    const index = ships.findIndex(x => x.name === oldName);
    ships[index] = { ...ships[index], name: newName }
    expect(callback).toBeCalledWith({ ...GameMode.Basic.settings, ships })
});

test('Changing ship size should update settings', () => {
    const callback = jest.fn();
    render(<CustomGameSettings settings={GameMode.Basic.settings} onSettingsChanged={callback} />);
    const shipName = 'Destroyer';
    const listItem = screen.getByDisplayValue(shipName).closest('li');
    const input = within(listItem!).getByRole('spinbutton');
    const newSize = 6;
    fireEvent.change(input, { target: { value: newSize } });
    const ships = [...GameMode.Basic.settings.ships];
    const index = ships.findIndex(x => x.name === shipName);
    ships[index] = { ...ships[index], size: newSize };
    expect(callback).toBeCalledWith({ ...GameMode.Basic.settings, ships });
});

test('Adding a ship should add a blank one to the end of the list', () => {
    const callback = jest.fn();
    render(<CustomGameSettings settings={GameMode.Basic.settings} onSettingsChanged={callback} />);
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    const ships = [...GameMode.Basic.settings.ships, { id: expect.any(Number), name: '', size: 2 }];
    expect(callback).toBeCalledWith({ ...GameMode.Basic.settings, ships });
});

test('Removing a ship should delete it', () => {
    const callback = jest.fn();
    render(<CustomGameSettings settings={GameMode.Basic.settings} onSettingsChanged={callback} />);
    const shipName = 'Battleship';
    const listItem = screen.getByDisplayValue(shipName).closest('li');
    const input = within(listItem!).getByRole('button', { name: 'X' });
    fireEvent.click(input);
    const ships = [...GameMode.Basic.settings.ships];
    const index = ships.findIndex(x => x.name === shipName);
    ships.splice(index, 1);
    expect(callback).toBeCalledWith({ ...GameMode.Basic.settings, ships });
});