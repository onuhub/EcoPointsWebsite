from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI()

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = joblib.load("best_co2_model.pkl")

# Define expected input
class InputData(BaseModel):
    category: str
    subcategory: str
    country: str
    city: str
    quantity: float

@app.post("/predict")
def predict(data: InputData):
    features = [[
        data.category,
        data.subcategory,
        data.country,
        data.city,
        data.quantity
    ]]
    prediction = model.predict(features)[0]
    return {"prediction": prediction}
