import * as Chai from "chai";
import chaiAlmost from "chai-almost";
import { describe, expect, it } from "vitest";

import * as Err from "../errors/Error.ts";
import { Direction } from "../model/gen/view_pb.ts";
import * as Path from "./Path";

Chai.use(chaiAlmost(0.001));

describe("connector", () => {
  it("can connect intersection", () => {
    const vf = {
      c: { x: 0, y: 0 },
      d: Direction.EAST,
    };
    const vt = {
      c: { x: 10, y: 10 },
      d: Direction.SOUTH,
    };
    const path = new Path.Connector(5).connect(vf, vt);
    // @ts-ignore: added by the plugin
    Chai.expect(path).to.almost.eql({
      origin: { x: 0, y: 0 },
      nexts: [
        {
          point: { x: 5, y: 0 },
          arcRadius: 0,
        },
        {
          point: { x: 10, y: 5 },
          arcRadius: 5,
        },
        {
          point: { x: 10, y: 10 },
          arcRadius: 0,
        },
      ],
    });
  });
  it("can connect same line", () => {
    const vf = {
      c: { x: 0, y: 0 },
      d: Direction.EAST,
    };
    const vt = {
      c: { x: 10, y: 0 },
      d: Direction.EAST,
    };
    const path = new Path.Connector(5).connect(vf, vt);
    // @ts-ignore: added by the plugin
    Chai.expect(path).to.almost.eql({
      origin: { x: 0, y: 0 },
      nexts: [
        {
          point: { x: 10, y: 0 },
          arcRadius: 0,
        },
      ],
    });
  });
  it("can connect parellel", () => {
    const vf = {
      c: { x: 0, y: 0 },
      d: Direction.EAST,
    };
    const vt = {
      c: { x: 10, y: 3 },
      d: Direction.EAST,
    };
    const path = new Path.Connector(5).connect(vf, vt);
    // @ts-ignore: added by the plugin
    Chai.expect(path).to.almost.eql({
      origin: { x: 0, y: 0 },
      nexts: [
        {
          arcRadius: 0,
          point: {
            x: 1.4289,
            y: 0,
          },
        },
        {
          arcRadius: 5,
          point: {
            x: 4.9645,
            y: 1.4645,
          },
        },
        {
          arcRadius: 0,
          point: {
            x: 5,
            y: 1.5,
          },
        },
        {
          arcRadius: 0,
          point: {
            x: 5.0355,
            y: 1.5355,
          },
        },
        {
          arcRadius: 5,
          point: {
            x: 8.5711,
            y: 3,
          },
        },
        {
          arcRadius: 0,
          point: {
            x: 10,
            y: 3,
          },
        },
      ],
    });
  });
  it("error when points are too close", () => {
    const vf = {
      c: { x: 0, y: 0 },
      d: Direction.EAST,
    };
    const vt = {
      c: { x: 1, y: 1 },
      d: Direction.SOUTH,
    };
    expect(() => new Path.Connector(5).connect(vf, vt)).toThrowError(
      new Err.PointsTooCloseError(),
    );
  });
  it("error when points have no intersection", () => {
    const vf = {
      c: { x: 0, y: 0 },
      d: Direction.EAST,
    };
    const vt = {
      c: { x: 1, y: 1 },
      d: Direction.NORTH,
    };
    expect(() => new Path.Connector(5).connect(vf, vt)).toThrowError(
      new Err.PointsNoIntersectionError(),
    );
  });
});
