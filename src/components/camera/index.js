import { h } from "preact";
import { useState, useRef, useCallback, useEffect } from "preact/hooks";
import style from "./style.css";
import Webcam from "react-webcam";
import { useOpenCv } from "opencv-react";

const Camera = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const { loaded, cv } = useOpenCv();
  // input slider for low threshold
  const [lowThreshold, setLowThreshold] = useState(110);
  // input slider for high threshold
  const [highThreshold, setHighThreshold] = useState(230);

  useEffect(() => {
    if (cv && imgSrc) {
      // Convert from base64 to image.
      const image = new Image();
      image.src = imgSrc;
      const src = cv.imread(image);

      let dst = new cv.Mat();
      let invert = new cv.Mat();
      let ksize = new cv.Size(5, 5);

      cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
      cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY);
      cv.Canny(src, dst, lowThreshold, highThreshold, 3, true);
      cv.bitwise_not(dst, invert);
      cv.imshow("canvas-invert", dst);

      src.delete();
      dst.delete();
    }
  }, [cv, imgSrc, lowThreshold, highThreshold]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, []);

  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user",
  };

  return (
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      {imgSrc && <img width="0" src={imgSrc} />}
      <canvas id="canvas" width="400" height="400" />
      <canvas id="canvas-invert" width="400" height="400" />

      <div>
        <button onClick={capture}>Capture photo</button>
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
    </>
  );
};

export default Camera;
