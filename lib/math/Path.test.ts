import * as Chai from "chai";
import chaiAlmost from "chai-almost";
import { describe, expect, it } from "vitest";

import * as ViewPb from "../model/gen/view_pb.ts";
import * as Coordinate from "./Coordinate.ts";
import * as Direction from "./Direction.ts";
import * as Err from "./MathError.ts";
import * as Path from "./Path.tsx";
import * as Shape from "./Shape.ts";
import * as Vector from "./Vector.ts";

Chai.use(chaiAlmost(0.01));

describe("connector", () => {
  it("can connect intersection", () => {
    const vf = new Vector.ShapeVector(
      0,
      0,
      Direction.fromViewPbDirection(ViewPb.Direction.EAST),
      new Shape.Circle(1),
    );
    const vt = new Vector.ShapeVector(
      10,
      10,
      Direction.fromViewPbDirection(ViewPb.Direction.SOUTH),
      new Shape.Circle(1),
    );
    const path = new Path.Connector(5).connect(vf, vt);
    // @ts-ignore: added by the plugin
    Chai.expect(path).to.almost.eql({
      origin: new Coordinate.Coordinate(1, 0),
      nexts: [
        {
          node: new Coordinate.Coordinate(5, 0),
          edge: {
            radius: 0,
          },
        },
        {
          node: new Coordinate.Coordinate(10, 5),
          edge: {
            radius: 5,
            clockwise: true,
          },
        },
        {
          node: new Coordinate.Coordinate(10, 9),
          edge: {
            radius: 0,
          },
        },
      ],
    });
  });
  it("can connect same line", () => {
    const vf = new Vector.ShapeVector(
      0,
      0,
      Direction.fromViewPbDirection(ViewPb.Direction.EAST),
      new Shape.Circle(1),
    );
    const vt = new Vector.ShapeVector(
      10,
      0,
      Direction.fromViewPbDirection(ViewPb.Direction.EAST),
      new Shape.Circle(1),
    );
    const path = new Path.Connector(5).connect(vf, vt);
    // @ts-ignore: added by the plugin
    Chai.expect(path).to.almost.eql({
      origin: new Coordinate.Coordinate(1, 0),
      nexts: [
        {
          node: new Coordinate.Coordinate(9, 0),
          edge: {
            radius: 0,
          },
        },
      ],
    });
  });
  it("can connect parellel", () => {
    const vf = new Vector.ShapeVector(
      0,
      0,
      Direction.fromViewPbDirection(ViewPb.Direction.EAST),
      new Shape.Circle(1),
    );
    const vt = new Vector.ShapeVector(
      10,
      3,
      Direction.fromViewPbDirection(ViewPb.Direction.EAST),
      new Shape.Circle(1),
    );
    const path = new Path.Connector(5).connect(vf, vt);
    // @ts-ignore: added by the plugin
    Chai.expect(path).to.almost.deep.eql({
      origin: new Coordinate.Coordinate(1, 0),
      nexts: [
        {
          node: new Coordinate.Coordinate(1.428932188134524, 0),
          edge: {
            radius: 0,
          },
        },
        {
          node: new Coordinate.Coordinate(
            4.964466094067262,
            1.4644660940672627,
          ),
          edge: {
            radius: 5,
            clockwise: true,
          },
        },
        {
          node: new Coordinate.Coordinate(5, 1.5),
          edge: {
            radius: 0,
          },
        },
        {
          node: new Coordinate.Coordinate(
            5.035533905932738,
            1.5355339059327373,
          ),
          edge: {
            radius: 0,
          },
        },
        {
          node: new Coordinate.Coordinate(8.571067811865476, 3),
          edge: {
            radius: 5,
            clockwise: false,
          },
        },
        {
          node: new Coordinate.Coordinate(9, 3),
          edge: {
            radius: 0,
          },
        },
      ],
    });
  });
  it("error when points are too close", () => {
    const vf = new Vector.ShapeVector(
      0,
      0,
      Direction.fromViewPbDirection(ViewPb.Direction.EAST),
      new Shape.Circle(1),
    );
    const vt = new Vector.ShapeVector(
      1,
      1,
      Direction.fromViewPbDirection(ViewPb.Direction.SOUTH),
      new Shape.Circle(1),
    );
    expect(() => new Path.Connector(5).connect(vf, vt)).toThrowError(
      Err.PointsTooCloseError,
    );
  });
  it("error when points have no intersection", () => {
    const vf = new Vector.ShapeVector(
      0,
      0,
      Direction.fromViewPbDirection(ViewPb.Direction.EAST),
      new Shape.Circle(1),
    );
    const vt = new Vector.ShapeVector(
      1,
      1,
      Direction.fromViewPbDirection(ViewPb.Direction.NORTH),
      new Shape.Circle(1),
    );
    expect(() => new Path.Connector(5).connect(vf, vt)).toThrowError(
      Err.PointsNoIntersectionError,
    );
  });
});
