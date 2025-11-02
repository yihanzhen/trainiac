import { Component } from "react";

import * as Coordinate from "../math/Coordinate.ts";
import { type CanvasSettings } from "../model/gen/view_pb.ts";

interface GridProps {
  canvasSettings: CanvasSettings;
}

export class Grid extends Component<GridProps, {}> {
  constructor(props: GridProps) {
    super(props);
  }

  render() {
    let cs = this.props.canvasSettings;
    if (cs.disableGrid) {
      return <></>;
    }
    if (cs.gridXOffset < 0 || cs.gridXOffset >= 1) {
      throw new Error("grid_x_offset must be in the range of [0, 1)");
    }
    if (cs.gridYOffset < 0 || cs.gridYOffset >= 1) {
      throw new Error("grid_y_offset must be in the range of [0, 1)");
    }
    let u = cs.unitLength;
    let inhSys: Coordinate.CoordinateSystem = {
      xOffset: cs.xOffset * u,
      yOffset: cs.yOffset * u,
      unitLength: u,
    };
    let topLeftScr: Coordinate.Coordinate = new Coordinate.Coordinate(0, 0);
    let bottomRightScr: Coordinate.Coordinate = new Coordinate.Coordinate(
      cs.width * u,
      cs.height * u,
    );
    const transformer: Coordinate.Transformer = new Coordinate.Transformer(
      inhSys,
      Coordinate.screen,
    );
    let topLeftInh = transformer.transform(topLeftScr);
    let bottomRightInh = transformer.transform(bottomRightScr);
    let topLeftInhFloorOffset = {
      x: Math.floor(topLeftInh.x) - 1 + cs.gridXOffset,
      y: Math.floor(topLeftInh.y) - 1 + cs.gridYOffset,
    };
    let bottomRightInhFloorOffset = {
      x: Math.ceil(bottomRightInh.x) + cs.gridXOffset,
      y: Math.ceil(bottomRightInh.y) + cs.gridYOffset,
    };
    let xsInh = Array.from(
      { length: bottomRightInhFloorOffset.x - topLeftInhFloorOffset.x + 1 },
      (_, i) => {
        return topLeftInhFloorOffset.x + i + 1;
      },
    );
    let ysInh = Array.from(
      { length: bottomRightInhFloorOffset.y - topLeftInhFloorOffset.y + 1 },
      (_, i) => {
        return topLeftInhFloorOffset.y + i + 1;
      },
    );

    return (
      <>
        {xsInh.map((xInh, _i, _a) => {
          let xScr = transformer.tsx(xInh);
          return (
            <line
              x1={xScr}
              y1={topLeftScr.y}
              x2={xScr}
              y2={bottomRightScr.y}
              className={this.props.canvasSettings.gridClassName}
            ></line>
          );
        })}
        {ysInh.map((yInh, _i, _a) => {
          let yScr = transformer.tsy(yInh);
          return (
            <line
              y1={yScr}
              x1={topLeftScr.x}
              y2={yScr}
              x2={bottomRightScr.x}
              className={this.props.canvasSettings.gridClassName}
            ></line>
          );
        })}
      </>
    );
  }
}
