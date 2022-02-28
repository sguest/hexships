import { useEffect, useRef } from 'react';
import * as hexUtils from '../../utils/hex-utils';
import { Point } from '../../utils/point-utils';
import * as pointUtils from '../../utils/point-utils';
import useScaledCanvas from './useScaledCanvas';
import { createUseStyles } from 'react-jss';

export interface FieldProps {
    gridSize: number
    uiScale: number
    gridDimensions: Point
}

const useStyles = createUseStyles({
    canvas: {
        position: 'absolute',
        zIndex: 1,
        pointerEvents: 'none',
    },
})

export default function Field(props: FieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const classes = useStyles();

    useEffect(() => {
        useScaledCanvas(canvasRef, props.uiScale, context => {
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
        });
    }, [props.gridSize, canvasRef, props.uiScale, props.gridDimensions])

    return <canvas ref={canvasRef} width={props.gridDimensions.x * props.uiScale} height={props.gridDimensions.y * props.uiScale} className={classes.canvas} />
}