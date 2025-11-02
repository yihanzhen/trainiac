import { Component } from "react";

import { Config } from "../config/Config.ts";
import * as Coordinate from "../math/Coordinate.ts";
import { Grid } from "./Grid.tsx";
import { Station } from "./Station.tsx";

interface GraphProps {
  model: string;
  view: string;
}

export class Graph extends Component<GraphProps, {}> {
  private config: Config;

  constructor(props: GraphProps) {
    super(props);
    this.config = Config.from(props.model, props.view);
  }

  render() {
    let cs = this.config.view.settings!.canvasSettings!;
    let u = cs.unitLength;
    return (
      <>
        <svg
          width={
            this.config.view.settings!.canvasSettings!.width *
            this.config.view.settings!.canvasSettings!.unitLength
          }
          height={
            this.config.view.settings!.canvasSettings!.height *
            this.config.view.settings!.canvasSettings!.unitLength
          }
        >
          <Grid
            canvasSettings={this.config.view.settings!.canvasSettings!}
          ></Grid>
          {Array.from(this.config.stations.entries()).map(
            ([n, stationConfig], _i) => {
              return (
                <Station
                  name={n}
                  key={n}
                  config={stationConfig}
                  viewSettings={this.config.view.settings!}
                  transformer={
                    new Coordinate.Transformer(
                      {
                        xOffset: cs.xOffset * u,
                        yOffset: cs.yOffset * u,
                        unitLength: u,
                      },
                      Coordinate.screen,
                    )
                  }
                ></Station>
              );
            },
          )}
        </svg>
      </>
    );
  }
}
