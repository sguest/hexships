import React, { useEffect, useRef, useState } from 'react';
import { Point } from '../../utils/point-utils';
import * as hexUtils from '../../utils/hex-utils';
import * as pointUtils from '../../utils/point-utils';
import useScaledCanvas from './useScaledCanvas';
import { createUseStyles } from 'react-jss';

export interface InteractionProps {
    highlightTile?: Point
    highlightStyle?: string | CanvasGradient | CanvasPattern
    mouseHighlightStyle?: string | CanvasGradient | CanvasPattern
    gridSize: number
    uiScale: number
    gridDimensions: Point
    onSelectTile?: (tile: Point) => void
}

const useStyles = createUseStyles({
    canvas: {
        position: 'absolute',
        zIndex: 2,
    },
})

export default function Interaction(props: InteractionProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoverTile, setHoverTile] = useState<Point | null>(null);
    const classes = useStyles();

    useEffect(() => {
        useScaledCanvas(canvasRef, props.uiScale, context => {
            const fillTile = (tile: Point, style: string | CanvasGradient | CanvasPattern) => {
                const corners = hexUtils.getCorners(tile);
                context.fillStyle = style;
                context.beginPath();
                pointUtils.moveTo(context, pointUtils.add(corners[5], pointUtils.multiplyScalar(props.gridDimensions, 0.5)));
                for(const corner of corners) {
                    pointUtils.lineTo(context, pointUtils.add(corner, pointUtils.multiplyScalar(props.gridDimensions, 0.5)));
                }
                context.fill();
            }

            if(hoverTile && props.mouseHighlightStyle) {
                fillTile(hoverTile, props.mouseHighlightStyle);
            }

            if(props.highlightTile && props.highlightStyle) {
                fillTile(props.highlightTile, props.highlightStyle);
            }
        });
    }, [canvasRef, props.highlightTile, props.highlightStyle, props.mouseHighlightStyle, hoverTile, props.uiScale, props.gridDimensions])

    const getMouseTile = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const relativeClick = pointUtils.add(
            pointUtils.multiplyScalar({ x: e.clientX, y: e.clientY }, 1 / props.uiScale),
            pointUtils.multiplyScalar(props.gridDimensions, -0.5),
            pointUtils.multiplyScalar(rect, -1 / props.uiScale),
        );
        return hexUtils.getCellFromCoords(relativeClick);
    }

    const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const clickedTile = getMouseTile(e);
        if(hexUtils.isInGrid(clickedTile, props.gridSize)) {
            props.onSelectTile && props.onSelectTile(clickedTile);
        }
    }

    const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const tile = getMouseTile(e);
        setHoverTile(hexUtils.isInGrid(tile, props.gridSize) ? tile : null);
    }

    return <canvas ref={canvasRef} width={props.gridDimensions.x * props.uiScale} height={props.gridDimensions.y * props.uiScale} className={classes.canvas} onClick={onClick} onMouseMove={onMove} />
}