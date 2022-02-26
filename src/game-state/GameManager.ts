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
            sunkEnemies: this.players[otherPlayerId].ships.filter(s => s.hits === s.size).map(s => s.name),
        }
    }

    private validateShipPlacement(ships: Ship[]) {
        if(!shipFuncs.isPlacementValid(ships, this.gameSettings.gridSize)) {
            return [];
        }

        const neededShips = this.gameSettings.ships.slice(0);
        const newShips: Ship[] = [];

        for(const ship of ships) {
            const index = neededShips.findIndex(s => s.name === ship.name && s.size === ship.size);
            if(index === -1) {
                return [];
            }

            newShips.push({
                x: ship.x,
                y: ship.y,
                size: ship.size,
                facing: ship.facing,
                hits: 0,
                name: ship.name,
            });

            neededShips.splice(index, 1);
        }

        if(neededShips.length) {
            return [];
        }

        return newShips;
    }

    public setShips(playerId: number, ships: Ship[]) {
        const newShips = this.validateShipPlacement(ships);
        if(newShips.length) {
            this.players[playerId].ships = newShips;
        }
        this.broadcastState();
    }

    public fireShot(playerId: number, target: Point) {
        const valid = this.activePlayerId === playerId &&
            hexUtils.isInGrid(target, this.gameSettings.gridSize) &&
            !this.players[playerId].markers.some(marker => pointUtils.equal(marker, target));

        if(valid) {
            const otherPlayerId = +!playerId;
            let isHit = false;
            for(const ship of this.players[otherPlayerId].ships) {
                for(const point of shipFuncs.getPoints(ship)) {
                    if(pointUtils.equal(point, target)) {
                        isHit = true;
                        ship.hits++;
                    }
                }
            }
            this.players[playerId].markers.push({
                x: target.x,
                y: target.y,
                type: isHit ? MarkerType.Hit : MarkerType.Miss,
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