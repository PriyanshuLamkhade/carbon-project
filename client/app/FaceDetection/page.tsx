"use client";
import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
// import jsQR from "jsqr";

const videoConstraints = {
  width: 540,
  facingMode: "environment"
};

const Camera = () => {
  const webcamRef = useRef(null);
  const [url, setUrl] = React.useState(null);
  const capturePhoto = React.useCallback(() => {
  //@ts-ignore
  const imageSrc = webcamRef.current?.getScreenshot();
  setUrl(imageSrc);

  if (imageSrc) {
    const base64Data = imageSrc.split(",")[1]; // strip prefix
    sendToBackend(base64Data);
  }
}, [webcamRef]);

  const onUserMedia = (e:any) => {
    console.log(e);
  };

  const sendToBackend = async (base64: string) => {
  await fetch("/api/verify-face", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64 }),
  });
};


  return (
    <>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMedia={onUserMedia}
      />
      <button onClick={capturePhoto}>Capture</button>
      <button onClick={() => setUrl(null)}>Refresh</button>
      {url && (
        <div>
          <img src={url} alt="Screenshot" />
        </div>
      )}
    </>
  );
};

export default Camera;
