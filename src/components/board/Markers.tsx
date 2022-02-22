import { useEffect, useRef } from "react";
import UiSettings from "../../config/UiSettings";
import { Point } from "../../point-utils";
import * as hexUtils from '../../hex-utils';
import * as pointUtils from '../../point-utils';

export interface MarkersProps {
    hits: Point[]
    misses: Point[]
    uiSettings: UiSettings
}

export default function Markers(props: MarkersProps) {
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

        const drawMarkers = (markers: Point[], colour: string) => {
            context.strokeStyle = 'black';
            context.fillStyle = colour;
            for(let marker of markers) {
                context.beginPath();
                const coords = pointUtils.add(hexUtils.getCenter(marker.x, marker.y, props.uiSettings.cellSize), props.uiSettings.gridOffset);
                context.arc(coords.x, coords.y, props.uiSettings.cellSize * 0.4 , 0, Math.PI * 2);
                context.stroke();
                context.fill();
            }
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        drawMarkers(props.hits, 'red');
        drawMarkers(props.misses, 'white');

    }, [props.hits, props.misses, props.uiSettings, canvasRef])

    return <canvas ref={canvasRef} width="500" height="500" className="markers-canvas"/>
}