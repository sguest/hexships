import React from 'react';

export default function useScaledCanvas(canvasRef: React.RefObject<HTMLCanvasElement>, uiScale: number, callback: (context: CanvasRenderingContext2D) => void) {
    const canvas = canvasRef.current;
    if(!canvas) {
        return;
    }
    const context = canvas.getContext('2d');
    if(!context) {
        return;
    }
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.scale(uiScale, uiScale);
    callback(context);
}