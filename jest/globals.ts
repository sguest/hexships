import ReactModal from 'react-modal';

// ts-jest imports don't seem to play nice with how react-modal is exported, so mocking around the issue
jest.mock('react-modal', () => {
    const actual = jest.requireActual('react-modal');
    return {
        __esModule: true,
        default: actual,
    }
});

// react-modal complains if the app element isn't set
ReactModal.setAppElement(document.createElement('div'));