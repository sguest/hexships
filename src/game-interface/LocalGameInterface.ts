import GameSettings from '../config/GameSettings';
import GameManager from '../game-state/GameManager';
import LocalState from '../game-state/LocalState';
import Ship from '../game-state/Ship';
import GameInterface, { StateSubscription } from './GameInterface';
import * as shipFuncs from '../game-state/Ship';
import * as mathUtils from '../utils/math-utils';
import * as hexUtils from '../utils/hex-utils';
import Direction from '../game-state/Direction';
import { Point } from '../utils/point-utils';

export default class LocalGameInterface implements GameInterface {
    private stateSubscriptions: StateSubscription[];
    private gameManager: GameManager;

    constructor(public gameSettings: GameSettings) {
        this.stateSubscriptions = [];
        this.gameManager = new GameManager(gameSettings, (playerId: number, state: LocalState) => this.sendState(playerId, state));
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

    public setShips(ships: Ship[]) {
        this.gameManager.setShips(0, ships);
        this.gameManager.setShips(1, this.generateShips());
    }

    public fireShot(target: Point) {
        this.gameManager.fireShot(0, target);
    }

    private sendState(playerId: number, state: LocalState) {
        if(playerId === 0) {
            this.stateSubscriptions.forEach(s => s(state));
        }
        else if(state.isOwnTurn) {
            setTimeout(() => {
                this.takeEnemyShot();
            }, 1000);
        }
    }

    private takeEnemyShot() {
        let target: Point;
        do {
            target = {
                x: mathUtils.randomInt(-this.gameSettings.gridSize, this.gameSettings.gridSize),
                y: mathUtils.randomInt(-this.gameSettings.gridSize, this.gameSettings.gridSize),
            };
        } while(!hexUtils.isInGrid(target, this.gameSettings.gridSize));
        this.gameManager.fireShot(1, target);
    }

    private generateShips(): Ship[] {
        const lengths = [2, 3, 3, 4, 5];
        const ships: Ship[] = [];
        const minX = -this.gameSettings.gridSize;
        const minY = -this.gameSettings.gridSize;
        const maxX = this.gameSettings.gridSize;
        const maxY = this.gameSettings.gridSize;

        for(const length of lengths) {
            let ship: Ship;
            do {
                ship = {
                    size: length,
                    x: mathUtils.randomInt(minX, maxX),
                    y: mathUtils.randomInt(minY, maxY),
                    facing: mathUtils.randomEnum(Direction),
                }
            } while(!shipFuncs.isPlacementValid([...ships, ship], this.gameSettings.gridSize));
            ships.push(ship);
        }

        return ships;
    }
}