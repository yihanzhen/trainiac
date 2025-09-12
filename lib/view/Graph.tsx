import { Component } from "react";

import { Config } from "../config/Config.ts";
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
          {Array.from(this.config.stations.entries()).map(
            ([n, [, view]], _i) => {
              return (
                <Station
                  name={n}
                  key={n}
                  view={view}
                  viewSettings={this.config.view.settings!}
                ></Station>
              );
            },
          )}
        </svg>
      </>
    );
  }
}
