import { h } from "preact";
import { useState, useRef, useCallback, useEffect } from "preact/hooks";
import style from "./style.css";
import Webcam from "react-webcam";
import { useOpenCv } from "opencv-react";

const Camera = () => {
  const webcamRef = useRef(null);

  const [imgSrc, setImgSrc] = useState(null);
  const { loaded, cv } = useOpenCv();

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
      cv.Canny(src, dst, 130, 220, 3, true);
      cv.bitwise_not(dst, invert);
      cv.imshow("canvas", dst);

      src.delete();
      dst.delete();
    }
  }, [cv, imgSrc]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const videoConstraints = {
    width: 600,
    height: 600,
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
      <button onClick={capture}>Capture photo</button>
      {imgSrc && <img src={imgSrc} />}
      <canvas id="canvas" width="600" height="600" />;
    </>
  );
};

export default Camera;
