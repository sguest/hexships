import { useEffect, useRef } from 'react';
import UiSettings from '../../config/UiSettings';
import * as hexUtils from '../../hex-utils';
import * as pointUtils from '../../point-utils';

export interface FieldProps {
    gridSize: number
    uiSettings: UiSettings
}

export default function Field(props: FieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
        const cells = hexUtils.getGridCells(props.gridSize);
        for(let cell of cells) {
            const corners = hexUtils.getCorners(cell.x, cell.y, props.uiSettings.cellSize);
            pointUtils.moveTo(context, pointUtils.add(corners[5], props.uiSettings.gridOffset));
            for(let corner of corners) {
                pointUtils.lineTo(context, pointUtils.add(corner, props.uiSettings.gridOffset));
            }
        }
        context.stroke();

    }, [props.gridSize, props.uiSettings, canvasRef])

    return <canvas ref={canvasRef} width="500" height="500" className="field-canvas"/>
}