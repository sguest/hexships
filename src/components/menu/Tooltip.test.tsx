import { fireEvent, render, screen } from '@testing-library/react';
import Tooltip from './Tooltip';

test('Dialog should not be visible initially', () => {
    const tooltip = 'Tooltip Text';
    render(<Tooltip text={tooltip} />)
    expect(screen.queryByText(tooltip)).toBeNull();
});

test('Should show dialog when clicking tooltip', () => {
    const tooltip = 'Tooltip Text';
    render(<Tooltip text={tooltip} />);
    fireEvent.click(screen.getByRole('button', { name: /\?/ }));
    expect(screen.getByText(tooltip)).not.toBeNull();
});

test('Should hide dialog when clicking OK', () => {
    const tooltip = 'Tooltip Text';
    render(<Tooltip text={tooltip} />);
    fireEvent.click(screen.getByRole('button', { name: /\?/ }));
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(screen.queryByText(tooltip)).toBeNull();
});