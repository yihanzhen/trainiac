import * as modelpb from "../model/gen/model_pb.ts";
import * as viewpb from "../model/gen/view_pb.ts";
import * as ConfigError from "./ConfigError.ts";

export type NodeConfig = {
  readonly name: string;
  readonly model: modelpb.TrackArrangement_Node;
  readonly view: viewpb.Station_Node;
};

export type TrackRailwayConfig = {
  readonly railway: string;
  readonly model: modelpb.TrackRailway;
};

export class StationConfig {
  readonly name: string;
  readonly model: modelpb.Station;
  readonly view: viewpb.Station;
  readonly nodeMap: Map<string, NodeConfig>;
  readonly trackRailwayMap: Map<string, TrackRailwayConfig>;

  constructor(model: modelpb.Station, view: viewpb.Station) {
    const mns = model.trackArrangement!.nodes;
    const vns = view.nodes;
    const trs = model.trackArrangement!.trackRailways;
    if (mns.length != vns.length) {
      throw new Error(
        `Station ${model.name} has ${mns.length} nodes in model but ${vns.length} nodes in view`,
      );
    }
    const nodeMap: Map<string, NodeConfig> = new Map();
    for (const [i, mn] of mns.entries()) {
      const vn = vns[i];
      const name = mn.node.value!.name;
      nodeMap.set(name, { name: name, model: mn, view: vn });
    }
    const trackRailwayMap: Map<string, TrackRailwayConfig> = new Map();
    for (const tr of trs) {
      trackRailwayMap.set(tr.railway, { railway: tr.railway, model: tr });
      for (const conn of tr.connections) {
        switch (conn.connection.case) {
          case "interConnection":
            continue;
          case "intraConnection":
            if (!nodeMap.has(conn.connection.value.node)) {
              throw new ConfigError.UnknownConnectionNodeError(
                model.name,
                tr.railway,
                conn.connection.value.node,
              );
            }
            break;
          default:
            throw new ConfigError.UnknownTrackRailwayConnectionTypeError(
              model.name,
              tr.railway,
              conn,
            );
        }
      }
    }
    this.name = model.name;
    this.model = model;
    this.view = view;
    this.nodeMap = nodeMap;
    this.trackRailwayMap = trackRailwayMap;
  }
}
