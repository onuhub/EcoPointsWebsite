# main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import requests
import os

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------- Download model from Google Drive if not already downloaded ----------
MODEL_URL = "https://drive.google.com/uc?export=download&id=1xunV0bTzV2bb5jh5tTCZpc0uNBQhcyMN"
MODEL_PATH = "best_co2_model.pkl"

if not os.path.exists(MODEL_PATH):
    print("Downloading model from Google Drive...")
    response = requests.get(MODEL_URL)
    with open(MODEL_PATH, "wb") as f:
        f.write(response.content)
    print("Download complete.")

# Load the model
model = joblib.load(MODEL_PATH)

# Request schema
class PredictionRequest(BaseModel):
    amount: float
    category: str
    subcategory: str

# Root route — to show API is working
@app.get("/")
def read_root():
    return {"message": "Carbon Footprint API is live!"}

# Prediction route
@app.post("/predict")
async def predict(data: PredictionRequest):
    # Make a prediction based on input features
    features = [[data.amount, data.category, data.subcategory]]
    prediction = model.predict(features)[0]
    return {"estimated_co2": round(float(prediction), 2)}
