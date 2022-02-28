import { useEffect, useRef } from 'react';
import Ship from '../../game-state/Ship';
import { getDelta } from '../../game-state/Direction';
import * as hexUtils from '../../utils/hex-utils';
import { Point } from '../../utils/point-utils';
import * as pointUtils from '../../utils/point-utils';
import useScaledCanvas from './useScaledCanvas';
import { createUseStyles } from 'react-jss';

export interface ShipsProps {
    ships: Ship[]
    uiScale: number
    gridDimensions: Point
}

const useStyles = createUseStyles({
    canvas: {
        position: 'absolute',
        zIndex: 3,
        pointerEvents: 'none',
    },
})

export default function Ships(props: ShipsProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const classes = useStyles();

    useEffect(() => {
        useScaledCanvas(canvasRef, props.uiScale, context => {
            context.strokeStyle = 'grey';
            context.lineWidth = hexUtils.cellSize;
            context.lineCap = 'round';
            context.beginPath();
            for(const ship of props.ships) {
                const start = hexUtils.getCenter(ship);
                const delta = getDelta(ship.facing);
                const endCoords = pointUtils.add(ship, pointUtils.multiplyScalar(delta, ship.size - 1));
                const end = hexUtils.getCenter(endCoords);
                pointUtils.moveTo(context, pointUtils.add(start, pointUtils.multiplyScalar(props.gridDimensions, 0.5)));
                pointUtils.lineTo(context, pointUtils.add(end, pointUtils.multiplyScalar(props.gridDimensions, 0.5)));
            }
            context.stroke();
        });
    }, [props.ships, canvasRef, props.uiScale, props.gridDimensions])

    return <canvas ref={canvasRef} width={props.gridDimensions.x * props.uiScale} height={props.gridDimensions.y * props.uiScale} className={classes.canvas}/>
}