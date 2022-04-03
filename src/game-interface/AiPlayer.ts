import GameSettings from '../config/GameSettings';
import Ship from '../game-state/Ship';
import * as shipFuncs from '../game-state/Ship';
import * as mathUtils from '../utils/math-utils';
import * as pointUtils from '../utils/point-utils';
import * as hexUtils from '../utils/hex-utils';
import Direction from '../game-state/Direction';
import * as direction from '../game-state/Direction';
import LocalState from '../game-state/LocalState';
import { Point } from '../utils/point-utils';
import { MarkerType } from '../game-state/Marker';
import { ShipPlacement } from '../game-state/GameManager';

export default class AiPlayer {
    private ownShots: MarkerType[][] = [];
    private ownShotCount = 0;
    private priorityHits: Point[] = [];
    private trackedHits: Point[] = [];
    private sunkShips: number[] = [];

    constructor(private gameSettings: GameSettings) {
    }

    public generateShips(): ShipPlacement[] {
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

    public updateState(state: LocalState) {
        if(!state.ownMarkers?.length) {
            return;
        }
        while(state.ownMarkers.length > this.ownShotCount) {
            const newShot = state.ownMarkers[this.ownShotCount];
            this.ownShots[newShot.x] = this.ownShots[newShot.x] || [];
            if(this.ownShots[newShot.x][newShot.y] === undefined) {
                this.ownShots[newShot.x][newShot.y] = newShot.type;

                if(newShot.type === MarkerType.Hit) {
                    if(state.sunkEnemies.length === this.sunkShips.length) {
                        this.priorityHits.push(newShot);
                        this.trackedHits.push(newShot);
                    }
                    else {
                        for(const sunk of state.sunkEnemies) {
                            if(this.sunkShips.indexOf(sunk) === -1) {
                                this.sunkShips.push(sunk);
                                const size = this.gameSettings.ships.find(s => s.id === sunk)?.size;
                                if(size) {
                                    let found = false;
                                    for(let dir = 0; dir < 6; dir++) {
                                        if(!found) {
                                            const delta = direction.getDelta(dir);
                                            let current: Point = newShot;
                                            const matchedShots = [current];
                                            for(let i = 0; i < size; i++) {
                                                current = pointUtils.add(current, delta);
                                                const match = this.trackedHits.find(h => pointUtils.equal(h, current));
                                                if(match) {
                                                    matchedShots.push(current);
                                                }
                                            }
                                            if(matchedShots.length === size) {
                                                found = true;
                                                for(const match of matchedShots) {
                                                    let index = this.trackedHits.findIndex(h => pointUtils.equal(h, match));
                                                    if(index !== -1) {
                                                        this.trackedHits.splice(index, 1);
                                                    }
                                                    index = this.priorityHits.findIndex(h => pointUtils.equal(h, match));
                                                    if(index !== -1) {
                                                        this.priorityHits.splice(index, 1);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.ownShotCount++;
        }
    }

    public getShots(numShots: number): Point[] {
        const shots: Point[] = [];
        while(this.priorityHits.length) {
            const current = this.priorityHits[0];
            const directions = [Direction.negativeX, Direction.negativeY, Direction.negativeZ, Direction.positiveX, Direction.positiveY, Direction.positiveZ];
            while(directions.length) {
                const dir = directions.splice(mathUtils.randomInt(0, directions.length - 1), 1)[0];
                let delta = direction.getDelta(dir);
                const moved = pointUtils.add(current, delta);
                let target = current;
                if(this.trackedHits.find(h => pointUtils.equal(h, moved))) {
                    while(this.getOwnShot(target) === MarkerType.Hit && hexUtils.isInGrid(target, this.gameSettings.gridSize)) {
                        target = pointUtils.add(target, delta);
                    }
                    while(this.getOwnShot(target) === undefined && hexUtils.isInGrid(target, this.gameSettings.gridSize)) {
                        shots.push(target);
                        target = pointUtils.add(target, delta);
                    }
                    target = current;
                    delta = direction.getDelta((dir + 3) % 6);
                    while(this.getOwnShot(target) === MarkerType.Hit && hexUtils.isInGrid(target, this.gameSettings.gridSize)) {
                        target = pointUtils.add(target, delta);
                    }
                    while(this.getOwnShot(target) === undefined && hexUtils.isInGrid(target, this.gameSettings.gridSize)) {
                        shots.push(target);
                        target = pointUtils.add(target, delta);
                    }
                }
            }

            if(shots.length >= numShots) {
                return shots.slice(0, numShots);
            }

            const targets: Point[] = [];
            for(let dir = 0; dir < 6; dir++) {
                const delta = direction.getDelta(dir);
                const target = pointUtils.add(current, delta);
                if(this.getOwnShot(target) === undefined && hexUtils.isInGrid(target, this.gameSettings.gridSize)) {
                    targets.push(target);
                }
            }
            while(targets.length) {
                shots.push(targets.splice(mathUtils.randomInt(0, targets.length - 1), 1)[0]);
            }

            if(shots.length >= numShots) {
                return shots.slice(0, numShots);
            }

            this.priorityHits.splice(0, 1);
        }

        const remainingShips = this.gameSettings.ships.filter(s => !this.sunkShips.some(ss => s.id === ss));
        const minSize = Math.min(...remainingShips.map(s => s.size));

        const targets: Point[] = [];
        for(let x = -this.gameSettings.gridSize; x <= this.gameSettings.gridSize; x++) {
            for(let y = -this.gameSettings.gridSize; y <= this.gameSettings.gridSize; y++) {
                const target = { x, y };
                if(hexUtils.isInGrid(target, this.gameSettings.gridSize) &&
                        (this.getOwnShot(target)) === undefined) {
                    for(let dir = 0; dir < 3; dir++) {
                        const delta = direction.getDelta(dir);
                        let valid = true;
                        const newTargets = [target];
                        let current = target;
                        for(let i = 1; i < minSize; i++) {
                            current = pointUtils.add(current, delta);
                            const ownShot = this.getOwnShot(current);
                            if(!hexUtils.isInGrid(current, this.gameSettings.gridSize) || ownShot === MarkerType.Miss) {
                                valid = false;
                            }
                            else if(ownShot === undefined) {
                                newTargets.push(current);
                            }
                        }
                        if(valid) {
                            targets.push(...newTargets);
                        }
                    }
                }
            }
        }

        while(shots.length < numShots) {
            shots.push(targets.splice(mathUtils.randomInt(0, targets.length - 1), 1)[0])
        }

        return shots;
    }

    private getOwnShot(point: Point) {
        return this.ownShots[point.x] && this.ownShots[point.x][point.y];
    }
}