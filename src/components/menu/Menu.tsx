import { useState } from 'react';
import { createUseStyles } from 'react-jss';
import Dialog from '../Dialog';

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
        fontFamily: ['Big Shoulders Stencil Text', 'sans-serif'],
        color: '#ccc',
        fontSize: '1.5rem',
        cursor: 'pointer',
        '&:hover': {
            color: '#fff',
        },
    },
    tooltip: {
        fontSize: '1.5rem',
        cursor: 'pointer',
        marginLeft: '20px',
        color: '#cfc',
        border: 'none',
        background: 'transparent',
    },
});

export default function Menu(props: MenuProps) {
    const classes = useStyles();
    const [tooltipText, setTooltipText] = useState<string | undefined>(undefined);

    return <>
        {tooltipText &&
            <Dialog
                text={tooltipText}
                okButton={true}
                onClose={() => setTooltipText(undefined)} />
        }
        <ul className={classes.menu}>
            {props.items.filter(i => i.condition === undefined || i.condition).map(i => <li key={i.text}>
                <button className={classes.menuButton} onClick={i.onClick}>{i.text}</button>
                {i.tooltip && <button className={classes.tooltip} onClick={() => setTooltipText(i.tooltip)}>(?)</button>}
            </li>)}
        </ul>
    </>
}