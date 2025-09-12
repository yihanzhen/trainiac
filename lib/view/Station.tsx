import React from "react";

import * as viewpb from "../model/gen/view_pb.ts";

interface StationProps {
  name: string;
  key: string;
  view: viewpb.Station;
  viewSettings: viewpb.Settings;
}

type TrackSpec = {
  cx: number;
  cy: number;
  r: number;
  color: string;
  strokeWidth: number;
};

type ConcourseSpec = {
  trackSpecs: TrackSpec[];
};

export class Station extends React.Component<StationProps, {}> {
  constructor(props: StationProps) {
    super(props);
  }

  render() {
    const trackSettings = this.props.viewSettings.trackSettings!;
    const unitLength: number =
      this.props.viewSettings!.canvasSettings!.unitLength;

    const concourseSpec: ConcourseSpec = {
      trackSpecs: [
        {
          cx: this.props.view.x * unitLength,
          cy: this.props.view.y * unitLength,
          r: trackSettings.trackRadius * unitLength,
          strokeWidth: trackSettings.trackStrokeWidth * unitLength,
          color: this.props.view.color,
        },
      ],
    };

    return (
      <>
        {
          <circle
            cx={concourseSpec.trackSpecs[0]!.cx}
            cy={concourseSpec.trackSpecs[0]!.cy}
            r={concourseSpec.trackSpecs[0]!.r}
            stroke={concourseSpec.trackSpecs[0]!.color}
            strokeWidth={concourseSpec.trackSpecs[0]!.strokeWidth}
            fill="none"
          />
        }
      </>
    );
  }
}
