import Field, { FieldProps } from './Field';
import Ships, { ShipsProps } from './Ships';
import Markers, { MarkersProps } from './Markers';

export type BoardProps = FieldProps & ShipsProps & MarkersProps;

export default function Board(props: BoardProps) {
    return <div className="board">
        <Field {...props} />
        <Ships {...props} />
        <Markers {...props} />
    </div>
}