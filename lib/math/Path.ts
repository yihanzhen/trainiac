import * as Err from "../errors/Error.ts";
import { Direction } from "../model/gen/view_pb.ts";
import { Coordinate } from "./Coordinate";

export type Vector = {
  c: Coordinate;
  d: Direction;
};

export type PathNode = {
  point: Coordinate;
  arcRadius: number;
};

export type Path = {
  origin: Coordinate;
  nexts: PathNode[];
};

export class Connector {
  private r: number;

  constructor(r: number) {
    this.r = r;
  }

  connect(vf: Vector, vt: Vector): Path {
    if (vf.d == vt.d) {
      return this.connectParellel(vf, vt);
    }
    return this.connectIntersect(vf, vt);
  }

  connectParellel(vf: Vector, vt: Vector): Path {
    const ftd = { x: vt.c.x - vf.c.x, y: vt.c.y - vf.c.y };
    const vfd = dtoc(vt.d);
    const cp = vfd.x * ftd.y - vfd.y * ftd.x; // ftd.y
    // vf, vt are on the same line
    if (cp == 0) {
      return {
        origin: vf.c,
        nexts: [
          {
            point: vt.c,
            arcRadius: 0,
          },
        ],
      };
    }
    var vm: Vector;
    if (cp > 0) {
      vm = {
        c: {
          x: (vf.c.x + vt.c.x) / 2,
          y: (vf.c.y + vt.c.y) / 2,
        },
        d: (vf.d + 1) % 8,
      };
    } else {
      vm = {
        c: {
          x: (vf.c.x + vt.c.x) / 2,
          y: (vf.c.y + vt.c.y) / 2,
        },
        d: (vf.d + 7) % 8,
      };
    }
    const fmp = this.connectIntersect(vf, vm);
    const mtp = this.connectIntersect(vm, vt);
    return {
      origin: vf.c,
      nexts: [...fmp.nexts, ...mtp.nexts],
    };
  }

  // (v.c.x,v.c.y)-(vf.c.x, vf.c.y) = n * vf.d.(x, y), n > 0
  // (vt.c.x, vt.c.y)-(v.c.x,v.c.y) = m * vt.d.(x, y), m > 0
  // v.c.x = vf.c.x + n * vf.d.x = vt.c.x - m * vt.d.x
  // v.c.y = vf.c.y + n * vf.d.y = vt.c.y - m * vt.d.y
  //
  // vf.c.x * vf.d.y + n * vf.d.x * vf.d.y = vt.c.x * vf.d.y - m * vt.d.x * vf.d.y
  // vf.c.y * vf.d.x + n * vf.d.y * vf.d.x = vt.c.y * cf.d.x - m * vt.d.y * vf.d.x
  // vf.c.x * vf.d.y - vf.c.y * vf.d.x = (vt.c.x * vf.d.y - vt.c.y * vf.d.x) + m * (vt.d.y * vf.d.x - vt.d.x * vf.d.y)
  // m = (vf.c.x * vf.d.y + vt.c.y * vf.d.x - vf.c.y * vf.d.x - vt.c.x * vf.d.y) / (vt.d.y * vf.d.x - vt.d.x * vf.d.y)
  //
  // vf.c.x * vt.d.y + n * vf.d.x * vt.d.y = vt.c.x * vt.d.y - m * vt.d.x * vt.d.y
  // vf.c.y * vt.d.x + n * vf.d.y * vt.d.x = vt.c.y * vt.d.x - m * vt.d.y * vt.d.x
  // vf.c.x * vt.d.y - vf.c.y * vt.d.x + n * (vf.d.x * vt.d.y - vf.d.y * vt.d.x) = vt.c.x * vt.d.y - vt.c.y * vt.d.x
  // n = (vt.c.x * vt.d.y + vf.c.y * vt.d.x - vt.c.y * vt.d.x - vf.c.x * vt.d.y) / (vf.d.x * vt.d.y - vf.d.y * vt.d.x)
  connectIntersect(vf: Vector, vt: Vector): Path {
    const vfd: Coordinate = dtoc(vf.d);
    const vtd: Coordinate = dtoc(vt.d);
    const m =
      (vf.c.x * vfd.y + vt.c.y * vfd.x - vf.c.y * vfd.x - vt.c.x * vfd.y) /
      (vtd.y * vfd.x - vtd.x * vfd.y);
    const n =
      (vt.c.x * vtd.y + vf.c.y * vtd.x - vt.c.y * vtd.x - vf.c.x * vtd.y) /
      (vfd.x * vtd.y - vfd.y * vtd.x);
    if (m < 0 || n < 0 || Number.isNaN(m) || Number.isNaN(n)) {
      throw new Err.PointsNoIntersectionError();
    }
    const vx = vf.c.x + n * vfd.x;
    const vy = vf.c.y + n * vfd.y;
    const bo = this.r * Math.abs(Math.tan(((vt.d - vf.d) * Math.PI) / 8));
    const dvvf = distance({ x: vx, y: vy }, vf.c);
    if (bo > dvvf) {
      throw new Err.PointsTooCloseError();
    }
    const dvvt = distance({ x: vx, y: vy }, vt.c);
    if (bo > dvvf) {
      throw new Err.PointsTooCloseError();
    }
    const curvef = {
      x: vx - bo * Math.cos((vf.d * Math.PI) / 4),
      y: vy - bo * Math.sin((vf.d * Math.PI) / 4),
    };
    const curvet = {
      x: vx + bo * Math.cos((vt.d * Math.PI) / 4),
      y: vy + bo * Math.sin((vt.d * Math.PI) / 4),
    };
    return {
      origin: vf.c,
      nexts: [
        { point: curvef, arcRadius: 0 },
        { point: curvet, arcRadius: this.r },
        { point: vt.c, arcRadius: 0 },
      ],
    };
  }
}

function dtoc(d: Direction): Coordinate {
  switch (d) {
    case Direction.NORTH:
      return { x: 0, y: -1 };
    case Direction.NORTHEAST:
      return { x: 1, y: -1 };
    case Direction.EAST:
      return { x: 1, y: 0 };
    case Direction.SOUTHEAST:
      return { x: 1, y: 1 };
    case Direction.SOUTH:
      return { x: 0, y: 1 };
    case Direction.SOUTHWEST:
      return { x: -1, y: 1 };
    case Direction.WEST:
      return { x: -1, y: 0 };
    case Direction.NORTHWEST:
      return { x: -1, y: -1 };
    default:
      throw new Error("Unknown direction");
  }
}

function distance(c1: Coordinate, c2: Coordinate): number {
  return Math.sqrt(
    (c2.x - c1.x) * (c2.x - c1.x) + (c2.y - c1.y) * (c2.y - c1.y),
  );
}
