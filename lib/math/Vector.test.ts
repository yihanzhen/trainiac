import { describe, expect, it } from "vitest";

import * as Coordinate from "./Coordinate";
import * as Direction from "./Direction.ts";
import * as Shape from "./Shape.ts";
import * as Vector from "./Vector.ts";

describe("vector", () => {
  it("works", () => {
    const v1: Vector.Vector = new Vector.Vector(
      1,
      2,
      new Direction.Direction(0, 1),
    );
    const v2: Vector.Vector = new Vector.Vector(
      new Coordinate.Coordinate(1, 2),
      new Direction.Direction(0, 1),
    );
    expect(v1).to.deep.equal(v2);
    expect(v1.move(2)).to.deep.equal(
      new Vector.Vector(1, 4, new Direction.Direction(0, 1)),
    );
    expect(v1.move(new Direction.Direction(1, 0), 2)).to.deep.equal(
      new Vector.Vector(3, 2, new Direction.Direction(0, 1)),
    );
    expect(v1.equals(v2)).to.equal(true);
    expect(v1.toString()).to.equal("{(1,2)->(0,1)}");
  });
});

describe("shapeVector", () => {
  it("works", () => {
    const v1: Vector.ShapeVector = new Vector.ShapeVector(
      1,
      2,
      new Direction.Direction(0, 1),
      new Shape.Point(),
    );
    const v2: Vector.ShapeVector = new Vector.ShapeVector(
      new Vector.Vector(1, 2, new Direction.Direction(0, 1)),
      new Shape.Point(),
    );
    expect(v1).to.deep.equal(v2);
    const v3: Vector.ShapeVector = new Vector.ShapeVector(
      new Vector.Vector(1, 2, new Direction.Direction(0, 1)),
      new Shape.Circle(2),
    );
    expect(v1.edgeCoordinate()).to.deep.equal(new Coordinate.Coordinate(1, 2));
    expect(v3.edgeCoordinate()).to.deep.equal(new Coordinate.Coordinate(1, 4));
    expect(v3.edgeCoordinate(-Math.PI / 2)).to.deep.equal(
      new Coordinate.Coordinate(3, 2),
    );
    expect(v3.edgeDistance(-Math.PI / 2)).to.deep.equal(2);
  });
});
