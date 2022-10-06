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
    '@keyframes boardGradient': {
        from: { backgroundPosition: '0% 50%' },
        to: { backgroundPosition: '100% 50%' },
    },
    canvas: {
        animationName: '$boardGradient',
        animationDuration: '20s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease',
        animationDirection: 'alternate',
        position: 'absolute',
        zIndex: 1,
        pointerEvents: 'none',
        background: 'linear-gradient(80deg, #00545c 0%, #00405c 30%, #00545c 60%, #00405c 90%)',
        backgroundSize: '400% 400%',
        border: '5px solid #242f40',
        boxSizing: 'border-box',
    },
})

export default function Field(props: FieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const classes = useStyles();

    useEffect(() => {
        useScaledCanvas(canvasRef, props.uiScale, context => {
            context.strokeStyle = 'black';
            context.beginPath();
            const cells = hexUtils.getGridCells(props.gridSize);
            for(const cell of cells) {
                const corners = hexUtils.getCorners(cell, props.gridSize);
                pointUtils.moveTo(context, pointUtils.add(corners[5], pointUtils.multiplyScalar(props.gridDimensions, 0.5)));
                for(const corner of corners) {
                    pointUtils.lineTo(context, pointUtils.add(corner, pointUtils.multiplyScalar(props.gridDimensions, 0.5)));
                }
            }
            context.stroke();
        });
    }, [props.gridSize, canvasRef, props.uiScale, props.gridDimensions])

    return <canvas ref={canvasRef} width={props.gridDimensions.x * props.uiScale} height={props.gridDimensions.y * props.uiScale} className={classes.canvas} data-testid="field-canvas" />
}