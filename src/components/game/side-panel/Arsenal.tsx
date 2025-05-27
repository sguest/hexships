import { createUseStyles } from 'react-jss';
import { standardButton } from '../../CommonStyles';

export interface ArsenalProps {
    onCloseClick: () => void
}

const useStyles = createUseStyles({
    close: {
        ...standardButton,
        maxHeight: '3rem',
        margin: {
            top: 10,
        },
    },
});

export default function Arsenal(props: ArsenalProps) {
    const classes = useStyles();

    return <>
        <button className={classes.close} onClick={props.onCloseClick}>Close</button>
    </>;
}