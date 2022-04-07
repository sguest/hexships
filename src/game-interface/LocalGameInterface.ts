import GameSettings from '../config/GameSettings';
import GameManager, { FleetPlacement } from '../game-state/GameManager';
import LocalState from '../game-state/LocalState';
import GameInterface, { StateSubscription } from './GameInterface';
import { Point } from '../utils/point-utils';
import AiPlayer from './AiPlayer';
import { getNumShots } from '../game-state/state-util';

const localPlayerId = 0;
const aiPlayerId = 1;

export default class LocalGameInterface implements GameInterface {
    private stateSubscriptions: StateSubscription[];
    private gameManager: GameManager;
    private aiPlayer: AiPlayer;

    constructor(private gameSettings: GameSettings) {
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

    public setFleet(fleet: FleetPlacement) {
        this.gameManager.setFleet(localPlayerId, fleet);
        this.gameManager.setFleet(aiPlayerId, this.aiPlayer.generateFleet());
    }

    public fireShots(targets: Point[]) {
        this.gameManager.fireShots(localPlayerId, targets);
    }

    public leaveGame() {
    }

    public getSettings() {
        return this.gameSettings;
    }

    private sendState(playerId: number, state: LocalState) {
        if(playerId === localPlayerId) {
            this.stateSubscriptions.forEach(s => s(state));
        }
        else {
            this.aiPlayer.updateState(state);
            if(state.isOwnTurn && !state.gameLost && !state.gameWon) {
                setTimeout(() => {
                    this.takeEnemyShot(state);
                }, 1000);
            }
        }
    }

    private takeEnemyShot(state: LocalState) {
        this.gameManager.fireShots(aiPlayerId, this.aiPlayer.getShots(getNumShots(this.gameSettings, state)));
    }
}