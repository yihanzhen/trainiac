import * as modelpb from "../model/gen/model_pb.ts";

export class ConfigError extends Error {}

export class StationsWithoutModelError extends ConfigError {
  constructor(stations: string[]) {
    super(`these stations do not have models: ${stations}`);
  }
}

export class StationsWithoutViewError extends ConfigError {
  constructor(stations: string[]) {
    super(`these stations do not have views: ${stations}`);
  }
}

export class UnknownConnectionNodeError extends ConfigError {
  constructor(station: string, trackRailway: string, node: string) {
    super(
      `unknown node: ${node} in track railway ${trackRailway} in station ${station}`,
    );
  }
}

export class UnknownTrackRailwayConnectionTypeError extends ConfigError {
  constructor(
    station: string,
    trackRailway: string,
    connection: modelpb.TrackRailway_Connection,
  ) {
    super(
      `unsupported track railway connection: ${JSON.stringify(connection)} in track railway ${trackRailway} in station ${station}`,
    );
  }
}

export class NotFirstEntryError extends ConfigError {
  constructor(station: string, trackRailway: string) {
    super(
      `unsupported track railway connection: connection of type ENTRY must be the first in the list. track railway ${trackRailway} in station ${station}`,
    );
  }
}

export class NotLastExitError extends ConfigError {
  constructor(station: string, trackRailway: string) {
    super(
      `unsupported track railway connection: connection of type EXIT must be the last in the list. track railway ${trackRailway} in station ${station}`,
    );
  }
}
