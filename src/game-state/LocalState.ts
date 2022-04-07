import { Point } from '../utils/point-utils';
import Marker from './Marker';
import Ship from './Ship';

export default interface LocalState {
    ownShips: Ship[];
    ownMarkers: Marker[];
    ownMines: Point[];
    opponentShips: Ship[] | undefined;
    opponentMarkers: Marker[];
    opponentMines: Point[];
    isOwnTurn: boolean;
    sunkEnemies: number[];
    gameWon: boolean;
    gameLost: boolean;
    opponentShipsPlaced: boolean;
    opponentLeft: boolean;
}