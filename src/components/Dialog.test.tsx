import { fireEvent, render, screen } from '@testing-library/react';
import Dialog from './Dialog';

test('should display dialog text', () => {
    const dialogText = 'Dialog Text';
    render(<Dialog text={dialogText} onClose={() => {}} />);
    expect(screen.getByText(dialogText)).not.toBeNull();
});

test('should not render buttons if not specified', () => {
    render(<Dialog text="Text" onClose={() => {}} />);
    expect(screen.queryByRole('button', { name: 'OK' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
});

test('should render OK button when specified', () => {
    render(<Dialog text="Text" okButton={true} onClose={() => {}} />);
    expect(screen.getByRole('button', { name: 'OK' })).not.toBeNull();
});

test('should call OK handler on click', () => {
    const handler = jest.fn();
    render(<Dialog text="Text" okButton={true} onOk={handler} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(handler).toHaveBeenCalled();
});

test('should call close handler on OK', () => {
    const handler = jest.fn();
    render(<Dialog text="Text" okButton={true} onClose={handler} />);
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(handler).toHaveBeenCalled();
});

test('should render Cancel button when specified', () => {
    render(<Dialog text="Text" cancelButton={true} onClose={() => {}} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).not.toBeNull();
});

test('should call close handler on Cancel', () => {
    const handler = jest.fn();
    render(<Dialog text="Text" cancelButton={true} onClose={handler} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handler).toHaveBeenCalled();
});
