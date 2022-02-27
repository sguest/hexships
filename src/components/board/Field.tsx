import { useEffect, useRef } from 'react';
import * as hexUtils from '../../utils/hex-utils';
import { Point } from '../../utils/point-utils';
import * as pointUtils from '../../utils/point-utils';

export interface FieldProps {
    gridSize: number
    uiScale: number
    gridDimensions: Point
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
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.scale(props.uiScale, props.uiScale);
        context.strokeStyle = 'blue';
        context.beginPath();
        const cells = hexUtils.getGridCells(props.gridSize);
        for(const cell of cells) {
            const corners = hexUtils.getCorners(cell);
            pointUtils.moveTo(context, pointUtils.add(corners[5], pointUtils.multiplyScalar(props.gridDimensions, 0.5)));
            for(const corner of corners) {
                pointUtils.lineTo(context, pointUtils.add(corner, pointUtils.multiplyScalar(props.gridDimensions, 0.5)));
            }
        }
        context.stroke();
    }, [props.gridSize, canvasRef, props.uiScale, props.gridDimensions])

    return <canvas ref={canvasRef} width={props.gridDimensions.x * props.uiScale} height={props.gridDimensions.y * props.uiScale} className="field-canvas"/>
}