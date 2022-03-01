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
    highlightTile?: Point
    highlightTileStyle?: string | CanvasPattern | CanvasGradient
    mouseHighlightStyle?: (tile: Point) => string | CanvasPattern | CanvasGradient | undefined
}

const useStyles = createUseStyles({
    '@keyframes boardGradient': {
        from: { backgroundPosition: '0% 50%' },
        to: { backgroundPosition: '100% 50%' },
    },
    board: {
        animationName: '$boardGradient',
        animationDuration: '20s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease',
        animationDirection: 'alternate',
        position: 'relative',
        width: '100%',
        maxWidth: 500,
        aspectRatio: 0.86,
        overflow: 'hidden',
        background: 'linear-gradient(80deg, #00545c 0%, #00405c 30%, #00545c 60%, #00405c 90%)',
        backgroundSize: '400% 400%',
        border: '5px solid #242f40',
    },
});

export default function Board(props: BoardProps) {
    const boardRef = useRef<HTMLDivElement>(null);
    const [uiScale, setUiScale] = useState(0);
    const classes = useStyles();
    useEffect(() => {
        const listener = () => {
            setUiScale((boardRef?.current?.clientWidth || 0) / 420);
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
        { (props.highlightTile || props.onSelectTile || props.mouseHighlightStyle) &&
            <Interaction gridSize={props.gridSize}
                onSelectTile={props.onSelectTile}
                highlightTile={props.highlightTile}
                highlightStyle={props.highlightTileStyle}
                mouseHighlightStyle={props.mouseHighlightStyle}
                uiScale={uiScale}
                gridDimensions={gridDimensions} /> }
        { props.ships && <Ships ships={props.ships} uiScale={uiScale} gridDimensions={gridDimensions} /> }
        { !!props.markers?.length && <Markers markers={props.markers} uiScale={uiScale} gridDimensions={gridDimensions}/> }
    </div>
}