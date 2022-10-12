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

export interface FleetPlacement {
    ships: ShipPlacement[],
    mines: Point[],
}

export interface GameState {
    players: Player[]
    activePlayerId: number
}

export default class GameManager {
    private players: Player[];
    private activePlayerId: number;

    constructor(public gameSettings: GameSettings, private subscriber: (playerId: number, state: LocalState) => void) {
        this.players = [
            {
                ships: [],
                mines: [],
                markers: [],
                active: true,
            },
            {
                ships: [],
                mines: [],
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
            ownMines: this.players[playerId].mines,
            opponentShips: gameOver ? this.players[otherPlayerId].ships : undefined,
            opponentMarkers: this.players[otherPlayerId].markers,
            opponentMines: this.players[otherPlayerId].mines.filter(mine => gameOver || this.players[playerId].markers.some(marker => pointUtils.equal(mine, marker))),
            isOwnTurn: playerId === this.activePlayerId && !!this.players[playerId].ships.length,
            sunkEnemies: getSunkShips(this.players[otherPlayerId].ships).map(s => s.definitionId),
            gameWon,
            gameLost,
            opponentShipsPlaced: !!this.players[otherPlayerId].ships.length,
            opponentLeft: !this.players[otherPlayerId].active,
        }
    }

    public loadFromState(state: GameState) {
        this.players = state.players;
        this.activePlayerId = state.activePlayerId;
    }

    public getState(): GameState {
        return {
            players: this.players,
            activePlayerId: this.activePlayerId,
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

    private validateMinePlacement(mines: Point[], ships: Ship[]) {
        if(mines.length !== this.gameSettings.mines) {
            return false;
        }

        const shipPoints = ships.map(s => shipFuncs.getPoints(s)).flat();
        for(const mine of mines) {
            if(shipPoints.some(p => pointUtils.equal(p, mine))) {
                return false;
            }

            if(mines.some(m => m !== mine && pointUtils.equal(mine, m))) {
                return false;
            }

            if(!hexUtils.isInGrid(mine, this.gameSettings.gridSize)) {
                return false;
            }
        }

        return true;
    }

    public setFleet(playerId: number, fleet: FleetPlacement) {
        if(!this.players[playerId]) {
            return;
        }

        const newShips = this.validateShipPlacement(fleet.ships);
        if(newShips.length && this.validateMinePlacement(fleet.mines, newShips)) {
            this.players[playerId].ships = newShips;
            this.players[playerId].mines = fleet.mines.slice();
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

    private tryHit(ships: Ship[], target: Point) {
        for(const ship of ships) {
            for(const point of shipFuncs.getPoints(ship)) {
                if(pointUtils.equal(point, target)) {
                    ship.hits++;
                    return true;
                }
            }
        }
        return false;
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
                const isHit = this.tryHit(this.players[otherPlayerId].ships, target);
                player.markers.push({
                    x: target.x,
                    y: target.y,
                    type: isHit ? MarkerType.Hit : MarkerType.Miss,
                });
                anyHit = anyHit || isHit;

                if(this.players[otherPlayerId].mines.some(m => pointUtils.equal(m, target))) {
                    for(const point of [...hexUtils.getNeighbours(target, this.gameSettings.gridSize), target]) {
                        if(!this.players[otherPlayerId].markers.some(p => pointUtils.equal(p, point))) {
                            this.players[otherPlayerId].markers.push({
                                x: point.x,
                                y: point.y,
                                type: this.tryHit(this.players[playerId].ships, point) ? MarkerType.Hit : MarkerType.Miss,
                            })
                        }
                    }
                }
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