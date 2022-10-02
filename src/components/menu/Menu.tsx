import { createUseStyles } from 'react-jss';
import { stencilFont, textColour } from '../CommonStyles';
import Tooltip from './Tooltip';

export interface MenuItem {
    text: string
    condition?: boolean
    onClick: () => void
    tooltip?: string
}

export interface MenuProps {
    items: MenuItem[]
}

const useStyles = createUseStyles({
    menu: {
        margin: 0,
        padding: {
            left: 20,
        },
        listStyleType: 'none',
    },
    menuButton: {
        background: 'transparent',
        border: 'none',
        fontFamily: stencilFont,
        color: textColour,
        fontSize: '1.5rem',
        cursor: 'pointer',
        '&:hover': {
            color: '#fff',
        },
    },
});

export default function Menu(props: MenuProps) {
    const classes = useStyles();

    return <ul className={classes.menu}>
        {props.items.filter(i => i.condition === undefined || i.condition).map(i => <li key={i.text}>
            <button className={classes.menuButton} onClick={i.onClick}>{i.text}</button>
            {i.tooltip && <Tooltip text={i.tooltip} />}
        </li>)}
    </ul>
}