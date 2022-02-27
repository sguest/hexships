import Field from './Field';
import Ships from './Ships';
import Markers from './Markers';
import Ship from '../../game-state/Ship';
import UiSettings from '../../config/UiSettings';
import { Point } from '../../utils/point-utils';
import Interaction from './Interaction';
import Marker from '../../game-state/Marker';

export type BoardProps = {
    uiSettings: UiSettings,
    gridSize: number,
    ships?: Ship[],
    markers?: Marker[],
    onSelectTile?: (tile: Point) => void
    highlightTile?: Point
    highlightTileStyle?: string | CanvasPattern | CanvasGradient
    mouseHighlightStyle?: string | CanvasPattern | CanvasGradient
}

export default function Board(props: BoardProps) {
    return <div className="board">
        <Field gridSize={props.gridSize}
            uiSettings={props.uiSettings} />
        { (props.highlightTile || props.onSelectTile || props.mouseHighlightStyle) &&
            <Interaction gridSize={props.gridSize}
                uiSettings={props.uiSettings}
                onSelectTile={props.onSelectTile}
                highlightTile={props.highlightTile}
                highlightStyle={props.highlightTileStyle}
                mouseHighlightStyle={props.mouseHighlightStyle} /> }
        { props.ships && <Ships ships={props.ships} uiSettings={props.uiSettings} /> }
        { !!props.markers?.length && <Markers markers={props.markers} uiSettings={props.uiSettings} /> }
    </div>
}