import React from "react";
import { ViewConfig } from "../model/gen/view_pb.ts";

class Graph extends React.Component<void, void> {
  private viewConfig: ViewConfig;
  private color: string;

  constructor(props: void, viewConfig: ViewConfig, color: string) {
    super(props);
    this.viewConfig = viewConfig;
    this.color = color;
  }

  render() {
    return (
      <>
        {
          <circle
            cx="100"
            cy="100"
            r="{this.viewConfig.trackSize}"
            stroke="{this.color}"
            stroke-width="{this.viewConfig.trackStrokeWidth}"
            fill="none"
          />
        }
      </>
    );
  }
}
