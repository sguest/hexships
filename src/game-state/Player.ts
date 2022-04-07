import { Point } from '../utils/point-utils';
import Marker from './Marker';
import Ship from './Ship';

export default interface Player {
    ships: Ship[]
    mines: Point[]
    markers: Marker[]
    active: boolean
}