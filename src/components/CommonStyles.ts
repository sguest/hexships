export const textColour = '#ccc';
export const stencilFont = ['Big Shoulders Stencil Text', 'sans-serif'];
export const standardButton = {
    fontSize: '1.2rem',
    border: '2px solid black',
    padding: {
        top: 4,
        bottom: 4,
        left: 10,
        right: 10,
    },
    cursor: 'pointer',
    color: textColour,
    backgroundColor: '#333',
    '&:hover': {
        backgroundColor: '#555',
    },
    '&:disabled': {
        cursor: 'default',
        backgroundColor: '#999',
    },
};
export const textInput = {
    border: `1px solid ${textColour}`,
    background: 'transparent',
    color: textColour,
    padding: 3,
    fontSize: '1rem',
    '& option': {
        backgroundColor: '#022866',
    },
    '&:disabled': {
        backgroundColor: '#ccc',
        color: '#666',
    },
};