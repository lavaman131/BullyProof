from fastapi import FastAPI
from pydantic import BaseModel
from typing import Union, List
from fastapi.middleware.cors import CORSMiddleware
import joblib
import utils

app = FastAPI()

origins = [
    "http://localhost:8000",
    "http://127.0.0.1:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

class Text(BaseModel):
    twitter_text: List[str]
    
clf = joblib.load('models/random_forest_clf.pkl') 

@app.post("/predict/")
async def predict(text: Text):
    encoded_text = utils.process_data(text.twitter_text)
    pred = clf.predict(encoded_text).tolist()
    return {'prediction': pred}