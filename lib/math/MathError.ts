import * as Coordinate from "./Coordinate.ts";
import * as Vector from "./Vector.ts";

export class ConnectorError extends Error {}

export class PointsTooCloseError extends ConnectorError {
  constructor(
    task: string,
    p1: Coordinate.Coordinate,
    p2: Coordinate.Coordinate,
    minDistance: number,
  ) {
    super(
      `When doing ${task}, ${p1.toString()} and ${p2.toString()} are too close to each other. The minimum distance is ${minDistance}`,
    );
  }
}

export class PointsNoIntersectionError extends ConnectorError {
  constructor(task: string, p1: Vector.Vector, p2: Vector.Vector) {
    super(
      `When doing ${task}, ${p1.toString()} and ${p2.toString()} do not intersect with each other`,
    );
  }
}
