from fastapi import FastAPI, Depends
from fastapi.responses import HTMLResponse 
from pydantic import BaseModel
from typing import Union, List, Dict
from fastapi.middleware.cors import CORSMiddleware
import joblib
import utils
import urllib3
from urllib.parse import urlencode
from config import Settings
from functools import lru_cache
import db
import json
import tweepy
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

"""

clf = joblib.load('models/random_forest_clf.pkl') 

@app.post("/predict/")
async def predict(twitter_data: List[TwitterData]):
    identifiers = [t.id for t in twitter_data]
    text = [t.text for t in twitter_data]
    encoded_text = utils.process_data(text)
    preds = clf.predict(encoded_text).tolist()
    output = [{'id': i, 'sentiment': p} for i, p in zip(identifiers, preds)]
    return output

"""
def generate_html_response():
    html_content = """
    <html>
        <head>
            <title>BullyProof</title>
        </head>
        <body>
            <h1>Thanks for signing-in! </h1>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content, status_code=200)

@lru_cache()
def get_settings():
    return Settings()

http = urllib3.PoolManager()


@app.get('/userInfo')
async def getUserInfo(user_id:int):
    res = db.get_user_token(user_id)

    if res['status'] == 200:
        res2 = db.get_user_twitter_user_id(user_id)
        twitter_user_id = res2['data']['twitter_user_id']
        token = res['data']['token']
        client = tweepy.Client(token)
        data = client.get_users_following(id=twitter_user_id).data
        return {
            'data':data,
            'status':200,
            'message':'successful info look up'
        }
    else:
        return res

# https://twitter.com/i/oauth2/authorize?response_type=code&client_id=aTBraVVTSHktUmE1ZHVGRXQ0YXo6MTpjaQ&redirect_uri=http://127.0.0.1:8000/api/token&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=challenge&code_challenge_method=plain
@app.get('/api/token')
async def token(code:str, state: Union[str,None] = None, settings: Settings = Depends(get_settings)):
    url = "https://api.twitter.com/2/oauth2/token?"
    queryParams = urlencode({
        'grant_type':'authorization_code',
        'client_id':settings.client_id,
        'redirect_uri':settings.redirect_uri,
        'code_verifier':settings.code_challenge,
        'code':code
    })
    req = url+queryParams
    r = http.request('POST',req)
    token = (json.loads(r.data.decode('utf-8'))['access_token'])
    client = tweepy.Client(token)
    twitter_user_id = client.get_me(user_auth=False).data['id']
    # replace later with real user_id 
    user_id = 123
    db.update_user(user_id, twitter_user_id=twitter_user_id, token=token)
    return generate_html_response()

@app.get('/')
async def root(settings: Settings = Depends(get_settings)):
    return settings
