import * as Coordinate from "./Coordinate";
import * as Direction from "./Direction";

export type Shape = {
  edgeDistance(direction: Direction.Direction): number;
  edgeCoordinate(
    center: Coordinate.Coordinate,
    direction: Direction.Direction,
  ): Coordinate.Coordinate;
};

export class Circle implements Shape {
  constructor(readonly radius: number) {}

  edgeCoordinate(
    center: Coordinate.Coordinate,
    direction: Direction.Direction,
  ): Coordinate.Coordinate {
    return new Coordinate.Coordinate(
      center.x + this.radius * direction.x,
      center.y + this.radius * direction.y,
    );
  }
  edgeDistance(_: Direction.Direction): number {
    return this.radius;
  }
}

export class Point implements Shape {
  edgeCoordinate(
    center: Coordinate.Coordinate,
    _: Direction.Direction,
  ): Coordinate.Coordinate {
    return center;
  }
  edgeDistance(_: Direction.Direction): number {
    return 0;
  }
}
