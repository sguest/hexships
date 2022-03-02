import GameSettings from '../config/GameSettings';
import GameManager from '../game-state/GameManager';
import LocalState from '../game-state/LocalState';
import Ship from '../game-state/Ship';
import GameInterface, { StateSubscription } from './GameInterface';
import { Point } from '../utils/point-utils';
import AiPlayer from './AiPlayer';

const localPlayerId = 0;
const aiPlayerId = 1;

export default class LocalGameInterface implements GameInterface {
    private stateSubscriptions: StateSubscription[];
    private gameManager: GameManager;
    private aiPlayer: AiPlayer;

    constructor(public gameSettings: GameSettings) {
        this.stateSubscriptions = [];
        this.gameManager = new GameManager(gameSettings, (playerId: number, state: LocalState) => this.sendState(playerId, state));
        this.aiPlayer = new AiPlayer(gameSettings);
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
        this.gameManager.setShips(localPlayerId, ships);
        this.gameManager.setShips(aiPlayerId, this.aiPlayer.generateShips());
    }

    public fireShot(target: Point) {
        this.gameManager.fireShot(localPlayerId, target);
    }

    private sendState(playerId: number, state: LocalState) {
        if(playerId === localPlayerId) {
            this.stateSubscriptions.forEach(s => s(state));
        }
        else {
            this.aiPlayer.updateState(state);
            if(state.isOwnTurn && !state.gameLost && !state.gameWon) {
                setTimeout(() => {
                    this.takeEnemyShot();
                }, 1000);
            }
        }
    }

    private takeEnemyShot() {
        this.gameManager.fireShot(aiPlayerId, this.aiPlayer.getShot());
    }
}