import GameSettings from '../config/GameSettings';
import LocalState from './LocalState';
import Player from './Player';
import Ship, * as shipFuncs from './Ship';
import { Point } from '../utils/point-utils';
import * as pointUtils from '../utils/point-utils';
import * as hexUtils from '../utils/hex-utils';
import { MarkerType } from './Marker';
import Direction from './Direction';
import { getNumShots, getSunkShips } from './state-util';

export interface ShipPlacement {
    x: number,
    y: number,
    facing: Direction,
    definitionId: number,
}

export default class GameManager {
    private players: Player[];
    private activePlayerId: number;

    constructor(public gameSettings: GameSettings, private subscriber: (playerId: number, state: LocalState) => void) {
        this.players = [
            {
                ships: [],
                markers: [],
                active: true,
            },
            {
                ships: [],
                markers: [],
                active: true,
            },
        ];
        this.activePlayerId = 0;
    }

    public getLocalState(playerId: number): LocalState {
        const otherPlayerId = +!playerId;
        const gameWon = this.playerLost(otherPlayerId);
        const gameLost = this.playerLost(playerId);
        const gameOver = gameLost || gameWon;
        return {
            ownShips: this.players[playerId].ships,
            ownMarkers: this.players[playerId].markers,
            opponentShips: gameOver ? this.players[otherPlayerId].ships : undefined,
            opponentMarkers: this.players[otherPlayerId].markers,
            isOwnTurn: playerId === this.activePlayerId && !!this.players[playerId].ships.length,
            sunkEnemies: getSunkShips(this.players[otherPlayerId].ships).map(s => s.definitionId),
            gameWon,
            gameLost,
            opponentShipsPlaced: !!this.players[otherPlayerId].ships.length,
            opponentLeft: !this.players[otherPlayerId].active,
        }
    }

    private playerLost(playerId: number) {
        const player = this.players[playerId];
        return !player.active || (!!player.ships.length && player.ships.every(s => s.hits === s.size));
    }

    private validateShipPlacement(ships: ShipPlacement[]) {
        const neededShips = this.gameSettings.ships.slice(0);
        const newShips: Ship[] = [];

        for(const ship of ships) {
            const index = neededShips.findIndex(s => s.id === ship.definitionId);
            if(index === -1) {
                return [];
            }
            const shipDefinition = neededShips[index];

            newShips.push({
                x: ship.x,
                y: ship.y,
                size: shipDefinition.size,
                facing: ship.facing,
                hits: 0,
                name: shipDefinition.name,
                definitionId: ship.definitionId,
            });

            neededShips.splice(index, 1);
        }

        if(neededShips.length) {
            return [];
        }

        if(!shipFuncs.isPlacementValid(newShips, this.gameSettings.gridSize)) {
            return [];
        }

        return newShips;
    }

    public setShips(playerId: number, ships: ShipPlacement[]) {
        if(!this.players[playerId]) {
            return;
        }

        const newShips = this.validateShipPlacement(ships);
        if(newShips.length) {
            this.players[playerId].ships = newShips;
            if(this.allShipsPlaced()) {
                this.broadcastState();
            }
            else {
                this.sendState(playerId);
            }
        }
        else {
            this.sendState(playerId);
        }
    }

    public fireShots(playerId: number, targets: Point[]) {
        const player = this.players[playerId];
        const localState = this.getLocalState(playerId);

        const otherPlayerId = +!playerId;
        const valid = this.activePlayerId === playerId &&
            !this.playerLost(playerId) &&
            !this.playerLost(otherPlayerId) &&
            this.allShipsPlaced() &&
            targets.length === getNumShots(this.gameSettings, localState) &&
            targets.every(target => !!target &&
                hexUtils.isInGrid(target, this.gameSettings.gridSize) &&
                !player.markers.some(marker => pointUtils.equal(marker, target)) &&
                !targets.some(target2 => target2 !== target && pointUtils.equal(target, target2)));

        if(valid) {
            let anyHit = false;
            for(const target of targets) {
                let isHit = false;
                for(const ship of this.players[otherPlayerId].ships) {
                    for(const point of shipFuncs.getPoints(ship)) {
                        if(pointUtils.equal(point, target)) {
                            isHit = true;
                            ship.hits++;
                        }
                    }
                }
                player.markers.push({
                    x: target.x,
                    y: target.y,
                    type: isHit ? MarkerType.Hit : MarkerType.Miss,
                });
                anyHit = anyHit || isHit;
            }
            if(!this.gameSettings.streak || !anyHit) {
                this.activePlayerId = otherPlayerId;
            }
            this.broadcastState();
        }
        else {
            this.sendState(playerId);
        }
    }

    public leaveGame(playerId: number) {
        const otherPlayerId = +!playerId;
        if(!this.playerLost(playerId) && !this.playerLost(otherPlayerId)) {
            this.players[playerId].active = false;
            this.broadcastState();
        }
    }

    private sendState(playerId: number) {
        this.subscriber(playerId, this.getLocalState(playerId));
    }

    private broadcastState() {
        for(let id = 0; id < this.players.length; id++) {
            this.sendState(id);
        }
    }

    private allShipsPlaced() {
        return this.players.every(p => p.ships.length);
    }
}