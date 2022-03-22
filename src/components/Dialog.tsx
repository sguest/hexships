import { createUseStyles } from 'react-jss';

export interface DialogProps {
    text: string,
    onOk?: () => void,
    onCancel?: () => void,
}

const buttonStyle = {
    fontSize: '1.6rem',
    border: '2px solid black',
    padding: {
        top: 4,
        bottom: 4,
        left: 10,
        right: 10,
    },
    cursor: 'pointer',
}

const useStyles = createUseStyles({
    background: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        background: 'rgba(50, 50, 50, 0.6)',
        zIndex: 99,
        top: 0,
        left: 0,
    },
    dialog: {
        border: '3px solid #ccc',
        display: 'inline-block',
        background: '#333',
        color: 'white',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: 20,
        fontSize: '1.5rem',
        fontFamily: 'sans-serif',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    okButton: {
        ...buttonStyle,
        '&:hover': {
            backgroundColor: 'white',
        },
    },
    cancelButton: {
        ...buttonStyle,
        color: '#ccc',
        backgroundColor: '#333',
        '&:hover': {
            backgroundColor: '#555',
        },
    },
})

export default function Dialog(props: DialogProps) {
    const classes = useStyles();

    return <div className={classes.background}>
        <div className={classes.dialog}>
            <p>{props.text}</p>
            <div className={classes.buttonContainer}>
                { props.onOk && <button className={classes.okButton} onClick={props.onOk}>OK</button> }
                { props.onCancel && <button className={classes.cancelButton} onClick={props.onCancel}>Cancel</button> }
            </div>
        </div>
    </div>;
}