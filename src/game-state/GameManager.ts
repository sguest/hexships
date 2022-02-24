import GameSettings from "../config/GameSettings";
import LocalState from "./LocalState";
import Player from "./Player";
import Ship from "./Ship";
import * as shipFuncs from './Ship';
import * as mathUtils from '../utils/math-utils';
import * as hexUtils from '../utils/hex-utils';
import * as pointUtils from '../utils/point-utils';
import Direction from "./Direction";

export type StateSubscription = (state: LocalState) => void;

export default class GameManager {
    private players: Player[];
    private stateSubscriptions: StateSubscription[];

    constructor(public gameSettings: GameSettings) {
        this.players = [
            {
                ships: [],
                hits: [],
                misses: [],
            },
            {
                ships: this.generateShips(),
                hits: [],
                misses: [],
            }
        ];
        this.stateSubscriptions = [];
    }

    public getLocalState(): LocalState {
        return {
            ownShips: this.players[1].ships,    // todo: should be player[0], but want to show enemy ships for now
            ownHits: this.players[0].hits,
            ownMisses: this.players[0].misses,
            opponentHits: this.players[1].hits,
            opponentMisses: this.players[1].misses,
        }
    }

    public onStateChange(subscriber: StateSubscription) {
        this.stateSubscriptions.push(subscriber);
    }

    public offStateChange(subscriber: StateSubscription) {
        const index = this.stateSubscriptions.indexOf(subscriber);
        if(index >= 0) {
            this.stateSubscriptions.splice(index, 1);
        }
    }

    private generateShips(): Ship[] {
        const lengths = [2, 3, 3, 4, 5];
        const ships: Ship[] = [];
        const minX = -this.gameSettings.gridSize;
        const minY = -this.gameSettings.gridSize;
        const maxX = this.gameSettings.gridSize;
        const maxY = this.gameSettings.gridSize;

        for(let length of lengths) {
            let valid = true;
            let ship: Ship;
            do {
                valid = true;
                ship = {
                    size: length,
                    x: mathUtils.randomInt(minX, maxX),
                    y: mathUtils.randomInt(minY, maxY),
                    facing: mathUtils.randomEnum(Direction),
                }
                const points = shipFuncs.getPoints(ship);
                for(let point of points) {
                    if(!hexUtils.isInGrid(point, this.gameSettings.gridSize)) {
                        valid = false;
                    }

                    for(let otherShip of ships) {
                        const otherPoints = shipFuncs.getPoints(otherShip);

                        for(let otherPoint of otherPoints) {
                            if(pointUtils.equal(point, otherPoint)) {
                                valid = false;
                            }
                        }
                    }
                }
            } while(!valid);
            ships.push(ship);
        }

        return ships;
    }
}