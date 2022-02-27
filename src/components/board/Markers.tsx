import { useEffect, useRef } from 'react';
import * as hexUtils from '../../utils/hex-utils';
import { Point } from '../../utils/point-utils';
import * as pointUtils from '../../utils/point-utils';
import Marker, { MarkerType } from '../../game-state/Marker';

export interface MarkersProps {
    markers: Marker[]
    uiScale: number
    gridDimensions: Point
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

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.scale(props.uiScale, props.uiScale);
        context.strokeStyle = 'black';
        for(const marker of props.markers) {
            context.fillStyle = marker.type === MarkerType.Hit ? 'red' : 'white';
            context.beginPath();
            const coords = pointUtils.add(hexUtils.getCenter(marker), pointUtils.multiplyScalar(props.gridDimensions, 0.5));
            context.arc(coords.x, coords.y, hexUtils.cellSize * 0.4, 0, Math.PI * 2);
            context.stroke();
            context.fill();
        }
    }, [props.markers, canvasRef, props.uiScale, props.gridDimensions])

    return <canvas ref={canvasRef} width={props.gridDimensions.x * props.uiScale} height={props.gridDimensions.y * props.uiScale} className="markers-canvas" />
}