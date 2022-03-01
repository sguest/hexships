import GameSettings from '../config/GameSettings';
import GameManager from '../game-state/GameManager';
import LocalState from '../game-state/LocalState';
import Ship from '../game-state/Ship';
import GameInterface, { StateSubscription } from './GameInterface';
import * as shipFuncs from '../game-state/Ship';
import * as mathUtils from '../utils/math-utils';
import * as hexUtils from '../utils/hex-utils';
import * as pointUtils from '../utils/point-utils';
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
        else if(state.isOwnTurn && !state.gameLost && !state.gameWon) {
            setTimeout(() => {
                this.takeEnemyShot(state);
            }, 1000);
        }
    }

    private takeEnemyShot(state: LocalState) {
        const targets: Point[] = [];
        for(let x = -this.gameSettings.gridSize; x <= this.gameSettings.gridSize; x++) {
            for(let y = -this.gameSettings.gridSize; y <= this.gameSettings.gridSize; y++) {
                const target = { x, y };
                if(hexUtils.isInGrid(target, this.gameSettings.gridSize) &&
                        !state.ownMarkers.some(marker => pointUtils.equal(target, marker))) {
                    targets.push(target);
                }
            }
        }

        this.gameManager.fireShot(1, targets[mathUtils.randomInt(0, targets.length - 1)]);
    }

    private generateShips(): Ship[] {
        const ships: Ship[] = [];
        const minX = -this.gameSettings.gridSize;
        const minY = -this.gameSettings.gridSize;
        const maxX = this.gameSettings.gridSize;
        const maxY = this.gameSettings.gridSize;

        for(const shipInfo of this.gameSettings.ships) {
            let ship: Ship;
            do {
                ship = {
                    size: shipInfo.size,
                    name: shipInfo.name,
                    x: mathUtils.randomInt(minX, maxX),
                    y: mathUtils.randomInt(minY, maxY),
                    facing: mathUtils.randomEnum(Direction),
                    hits: 0,
                    definitionId: shipInfo.id,
                }
            } while(!shipFuncs.isPlacementValid([...ships, ship], this.gameSettings.gridSize));
            ships.push(ship);
        }

        return ships;
    }
}