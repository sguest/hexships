import { Point } from '../utils/point-utils';

export enum MarkerType {
    Hit,
    Miss,
}

export default interface Marker extends Point {
    type: MarkerType
}