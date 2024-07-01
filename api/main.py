from io import BytesIO
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
import PIL.Image
import tensorflow as tf
import sys

# Set the default encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

app = FastAPI()

# Load the model
model = tf.keras.models.load_model("../models/eye_classifier_1.keras")
diseases = ['cataract', 'diabetic_retinopathy', 'glaucoma', 'normal']

# CORS Configuration
origins = [
    "http://localhost:8400",  # Update with your frontend URL
    "http://localhost:8400",  # Allow multiple origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

def read_imagefile(data) -> np.ndarray:
    img = PIL.Image.open(BytesIO(data))
    img = img.resize((256, 256))
    numpy_image = np.array(img)
    numpy_image = np.expand_dims(numpy_image, 0)
    return numpy_image

@app.post('/predict')
async def predict(file: UploadFile = File(...)):
    extension = file.filename.split(".")[-1] in ("jpg", "jpeg", "png")
    if not extension:
        raise HTTPException(status_code=415, detail="Unsupported file format. Please upload a JPG, JPEG, or PNG file.")

    np_img = read_imagefile(await file.read())
    prediction = model.predict(np_img)

    predicted_class = diseases[np.argmax(prediction[0])]
    confidence = float(np.max(prediction[0]))

    return {
        "pred_class": predicted_class,
        "confidence": confidence
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8501)
