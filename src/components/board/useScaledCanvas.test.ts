import 'jest-canvas-mock';
import useScaledCanvas from './useScaledCanvas';

test('should apply correct actions', () => {
    const canvas = document.createElement('canvas');
    const uiScale = 0.4;
    useScaledCanvas({ current: canvas }, uiScale, () => {});
    const events = canvas.getContext('2d')?.__getEvents();
    expect(events).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'setTransform', transform: [1, 0, 0, 1, 0, 0] })]));
    expect(events).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'clearRect', props: { x: 0, y: 0, width: canvas.width, height: canvas.height } })]));
    expect(events).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'scale', props: { x: uiScale, y: uiScale } })]));
});

test('should call callback', () => {
    const canvas = document.createElement('canvas');
    const callback = jest.fn();
    useScaledCanvas({ current: canvas }, 0.5, callback);
    expect(callback).toBeCalledWith(canvas.getContext('2d'));
});

test('should exit silently if canvas ref not populated', () => {
    const callback = jest.fn();
    useScaledCanvas({ current: null }, 0.5, callback);
    expect(callback).not.toBeCalled();
});