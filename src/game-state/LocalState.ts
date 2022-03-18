import Marker from './Marker';
import Ship from './Ship';

export default interface LocalState {
    ownShips: Ship[];
    ownMarkers: Marker[];
    opponentShips: Ship[] | undefined;
    opponentMarkers: Marker[];
    isOwnTurn: boolean;
    sunkEnemies: number[];
    gameWon: boolean;
    gameLost: boolean;
    enemyShipsPlaced: boolean;
}