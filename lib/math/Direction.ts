import { Direction as ViewDir } from "../model/gen/view_pb.ts";

export class Direction {
  constructor(
    readonly x: number,
    readonly y: number,
  ) {}

  unit() {
    const d: number = this.distance();
    return new Direction(this.x / d, this.y / d);
  }

  distance(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  cos(): number {
    return this.x / this.distance();
  }

  sin(): number {
    return this.y / this.distance();
  }

  rotate(angle: number): Direction {
    return new Direction(
      Math.cos(angle) * this.x - Math.sin(angle) * this.y,
      Math.sin(angle) * this.x + Math.cos(angle) * this.y,
    );
  }

  reverse(): Direction {
    return new Direction(-this.x, -this.y);
  }

  cross(d2: Direction): number {
    return this.x * d2.y - this.y * d2.x;
  }

  toString(): string {
    return `(${this.x},${this.y})`;
  }

  equals(other: any): boolean {
    if (!(other instanceof Direction)) {
      return false;
    }
    const thisUnit: Direction = this.unit();
    const otherUnit: Direction = (other as Direction).unit();

    return thisUnit.x == otherUnit.x && thisUnit.y == otherUnit.y;
  }
}

export function clockwise(d: Direction): ViewDir {
  if (d.x > 0 && d.y >= 0) {
    if (d.x > d.y) {
      return ViewDir.SOUTHEAST;
    } else {
      return ViewDir.SOUTH;
    }
  }
  if (d.x >= 0 && d.y < 0) {
    if (d.x >= -d.y) {
      return ViewDir.EAST;
    } else {
      return ViewDir.NORTHEAST;
    }
  }
  if (d.x <= 0 && d.y > 0) {
    if (-d.x >= d.y) {
      return ViewDir.WEST;
    } else {
      return ViewDir.SOUTHWEST;
    }
  }
  if (d.x < 0 && d.y <= 0) {
    if (-d.x > d.y) {
      return ViewDir.NORTHWEST;
    } else {
      return ViewDir.NORTH;
    }
  }
  throw new Error(`invalid direction: ${d}`);
}

export function counterClockwise(d: Direction): ViewDir {
  if (d.x >= 0 && d.y > 0) {
    if (d.x > d.y) {
      return ViewDir.EAST;
    } else {
      return ViewDir.SOUTHEAST;
    }
  }
  if (d.x > 0 && d.y <= 0) {
    if (d.x > -d.y) {
      return ViewDir.NORTHEAST;
    } else {
      return ViewDir.NORTH;
    }
  }
  if (d.x < 0 && d.y >= 0) {
    if (-d.x > d.y) {
      return ViewDir.SOUTHWEST;
    } else {
      return ViewDir.SOUTH;
    }
  }
  if (d.x <= 0 && d.y < 0) {
    if (-d.x > d.y) {
      return ViewDir.WEST;
    } else {
      return ViewDir.NORTHWEST;
    }
  }
  throw new Error(`invalid direction: ${d}`);
}

export function fromViewPbDirection(d: ViewDir): Direction {
  switch (d) {
    case ViewDir.NORTH:
      return new Direction(0, -1);
    case ViewDir.NORTHEAST:
      return new Direction(1, -1).unit();
    case ViewDir.EAST:
      return new Direction(1, 0);
    case ViewDir.SOUTHEAST:
      return new Direction(1, 1).unit();
    case ViewDir.SOUTH:
      return new Direction(0, 1);
    case ViewDir.SOUTHWEST:
      return new Direction(-1, 1).unit();
    case ViewDir.WEST:
      return new Direction(-1, 0);
    case ViewDir.NORTHWEST:
      return new Direction(-1, -1).unit();
    default:
      throw new Error(`Unknown direction: ${d}`);
  }
}
