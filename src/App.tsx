import { BrowserRouter, Routes, Route } from "react-router-dom";
import TrainiacAppBar from "../lib/view/AppBar.tsx";
import Canvas from "../lib/view/canvas.tsx";

function PlaygroundApp() {
  return (
    <>
      <h1>hi</h1>
      <Canvas />
    </>
  );
}

function MainApp() {
  return (
    <>
      <TrainiacAppBar />
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
