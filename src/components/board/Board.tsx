import Field from './Field';
import Ships from './Ships';
import Markers from './Markers';
import Ship from '../../game-state/Ship';
import { Point } from '../../utils/point-utils';
import * as hexUtils from '../../utils/hex-utils';
import Interaction from './Interaction';
import Marker from '../../game-state/Marker';
import { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';

export type BoardProps = {
    gridSize: number,
    ships?: Ship[],
    markers?: Marker[],
    onSelectTile?: (tile: Point) => void
    highlightTiles?: Array<{x: number, y: number, style: string | CanvasGradient | CanvasPattern}>
    mouseHighlightStyle?: (tile: Point) => string | CanvasPattern | CanvasGradient | undefined
    gridArea?: string
}

const useStyles = createUseStyles({
    board: {
        position: 'relative',
        width: '100%',
        maxHeight: '100%',
        aspectRatio: 0.86,
        overflow: 'hidden',
        '@media (max-width: 640px)': {
            maxWidth: '100%',
            height: '100%',
        },
        gridArea: (props: BoardProps) => props.gridArea,
    },
});

export default function Board(props: BoardProps) {
    const boardRef = useRef<HTMLDivElement>(null);
    const [uiScale, setUiScale] = useState(0);
    const classes = useStyles(props);
    useEffect(() => {
        const listener = () => {
            setUiScale(Math.min((boardRef?.current?.clientWidth || 0) / 420, (boardRef?.current?.clientHeight || 0) / 500));
        };

        window.addEventListener('resize', listener);

        listener();

        return () => {
            window.removeEventListener('resize', listener);
        }
    }, [boardRef]);

    const gridDimensions = hexUtils.getGridDimensions(props.gridSize);

    return <div className={classes.board} ref={boardRef}>
        <Field gridSize={props.gridSize}
            uiScale={uiScale}
            gridDimensions={gridDimensions} />
        { (!!props.highlightTiles?.length || props.onSelectTile || props.mouseHighlightStyle) &&
            <Interaction gridSize={props.gridSize}
                onSelectTile={props.onSelectTile}
                highlightTiles={props.highlightTiles}
                mouseHighlightStyle={props.mouseHighlightStyle}
                uiScale={uiScale}
                gridDimensions={gridDimensions} /> }
        { props.ships && <Ships ships={props.ships} uiScale={uiScale} gridDimensions={gridDimensions} /> }
        { !!props.markers?.length && <Markers markers={props.markers} uiScale={uiScale} gridDimensions={gridDimensions}/> }
    </div>
}