import * as Direction from "./Direction.ts";
import * as Shape from "./Shape.ts";

// CoordinateSystem defines a coordinate system.
// All three values are measured in pixels. X-axis and
// y-axis are both parellel to those of the svg
// definitions, and have the same direction.
export type CoordinateSystem = {
  xOffset: number;
  yOffset: number;
  unitLength: number;
};

// The coordinate system according to the svg definitions.
export var screen = {
  xOffset: 0,
  yOffset: 0,
  unitLength: 1,
};

export class Coordinate {
  constructor(
    readonly x: number,
    readonly y: number,
  ) {}

  move(direction: Direction.Direction, length: number): Coordinate {
    const ut: Direction.Direction = direction.unit();
    return new Coordinate(this.x + ut.x * length, this.y + ut.y * length);
  }

  toString(): string {
    return `(${this.x},${this.y})`;
  }

  equals(other: any): boolean {
    if (!(other instanceof Coordinate)) {
      return false;
    }
    const otherCoordinate: Coordinate = other as Coordinate;
    return this.x == otherCoordinate.x && this.y == otherCoordinate.y;
  }
}

export class ShapeCoordinate extends Coordinate {
  constructor(
    x: number,
    y: number,
    private shape: Shape.Shape,
  ) {
    super(x, y);
    this.shape = shape;
  }

  edgeCoordinate(direction: Direction.Direction): Coordinate {
    return this.shape.edgeCoordinate(this, direction);
  }
}

export class Transformer {
  private fromSys: CoordinateSystem;
  private toSys: CoordinateSystem;

  constructor(fromSys: CoordinateSystem, toSys: CoordinateSystem) {
    this.fromSys = fromSys;
    this.toSys = toSys;
  }

  // Transforms a coordinate from fromSys to toSys.
  transform(c: Coordinate): Coordinate {
    return new Coordinate(this.tsx(c.x), this.tsy(c.y));
  }

  // Transforms the x coordinate from fromSys to toSys.
  tsx(x: number) {
    let xAbs = x * this.fromSys.unitLength + this.fromSys.xOffset;
    return (xAbs - this.toSys.xOffset) / this.toSys.unitLength;
  }

  // Transforms the y coordinate from fromSys to toSys.
  tsy(y: number) {
    let yAbs = y * this.fromSys.unitLength + this.fromSys.yOffset;
    return (yAbs - this.toSys.yOffset) / this.toSys.unitLength;
  }

  // Transfroms the scalar coordinate from cs to screen.
  tss(s: number) {
    return (this.fromSys.unitLength / this.toSys.unitLength) * s;
  }
}

export function distance(c1: Coordinate, c2: Coordinate): number {
  return Math.sqrt(
    (c2.x - c1.x) * (c2.x - c1.x) + (c2.y - c1.y) * (c2.y - c1.y),
  );
}
