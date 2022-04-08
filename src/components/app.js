import { OpenCvProvider } from "opencv-react";
import Camera from "./camera";
import Header from "./header";
import "style/index.css";

const App = () => (
  <div id="app">
    <Header />
    <OpenCvProvider>
      <Camera />
    </OpenCvProvider>
  </div>
);

export default App;
