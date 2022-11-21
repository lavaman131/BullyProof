from pydantic import BaseSettings


class Settings(BaseSettings):
    client_id : str 
    redirect_uri: str = "http://127.0.0.1:8000"
    scope: str
    code_challenge: str
    code_challenge_method: str

    class Config:
        env_file = ".env"