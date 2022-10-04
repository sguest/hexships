import { ReactNode, useState } from 'react';
import { createUseStyles } from 'react-jss'
import Dialog from '../Dialog';

export interface TooltipProps {
    children: ReactNode
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
                okButton={true}
                onClose={() => setDialogActive(false)}>
                {props.children}
            </Dialog>
        }
        <button className={classes.tooltip} onClick={() => setDialogActive(true)} type="button">(?)</button>
    </>
}