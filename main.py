from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend connection (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load model
model = joblib.load("best_co2_model.pkl")

# Input schema
class CO2Input(BaseModel):
    amount: float
    category: str
    subcategory: str

@app.post("/predict")
def predict_co2(data: CO2Input):
    df = pd.DataFrame([{
        "Amount": data.amount,
        "Category": data.category,
        "Subcategory": data.subcategory
    }])
    prediction = model.predict(df)[0]
    return {"estimated_co2": round(float(prediction), 2)}
