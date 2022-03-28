import { fireEvent, render, screen } from '@testing-library/react'
import Menu from './Menu'

test('should render menu item', () => {
    const menuText = 'Menu Text'
    render(<Menu items={[{ text: menuText, onClick: () => {} }]} />);
    expect(screen.getByRole('button', { name: menuText })).not.toBeNull();
});

test('should trigger click handler', () => {
    const menuText = 'Menu Text';
    const clickHandler = jest.fn();
    render(<Menu items={[{ text: menuText, onClick: clickHandler }]} />);
    fireEvent.click(screen.getByRole('button', { name: menuText }));
    expect(clickHandler).toHaveBeenCalled();
});

test('should not render tooltip callout', () => {
    const menuText = 'Menu Text'
    render(<Menu items={[{ text: menuText, onClick: () => {} }]} />);
    expect(screen.queryByRole('button', { name: /\?/ })).toBeNull();
});

describe('with tooltip', () => {
    const menuText = 'Menu Text';
    const tooltipText = 'Tooltip Text';

    beforeEach(() => {
        render(<Menu items={[{ text: menuText, tooltip: tooltipText, onClick: () => {} }]} />);
    });

    test('should render tooltip callout', () => {
        expect(screen.getByRole('button', { name: /\?/ })).not.toBeNull();
    });

    test('should show tooltip when clicked', () => {
        fireEvent.click(screen.getByRole('button', { name: /\?/ }));
        expect(screen.getByText(tooltipText)).not.toBeNull();
    });
});