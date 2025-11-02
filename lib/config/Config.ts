import { create, fromJsonString, merge } from "@bufbuild/protobuf";

import * as modelpb from "../model/gen/model_pb.ts";
import * as viewpb from "../model/gen/view_pb.ts";
import * as ConfigError from "./ConfigError.ts";
import * as StationConfig from "./StationConfig.ts";

function defaultModel() {
  return create(modelpb.ModelSchema, {});
}

function defaultView() {
  return create(viewpb.ViewSchema, {
    settings: {
      canvasSettings: {
        unitLength: 20,
        gridXOffset: 0.5,
        gridYOffset: 0.5,
        gridClassName: "default-grid",
      },
      stationSettings: {
        concourseTrackRadius: 0.5,
        concourseTrackStrokeWidth: 0.25,
        concourseTrackConnectorLength: 0.25,
        interlockingTrackRadius: 0.25,
        interlockingTrackStrokeWidth: 0.15,
        interlockingTrackConnectorLength: 0.1,
        stationLineCurveRadius: 2,
        stationLineStrokeWidth: 0.5,
      },
    },
  });
}

function defaultStationView() {
  return create(viewpb.StationSchema, {
    className: "default-station",
  });
}

export class Config {
  readonly model: modelpb.Model;
  readonly view: viewpb.View;
  readonly stations: Map<string, StationConfig.StationConfig>;

  private constructor(model: modelpb.Model, view: viewpb.View) {
    this.model = defaultModel();
    this.view = defaultView();
    merge(modelpb.ModelSchema, this.model, model);
    merge(viewpb.ViewSchema, this.view, view);
    let stationModelNames: string[] = this.model.stations.map((s) => {
      return s.name;
    });

    let stationViewNames: string[] = this.view.stations.map((s) => {
      return s.name;
    });

    let noViewStations = stationModelNames.filter(
      (item) => !stationViewNames.includes(item),
    );

    let noModelStations = stationViewNames.filter(
      (item) => !stationModelNames.includes(item),
    );
    if (noViewStations.length != 0) {
      throw new ConfigError.StationsWithoutViewError(noViewStations);
    }
    if (noModelStations.length != 0) {
      throw new ConfigError.StationsWithoutModelError(noModelStations);
    }
    const stations = new Map<string, [modelpb.Station, viewpb.Station]>();
    for (const s of model.stations) {
      stations.set(s.name, [s, create(viewpb.StationSchema)]);
    }
    for (const s of view.stations) {
      var merged = defaultStationView();
      merge(viewpb.StationSchema, merged, s);
      stations.get(s.name)![1] = merged;
    }
    this.stations = new Map();
    for (const [name, modelView] of stations.entries()) {
      this.stations.set(
        name,
        new StationConfig.StationConfig(modelView[0], modelView[1]),
      );
    }
  }

  public static from(modelData: string, viewData: string) {
    const m = fromJsonString(modelpb.ModelSchema, modelData);
    const v = fromJsonString(viewpb.ViewSchema, viewData);
    return new Config(m, v);
  }
}
