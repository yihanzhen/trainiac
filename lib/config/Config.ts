import { create, fromJsonString, merge } from "@bufbuild/protobuf";

import * as modelpb from "../model/gen/model_pb.ts";
import * as viewpb from "../model/gen/view_pb.ts";

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
        trackRadius: 0.5,
        trackStrokeWidth: 0.25,
        concourseTrackConnectorLength: 0.25,
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
  readonly stations: Map<string, [modelpb.Station, viewpb.Station]>;

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

    let errMsg = "";

    if (noViewStations.length != 0) {
      errMsg = `these stations do not have views: ${noViewStations}`;
    }
    if (noModelStations.length != 0) {
      if (errMsg != "") {
        errMsg += "; ";
      }
      errMsg += `these stations do not have models: ${noModelStations}`;
    }
    if (errMsg != "") {
      throw new Error(errMsg);
    }
    this.stations = new Map<string, [modelpb.Station, viewpb.Station]>();
    for (const s of model.stations) {
      this.stations.set(s.name, [s, create(viewpb.StationSchema)]);
    }
    for (const s of view.stations) {
      var merged = defaultStationView();
      merge(viewpb.StationSchema, merged, s);
      this.stations.get(s.name)![1] = merged;
    }
  }

  public static from(modelData: string, viewData: string) {
    const m = fromJsonString(modelpb.ModelSchema, modelData);
    const v = fromJsonString(viewpb.ViewSchema, viewData);
    return new Config(m, v);
  }

  public stationModel(name: string): modelpb.Station {
    return this.stations.get(name)![0];
  }

  public stationView(name: string): viewpb.Station {
    return this.stations.get(name)![1];
  }
}
