import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import playgroundErrStationModel from "../impl/playground/errstation/model.json?raw";
import playgroundErrStationView from "../impl/playground/errstation/view.json?raw";
import playgroundMultiConcourseStationModel from "../impl/playground/multiconcoursestation/model.json?raw";
import playgroundMultiConcourseStationView from "../impl/playground/multiconcoursestation/view.json?raw";
import playgroundSingleStationModel from "../impl/playground/station/model.json?raw";
import playgroundSingleStationView from "../impl/playground/station/view.json?raw";
import playgroundTwoStationsModel from "../impl/playground/twostations/model.json?raw";
import playgroundTwoStationsView from "../impl/playground/twostations/view.json?raw";
import playgroundTwoTrackConcourseStationModel from "../impl/playground/twotrackconcoursestation/model.json?raw";
import playgroundTwoTrackConcourseStationView from "../impl/playground/twotrackconcoursestation/view.json?raw";
import { TrainiacAppBar } from "../lib/view/AppBar.tsx";
import { Graph } from "../lib/view/Graph.tsx";
import { GraphError } from "../lib/view/GraphError.tsx";
import { PlaygroundCard } from "../lib/view/Playground.tsx";

function PlaygroundApp() {
  return (
    <>
      <TrainiacAppBar appName="Trainiac playground" />
      <Box sx={{ p: 6 }}>
        <Grid container spacing={6}>
          <PlaygroundCard name="single station">
            <GraphError>
              <Graph
                model={playgroundSingleStationModel}
                view={playgroundSingleStationView}
              ></Graph>
            </GraphError>
          </PlaygroundCard>
          <PlaygroundCard name="two station">
            <GraphError>
              <Graph
                model={playgroundTwoStationsModel}
                view={playgroundTwoStationsView}
              ></Graph>
            </GraphError>
          </PlaygroundCard>
          <PlaygroundCard name="err station">
            <GraphError>
              <Graph
                model={playgroundErrStationModel}
                view={playgroundErrStationView}
              ></Graph>
            </GraphError>
          </PlaygroundCard>
          <PlaygroundCard name="two track concourse station">
            <GraphError>
              <Graph
                model={playgroundTwoTrackConcourseStationModel}
                view={playgroundTwoTrackConcourseStationView}
              ></Graph>
            </GraphError>
          </PlaygroundCard>
          <PlaygroundCard name="two track concourse station">
            <GraphError>
              <Graph
                model={playgroundMultiConcourseStationModel}
                view={playgroundMultiConcourseStationView}
              ></Graph>
            </GraphError>
          </PlaygroundCard>
        </Grid>
      </Box>
    </>
  );
}

function MainApp() {
  return (
    <>
      <TrainiacAppBar appName="Trainiac" />
      <div>main</div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={MainApp()} />
        <Route path="/playground" element={PlaygroundApp()} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
