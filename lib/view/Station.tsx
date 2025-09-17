import * as React from "react";

import { type CoordinateSystem, tss, tsx, tsy } from "../math/Coordinate.ts";
import * as modelpb from "../model/gen/model_pb.ts";
import * as viewpb from "../model/gen/view_pb.ts";

interface StationProps {
  name: string;
  key: string;
  model: modelpb.Station;
  view: viewpb.Station;
  viewSettings: viewpb.Settings;
  ics: CoordinateSystem;
}

export class Station extends React.Component<StationProps, {}> {
  constructor(props: StationProps) {
    super(props);
  }

  render() {
    const mns = this.props.model.trackArrangement!.nodes;
    const vns = this.props.view.nodes;
    if (mns.length != vns.length) {
      throw new Error(
        `Station ${this.props.name} has ${mns.length} nodes in model but ${vns.length} nodes in view`,
      );
    }
    var nodes: React.ReactNode[] = [];
    for (const [i, mn] of mns.entries()) {
      const vn = vns[i];
      switch (mn.node.case) {
        case "concourse":
          nodes.push(this.renderConcourse(mn.node.value, vn, 0));
          break;
        case "multiConcourse":
          var skipTrack = 0;
          for (const c of mn.node.value.concourses) {
            nodes.push(this.renderConcourse(c, vn, skipTrack));
            skipTrack += c.tracks.length;
          }
          break;
        default:
          throw new Error(`Unimplemented: ${mn.node.case}`);
      }
    }

    return nodes;
  }

  renderConcourse(
    mc: modelpb.Concourse,
    vn: viewpb.Station_Node,
    skipTrack: number,
  ) {
    const hl =
      this.props.viewSettings.stationSettings!.concourseTrackConnectorLength /
      2;
    const tr = this.props.viewSettings.stationSettings!.trackRadius;
    const dx = Math.sqrt(tr * tr - (tr - hl) * (tr - hl));
    const dy = tr - hl;

    var pathCmd = "";
    // Right half.
    var cx = vn.x;
    var cy = 0;
    for (var i = 0; i < mc.tracks.length; i++) {
      const ti = i + skipTrack;
      cy = vn.y - (vn.referenceTrack - ti) * 2 * tr;
      if (i == 0) {
        pathCmd += `M ${tsx(cx + dx, this.props.ics)} ${tsy(cy - dy, this.props.ics)}`;
      } else {
        pathCmd += ` L ${tsx(cx + dx, this.props.ics)} ${tsy(cy - dy, this.props.ics)}`;
      }
      pathCmd += ` A ${tss(tr, this.props.ics)} ${tss(tr, this.props.ics)} 0 0 1 ${tsx(cx + dx, this.props.ics)} ${tsy(cy + dy, this.props.ics)}`;
    }

    // Buttom.
    pathCmd += ` A ${tss(tr, this.props.ics)} ${tss(tr, this.props.ics)} 0 0 1 ${tsx(cx - dx, this.props.ics)} ${tsy(cy + dy, this.props.ics)}`;

    // Left half.
    for (var i = mc.tracks.length - 1; i >= 0; i--) {
      const ti = i + skipTrack;
      cy = vn.y - (vn.referenceTrack - ti) * 2 * tr;
      if (i != mc.tracks.length - 1) {
        pathCmd += ` L ${tsx(cx - dx, this.props.ics)} ${tsy(cy + dy, this.props.ics)}`;
      }
      pathCmd += ` A ${tss(tr, this.props.ics)} ${tss(tr, this.props.ics)} 0 0 1 ${tsx(cx - dx, this.props.ics)} ${tsy(cy - dy, this.props.ics)}`;
    }

    // Top.
    pathCmd += ` A ${tss(tr, this.props.ics)} ${tss(tr, this.props.ics)} 0 0 1 ${tsx(cx + dx, this.props.ics)} ${tsy(cy - dy, this.props.ics)}`;
    return (
      <>
        <path
          d={pathCmd}
          className={this.props.view.className}
          transform={`rotate(${vn.direction * 45} ${tsx(vn.x, this.props.ics)} ${tsx(vn.y, this.props.ics)})`}
          strokeWidth={tss(
            this.props.viewSettings.stationSettings!.trackStrokeWidth,
            this.props.ics,
          )}
        ></path>
      </>
    );
  }
}
