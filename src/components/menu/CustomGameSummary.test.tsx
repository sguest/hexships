import { render, screen } from '@testing-library/react';
import CustomGameSummary from './CustomGameSummary'
import * as GameMode from '../../config/GameMode';

test('Should show shot per ship when enabled', () => {
    render(<CustomGameSummary settings={GameMode.Salvo.settings} />);
    expect(screen.getByText('1 shot per surviving ship')).not.toBeNull();
});

test('Should not show shot per ship when disabled', () => {
    render(<CustomGameSummary settings={GameMode.Basic.settings} />);
    expect(screen.queryByText('1 shot per surviving ship')).toBeNull();
});

test('Should show number of shots when greater than 1', () => {
    render(<CustomGameSummary settings={GameMode.Barrage.settings} />);
    expect(screen.getByText(`${GameMode.Barrage.settings.shots} shots per turn`)).not.toBeNull();
});

test('Should not show number of shots when 1', () => {
    render(<CustomGameSummary settings={GameMode.Basic.settings} />);
    expect(screen.queryByText(/shots per turn/)).toBeNull();
});

test('Should not show number of shots when per ship is enabled', () => {
    render(<CustomGameSummary settings={{...GameMode.Basic.settings, shots: 2, shotPerShip: true}} />);
    expect(screen.queryByText(/shots per turn/)).toBeNull();
});

test('Should show streak if enabled', () => {
    render(<CustomGameSummary settings={GameMode.Streak.settings} />);
    expect(screen.getByText('Fire again after a hit')).not.toBeNull();
});

test('Should not show streak if disabled', () => {
    render(<CustomGameSummary settings={GameMode.Basic.settings} />);
    expect(screen.queryByText('Fire again after a hit')).toBeNull();
});

test('Should show number of mines when greater than 0', () => {
    render(<CustomGameSummary settings={GameMode.Minefield.settings} />);
    expect(screen.getByText(`${GameMode.Minefield.settings.mines} mines`)).not.toBeNull();
});

test('Should not number of mines when 0', () => {
    render(<CustomGameSummary settings={GameMode.Basic.settings} />);
    expect(screen.queryByText(/mines/)).toBeNull();
});

test('Should show ships when non-standard', () => {
    render(<CustomGameSummary settings={{ ...GameMode.Basic.settings, ships: [] }} />);
    expect(screen.getByText('Ships')).not.toBeNull();
});

test('Should not show ships when standard', () => {
    render(<CustomGameSummary settings={GameMode.Basic.settings} />);
    expect(screen.queryByText('Ships')).toBeNull();
});
