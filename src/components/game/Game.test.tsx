import 'jest-canvas-mock';
import LocalGameInterface from '../../game-interface/LocalGameInterface';
import * as GameMode from '../../config/GameMode';
import LocalState from '../../game-state/LocalState';
import { StateSubscription } from '../../game-interface/GameInterface';
import { act, fireEvent, render, screen } from '@testing-library/react';
import Game from './Game';
import Direction from '../../game-state/Direction';

function mockUpdater(gameInterface: LocalGameInterface) {
    let subscriber: StateSubscription | undefined;
    jest.spyOn(gameInterface, 'onStateChange').mockImplementation(s => (subscriber = s));
    jest.spyOn(gameInterface, 'offStateChange').mockImplementation(() => (subscriber = undefined));
    return (state: LocalState) => {
        act(() => {
            subscriber && subscriber(state);
        });
    }
}

const defaultState: LocalState = {
    ownShips: [{ x: 0, y: 0, size: 1, facing: Direction.positiveX, hits: 0, name: 'X', definitionId: 1 }],
    ownMarkers: [],
    opponentShips: [],
    opponentMarkers: [],
    isOwnTurn: false,
    sunkEnemies: [],
    gameWon: false,
    gameLost: false,
    opponentShipsPlaced: true,
    opponentLeft: false,
}

describe('status messages', () => {
    function testStatusMessage(message: string, state: LocalState) {
        const gameInterface = new LocalGameInterface(GameMode.Basic.settings);
        const updater = mockUpdater(gameInterface);
        render(<Game gameInterface={gameInterface} onExit={() => {}} />);
        updater(state);
        expect(screen.getByText(message)).not.toBeNull();
    }

    test('opponent left', () => {
        testStatusMessage('Your opponent left', {
            ...defaultState,
            opponentLeft: true,
            gameWon: true,
        })
    });

    test('game won', () => {
        testStatusMessage('You have Won', {
            ...defaultState,
            gameWon: true,
        })
    });

    test('game lost', () => {
        testStatusMessage('You have Lost', {
            ...defaultState,
            gameLost: true,
        })
    });

    test('enemy placing', () => {
        testStatusMessage('Enemy placing ships', {
            ...defaultState,
            opponentShipsPlaced: false,
        })
    });

    test('own shot', () => {
        testStatusMessage('Take your shot', {
            ...defaultState,
            isOwnTurn: true,
        })
    })

    test('enemy shot', () => {
        testStatusMessage('Enemy\'s turn', {
            ...defaultState,
            isOwnTurn: false,
        })
    })
});

describe('Menu button', () => {
    test('Show menu', () => {
        render(<Game gameInterface={new LocalGameInterface(GameMode.Basic.settings)} onExit={() => {}} />);
        fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
        expect(screen.getByText('Are you sure you want to end the game?')).not.toBeNull();
    });

    test('Call exit from menu', () => {
        const listener = jest.fn();
        render(<Game gameInterface={new LocalGameInterface(GameMode.Basic.settings)} onExit={listener} />);
        fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
        fireEvent.click(screen.getByRole('button', { name: 'OK' }));
        expect(listener).toHaveBeenCalled();
    });

    test('Cancel menu', () => {
        render(<Game gameInterface={new LocalGameInterface(GameMode.Basic.settings)} onExit={() => {}} />);
        fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(screen.queryByText('Are you sure you want to end the game?')).toBeNull();
    });
});