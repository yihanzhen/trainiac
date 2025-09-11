import { BrowserRouter, Route, Routes } from "react-router-dom";

import { TrainiacAppBar } from "../lib/view/AppBar.tsx";
import Canvas from "../lib/view/canvas.tsx";

function PlaygroundApp() {
  return (
    <>
      <TrainiacAppBar appName="Trainiac playground" />
      <Canvas />
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
