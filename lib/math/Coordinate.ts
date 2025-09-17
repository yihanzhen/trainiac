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
  yOffset: 1,
  unitLength: 1,
};

export type Coordinate = {
  x: number;
  y: number;
};

// Transforms a coordinate from fromSys to toSys.
export function transform(
  c: Coordinate,
  fromSys: CoordinateSystem,
  toSys: CoordinateSystem,
): Coordinate {
  return {
    x: transformX(c.x, fromSys, toSys),
    y: transformY(c.y, fromSys, toSys),
  };
}

// Transforms the x coordinate from fromSys to toSys.
export function transformX(
  x: number,
  fromSys: CoordinateSystem,
  toSys: CoordinateSystem,
) {
  let xAbs = x * fromSys.unitLength + fromSys.xOffset;
  return (xAbs - toSys.xOffset) / toSys.unitLength;
}

// Transforms the y coordinate from fromSys to toSys.
export function transformY(
  y: number,
  fromSys: CoordinateSystem,
  toSys: CoordinateSystem,
) {
  let yAbs = y * fromSys.unitLength + fromSys.yOffset;
  return (yAbs - toSys.yOffset) / toSys.unitLength;
}

// Transfroms the x coordinate from cs to screen.
export function tsx(x: number, cs: CoordinateSystem) {
  return transformX(x, cs, screen);
}

// Transfroms the y coordinate from cs to screen.
export function tsy(y: number, cs: CoordinateSystem) {
  return transformY(y, cs, screen);
}

// Transfroms the scalar coordinate from cs to screen.
export function tss(s: number, cs: CoordinateSystem) {
  return cs.unitLength * s;
}
