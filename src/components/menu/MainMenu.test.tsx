import { fireEvent, render, screen } from '@testing-library/react';
import MainMenu from './MainMenu';
import { EventEmitter } from 'events';
import RemoteGameInterface, { ClientSocket } from '../../game-interface/RemoteGameInterface';
import * as GameMode from '../../config/GameMode';
import { listGameModes, GameModeId } from '../../config/GameMode';
import LocalGameInterface from '../../game-interface/LocalGameInterface';

test('should render menu', () => {
    render(<MainMenu onNewGame={() => {}} isConnected={true} socket={new EventEmitter() as unknown as ClientSocket} />);
    expect(screen.getByRole('button', { name: 'Versus AI' })).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Find Opponent' })).not.toBeNull();
});

test('when disconnected should not render connected', () => {
    render(<MainMenu onNewGame={() => {}} isConnected={false} socket={new EventEmitter() as unknown as ClientSocket} />);
    expect(screen.queryByRole('button', { name: 'Find Opponent' })).toBeNull();
});

describe('after selecting VS AI', () => {
    let newGameListener: jest.Mock;
    beforeEach(() => {
        newGameListener = jest.fn();
        render(<MainMenu onNewGame={newGameListener} isConnected={true} socket={new EventEmitter() as unknown as ClientSocket} />);
        fireEvent.click(screen.getByRole('button', { name: 'Versus AI' }));
    });

    test('should show game modes', () => {
        for(const mode of listGameModes()) {
            expect(screen.getByRole('button', { name: mode.title })).not.toBeNull();
        }
        expect(screen.getByRole('button', { name: 'Back' })).not.toBeNull();
    });

    test('clicking back should go back to main menu', () => {
        fireEvent.click(screen.getByRole('button', { name: 'Back' }));
        expect(screen.getByRole('button', { name: 'Versus AI' })).not.toBeNull();
    });

    test('clicking game mode should launch local game', () => {
        fireEvent.click(screen.getByRole('button', { name: GameMode.Basic.title }));
        const gameInterface = newGameListener.mock.calls[0][0] as LocalGameInterface;
        expect(gameInterface).toBeInstanceOf(LocalGameInterface);
        expect(gameInterface.getSettings()).toEqual(GameMode.Basic.settings);
    });
});

describe('after selecting Find Opponent', () => {
    let newGameListener: jest.Mock;
    let socket: EventEmitter;
    beforeEach(() => {
        newGameListener = jest.fn();
        socket = new EventEmitter();
        render(<MainMenu onNewGame={newGameListener} isConnected={true} socket={socket as unknown as ClientSocket} />);
        fireEvent.click(screen.getByRole('button', { name: 'Find Opponent' }));
    });

    test('should show game modes', () => {
        for(const mode of listGameModes()) {
            expect(screen.getByRole('button', { name: mode.title })).not.toBeNull();
        }
        expect(screen.getByRole('button', { name: 'Back' })).not.toBeNull();
    });

    test('clicking back should go back to main menu', () => {
        fireEvent.click(screen.getByRole('button', { name: 'Back' }));
        expect(screen.getByRole('button', { name: 'Find Opponent' })).not.toBeNull();
    });

    describe('clicking game mode', () => {
        let quickConnectListener: jest.Mock;
        beforeEach(() => {
            quickConnectListener = jest.fn();
            socket.on('quick-connect', quickConnectListener);
            fireEvent.click(screen.getByRole('button', { name: GameMode.Basic.title }));
        });

        test('should request quick connect', () => {
            expect(quickConnectListener).toBeCalledWith(GameModeId.Basic);
        });

        test('should display quick connect waiting text', () => {
            expect(screen.getByText('Searching for opponent...')).not.toBeNull();
        });

        test('should listen for game join', () => {
            socket.emit('join-game', GameMode.Basic.settings);
            const gameInterface = newGameListener.mock.calls[0][0] as RemoteGameInterface;
            expect(gameInterface).toBeInstanceOf(RemoteGameInterface);
            expect(gameInterface.getSettings()).toEqual(GameMode.Basic.settings);
        });

        describe('then clicking cancel', () => {
            test('should go back to mode selection', () => {
                fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
                expect(screen.getByRole('button', { name: GameMode.Basic.title })).not.toBeNull();
            });

            test('should cancel quick connect request', () => {
                const subscriber = jest.fn();
                socket.on('cancel-quick-connect', subscriber);
                fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
                expect(subscriber).toHaveBeenCalled();
            });

            test('should remove join listener', () => {
                fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
                expect(socket.eventNames()).not.toContain('join-game');
            });
        });
    });
});