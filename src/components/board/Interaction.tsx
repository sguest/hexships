import React, { useEffect, useRef } from 'react';
import UiSettings from '../../config/UiSettings';
import { Point } from '../../utils/point-utils';
import * as hexUtils from '../../utils/hex-utils';
import * as pointUtils from '../../utils/point-utils';

export interface InteractionProps {
    highlightTile?: Point
    highlightStyle?: string | CanvasGradient | CanvasPattern
    uiSettings: UiSettings
    gridSize: number
    onSelectTile?: (tile: Point) => void
}

export default function Interaction(props: InteractionProps) {
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

        if(props.highlightTile && props.highlightStyle) {
            const corners = hexUtils.getCorners(props.highlightTile, props.uiSettings.cellSize);
            context.fillStyle = props.highlightStyle;
            context.beginPath();
            pointUtils.moveTo(context, pointUtils.add(corners[5], props.uiSettings.gridOffset));
            for(const corner of corners) {
                pointUtils.lineTo(context, pointUtils.add(corner, props.uiSettings.gridOffset));
            }
            context.fill();
        }
    }, [props.uiSettings, canvasRef, props.highlightTile, props.highlightStyle])

    const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const relativeClick = pointUtils.add(
            { x: e.clientX, y: e.clientY },
            pointUtils.multiplyScalar(props.uiSettings.gridOffset, -1),
            pointUtils.multiplyScalar(rect, -1),
        );
        const clickedTile = hexUtils.getCellFromCoords(relativeClick, props.uiSettings.cellSize);
        if(hexUtils.isInGrid(clickedTile, props.gridSize)) {
            props.onSelectTile && props.onSelectTile(clickedTile);
        }
    }

    return <canvas ref={canvasRef} width="500" height="500" className="interaction-canvas" onClick={onClick} />
}