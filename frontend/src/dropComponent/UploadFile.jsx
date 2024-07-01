import React, { useState } from "react";
import Dropzone from "react-dropzone";
import api from "../api.js";

const UploadFile = () => {
  const [predictions, setPredictions] = useState({
    predicted_class: "",
    confidence: 0.0,
  });
  const [file, setFile] = useState(null);

  const onDrop = async (acceptedFiles) => {
    const imageFile = acceptedFiles[0];
    setFile(imageFile);

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await api.post("/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPredictions({
        predicted_class: response.data.pred_class,
        confidence: Math.round(response.data.confidence * 100),
      });
    } catch (error) {
      console.error("Error predicting image:", error);
      // Handle error as needed
    }
  };

  return (
    <div className="main-container">
      <Dropzone onDrop={onDrop} accept="image/*" minSize={1024} maxSize={3072000}>
        {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => {
          const additionalClass = isDragAccept ? "accept" : isDragReject ? "reject" : "";

          return (
            <div
              {...getRootProps({
                className: `dropzone ${additionalClass}`,
              })}
            >
              <input {...getInputProps()} />
              <p>Drag and Drop Images or Click to Select Files</p>
            </div>
          );
        }}
      </Dropzone>
      {file && (
        <>
          <h4>File Uploaded Successfully !!</h4>
          <img src={URL.createObjectURL(file)} className="img-container" alt="Uploaded file" />
          {predictions.predicted_class && (
            <div>
              <h4>Prediction: {predictions.predicted_class}</h4>
              <p>Confidence: {predictions.confidence}%</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UploadFile;
