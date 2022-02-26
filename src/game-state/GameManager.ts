import GameSettings from '../config/GameSettings';
import LocalState from './LocalState';
import Player from './Player';
import Ship, * as shipFuncs from './Ship';
import { Point } from '../utils/point-utils';
import * as pointUtils from '../utils/point-utils';
import * as hexUtils from '../utils/hex-utils';
import { MarkerType } from './Marker';

export default class GameManager {
    private players: Player[];
    private activePlayerId: number;

    constructor(public gameSettings: GameSettings, private subscriber: (playerId: number, state: LocalState) => void) {
        this.players = [
            {
                ships: [],
                markers: [],
            },
            {
                ships: [],
                markers: [],
            },
        ];
        this.activePlayerId = 0;
    }

    public getLocalState(playerId: number): LocalState {
        const otherPlayerId = +!playerId;
        return {
            ownShips: this.players[playerId].ships,
            ownMarkers: this.players[playerId].markers,
            opponentMarkers: this.players[otherPlayerId].markers,
            isOwnTurn: playerId === this.activePlayerId && !!this.players[playerId].ships.length,
        }
    }

    public setShips(playerId: number, ships: Ship[]) {
        if(shipFuncs.isPlacementValid(ships, this.gameSettings.gridSize)) {
            this.players[playerId].ships = ships;
        }
        this.broadcastState();
    }

    public fireShot(playerId: number, target: Point) {
        const valid = this.activePlayerId === playerId &&
            hexUtils.isInGrid(target, this.gameSettings.gridSize) &&
            !this.players[playerId].markers.some(marker => pointUtils.equal(marker, target));

        if(valid) {
            const otherPlayerId = +!playerId;
            const points = this.players[otherPlayerId].ships.map(ship => shipFuncs.getPoints(ship)).flat();
            this.players[playerId].markers.push({
                x: target.x,
                y: target.y,
                type: points.some(point => pointUtils.equal(point, target)) ? MarkerType.Hit : MarkerType.Miss,
            })
            this.activePlayerId = otherPlayerId;
        }
        this.broadcastState();
    }

    private broadcastState() {
        for(let id = 0; id < this.players.length; id++) {
            this.subscriber(id, this.getLocalState(id));
        }
    }
}