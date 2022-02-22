import * as React from 'react'
import { useEffect, useRef } from 'react';
import * as hexUtils from './hex-utils';
import GameSettings from './config/GameSettings';

export interface FieldProps {
    settings: GameSettings
}

export default function Field(props: FieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { settings } = props;
    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) {
            return;
        }
        const context = canvas.getContext('2d');
        if(!context) {
            return;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = 'blue';
        context.beginPath();
        const cells = hexUtils.getGridCells(settings.gridSize);
        for(let cell of cells) {
            const corners = hexUtils.getCorners(cell.x, cell.y, 20);
            context.moveTo(corners[5].x + 200, corners[5].y + 250);
            for(let corner of corners) {
                context.lineTo(corner.x + 200, corner.y + 250);
            }
        }
        context.stroke();

    }, [settings, canvasRef])
    return <canvas ref={canvasRef} width="500" height="500" />
}