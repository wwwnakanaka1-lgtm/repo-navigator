from app.core.config import settings


def test_settings_defaults() -> None:
    assert settings.app_name == "Repo Navigator API"
    assert settings.cache_ttl_seconds > 0
