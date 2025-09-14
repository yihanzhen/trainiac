export type CoordinateSystem = {
  xOffset: number;
  yOffset: number;
  unitLength: number;
};

export var screen = {
  xOffset: 0,
  yOffset: 1,
  unitLength: 1,
};

export type Coordinate = {
  x: number;
  y: number;
};

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

export function transformX(
  x: number,
  fromSys: CoordinateSystem,
  toSys: CoordinateSystem,
) {
  let xAbs = x * fromSys.unitLength + fromSys.xOffset;
  return (xAbs - toSys.xOffset) / toSys.unitLength;
}

export function transformY(
  y: number,
  fromSys: CoordinateSystem,
  toSys: CoordinateSystem,
) {
  let yAbs = y * fromSys.unitLength + fromSys.yOffset;
  return (yAbs - toSys.yOffset) / toSys.unitLength;
}
