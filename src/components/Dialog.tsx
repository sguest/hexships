import ReactModal from 'react-modal';
import { createUseStyles } from 'react-jss';

export interface DialogProps {
    text: string,
    onOk?: () => void,
    onClose: () => void,
    okButton?: boolean,
    cancelButton?: boolean,
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
});

const dialogStyles = {
    content: {
        border: '3px solid #ccc',
        display: 'inline-block',
        background: '#333',
        color: 'white',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: 20,
        fontSize: '1.5rem',
        fontFamily: 'sans-serif',
        inset: '50% auto auto 50%',
    },
    overlay: {
        zIndex: 999,
    },
};

export default function Dialog(props: DialogProps) {
    const classes = useStyles();

    const onOk = () => {
        props.onClose();
        if(props.onOk) {
            props.onOk();
        }
    }

    return <ReactModal isOpen={true} onRequestClose={props.onClose} style={dialogStyles}>
        <p>{props.text}</p>
        <div className={classes.buttonContainer}>
            { props.okButton && <button className={classes.okButton} onClick={onOk}>OK</button> }
            { props.cancelButton && <button className={classes.cancelButton} onClick={props.onClose}>Cancel</button> }
        </div>
    </ReactModal>;
}