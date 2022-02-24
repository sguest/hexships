import { Point } from "../utils/point-utils";
import Ship from "./Ship";

export default interface Player {
    ships: Ship[]
    hits: Point[]
    misses: Point[]
}