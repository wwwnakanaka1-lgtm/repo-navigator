from datetime import datetime, timedelta
from typing import Any


class MemoryCache:
    def __init__(self, ttl_seconds: int = 60) -> None:
        self.ttl_seconds = ttl_seconds
        self._expires_at = datetime.min
        self._payload: Any = None

    def get(self) -> Any | None:
        if datetime.utcnow() > self._expires_at:
            return None
        return self._payload

    def set(self, payload: Any) -> None:
        self._payload = payload
        self._expires_at = datetime.utcnow() + timedelta(seconds=self.ttl_seconds)
