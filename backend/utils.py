import numpy as np
import pandas as pd
import re
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords

nltk.download("stopwords")
nltk.download("wordnet")
nltk.download("omw-1.4")
import joblib
from typing import List

# constants for preprocess data
stop_words = set(stopwords.words("english"))
stop_words.add("rt")
stop_words.remove("not")
lemmatizer = WordNetLemmatizer()
giant_url_regex = (
    "http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|" "[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+"
)
mention_regex = "@[\w\-]+"


def _clean_text(text: str):
    text = re.sub('"', "", text)
    text = re.sub(mention_regex, " ", text)  # removing all user names
    text = re.sub(giant_url_regex, " ", text)  # removing the urls
    text = text.lower()
    text = re.sub("hm+", "", text)  # removing variants of hmmm
    text = re.sub(
        "[^a-z]+", " ", text
    )  # removing all numbers, special chars like @,#,? etc
    text = text.split()
    text = [word for word in text if not word in stop_words]
    text = [lemmatizer.lemmatize(token) for token in text]
    text = [lemmatizer.lemmatize(token, "v") for token in text]
    text = " ".join(text)
    return text


def _z_norm(X, mu, sigma):
    return (X - mu) / sigma


def process_data(raw_text: List[str]):
    text = pd.Series(raw_text)
    text = text.apply(_clean_text)
    vectorizer = joblib.load("vectorizer.pkl")
    encoded_text = vectorizer.transform(text).toarray()
    with open("stats.npy", "rb") as f:
        mu = np.load(f)
        sigma = np.load(f)
    encoded_text = _z_norm(encoded_text, mu, sigma)
    return encoded_text
