import GameSettings from '../config/GameSettings';
import LocalState from './LocalState';
import Player from './Player';
import Ship, * as shipFuncs from './Ship';

export default class GameManager {
    private players: Player[];

    constructor(public gameSettings: GameSettings, private subscriber: (playerId: number, state: LocalState) => void) {
        this.players = [
            {
                ships: [],
                hits: [],
                misses: [],
            },
            {
                ships: [],
                hits: [],
                misses: [],
            },
        ];
    }

    public getLocalState(playerId: number): LocalState {
        const otherPlayerId = +!playerId;
        return {
            ownShips: this.players[playerId].ships,
            ownHits: this.players[playerId].hits,
            ownMisses: this.players[playerId].misses,
            opponentHits: this.players[otherPlayerId].hits,
            opponentMisses: this.players[otherPlayerId].misses,
        }
    }

    public setShips(playerId: number, ships: Ship[]) {
        if(shipFuncs.isPlacementValid(ships, this.gameSettings.gridSize)) {
            this.players[playerId].ships = ships;
        }
        this.broadcastState();
    }

    private broadcastState() {
        for(let id = 0; id < this.players.length; id++) {
            this.subscriber(id, this.getLocalState(id));
        }
    }
}