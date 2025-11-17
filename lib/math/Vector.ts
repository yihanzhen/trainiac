import { Coordinate } from "./Coordinate";
import * as Direction from "./Direction.ts";
import * as Shape from "./Shape.ts";

export class Vector extends Coordinate {
  readonly d: Direction.Direction;
  constructor(coordinate: Coordinate, d: Direction.Direction);
  constructor(x: number, y: number, d: Direction.Direction);
  constructor(
    p1: number | Coordinate,
    p2: number | Direction.Direction,
    p3?: Direction.Direction,
  ) {
    if (typeof p1 == "number") {
      super(p1 as number, p2 as number);
      this.d = p3!;
    } else {
      const c1: Coordinate = p1 as Coordinate;
      super(c1.x, c1.y);
      this.d = p2 as Direction.Direction;
    }
  }

  move(length: number): Vector;
  move(direction: Direction.Direction, length: number): Vector;
  move(p1: number | Direction.Direction, p2?: number): Vector {
    if (typeof p1 == "number") {
      return new Vector(super.move(this.d, p1), this.d);
    }
    return new Vector(super.move(p1 as Direction.Direction, p2!), this.d);
  }

  reverse(): Vector {
    return new Vector(this.x, this.y, this.d.reverse());
  }
  toString(): string {
    return `{${super.toString()}->${this.d.toString()}}`;
  }

  equals(other: any): boolean {
    if (!(other instanceof Vector)) {
      return false;
    }
    const otherVector: Vector = other as Vector;
    return (
      this.x == otherVector.x &&
      this.y == otherVector.y &&
      this.d.equals(otherVector.d)
    );
  }
}

export class ShapeVector extends Vector {
  private shape: Shape.Shape;

  constructor(x: number, y: number, d: Direction.Direction, shape: Shape.Shape);
  constructor(v: Vector, shape: Shape.Shape);
  constructor(
    p1: number | Vector,
    p2: number | Shape.Shape,
    p3?: Direction.Direction,
    p4?: Shape.Shape,
  ) {
    if (typeof p1 == "number") {
      super(p1 as number, p2 as number, p3!);
      this.shape = p4!;
    } else {
      const v = p1 as Vector;
      super(v.x, v.y, v.d);
      this.shape = p2 as Shape.Shape;
    }
  }

  edgeCoordinate(): Coordinate;
  edgeCoordinate(_: number): Coordinate;
  edgeCoordinate(angle?: number): Coordinate {
    if (!angle) {
      angle = 0;
    }
    return this.shape.edgeCoordinate(
      new Coordinate(this.x, this.y),
      this.d.rotate(angle),
    );
  }

  edgeDistance(): number;
  edgeDistance(_: number): number;
  edgeDistance(angle?: number): number {
    if (!angle) {
      angle = 0;
    }
    return this.shape.edgeDistance(this.d.rotate(angle));
  }
}
