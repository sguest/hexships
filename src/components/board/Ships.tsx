import { useEffect, useRef } from "react";
import Ship from "../../game-state/Ship";
import { getDelta } from '../../game-state/Direction';
import * as hexUtils from '../../hex-utils';
import * as pointUtils from '../../point-utils';
import UiSettings from "../../config/UiSettings";

export interface ShipsProps {
    ships: Ship[]
    uiSettings: UiSettings
}

export default function Ships(props: ShipsProps) {
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
        context.strokeStyle = 'grey';
        context.lineWidth = props.uiSettings.cellSize;
        context.lineCap = 'round';
        context.beginPath();
        for(let ship of props.ships) {
            const start = hexUtils.getCenter(ship, props.uiSettings.cellSize);
            const delta = getDelta(ship.facing);
            const endCoords = pointUtils.add(ship, pointUtils.multiplyScalar(delta, ship.size - 1));
            const end = hexUtils.getCenter(endCoords, props.uiSettings.cellSize);
            pointUtils.moveTo(context, pointUtils.add(start, props.uiSettings.gridOffset));
            pointUtils.lineTo(context, pointUtils.add(end, props.uiSettings.gridOffset));
        }
        context.stroke();

    }, [props.ships, props.uiSettings, canvasRef])

    return <canvas ref={canvasRef} width="500" height="500" className="ships-canvas"/>
}