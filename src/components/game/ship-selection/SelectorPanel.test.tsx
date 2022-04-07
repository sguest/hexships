import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectorPanel from './SelectorPanel';

test('when rotate is clicked, should execute callback', () => {
    const listener = jest.fn();
    render(<SelectorPanel onRotated={listener} ships={[]} placedIds={[]} placementValid={true} canRotate={true} onSelected={() => {}} onConfirm={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Rotate' }));
    expect(listener).toHaveBeenCalled();
});

test('when cannot rotate, should disable Rotate button', () => {
    render(<SelectorPanel ships={[]} placedIds={[]} placementValid={true} canRotate={false} onSelected={() => {}} onRotated={() => {}} onConfirm={() => {}} />);
    expect(screen.getByRole('button', { name: 'Rotate' })).toBeDisabled();
});

test('when confirm is clicked, should execute callback', () => {
    const listener = jest.fn();
    render(<SelectorPanel onConfirm={listener} ships={[]} placedIds={[]} placementValid={true} canRotate={true} onSelected={() => {}} onRotated={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(listener).toHaveBeenCalled();
});

test('when placement is invalid, should disable Confirm button', () => {
    render(<SelectorPanel ships={[]} placedIds={[]} placementValid={false} canRotate={true} onSelected={() => {}} onRotated={() => {}} onConfirm={() => {}} />);
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
});

test('should render ships', () => {
    const shipName = 'Ship Name';
    const size = 3;
    render(<SelectorPanel ships={[{ id: 1, size, name: shipName }]} placedIds={[]} placementValid={true} canRotate={true} onSelected={() => {}} onRotated={() => {}} onConfirm={() => {}} />);
    expect(screen.getByText(shipName)).not.toBeNull();
    expect(screen.getByText(`Size: ${size}`)).not.toBeNull();
});

test('should fire selector when clicking on a ship', () => {
    const shipName = 'Ship Name';
    const size = 3;
    const shipId = 1;
    const listener = jest.fn();
    render(<SelectorPanel ships={[{ id: shipId, size, name: shipName }]} onSelected={listener} placedIds={[]} placementValid={true} canRotate={true} onRotated={() => {}} onConfirm={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: new RegExp(shipName) }));
    expect(listener).toHaveBeenCalledWith(shipId);
});

test('should highlight placed ship', () => {
    const shipName = 'Ship Name';
    const shipId = 1;
    render(<SelectorPanel ships={[{ id: shipId, size: 3, name: shipName }]} placedIds={[shipId]} placementValid={true} canRotate={true} onSelected={() => {}} onRotated={() => {}} onConfirm={() => {}} />);
    expect(screen.getByRole('button', { name: new RegExp(shipName) }).closest('button')).toHaveStyle({ borderColor: '#ccc' });
});

test('should highlight selected ship', () => {
    const shipName = 'Ship Name';
    const shipId = 1;
    render(<SelectorPanel ships={[{ id: shipId, size: 3, name: shipName }]} selectedId={shipId} placedIds={[]} placementValid={true} canRotate={true} onSelected={() => {}} onRotated={() => {}} onConfirm={() => {}} />);
    expect(screen.getByRole('button', { name: new RegExp(shipName) }).closest('button')).toHaveStyle({ backgroundColor: '#0050d4' });
});

describe('With mines', () => {
    test('should show mines remaining', () => {
        const mines = 4;
        render(<SelectorPanel ships={[]} mines={mines} placedIds={[]} placementValid={true} canRotate={true} onSelected={() => {}} onRotated={() => {}} onConfirm={() => {}} />)
        expect(screen.getByText(`${mines} Mines remaining`)).not.toBeNull();
    });

    test('should format single mine properly', () => {
        render(<SelectorPanel ships={[]} mines={1} placedIds={[]} placementValid={true} canRotate={true} onSelected={() => {}} onRotated={() => {}} onConfirm={() => {}} />)
        expect(screen.getByText('1 Mine remaining')).not.toBeNull();
    });

    test('should not show ships', () => {
        const shipName = 'Ship Name';
        const size = 3;
        render(<SelectorPanel ships={[{ id: 1, size, name: shipName }]} mines={2} placedIds={[]} placementValid={true} canRotate={true} onSelected={() => {}} onRotated={() => {}} onConfirm={() => {}} />);
        expect(screen.queryByText(shipName)).toBeNull();
    });

    test('should hide rotate button', () => {
        render(<SelectorPanel ships={[]} mines={2} placedIds={[]} placementValid={true} canRotate={true} onSelected={() => {}} onRotated={() => {}} onConfirm={() => {}} />);
        expect(screen.queryByRole('button', { name: 'Rotate' })).toBeNull();
    });
});