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
    mines: Point[]
    uiScale: number
    gridDimensions: Point
}

const useStyles = createUseStyles({
    canvas: {
        position: 'absolute',
        zIndex: 3,
        pointerEvents: 'none',
        border: '5px solid transparent',
        boxSizing: 'border-box',
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
            if(props.mines?.length) {
                context.strokeStyle = 'black';
                context.fillStyle = 'black';
                context.lineWidth = 1;
                context.lineCap = 'butt';
                context.beginPath();
                const numPoints = 16;
                const interval = Math.PI * 2 / numPoints;
                for(const mine of props.mines) {
                    const center = hexUtils.getCenter(mine);
                    const points = [];
                    for(let point = 0; point < numPoints; point++) {
                        const angle = point * interval;
                        const size = hexUtils.cellSize * ((point % 2) ? 0.3 : 0.8);
                        points.push(pointUtils.add(center, { x: Math.cos(angle) * size, y: Math.sin(angle) * size }, pointUtils.multiplyScalar(props.gridDimensions, 0.5)));
                    }

                    pointUtils.moveTo(context, points[numPoints - 1]);
                    for(const point of points) {
                        pointUtils.lineTo(context, point);
                    }
                }
                context.fill();
            }
        });
    }, [props.ships, props.mines, canvasRef, props.uiScale, props.gridDimensions])

    return <canvas ref={canvasRef} width={props.gridDimensions.x * props.uiScale} height={props.gridDimensions.y * props.uiScale} className={classes.canvas} data-testid="ships-canvas" />
}