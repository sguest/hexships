import { useEffect, useRef } from 'react';
import UiSettings from '../../config/UiSettings';
import * as hexUtils from '../../utils/hex-utils';
import * as pointUtils from '../../utils/point-utils';
import Marker, { MarkerType } from '../../game-state/Marker';

export interface MarkersProps {
    markers: Marker[]
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
        context.strokeStyle = 'black';
        for(const marker of props.markers) {
            context.fillStyle = marker.type === MarkerType.Hit ? 'red' : 'white';
            context.beginPath();
            const coords = pointUtils.add(hexUtils.getCenter(marker, props.uiSettings.cellSize), props.uiSettings.gridOffset);
            context.arc(coords.x, coords.y, props.uiSettings.cellSize * 0.4, 0, Math.PI * 2);
            context.stroke();
            context.fill();
        }
    }, [props.markers, props.uiSettings, canvasRef])

    return <canvas ref={canvasRef} width="500" height="500" className="markers-canvas" />
}