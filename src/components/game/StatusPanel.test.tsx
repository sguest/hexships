import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import StatusPanel from './StatusPanel';

test('Should display status mesasge', () => {
    const statusMessage = 'Status Message';
    render(<StatusPanel statusMessage={statusMessage} fireButtonEnabled={false} fireButtonVisible={false} onFireClick={() => {}} />);
    expect(screen.getByText(statusMessage)).not.toBeNull();
});

test('Should hide enemy ships listing when ships not placed', () => {
    render(<StatusPanel ships={[]} fireButtonEnabled={false} fireButtonVisible={false} onFireClick={() => {}} />);
    expect(screen.queryByText('Enemy Ships')).toBeNull();
});

test('Should show enemy ships', () => {
    const shipName = 'Ship Name';
    const size = 3;
    render(<StatusPanel ships={[{ id: 1, size, name: shipName }]} fireButtonEnabled={false} fireButtonVisible={false} onFireClick={() => {}} />);
    expect(screen.getByText(`${shipName} (${size})`)).not.toBeNull();
});

test('should indicate ship sunk', () => {
    const shipName = 'Ship Name';
    const size = 3;
    render(<StatusPanel ships={[{ id: 1, size, name: shipName }]} sunkShipIds={[1]} fireButtonEnabled={false} fireButtonVisible={false} onFireClick={() => {}} />);
    expect(screen.getByText(`${shipName} (${size})`)).toHaveStyle({ borderColor: 'red' });
});

describe('fire button', () => {
    test('should not be present when hidden', () => {
        render(<StatusPanel ships={[{ id: 1, size: 3, name: 'X' }]} sunkShipIds={[1]} fireButtonEnabled={false} fireButtonVisible={false} onFireClick={() => {}} />);
        expect(screen.queryByRole('button', { name: 'Fire' })).toBeNull();
    });

    test('should be present when not hidden', () => {
        render(<StatusPanel ships={[{ id: 1, size: 3, name: 'X' }]} sunkShipIds={[1]} fireButtonEnabled={true} fireButtonVisible={true} onFireClick={() => {}} />);
        expect(screen.getByRole('button', { name: 'Fire' })).not.toBeNull();
    });

    test('should be disabled when specified', () => {
        render(<StatusPanel ships={[{ id: 1, size: 3, name: 'X' }]} sunkShipIds={[1]} fireButtonEnabled={false} fireButtonVisible={true} onFireClick={() => {}} />);
        expect(screen.getByRole('button', { name: 'Fire' })).toBeDisabled();
    });

    test('should execute callback when clicked', () => {
        const callback = jest.fn();
        render(<StatusPanel ships={[{ id: 1, size: 3, name: 'X' }]} sunkShipIds={[1]} fireButtonEnabled={true} fireButtonVisible={true} onFireClick={callback} />);
        fireEvent.click(screen.getByRole('button', { name: 'Fire' }));
        expect(callback).toBeCalled();
    })
});