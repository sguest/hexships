import { listGameModes, ModeSettings } from '../../config/GameMode';
import Menu, { MenuItem } from './Menu';

export interface ModeSelectionProps {
    onSelection: (mode: ModeSettings) => void
    onCancel: () => void
}

export default function ModeSelection(props: ModeSelectionProps) {
    const items: MenuItem[] = listGameModes().map(m => ({ text: m.title, onClick: () => props.onSelection(m), tooltip: m.description }));
    items.push({ text: 'Back', onClick: props.onCancel });
    return <Menu items={items} />
}