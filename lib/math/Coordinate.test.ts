import { describe, expect, it } from "vitest";

import * as Coordinate from "./Coordinate";
import * as Direction from "./Direction.ts";

describe("coordinate", () => {
  it("works", () => {
    const c1: Coordinate.Coordinate = new Coordinate.Coordinate(3, 5);
    const c2: Coordinate.Coordinate = new Coordinate.Coordinate(3, 5);
    const c3: Coordinate.Coordinate = new Coordinate.Coordinate(3, 6);
    expect(c1.equals(c2)).to.equal(true);
    expect(c1.equals(c3)).to.equal(false);
    expect(c1.move(new Direction.Direction(0, 1), 1).equals(c3)).to.equal(true);
  });

  it("transforms", () => {
    const c: Coordinate.Coordinate = new Coordinate.Coordinate(3, 3);
    const tr: Coordinate.Transformer = new Coordinate.Transformer(
      {
        xOffset: -3,
        yOffset: -3,
        unitLength: 1,
      },
      Coordinate.screen,
    );
    const d: Coordinate.Coordinate = tr.transform(c);
    expect(d).to.deep.equal(new Coordinate.Coordinate(0, 0));
  });
});
