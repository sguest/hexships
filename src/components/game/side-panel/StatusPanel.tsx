import { ReactNode } from 'react';
import { createUseStyles } from 'react-jss';
import { stencilFont, textColour } from '../../CommonStyles';

export interface SidePanelProps {
    statusMessage?: string
    children: ReactNode
    fireButtonVisible: boolean
    fireButtonEnabled: boolean
    shotsRemaining?: number
    onFireClick: () => void
}

const useStyles = createUseStyles({
    sidePanel: {
        position: 'relative',
        padding: {
            top: 10,
            left: 10,
            right: 10,
            bottom: 60,
        },
        boxSizing: 'border-box',
        minHeight: 90,
        width: '100%',
        maxWidth: 200,
        gridArea: 'panel',
        '@media (max-width: 640px)': {
            padding: 0,
        },
        display: 'grid',
        gridTemplateColumns: '100%',
        gridTemplateRows: 'repeat(7, 1fr)',
    },
    info: {
        fontFamily: stencilFont,
        color: textColour,
        fontSize: '2rem',
        margin: 0,
        '@media (max-width: 640px)': {
            fontSize: '1rem',
        },
    },
    fire: {
        border: '2px solid #ccc',
        cursor: 'pointer',
        color: 'white',
        fontSize: '1.5rem',
        textShadow: '1px 1px 0 black',
        background: 'radial-gradient(#ff8000, #ff0000)',
        textTransform: 'uppercase',
        '&:hover': {
            background: 'radial-gradient(#ffa447, #ff4747)',
        },
        '&:disabled': {
            color: '#aaa',
            background: '#777',
            cursor: 'default',
        },
    },
    shotsRemaining: {
        color: textColour,
        fontFamily: 'sans-serif',
        fontSize: '1.2rem',
        '@media (max-width: 640px)': {
            fontSize: '0.6rem',
        },
    },
});

export default function SidePanel(props: SidePanelProps) {
    const classes = useStyles();

    return <div className={classes.sidePanel}>
        {props.statusMessage && <p className={classes.info}>{props.statusMessage}</p>}
        {props.children}
        { props.fireButtonVisible && <>
            <button className={classes.fire} onClick={props.onFireClick} disabled={!props.fireButtonEnabled}>Fire</button>
            { !!props.shotsRemaining && <p className={classes.shotsRemaining}>{props.shotsRemaining} shot{props.shotsRemaining === 1 ? '' : 's'} remaining</p> }
        </>}
    </div>;
}