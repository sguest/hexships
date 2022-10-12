import GameSettings from '../config/GameSettings';
import GameManager, { FleetPlacement, GameState } from '../game-state/GameManager';
import LocalState from '../game-state/LocalState';
import GameInterface, { StateSubscription } from './GameInterface';
import { Point } from '../utils/point-utils';
import AiPlayer, { AiState } from './AiPlayer';
import { getNumShots } from '../game-state/state-util';
import { decodeLocalStorage, encodeLocalStorage } from '../utils/storage-utils';

const localPlayerId = 0;
const aiPlayerId = 1;

const storageKeyLocalState = 'localgamestate';
const storageKeyLocalSettings = 'localgamesettings';
const storageKeyLocalAi = 'localaisettings';

export default class LocalGameInterface implements GameInterface {
    private stateSubscriptions: StateSubscription[];
    private gameManager: GameManager;
    private aiPlayer: AiPlayer;
    private staleSubscriber = false;

    constructor(private gameSettings: GameSettings) {
        this.stateSubscriptions = [];
        this.gameManager = new GameManager(gameSettings, (playerId: number, state: LocalState) => this.sendState(playerId, state));
        this.aiPlayer = new AiPlayer(gameSettings);

        encodeLocalStorage(storageKeyLocalSettings, gameSettings);
    }

    public onStateChange(subscriber: StateSubscription) {
        this.stateSubscriptions.push(subscriber);
        if(this.staleSubscriber) {
            subscriber(this.gameManager.getLocalState(localPlayerId), true);
            this.staleSubscriber = false;
        }
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
        localStorage.removeItem(storageKeyLocalAi);
        localStorage.removeItem(storageKeyLocalSettings);
        localStorage.removeItem(storageKeyLocalState);
    }

    public getSettings() {
        return this.gameSettings;
    }

    public loadState(state: GameState, aiState: AiState) {
        this.gameManager.loadFromState(state);
        this.aiPlayer.loadFromState(aiState);
        this.sendState(aiPlayerId, this.gameManager.getLocalState(aiPlayerId));
        this.staleSubscriber = true;
    }

    private sendState(playerId: number, state: LocalState) {
        encodeLocalStorage(storageKeyLocalState, this.gameManager.getState());
        if(playerId === localPlayerId) {
            this.stateSubscriptions.forEach(s => s(state, false));
        }
        else {
            this.aiPlayer.updateGameState(state);
            if(state.isOwnTurn && !state.gameLost && !state.gameWon) {
                setTimeout(() => {
                    this.takeEnemyShot(state);
                }, 1000);
            }
            encodeLocalStorage(storageKeyLocalAi, this.aiPlayer.getState());
        }
    }

    private takeEnemyShot(state: LocalState) {
        this.gameManager.fireShots(aiPlayerId, this.aiPlayer.getShots(getNumShots(this.gameSettings, state)));
    }
}

export function loadFromStorage() {
    const localState = decodeLocalStorage(storageKeyLocalState);
    const localSettings = decodeLocalStorage(storageKeyLocalSettings);
    const localAi = decodeLocalStorage(storageKeyLocalAi);
    if(localState && localSettings && localAi && typeof localState === 'object' && typeof localSettings === 'object' && typeof localAi === 'object') {
        const gameInterface = new LocalGameInterface(localSettings);
        gameInterface.loadState(localState, localAi);
        return gameInterface
    }

    return undefined;
}
