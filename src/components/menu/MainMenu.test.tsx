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
    expect(screen.getByRole('button', { name: 'Multiplayer' })).not.toBeNull();
});

test('when disconnected should not render multiplayer option', () => {
    render(<MainMenu onNewGame={() => {}} isConnected={false} socket={new EventEmitter() as unknown as ClientSocket} />);
    expect(screen.queryByRole('button', { name: 'Multiplayer' })).toBeNull();
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

describe('after selecting Multiplayer', () => {
    let newGameListener: jest.Mock;
    let socket: EventEmitter;
    beforeEach(() => {
        newGameListener = jest.fn();
        socket = new EventEmitter();
        render(<MainMenu onNewGame={newGameListener} isConnected={true} socket={socket as unknown as ClientSocket} />);
        fireEvent.click(screen.getByRole('button', { name: 'Multiplayer' }));
    });

    test('clicking back should go back to main menu', () => {
        fireEvent.click(screen.getByRole('button', { name: 'Back' }));
        expect(screen.getByRole('button', { name: 'Multiplayer' })).not.toBeNull();
    });

    describe('clicking quick match', () => {
        beforeEach(() => {
            fireEvent.click(screen.getByRole('button', { name: 'Quick Match' }));
        });

        test('should show game modes', () => {
            for(const mode of listGameModes()) {
                expect(screen.getByRole('button', { name: mode.title })).not.toBeNull();
            }
            expect(screen.getByRole('button', { name: 'Back' })).not.toBeNull();
        });

        test('clicking back should go back to multiplayer menu', () => {
            fireEvent.click(screen.getByRole('button', { name: 'Back' }));
            expect(screen.getByRole('button', { name: 'Quick Match' })).not.toBeNull();
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
            });
        });
    });

    describe('clicking Create Game', () => {
        beforeEach(() => {
            fireEvent.click(screen.getByRole('button', { name: 'Create Game' }));
        });

        test('should display the game creation screen', () => {
            expect(screen.getByText('Game Name')).not.toBeNull();
        });

        test('clicking cancel should return to the multiplayer menu', () => {
            fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
            expect(screen.getByText('Quick Match')).not.toBeNull();
        });

        describe('creating a game', () => {
            let addLobbyListener: jest.Mock;
            beforeEach(() => {
                addLobbyListener = jest.fn();
                socket.on('add-lobby-game', addLobbyListener);
                // Enter a name so that the game creation is valid
                fireEvent.change(screen.getByLabelText('Game Name'), { target: { value: 'Name' } });
                fireEvent.click(screen.getByRole('button', { name: 'Create' }));
            });

            test('should create a game on the server', () => {
                expect(addLobbyListener).toBeCalledWith({ name: 'Name', mode: GameModeId.Basic });
            });

            test('should go to the lobby waiting screen', () => {
                expect(screen.getByText('Waiting for opponent...')).not.toBeNull();
            });

            test('then clicking cancel should return to the multiplayer menu', () => {
                fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
                expect(screen.getByText('Quick Match')).not.toBeNull();
            });
        });
    });

    describe('clicking Find Game', () => {
        beforeEach(() => {
            fireEvent.click(screen.getByRole('button', { name: 'Find Game' }));
        });

        test('should display the game list', () => {
            expect(screen.getByText('Loading game list...')).not.toBeNull();
        })

        test('clicking back should return to the multiplayer menu', () => {
            fireEvent.click(screen.getByRole('button', { name: 'Back' }));
            expect(screen.getByText('Quick Match')).not.toBeNull();
        })
    });
});