import * as React from "react";

import * as ConfigError from "../config/ConfigError.ts";
import * as StationConfig from "../config/StationConfig.ts";
import * as Coordinate from "../math/Coordinate.ts";
import * as Direction from "../math/Direction.ts";
import * as Path from "../math/Path.tsx";
import * as Shape from "../math/Shape.ts";
import * as Vector from "../math/Vector.ts";
import * as modelpb from "../model/gen/model_pb.ts";
import * as viewpb from "../model/gen/view_pb.ts";

interface StationProps {
  name: string;
  key: string;
  config: StationConfig.StationConfig;
  viewSettings: viewpb.Settings;
  transformer: Coordinate.Transformer;
}

export class Station extends React.Component<StationProps, {}> {
  private connector: Path.Connector;

  constructor(props: StationProps) {
    super(props);
    this.connector = new Path.Connector(
      props.viewSettings.stationSettings!.stationLineCurveRadius,
    );
  }

  render() {
    var nodeNodes = this.renderNodes(
      this.props.config.name,
      this.props.config.nodeMap,
      this.props.config.trackRailwayMap,
    );
    var lineNodes = this.renderLines(
      this.props.config.name,
      this.props.config.nodeMap,
      this.props.config.trackRailwayMap,
      this.props.viewSettings,
    );
    return [...nodeNodes, ...lineNodes];
  }

  renderLines(
    stationName: string,
    nodeMap: Map<string, StationConfig.NodeConfig>,
    trackRailwayMap: Map<string, StationConfig.TrackRailwayConfig>,
    viewSettings: viewpb.Settings,
  ): React.ReactNode[] {
    var nodes: React.ReactNode[] = [];
    for (const [name, tr] of trackRailwayMap.entries()) {
      var vectors: Vector.ShapeVector[] = [];
      var pushEntryFirst: boolean = false;
      for (const [i, conn] of tr.model.connections.entries()) {
        switch (conn.connection.case) {
          case "interConnection":
            switch (conn.connection.value) {
              case modelpb.TrackRailway_InterConnection.ENTRY:
                if (i != 0) {
                  throw new ConfigError.NotFirstEntryError(stationName, name);
                }
                pushEntryFirst = true;
                break;
              case modelpb.TrackRailway_InterConnection.EXIT:
                // TODO: integrate with inter-station lines; for now making
                // it a dangling start 5 units the opposite direction of the
                // point.
                if (i != tr.model.connections.length - 1) {
                  throw new ConfigError.NotLastExitError(stationName, name);
                }
                const prevVector = vectors[vectors.length - 1];
                vectors.push(
                  new Vector.ShapeVector(
                    prevVector.move(prevVector.d, 5),
                    new Shape.Point(),
                  ),
                );
                break;
              default:
                throw new ConfigError.UnknownTrackRailwayConnectionTypeError(
                  stationName,
                  name,
                  conn,
                );
            }
            break;
          case "intraConnection":
            const nodeName: string = conn.connection.value.node;
            const nodeConfig: StationConfig.NodeConfig = nodeMap.get(nodeName)!;
            const nodeModel = nodeConfig.model;
            const nodeView = nodeConfig.view;
            const radius: number = this.trackRadius(
              nodeModel,
              viewSettings.stationSettings!,
            );
            const currVector: Vector.Vector = this.trackVector(
              nodeModel,
              nodeView,
              conn.connection.value.reverse,
              viewSettings!.stationSettings!,
              conn.connection.value.track,
            );
            // TODO: integrate with inter-station lines; for now making
            // it a dangling start 5 units the opposite direction of the
            // point.
            if (pushEntryFirst) {
              const prevVector: Vector.ShapeVector = new Vector.ShapeVector(
                currVector.move(currVector.d.reverse(), 5),
                new Shape.Point(),
              );
              vectors.push(prevVector);
              pushEntryFirst = false;
            }
            vectors.push(
              new Vector.ShapeVector(currVector, new Shape.Circle(radius)),
            );
            break;
          default:
            throw new ConfigError.UnknownTrackRailwayConnectionTypeError(
              stationName,
              name,
              conn,
            );
        }
      }
      for (const [i, currVec] of vectors.entries()) {
        if (i == vectors.length - 1) {
          break;
        }

        const path: Path.Path = this.connector.connect(currVec, vectors[i + 1]);
        nodes.push(
          Path.render(
            this.props.transformer,
            path,
            // TODO: read from model
            "default-station-line",
            viewSettings.stationSettings!.stationLineStrokeWidth,
          ),
        );
      }
    }
    return nodes;
  }

  renderNodes(
    stationName: string,
    nodeMap: Map<string, StationConfig.NodeConfig>,
    trackRailwayMap: Map<string, StationConfig.TrackRailwayConfig>,
  ): React.ReactNode[] {
    var nodes: React.ReactNode[] = [];
    for (const [name, nodeConfig] of nodeMap.entries()) {
      const mn = nodeConfig.model;
      const vn = nodeConfig.view;
      switch (mn.node.case) {
        case "concourse":
          nodes.push(
            this.renderConcourse(
              mn.node.value,
              this.props.viewSettings.stationSettings!,
              vn,
              0,
            ),
          );
          break;
        case "multiConcourse":
          var skipTrack = 0;
          for (const c of mn.node.value.concourses) {
            nodes.push(
              this.renderConcourse(
                c,
                this.props.viewSettings.stationSettings!,
                vn,
                skipTrack,
              ),
            );
            skipTrack += c.trackCount;
          }
          break;
        case "interlocking":
          nodes.push(
            this.renderInterlocking(
              mn.node.value,
              this.props.viewSettings.stationSettings!,
              vn,
            ),
          );
          break;
        case "terminus":
          nodes.push(
            this.renderTerminus(
              mn.node.value,
              this.props.viewSettings.stationSettings!,
              vn,
              0,
            ),
          );
          break;
        default:
          throw new Error(`Unimplemented: ${mn.node.case}`);
      }
    }
    return nodes;
  }

  renderNode(
    numTracks: number,
    trackConnectorLength: number,
    trackRadius: number,
    strokeWidth: number,
    skipTrack: number,
    refTrack: number,
    nx: number,
    ny: number,
    nd: viewpb.Direction,
    outOnly: boolean,
  ) {
    const hl = trackConnectorLength / 2;
    const tr = trackRadius;
    const dx = Math.sqrt(tr * tr - (tr - hl) * (tr - hl));
    const dy = tr - hl;

    // TODO: move this to math/.
    var pathCmd = "";
    // Right half.
    var cx = nx;
    var cy0 = ny - (refTrack - skipTrack) * 2 * tr;
    var cy = cy0;
    for (var i = 0; i < numTracks; i++) {
      const ti = i + skipTrack;
      cy = ny - (refTrack - ti) * 2 * tr;
      if (i == 0) {
        pathCmd += `M ${this.props.transformer.tsx(cx + dx)} ${this.props.transformer.tsy(cy - dy)}`;
      } else {
        pathCmd += ` L ${this.props.transformer.tsx(cx + dx)} ${this.props.transformer.tsy(cy - dy)}`;
      }
      pathCmd += ` A ${this.props.transformer.tss(tr)} ${this.props.transformer.tss(tr)} 0 0 1 ${this.props.transformer.tsx(cx + dx)} ${this.props.transformer.tsy(cy + dy)}`;
    }

    // Buttom.
    pathCmd += ` A ${this.props.transformer.tss(tr)} ${this.props.transformer.tss(tr)} 0 0 1 ${this.props.transformer.tsx(cx - dx)} ${this.props.transformer.tsy(cy + dy)}`;

    // Left half.
    if (outOnly) {
      cy = cy0;
      pathCmd += ` L ${this.props.transformer.tsx(cx - dx)} ${this.props.transformer.tsy(cy - dy)}`;
    } else {
      for (var i = numTracks - 1; i >= 0; i--) {
        const ti = i + skipTrack;
        cy = ny - (refTrack - ti) * 2 * tr;
        if (i != numTracks - 1) {
          pathCmd += ` L ${this.props.transformer.tsx(cx - dx)} ${this.props.transformer.tsy(cy + dy)}`;
        }
        pathCmd += ` A ${this.props.transformer.tss(tr)} ${this.props.transformer.tss(tr)} 0 0 1 ${this.props.transformer.tsx(cx - dx)} ${this.props.transformer.tsy(cy - dy)}`;
      }
    }

    // Top.
    pathCmd += ` A ${this.props.transformer.tss(tr)} ${this.props.transformer.tss(tr)} 0 0 1 ${this.props.transformer.tsx(cx + dx)} ${this.props.transformer.tsy(cy - dy)}`;
    return (
      <>
        <path
          d={pathCmd}
          className={this.props.config.view.className}
          transform={`rotate(${nd * 45} ${this.props.transformer.tsx(nx)} ${this.props.transformer.tsx(ny)})`}
          strokeWidth={this.props.transformer.tss(strokeWidth)}
        ></path>
      </>
    );
  }

  renderConcourse(
    mc: modelpb.Concourse,
    vs: viewpb.StationSettings,
    vn: viewpb.Station_Node,
    skipTrack: number,
  ) {
    return this.renderNode(
      mc.trackCount,
      vs.concourseTrackConnectorLength,
      vs.concourseTrackRadius,
      vs.concourseTrackStrokeWidth,
      skipTrack,
      vn.referenceTrack,
      vn.x,
      vn.y,
      vn.direction,
      false,
    );
  }

  renderInterlocking(
    mc: modelpb.Interlocking,
    vs: viewpb.StationSettings,
    vn: viewpb.Station_Node,
  ) {
    return this.renderNode(
      mc.trackCount,
      vs.interlockingTrackConnectorLength,
      vs.interlockingTrackRadius,
      vs.interlockingTrackStrokeWidth,
      0,
      vn.referenceTrack,
      vn.x,
      vn.y,
      vn.direction,
      false,
    );
  }

  renderTerminus(
    mc: modelpb.Terminus,
    vs: viewpb.StationSettings,
    vn: viewpb.Station_Node,
    skipTrack: number,
  ) {
    return this.renderNode(
      mc.trackCount,
      vs.concourseTrackConnectorLength,
      vs.concourseTrackRadius,
      vs.concourseTrackStrokeWidth,
      skipTrack,
      vn.referenceTrack,
      vn.x,
      vn.y,
      vn.direction,
      true,
    );
  }

  trackRadius(
    nodeModel: modelpb.TrackArrangement_Node,
    vs: viewpb.StationSettings,
  ) {
    switch (nodeModel.node.case) {
      case "interlocking":
        return vs.interlockingTrackRadius;
      case "concourse":
      case "terminus":
        return vs.concourseTrackRadius;
      default:
        throw new Error(`unimplemented type: ${nodeModel.node.case}`);
    }
  }

  trackVector(
    nodeModel: modelpb.TrackArrangement_Node,
    nodeView: viewpb.Station_Node,
    reverse: boolean,
    vs: viewpb.StationSettings,
    index: number,
  ): Vector.Vector {
    var nodeVector: Vector.Vector = new Vector.Vector(
      nodeView.x,
      nodeView.y,
      Direction.fromViewPbDirection(nodeView.direction),
    );
    const shiftTracks: number = index - nodeView.referenceTrack;
    const trackRadius: number = this.trackRadius(nodeModel, vs);
    const shiftDistance: number = shiftTracks * trackRadius * 2;
    nodeVector = nodeVector.move(
      nodeVector.d.rotate(Math.PI / 2),
      shiftDistance,
    );
    if (reverse) {
      nodeVector = nodeVector.reverse();
    }
    return nodeVector;
  }
}
