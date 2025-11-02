import * as React from "react";

import * as Coordinate from "./Coordinate.ts";
import * as Direction from "./Direction.ts";
import * as Err from "./MathError.ts";
import * as Shape from "./Shape.ts";
import * as Vector from "./Vector.ts";

export type Node = Coordinate.Coordinate;

export type Edge = {
  // If zero, connecting with a straight line.
  radius: number;
  clockwise?: boolean;
};

export type Path = {
  origin: Node;
  nexts: {
    edge: Edge;
    node: Node;
  }[];
};

export function render(
  tr: Coordinate.Transformer,
  path: Path,
  className: string,
  strokeWidth: number,
): React.ReactNode {
  var pathCmd: string = `M ${tr.tsx(path.origin.x)} ${tr.tsy(path.origin.y)}`;
  for (const next of path.nexts) {
    if (next.edge.radius == 0) {
      pathCmd += ` L ${tr.tsx(next.node.x)} ${tr.tsy(next.node.y)}`;
    } else {
      pathCmd += ` A ${tr.tss(next.edge.radius)} ${tr.tss(next.edge.radius)} 0 0 ${next.edge.clockwise ? 1 : 0} ${tr.tsx(next.node.x)} ${tr.tsy(next.node.y)}`;
    }
  }
  return (
    <path
      d={pathCmd}
      className={className}
      strokeWidth={tr.tss(strokeWidth)}
    ></path>
  );
}

export class Connector {
  private r: number;

  constructor(r: number) {
    this.r = r;
  }

  connect(vf: Vector.ShapeVector, vt: Vector.ShapeVector): Path {
    if (vf.d.equals(vt.d)) {
      return this.connectParellel(vf, vt);
    }
    return this.connectIntersect(vf, vt);
  }

  connectParellel(vf: Vector.ShapeVector, vt: Vector.ShapeVector): Path {
    const ftd = new Direction.Direction(vt.x - vf.x, vt.y - vf.y);
    const vfd = vf.d;
    const cp = vfd.cross(ftd);
    // vf, vt are on the same line
    if (cp == 0) {
      return {
        origin: vf.edgeCoordinate(),
        nexts: [
          {
            node: vt.edgeCoordinate(-Math.PI),
            edge: {
              radius: 0,
            },
          },
        ],
      };
    }
    var vm: Vector.Vector;
    if (cp > 0) {
      vm = new Vector.Vector(
        (vf.x + vt.x) / 2,
        (vf.y + vt.y) / 2,
        Direction.fromViewPbDirection(Direction.clockwise(vf.d)),
      );
    } else {
      vm = new Vector.Vector(
        (vf.x + vt.x) / 2,
        (vf.y + vt.y) / 2,
        Direction.fromViewPbDirection(Direction.counterClockwise(vf.d)),
      );
    }
    var vms: Vector.ShapeVector = new Vector.ShapeVector(vm, new Shape.Point());
    const fmp = this.connectIntersect(vf, vms);
    const mtp = this.connectIntersect(vms, vt);
    return {
      origin: fmp.origin,
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
  connectIntersect(vf: Vector.ShapeVector, vt: Vector.ShapeVector): Path {
    const m =
      (vf.x * vf.d.y + vt.y * vf.d.x - vf.y * vf.d.x - vt.x * vf.d.y) /
      (vt.d.y * vf.d.x - vt.d.x * vf.d.y);
    const n =
      (vt.x * vt.d.y + vf.y * vt.d.x - vt.y * vt.d.x - vf.x * vt.d.y) /
      (vf.d.x * vt.d.y - vf.d.y * vt.d.x);
    if (m < 0 || n < 0 || Number.isNaN(m) || Number.isNaN(n)) {
      throw new Err.PointsNoIntersectionError(
        "checking if the two vectors intersects",
        vf,
        vt,
      );
    }
    const vx = vf.x + n * vf.d.x;
    const vy = vf.y + n * vf.d.y;
    const intersect: Coordinate.Coordinate = new Coordinate.Coordinate(vx, vy);
    const bo = this.backoffLength(vf.d, vt.d);
    const dvvf = Coordinate.distance(intersect, vf.edgeCoordinate());
    if (bo > dvvf) {
      throw new Err.PointsTooCloseError(
        "checking if beginning of arc is between origin and intersection",
        vf,
        intersect,
        bo,
      );
    }
    const dvvt = Coordinate.distance(intersect, vt.edgeCoordinate(-Math.PI));
    if (bo > dvvt) {
      throw new Err.PointsTooCloseError(
        "checking if end of arc is between origin and intersection",
        intersect,
        vt,
        bo,
      );
    }
    const curvef = new Coordinate.Coordinate(
      vx - bo * vf.d.cos(),
      vy - bo * vf.d.sin(),
    );
    const curvet = new Coordinate.Coordinate(
      vx + bo * vt.d.cos(),
      vy + bo * vt.d.sin(),
    );
    return {
      origin: vf.edgeCoordinate(),
      nexts: [
        { node: curvef, edge: { radius: 0 } },
        {
          node: curvet,
          edge: { radius: this.r, clockwise: vf.d.cross(vt.d) > 0 },
        },
        {
          node: vt.edgeCoordinate(-Math.PI),
          edge: { radius: 0 },
        },
      ],
    };
  }

  backoffLength(d1: Direction.Direction, d2: Direction.Direction): number {
    const d1u = d1.unit();
    const d2u = d2.unit();
    const dm = new Direction.Direction(
      (d1u.x + d2u.x) / 2,
      (d1u.y + d2u.y) / 2,
    );
    const d1m = new Direction.Direction(dm.x - d1u.x, dm.y - d1u.y);
    return (this.r / dm.distance()) * d1m.distance();
  }
}
