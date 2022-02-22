import Field, { FieldProps } from "./Field";
import Ships, { ShipsProps } from "./Ships";

export type BoardProps = FieldProps & ShipsProps;

export default function Board(props: BoardProps) {
    return <div className="board">
        <Field {...props} />
        <Ships {...props} />
    </div>
}