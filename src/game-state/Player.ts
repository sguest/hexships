import Marker from './Marker';
import Ship from './Ship';

export default interface Player {
    ships: Ship[]
    markers: Marker[]
}