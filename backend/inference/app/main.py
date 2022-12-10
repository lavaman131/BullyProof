from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoTokenizer, TFAutoModelForSequenceClassification
import numpy as np
from scipy.special import softmax
import utils

app = FastAPI()
tokenizer = AutoTokenizer.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment")
model = TFAutoModelForSequenceClassification.from_pretrained(
    "cardiffnlp/twitter-roberta-base-sentiment"
)

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TwitterData(BaseModel):
    id: str
    text: str


@app.post("/predict/")
async def predict(twitter_data: List[TwitterData]):
    identifiers = [t.id for t in twitter_data]
    text = [t.text for t in twitter_data]
    preds = []
    for t in text:
        encoded_input = tokenizer(utils.preprocess(t), return_tensors="tf")
        output = model(encoded_input)
        scores = output[0][0].numpy()
        scores = softmax(scores)
        # label mapping = ["negative", "neutral", "positive"]
        if np.argmax(scores, axis=0) == 0:
            preds.append(1)
        else:
            preds.append(0)
    output = [{"id": i, "sentiment": p} for i, p in zip(identifiers, preds)]
    return output
