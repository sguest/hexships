import ConnectedPlayer from './ConnectedPlayer';
import { GameModeId, getGameMode } from '../config/GameMode';
import { startGame } from './ServerGame';

let quickConnectWaiting: Array<{ player: ConnectedPlayer, mode: GameModeId }> = [];

export function requestQuickConnect(player: ConnectedPlayer, mode: GameModeId) {
    const index = quickConnectWaiting.findIndex(w => w.mode === mode);
    if(index === -1) {
        quickConnectWaiting.push({ player, mode });
    }
    else {
        const otherPlayer = quickConnectWaiting.splice(index, 1)[0];
        startGame(getGameMode(mode).settings, player, otherPlayer.player);
    }
}

export function cancelQuickConnect(player: ConnectedPlayer) {
    quickConnectWaiting = quickConnectWaiting.filter(w => w.player !== player);
}