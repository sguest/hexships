import { fireEvent, render, screen } from '@testing-library/react';
import Dialog from './Dialog';

test('should display dialog text', () => {
    const dialogText = 'Dialog Text';
    render(<Dialog text={dialogText} />);
    expect(screen.getByText(dialogText)).not.toBeNull();
});

test('should not render buttons if no handlers provided', () => {
    render(<Dialog text="Text" />);
    expect(screen.queryByRole('button', { name: 'OK' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
});

test('should render OK button when handler provided', () => {
    render(<Dialog text="Text" onOk={() => {}} />);
    expect(screen.getByRole('button', { name: 'OK' })).not.toBeNull();
});

test('should call OK handler on click', () => {
    const handler = jest.fn();
    render(<Dialog text="Text" onOk={handler} />);
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(handler).toHaveBeenCalled();
});

test('should render Cancel button when handler provided', () => {
    render(<Dialog text="Text" onCancel={() => {}} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).not.toBeNull();
});

test('should call Cancel handler on click', () => {
    const handler = jest.fn();
    render(<Dialog text="Text" onCancel={handler} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handler).toHaveBeenCalled();
});
