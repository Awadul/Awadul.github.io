from pathlib import Path

from pydantic import AliasChoices, Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env", env_prefix="CHAT_", extra="ignore"
    )

    database_path: Path = BACKEND_DIR / "data" / "chat.sqlite3"
    cors_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    session_days: int = Field(default=30, ge=1, le=365)
    openai_api_key: SecretStr | None = Field(default=None, validation_alias=AliasChoices("CHAT_OPENAI_API_KEY", "OPENAI_API_KEY", "openai_api_key"))
    openai_model: str = "gpt-4.1-mini"
    ai_turns_per_hour: int = Field(default=30, ge=1, le=1000)
    ai_max_output_tokens: int = Field(default=600, ge=100, le=2000)
    admin_token: SecretStr | None = None
    smtp_host: str = ""
    smtp_port: int = Field(default=587, ge=1, le=65535)
    smtp_username: str = ""
    smtp_password: SecretStr | None = None
    smtp_from: str = ""
    notification_to: str = "awaisabdullahm@gmail.com"
    email_chat_digests: bool = True
    digest_idle_minutes: int = Field(default=10, ge=1, le=1440)
    trusted_proxy_cidrs: list[str] = []

    @field_validator("trusted_proxy_cidrs")
    @classmethod
    def validate_proxies(cls, values):
        from ipaddress import ip_network
        for value in values:
            network = ip_network(value, strict=False)
            if network.prefixlen == 0:
                raise ValueError("Do not trust every IP as a proxy")
        return values

