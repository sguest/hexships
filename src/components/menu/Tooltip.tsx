import { useState } from 'react';
import { createUseStyles } from 'react-jss'
import Dialog from '../Dialog';

export interface TooltipProps {
    text: string
}

const useStyles = createUseStyles({
    tooltip: {
        fontSize: '1.5rem',
        cursor: 'pointer',
        marginLeft: '20px',
        color: '#cfc',
        border: 'none',
        background: 'transparent',
    },
})

export default function Tooltip(props: TooltipProps) {
    const classes = useStyles();
    const [dialogActive, setDialogActive] = useState(false);

    return <>
        {dialogActive &&
            <Dialog
                text={props.text}
                okButton={true}
                onClose={() => setDialogActive(false)} />
        }
        <button className={classes.tooltip} onClick={() => setDialogActive(true)} type="button">(?)</button>
    </>
}