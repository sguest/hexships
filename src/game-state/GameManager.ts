import GameSettings from '../config/GameSettings';
import LocalState from './LocalState';
import Player from './Player';
import Ship, * as shipFuncs from './Ship';
import { Point } from '../utils/point-utils';
import * as pointUtils from '../utils/point-utils';
import * as hexUtils from '../utils/hex-utils';

export default class GameManager {
    private players: Player[];
    private activePlayerId: number;

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
        this.activePlayerId = 0;
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

    public fireShot(playerId: number, target: Point) {
        let valid = this.activePlayerId === playerId;
        if(!hexUtils.isInGrid(target, this.gameSettings.gridSize)) {
            valid = false;
        }
        this.players[playerId].hits.forEach(hit => {
            if(pointUtils.equal(hit, target)) {
                valid = false;
            }
        })
        this.players[playerId].misses.forEach(miss => {
            if(pointUtils.equal(miss, target)) {
                valid = false;
            }
        })
        if(valid) {
            const otherPlayerId = +!playerId;
            const points = this.players[otherPlayerId].ships.map(ship => shipFuncs.getPoints(ship)).flat();
            if(points.some(point => pointUtils.equal(point, target))) {
                this.players[playerId].hits.push(target);
            }
            else {
                this.players[playerId].misses.push(target);
            }
        }
        this.broadcastState();
    }

    private broadcastState() {
        for(let id = 0; id < this.players.length; id++) {
            this.subscriber(id, this.getLocalState(id));
        }
    }
}