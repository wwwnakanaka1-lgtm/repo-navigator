from pydantic import BaseModel, Field


class Settings(BaseModel):
    app_name: str = "Repo Navigator API"
    scan_root: str = Field(default=r"C:\Users\wwwhi\Create")
    cache_ttl_seconds: int = 60


settings = Settings()
