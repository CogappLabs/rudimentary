import { h } from "preact";
import { useState, useRef, useCallback, useEffect } from "preact/hooks";
// import style from "./style.css";
import Webcam from "react-webcam";
import { useOpenCv } from "opencv-react";

const Camera = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const { loaded, cv } = useOpenCv();
  const [lowThreshold, setLowThreshold] = useState(200);
  const [highThreshold, setHighThreshold] = useState(255);

  useEffect(() => {
    if (cv && imgSrc) {
      // Convert from base64 to image.
      const image = new Image();
      image.src = imgSrc;

      const src = cv.imread(image);
      const dst = new cv.Mat();
      const invert = new cv.Mat();
      const ksize = new cv.Size(5, 5);

      cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
      cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY);
      cv.Canny(src, dst, lowThreshold, highThreshold, 3, false);
      cv.bitwise_not(dst, invert);
      cv.imshow("canvas-invert", invert);

      src.delete();
      dst.delete();
    }
  }, [cv, imgSrc, lowThreshold, highThreshold]);

  const captureHandler = useCallback(() => {
    const src = webcamRef.current.getScreenshot();
    setImgSrc(src);
  }, []);

  const uploadHandler = useCallback((e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImgSrc(reader.result);
    };
  }, []);

  // save canvas in new window as png
  const printHandler = useCallback(() => {
    const canvas = document.getElementById("canvas-invert");
    const img = canvas.toDataURL("image/png");
    const win = window.open("");
    win.document.write(
      `<img src='${img}' width='${canvas.width}' height='${canvas.height}'/>`
    );
  }, []);

  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user",
  };

  return (
    <>
      <div>
        <button onClick={captureHandler}>Capture portrait</button>
        {/* <div>
          <p>Or upload...</p>
          <input type="file" name="file" onChange={uploadHandler} />
        </div> */}
      </div>
      <div>
        <label>Low</label>
        <input
          type="range"
          min="0"
          max="255"
          value={lowThreshold}
          onChange={(e) => setLowThreshold(parseInt(e.target.value, 10))}
        />
      </div>
      <div>
        <label>High</label>
        <input
          type="range"
          min="0"
          max="255"
          value={highThreshold}
          onChange={(e) => setHighThreshold(parseInt(e.target.value, 10))}
        />
      </div>

      <div>
        <button onClick={printHandler}>Print</button>
      </div>

      <canvas id="canvas-invert" width="400" height="0" />
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />

      {imgSrc && <img width="0" src={imgSrc} />}
    </>
  );
};

export default Camera;
