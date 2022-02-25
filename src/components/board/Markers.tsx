import { useEffect, useRef } from 'react';
import UiSettings from '../../config/UiSettings';
import { Point } from '../../utils/point-utils';
import * as hexUtils from '../../utils/hex-utils';
import * as pointUtils from '../../utils/point-utils';

export interface MarkersProps {
    hits?: Point[]
    misses?: Point[]
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

        context.clearRect(0, 0, canvas.width, canvas.height);

        const drawMarkers = (markers: Point[] | undefined, colour: string) => {
            if(markers) {
                context.strokeStyle = 'black';
                context.fillStyle = colour;
                for(const marker of markers) {
                    context.beginPath();
                    const coords = pointUtils.add(hexUtils.getCenter(marker, props.uiSettings.cellSize), props.uiSettings.gridOffset);
                    context.arc(coords.x, coords.y, props.uiSettings.cellSize * 0.4, 0, Math.PI * 2);
                    context.stroke();
                    context.fill();
                }
            }
        }

        drawMarkers(props.hits, 'red');
        drawMarkers(props.misses, 'white');
    }, [props.hits, props.misses, props.uiSettings, canvasRef])

    return <canvas ref={canvasRef} width="500" height="500" className="markers-canvas" />
}