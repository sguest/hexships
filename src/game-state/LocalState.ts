import Marker from './Marker';
import Ship from './Ship';

export default interface LocalState {
    ownShips: Ship[];
    ownMarkers: Marker[];
    opponentMarkers: Marker[];
    isOwnTurn: boolean;
    sunkEnemies: string[];
}