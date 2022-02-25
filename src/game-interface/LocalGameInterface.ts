import GameSettings from '../config/GameSettings';
import GameManager from '../game-state/GameManager';
import LocalState from '../game-state/LocalState';
import Ship from '../game-state/Ship';
import GameInterface, { StateSubscription } from './GameInterface';
import * as shipFuncs from '../game-state/Ship';
import * as mathUtils from '../utils/math-utils';
import Direction from '../game-state/Direction';

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

    private sendState(playerId: number, state: LocalState) {
        if(playerId === 0) {
            this.stateSubscriptions.forEach(s => s(state));
        }
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