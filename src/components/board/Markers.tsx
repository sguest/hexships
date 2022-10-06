import { useEffect, useRef } from 'react';
import * as hexUtils from '../../utils/hex-utils';
import { Point } from '../../utils/point-utils';
import * as pointUtils from '../../utils/point-utils';
import Marker, { MarkerType } from '../../game-state/Marker';
import useScaledCanvas from './useScaledCanvas';
import { createUseStyles } from 'react-jss';

export interface MarkersProps {
    markers: Marker[]
    uiScale: number
    gridDimensions: Point
    gridSize: number
}

const useStyles = createUseStyles({
    canvas: {
        position: 'absolute',
        zIndex: 4,
        pointerEvents: 'none',
        border: '5px solid transparent',
        boxSizing: 'border-box',
    },
})

export default function Markers(props: MarkersProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const classes = useStyles();

    useEffect(() => {
        useScaledCanvas(canvasRef, props.uiScale, context => {
            context.strokeStyle = 'black';
            for(const marker of props.markers) {
                context.fillStyle = marker.type === MarkerType.Hit ? 'red' : 'white';
                context.beginPath();
                const coords = pointUtils.add(hexUtils.getCenter(marker, props.gridSize), pointUtils.multiplyScalar(props.gridDimensions, 0.5));
                context.arc(coords.x, coords.y, hexUtils.getCellSize(props.gridSize) * 0.4, 0, Math.PI * 2);
                context.stroke();
                context.fill();
            }
        });
    }, [props.markers, canvasRef, props.uiScale, props.gridDimensions, props.gridSize])

    return <canvas ref={canvasRef} width={props.gridDimensions.x * props.uiScale} height={props.gridDimensions.y * props.uiScale} className={classes.canvas} data-testid="marker-canvas" />
}