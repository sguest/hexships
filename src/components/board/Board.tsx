import Field from './Field';
import Ships from './Ships';
import Markers from './Markers';
import Ship from '../../game-state/Ship';
import UiSettings from '../../config/UiSettings';
import { Point } from '../../utils/point-utils';
import Interaction from './Interaction';

export type BoardProps = {
    uiSettings: UiSettings,
    gridSize: number,
    ships?: Ship[],
    hits?: Point[],
    misses?: Point[],
    onSelectTile?: (tile: Point) => void
    highlightTile?: Point
    highlightTileStyle?: string | CanvasPattern | CanvasGradient
}

export default function Board(props: BoardProps) {
    return <div className="board">
        <Field gridSize={props.gridSize}
            uiSettings={props.uiSettings} />
        { (props.highlightTile || props.onSelectTile) &&
            <Interaction gridSize={props.gridSize}
                uiSettings={props.uiSettings}
                onSelectTile={props.onSelectTile}
                highlightTile={props.highlightTile}
                highlightStyle={props.highlightTileStyle} /> }
        { props.ships && <Ships ships={props.ships} uiSettings={props.uiSettings} /> }
        { (props.hits?.length || props.misses?.length) ? <Markers hits={props.hits} misses={props.misses} uiSettings={props.uiSettings} /> : <></>}
    </div>
}