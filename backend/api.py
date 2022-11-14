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

class Data(BaseModel):
    data: List[Dict[str, str]]
    
clf = joblib.load('models/random_forest_clf.pkl') 

@app.post("/predict/")
async def predict(twitter_data: Data):
    identifier = [k for d in twitter_data.data for k in d.keys()]
    text = [v for d in twitter_data.data for v in d.values()]
    encoded_text = utils.process_data(text)
    preds = clf.predict(encoded_text).tolist()
    output = [{i: p} for i, p in zip(identifier, preds)]
    return output