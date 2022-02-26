export interface ShipSelectorProps {
    ships: Array<{name: string, id: number}>
    selectedId?: number
    placementValid: boolean
    canRotate: boolean
    onSelected: (id: number) => void
    onRotated: () => void
    onPlace: () => void
}

export default function SelectorPanel(props: ShipSelectorProps) {
    return <>
        <ul className="ship-selector">
            {props.ships.map(s => {
                return <li key={s.id} className={s.id === props.selectedId ? 'selected' : ''}>
                    <button onClick={() => props.onSelected(s.id)}>{s.name}</button>
                </li>
            })}
        </ul>
        <button onClick={props.onRotated} disabled={!props.canRotate}>Rotate</button>
        <button onClick={props.onPlace} disabled={!props.placementValid}>Place</button>
    </>
}