import { Point } from "../utils/point-utils";
import Ship from "./Ship";

export default interface LocalState {
    ownShips: Ship[];
    ownHits: Point[];
    ownMisses: Point[];
    opponentHits: Point[];
    opponentMisses: Point[];
}