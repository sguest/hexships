import Game from './Game';
import Player from './ConnectedPlayer';

let quickConnectWaiting: Player | undefined;

function requestQuickConnect(player: Player) {
    if(quickConnectWaiting === undefined) {
        quickConnectWaiting = player;
    }
    else {
        // eslint-disable-next-line no-new
        new Game(quickConnectWaiting, player);
        quickConnectWaiting = undefined;
    }
}

function cancelQuickConnect(player: Player) {
    if(quickConnectWaiting === player) {
        quickConnectWaiting = undefined;
    }
}

export function registerQuickConnect(player: Player) {
    player.on('quick-connect', 'lobby', () => {
        requestQuickConnect(player);
    });

    player.on('cancel-quick-connect', 'lobby', () => {
        cancelQuickConnect(player);
    })

    player.on('disconnect', 'lobby', () => {
        cancelQuickConnect(player);
    });
}