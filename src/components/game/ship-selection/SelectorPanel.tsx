import { createUseStyles } from 'react-jss'

export interface ShipSelectorProps {
    ships: Array<{name: string, id: number}>
    selectedId?: number
    placementValid: boolean
    canRotate: boolean
    onSelected: (id: number) => void
    onRotated: () => void
    onPlace: () => void
}

const useStyles = createUseStyles({
    panel: {
        display: 'inline-block',
        margin: 0,
    },
    selectedButton: {
        color: 'white',
        backgroundColor: 'black',
    },
})

export default function SelectorPanel(props: ShipSelectorProps) {
    const classes = useStyles();

    return <>
        <ul className={classes.panel}>
            {props.ships.map(s => {
                return <li key={s.id}>
                    <button onClick={() => props.onSelected(s.id)} className={s.id === props.selectedId ? classes.selectedButton : ''}>{s.name}</button>
                </li>
            })}
        </ul>
        <button onClick={props.onRotated} disabled={!props.canRotate}>Rotate</button>
        <button onClick={props.onPlace} disabled={!props.placementValid}>Place</button>
    </>
}