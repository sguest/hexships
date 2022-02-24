export interface MainMenuProps {
    onNewGame: () => void
}
export default function MainMenu(props: MainMenuProps) {
    return <ul>
        <li><button onClick={props.onNewGame}>New Game</button></li>
    </ul>
}