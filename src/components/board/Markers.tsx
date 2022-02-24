import { useEffect, useRef, useState } from "react";
import UiSettings from "../../config/UiSettings";
import { Point } from "../../utils/point-utils";
import * as hexUtils from '../../utils/hex-utils';
import * as pointUtils from '../../utils/point-utils';

export interface MarkersProps {
    hits: Point[]
    misses: Point[]
    uiSettings: UiSettings
}

export default function Markers(props: MarkersProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ selectedCell, setSelectedCell ] = useState<Point | null>(null);

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

        if(selectedCell) {
            const corners = hexUtils.getCorners(selectedCell, props.uiSettings.cellSize);
            context.fillStyle = 'green';
            context.beginPath();
            pointUtils.moveTo(context, pointUtils.add(corners[5], props.uiSettings.gridOffset));
            for(let corner of corners) {
                pointUtils.lineTo(context, pointUtils.add(corner, props.uiSettings.gridOffset));
            }
            context.fill();
        }

        const drawMarkers = (markers: Point[], colour: string) => {
            context.strokeStyle = 'black';
            context.fillStyle = colour;
            for(let marker of markers) {
                context.beginPath();
                const coords = pointUtils.add(hexUtils.getCenter(marker, props.uiSettings.cellSize), props.uiSettings.gridOffset);
                context.arc(coords.x, coords.y, props.uiSettings.cellSize * 0.4 , 0, Math.PI * 2);
                context.stroke();
                context.fill();
            }
        }

        drawMarkers(props.hits, 'red');
        drawMarkers(props.misses, 'white');
    }, [props.hits, props.misses, props.uiSettings, canvasRef, selectedCell])

    const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const relativeClick = pointUtils.add(
            { x: e.clientX, y: e.clientY},
            pointUtils.multiplyScalar(props.uiSettings.gridOffset, -1),
            pointUtils.multiplyScalar(rect, -1),
        );
        setSelectedCell(hexUtils.getCellFromCoords(relativeClick, props.uiSettings.cellSize));
    }

    return <canvas ref={canvasRef} width="500" height="500" className="markers-canvas" onMouseMove={onMove} />
}