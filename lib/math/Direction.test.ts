import * as Chai from "chai";
import chaiAlmost from "chai-almost";
import { describe, expect, it } from "vitest";

import * as Coordinate from "./Coordinate";
import * as Direction from "./Direction.ts";

Chai.use(chaiAlmost(0.001));

describe("direction", () => {
  it("works", () => {
    const d: Direction.Direction = new Direction.Direction(3, 5);
    // @ts-ignore: added by the plugin
    Chai.expect(d.unit()).to.almost.eql(
      new Direction.Direction(0.5145, 0.8575),
    );
    // @ts-ignore: added by the plugin
    Chai.expect(d.rotate(Math.PI / 2)).to.almost.eql(
      new Direction.Direction(-5, 3),
    );

    Chai.expect(d.reverse()).to.deep.equal(new Direction.Direction(-3, -5));
  });
});
