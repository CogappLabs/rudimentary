import { OpenCvProvider } from "opencv-react";
import { h } from "preact";

import Camera from "./camera";

const App = () => (
  <div id="app">
    <OpenCvProvider>
      <Camera />
    </OpenCvProvider>
  </div>
);

export default App;
