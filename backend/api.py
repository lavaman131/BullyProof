from fastapi import FastAPI
from pydantic import BaseModel
from typing import Union, List, Dict
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

class TwitterData(BaseModel):
    id: str
    text: str
    
clf = joblib.load('models/random_forest_clf.pkl') 

@app.post("/predict/")
async def predict(twitter_data: List[TwitterData]):
    identifiers = [t.id for t in twitter_data]
    text = [t.text for t in twitter_data]
    encoded_text = utils.process_data(text)
    preds = clf.predict(encoded_text).tolist()
    output = [{'id': i, 'sentiment': p} for i, p in zip(identifiers, preds)]
    return output