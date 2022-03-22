import Game from './Game';
import ConnectedPlayer from './ConnectedPlayer';
import { GameModeId, getGameMode } from '../config/GameMode';

let quickConnectWaiting: Array<{ player: ConnectedPlayer, mode: GameModeId }> = [];

function requestQuickConnect(player: ConnectedPlayer, mode: GameModeId) {
    const index = quickConnectWaiting.findIndex(w => w.mode === mode);
    if(index === -1) {
        quickConnectWaiting.push({ player, mode });
    }
    else {
        const otherPlayer = quickConnectWaiting.splice(index, 1)[0];
        // eslint-disable-next-line no-new
        new Game(getGameMode(mode).settings, player, otherPlayer.player);
    }
}

function cancelQuickConnect(player: ConnectedPlayer) {
    quickConnectWaiting = quickConnectWaiting.filter(w => w.player !== player);
}

export function registerQuickConnect(player: ConnectedPlayer) {
    player.on('quick-connect', 'lobby', (mode: GameModeId) => {
        requestQuickConnect(player, mode);
    });

    player.on('cancel-quick-connect', 'lobby', () => {
        cancelQuickConnect(player);
    })

    player.on('disconnect', 'lobby', () => {
        cancelQuickConnect(player);
    });
}