# P1-A Backend Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A running FastAPI service on Postgres 16 in which people can sign up into the right world (patient, scholar, clinician), log in with rotating refresh tokens and TOTP 2FA, grant and revoke consents, have clinicians verified by an admin, and every sensitive action lands in a tamper-evident audit chain — with the database itself stopping scholar code from reading patient data.

**Architecture:** Modular monolith (ADR-001). One FastAPI app under `apps/api`, hand-written Alembic SQL migrations, SQLAlchemy 2 Core-style queries over asyncpg, one connection pool per database login role so Postgres grants and row-level security enforce data boundaries (ADR-004). Redis backs rate limiting. The audit chain is computed inside Postgres by a `SECURITY DEFINER` function so app roles can append but never read or rewrite it.

**Tech Stack:** Python 3.12 (uv), FastAPI 0.141, SQLAlchemy 2.1 + asyncpg 0.31, psycopg 3.3 (migrations/tests), Alembic 1.20, Pydantic 2.13 + pydantic-settings, argon2-cffi 25, PyJWT 2.15, pyotp 2.10, cryptography 50 (AES-GCM), redis-py 8, structlog 26, pytest + pytest-asyncio + httpx. Postgres 16 with pgvector image, Redis 7, via Docker Compose.

**Spec:** `docs/02-Engineering/TRD.md` §4 (identity), §9 (NFRs); `docs/02-Engineering/Backend-Schema.md`; `docs/02-Engineering/API.md` (Auth and account, Admin); `docs/00-Home/Rules.md`; `docs/05-Planning/Phases.md` P1; `docs/05-Planning/Tracker.md` T-0.06, T-1.01–T-1.09, T-1.15.

## Global Constraints

- Python `>=3.12,<3.13`; run everything through `uv` from `apps/api`.
- Postgres 16 image `pgvector/pgvector:pg16`; Redis `redis:7-alpine`.
- Five schemas: `core`, `patient`, `clinical`, `scholar`, `audit` (Backend-Schema.md). `clinical` is created empty in P1.
- Passwords hashed with Argon2id (argon2-cffi defaults). Access token JWT HS256, 15 min (`access_ttl_seconds=900`). Refresh token opaque, 14 days, rotating, reuse detection revokes the whole family, stored only as SHA-256.
- Refresh cookie: name `zs_refresh`, `HttpOnly`, `SameSite=Strict`, `Path=/api/v1/auth`, `Secure` when `ZS_COOKIE_SECURE=true`.
- Error body is always `{"error": {"code": "SNAKE_CASE", "message": "...", "detail": {}}}` (API.md).
- Base path `/api/v1`; health at `/health` and `/health/ready`.
- Minimum age 18 by birth year (PRD §4): `current_year - birth_year < 18` → `422 UNDER_18`.
- Role-required consents at doc version `1.0`: patient `terms, screening_disclaimer, ai_processing`; scholar `terms, ai_processing`; clinician `terms`; admin none.
- Clinician and admin need TOTP before any admin or patient-data endpoint (`403 MFA_REQUIRED`).
- Auth endpoints rate-limited to 10 requests per minute per client IP (`429 RATE_LIMITED`).
- `zs_scholar_app` has no privilege on schema `patient`. Audit rows are append-only; app roles may only call `audit.append`.
- Logs carry IDs, never passwords, tokens, email addresses or free text (Rules › Privacy 7).
- Every commit authored by Hamza Younas; message starts with the tracker ID. No AI attribution.

## Review Focus

1. **Refresh token replay after rotation** — a stolen old refresh token used after the real client rotated must kill the whole session family, not just fail. Pinned in Task 6 (`test_refresh_reuse_revokes_family`).
2. **Email case and whitespace** — `Sana@Example.com ` and `sana@example.com` are one account; signup must 409 and login must succeed with either. Pinned in Task 6 (`test_email_is_case_insensitive`).
3. **Timing leak on unknown email** — login for a non-existent email must still run an Argon2 verify so response time doesn't reveal accounts. Pinned in Task 4 (`test_verify_against_dummy_hash_is_false`) and used in Task 6.
4. **TOTP code replay** — the same 6-digit code accepted twice within its 30 s window lets a shoulder-surfer in. Pinned in Task 8 (`test_totp_code_cannot_be_reused`).
5. **Proof upload spoofing** — a `.exe` renamed `licence.pdf` with `Content-Type: application/pdf` must be rejected by magic bytes, and files over 5 MB rejected. Pinned in Task 7 (`test_proof_rejects_fake_pdf`, `test_proof_rejects_large_file`).

---

## File Structure

```
package.json, pnpm-workspace.yaml, .editorconfig        monorepo root (web workspace arrives in P1-B)
infra/docker-compose.yml                                 postgres+pgvector, redis, minio
infra/.env.example                                       compose defaults
apps/api/
  pyproject.toml, alembic.ini, .env.example
  app/main.py                    create_app(), lifespan, routers, middleware
  app/cli.py                     create-admin command
  app/core/config.py             Settings
  app/core/errors.py             AppError + handlers
  app/core/logging.py            structlog config + request-id middleware
  app/core/db.py                 Database: one async engine per role, role-scoped sessions
  app/core/ids.py                uuid7()
  app/core/pseudonym.py          patient pseudonyms, invite codes
  app/core/security.py           argon2, JWT, refresh tokens
  app/core/crypto.py             AES-GCM for *_enc columns and files
  app/core/audit.py              record(), verify_chain()
  app/core/ratelimit.py          Redis fixed-window limiter
  app/core/storage.py            encrypted local file storage
  app/core/deps.py               Claims, current_claims, require_role, require_mfa
  app/modules/health/router.py
  app/modules/identity/schemas.py   request/response models
  app/modules/identity/consents.py  consent doc versions + required sets
  app/modules/identity/service.py   signup, login, refresh, logout, me, consents
  app/modules/identity/mfa.py       TOTP setup/enable/verify
  app/modules/identity/clinician.py clinician signup + proof validation
  app/modules/identity/router.py    /auth/*, /me/*
  app/modules/admin/service.py      clinician verification queue + decisions
  app/modules/admin/router.py       /admin/*
  migrations/env.py, migrations/script.py.mako
  migrations/versions/0001_baseline.py     schemas, enums, tables, audit functions
  migrations/versions/0002_roles_rls.py    login roles, grants, RLS
  tests/conftest.py
  tests/test_health.py, tests/test_errors.py
  tests/db/test_baseline.py, tests/db/test_roles_rls.py
  tests/core/test_security.py, tests/core/test_crypto.py, tests/core/test_audit.py, tests/core/test_ratelimit.py
  tests/identity/test_signup_login.py, tests/identity/test_refresh.py, tests/identity/test_consents.py,
  tests/identity/test_mfa.py, tests/identity/test_clinician.py
  tests/admin/test_verification.py
```

---

### Task 1: Monorepo skeleton, Compose stack, API skeleton with health and error shape (T-0.06, T-1.01, T-1.02)

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `.editorconfig`, `infra/docker-compose.yml`, `infra/.env.example`
- Create: `apps/api/pyproject.toml`, `apps/api/.env.example`, `apps/api/app/__init__.py`, `apps/api/app/main.py`, `apps/api/app/core/__init__.py`, `apps/api/app/core/config.py`, `apps/api/app/core/errors.py`, `apps/api/app/core/logging.py`, `apps/api/app/modules/__init__.py`, `apps/api/app/modules/health/__init__.py`, `apps/api/app/modules/health/router.py`
- Test: `apps/api/tests/__init__.py`, `apps/api/tests/test_health.py`, `apps/api/tests/test_errors.py`
- Modify: `.gitignore` (add `apps/api/var/`, `apps/api/.venv/`)

**Interfaces:**
- Produces: `get_settings() -> Settings`; `AppError(code: str, message: str, status: int = 400, detail: dict | None = None)`; `create_app() -> FastAPI`; settings fields listed below.

- [ ] **Step 1: Root workspace files**

`package.json`
```json
{
  "name": "zehensync",
  "private": true,
  "packageManager": "pnpm@12.6.0",
  "scripts": {
    "db:up": "docker compose -f infra/docker-compose.yml --env-file infra/.env.example up -d",
    "db:down": "docker compose -f infra/docker-compose.yml --env-file infra/.env.example down"
  }
}
```
`pnpm-workspace.yaml`
```yaml
packages:
  - "apps/web"
  - "packages/*"
```
`.editorconfig`
```ini
root = true
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
[*.py]
indent_size = 4
```

- [ ] **Step 2: Compose stack**

`infra/.env.example`
```ini
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=zehensync
MINIO_ROOT_USER=minio
MINIO_ROOT_PASSWORD=minio-dev-password
```
`infra/docker-compose.yml`
```yaml
name: zehensync
services:
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports: ["5432:5432"]
    volumes: [pg_data:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 5s
      timeout: 5s
      retries: 10
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 10
  minio:
    image: minio/minio:RELEASE.2025-04-22T22-12-26Z
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    ports: ["9000:9000", "9001:9001"]
    volumes: [minio_data:/data]
volumes:
  pg_data:
  minio_data:
```
Run: `pnpm db:up` then `docker compose -f infra/docker-compose.yml ps`
Expected: postgres and redis `healthy`.

- [ ] **Step 3: API project**

`apps/api/pyproject.toml`
```toml
[project]
name = "zehensync-api"
version = "0.2.0"
requires-python = ">=3.12,<3.13"
dependencies = [
  "fastapi>=0.141,<1",
  "uvicorn[standard]>=0.32",
  "sqlalchemy[asyncio]>=2.1,<2.2",
  "asyncpg>=0.31",
  "psycopg[binary]>=3.3",
  "alembic>=1.20",
  "pydantic>=2.13",
  "pydantic-settings>=2.6",
  "email-validator>=2.2",
  "argon2-cffi>=25.1",
  "pyjwt>=2.15",
  "pyotp>=2.10",
  "cryptography>=50",
  "structlog>=26.1",
  "python-multipart>=0.0.12",
  "redis>=8.1",
]

[dependency-groups]
dev = ["pytest>=8.3", "pytest-asyncio>=0.24", "httpx>=0.28", "ruff>=0.8", "mypy>=1.13"]

[tool.uv]
package = false

[tool.pytest.ini_options]
asyncio_mode = "auto"
asyncio_default_fixture_loop_scope = "session"
asyncio_default_test_loop_scope = "session"
testpaths = ["tests"]
pythonpath = ["."]

[tool.ruff]
line-length = 110
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP", "S"]
ignore = ["S101"]

[tool.ruff.lint.per-file-ignores]
"tests/**" = ["S105", "S106"]
"migrations/**" = ["E501", "S608"]

[tool.mypy]
python_version = "3.12"
strict = true
plugins = ["pydantic.mypy"]
exclude = ["migrations/"]
```
`apps/api/.env.example`
```ini
ZS_ENV=dev
ZS_DB_HOST=localhost
ZS_DB_NAME=zehensync
ZS_DB_OWNER_USER=postgres
ZS_DB_OWNER_PASSWORD=postgres
ZS_DB_APP_PASSWORD=zs_dev_app
ZS_REDIS_URL=redis://localhost:6379/0
ZS_JWT_SECRET=dev-only-change-me-dev-only-change-me
ZS_DATA_KEY_B64=ZGV2LW9ubHktMzItYnl0ZS1rZXktY2hhbmdlLW1lISE=
ZS_COOKIE_SECURE=false
```
Run: `cd apps/api && uv sync`
Expected: `.venv` created, all packages installed.

- [ ] **Step 4: Write failing tests**

`apps/api/tests/test_health.py`
```python
from httpx import ASGITransport, AsyncClient

from app.main import create_app


async def test_health_ok() -> None:
    app = create_app()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        r = await c.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}
    assert "x-request-id" in r.headers
```
`apps/api/tests/test_errors.py`
```python
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from pydantic import BaseModel

from app.core.errors import AppError, install_error_handlers


def _app() -> FastAPI:
    app = FastAPI()
    install_error_handlers(app)

    class Body(BaseModel):
        n: int

    @app.get("/boom")
    async def boom() -> None:
        raise AppError("EMAIL_TAKEN", "That email is already registered.", 409, {"field": "email"})

    @app.post("/v")
    async def v(b: Body) -> Body:
        return b

    return app


async def test_app_error_shape() -> None:
    async with AsyncClient(transport=ASGITransport(app=_app()), base_url="http://t") as c:
        r = await c.get("/boom")
    assert r.status_code == 409
    assert r.json() == {"error": {"code": "EMAIL_TAKEN", "message": "That email is already registered.",
                                  "detail": {"field": "email"}}}


async def test_validation_error_shape() -> None:
    async with AsyncClient(transport=ASGITransport(app=_app()), base_url="http://t") as c:
        r = await c.post("/v", json={"n": "not-a-number"})
    body = r.json()
    assert r.status_code == 422
    assert body["error"]["code"] == "VALIDATION_ERROR"
    assert body["error"]["detail"]["fields"][0]["loc"] == ["body", "n"]


async def test_unknown_route_shape() -> None:
    async with AsyncClient(transport=ASGITransport(app=_app()), base_url="http://t") as c:
        r = await c.get("/nope")
    assert r.status_code == 404
    assert r.json()["error"]["code"] == "NOT_FOUND"
```

- [ ] **Step 5: Run to see them fail**

Run: `cd apps/api && uv run pytest tests/test_health.py tests/test_errors.py -q`
Expected: FAIL, `ModuleNotFoundError: No module named 'app.main'`.

- [ ] **Step 6: Implement settings, errors, logging, app**

`apps/api/app/__init__.py`, `apps/api/app/core/__init__.py`, `apps/api/app/modules/__init__.py`, `apps/api/app/modules/health/__init__.py`, `apps/api/tests/__init__.py`: empty files.

`apps/api/app/core/config.py`
```python
import base64
from functools import lru_cache

from pydantic import SecretStr, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_DEV_JWT = "dev-only-change-me-dev-only-change-me"
_DEV_KEY = "ZGV2LW9ubHktMzItYnl0ZS1rZXktY2hhbmdlLW1lISE="


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="ZS_", env_file=".env", extra="ignore")

    env: str = "dev"
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "zehensync"
    db_owner_user: str = "postgres"
    db_owner_password: SecretStr = SecretStr("postgres")
    db_app_password: SecretStr = SecretStr("zs_dev_app")
    redis_url: str = "redis://localhost:6379/0"
    jwt_secret: SecretStr = SecretStr(_DEV_JWT)
    access_ttl_seconds: int = 900
    refresh_ttl_days: int = 14
    mfa_token_ttl_seconds: int = 300
    data_key_b64: SecretStr = SecretStr(_DEV_KEY)
    cookie_secure: bool = False
    storage_dir: str = "var/storage"
    auth_rate_limit_per_minute: int = 10

    @model_validator(mode="after")
    def _guard(self) -> "Settings":
        if len(base64.b64decode(self.data_key_b64.get_secret_value())) != 32:
            raise ValueError("ZS_DATA_KEY_B64 must decode to 32 bytes")
        if self.env not in ("dev", "test"):
            if self.jwt_secret.get_secret_value() == _DEV_JWT or self.data_key_b64.get_secret_value() == _DEV_KEY:
                raise ValueError("dev secrets are not allowed outside dev/test")
            if not self.cookie_secure:
                raise ValueError("ZS_COOKIE_SECURE must be true outside dev/test")
        return self

    def dsn(self, user: str, password: str, driver: str = "asyncpg", db: str | None = None) -> str:
        return f"postgresql+{driver}://{user}:{password}@{self.db_host}:{self.db_port}/{db or self.db_name}"

    def owner_dsn(self, driver: str = "psycopg", db: str | None = None) -> str:
        return self.dsn(self.db_owner_user, self.db_owner_password.get_secret_value(), driver, db)


@lru_cache
def get_settings() -> Settings:
    return Settings()
```

`apps/api/app/core/errors.py`
```python
from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


class AppError(Exception):
    def __init__(self, code: str, message: str, status: int = 400, detail: dict[str, Any] | None = None) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.status = status
        self.detail = detail or {}


def error_body(code: str, message: str, detail: dict[str, Any] | None = None) -> dict[str, Any]:
    return {"error": {"code": code, "message": message, "detail": detail or {}}}


_HTTP_CODES = {400: "BAD_REQUEST", 401: "UNAUTHENTICATED", 403: "FORBIDDEN", 404: "NOT_FOUND",
               405: "METHOD_NOT_ALLOWED", 413: "FILE_TOO_LARGE", 415: "UNSUPPORTED_MEDIA_TYPE"}


def install_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def _app_error(_: Request, exc: AppError) -> JSONResponse:
        return JSONResponse(error_body(exc.code, exc.message, exc.detail), status_code=exc.status)

    @app.exception_handler(RequestValidationError)
    async def _validation(_: Request, exc: RequestValidationError) -> JSONResponse:
        fields = [{"loc": list(e["loc"]), "msg": e["msg"], "type": e["type"]} for e in exc.errors()]
        return JSONResponse(error_body("VALIDATION_ERROR", "Some fields are not valid.", {"fields": fields}),
                            status_code=422)

    @app.exception_handler(StarletteHTTPException)
    async def _http(_: Request, exc: StarletteHTTPException) -> JSONResponse:
        code = _HTTP_CODES.get(exc.status_code, f"HTTP_{exc.status_code}")
        return JSONResponse(error_body(code, str(exc.detail)), status_code=exc.status_code)
```

`apps/api/app/core/logging.py`
```python
import logging
import secrets
import time

import structlog
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response


def configure_logging() -> None:
    logging.basicConfig(format="%(message)s", level=logging.INFO)
    structlog.configure(
        processors=[structlog.contextvars.merge_contextvars, structlog.processors.add_log_level,
                    structlog.processors.TimeStamper(fmt="iso"), structlog.processors.JSONRenderer()],
    )


class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        rid = request.headers.get("x-request-id") or secrets.token_hex(8)
        structlog.contextvars.bind_contextvars(request_id=rid)
        start = time.perf_counter()
        response = await call_next(request)
        response.headers["x-request-id"] = rid
        structlog.get_logger().info("request", method=request.method, path=request.url.path,
                                    status=response.status_code, ms=round((time.perf_counter() - start) * 1000))
        structlog.contextvars.clear_contextvars()
        return response
```

`apps/api/app/modules/health/router.py`
```python
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
```

`apps/api/app/main.py`
```python
from fastapi import FastAPI

from app.core.errors import install_error_handlers
from app.core.logging import RequestIdMiddleware, configure_logging
from app.modules.health.router import router as health_router


def create_app() -> FastAPI:
    configure_logging()
    app = FastAPI(title="ZehenSync API", version="0.2.0", openapi_url="/api/v1/openapi.json",
                  docs_url="/api/v1/docs")
    install_error_handlers(app)
    app.add_middleware(RequestIdMiddleware)
    app.include_router(health_router)
    return app


app = create_app()
```

- [ ] **Step 7: Run tests and linters**

Run: `cd apps/api && uv run pytest tests/test_health.py tests/test_errors.py -q && uv run ruff check . && uv run mypy app`
Expected: `4 passed`; ruff and mypy clean.

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-workspace.yaml .editorconfig .gitignore infra apps/api
git commit -m "T-1.01 T-1.02 monorepo skeleton, compose stack, FastAPI skeleton with error shape"
```

---

### Task 2: Baseline migration — schemas, enums, identity tables, audit chain functions (T-1.03, T-1.09 storage)

**Files:**
- Create: `apps/api/alembic.ini`, `apps/api/migrations/env.py`, `apps/api/migrations/script.py.mako`, `apps/api/migrations/versions/0001_baseline.py`
- Create: `apps/api/tests/conftest.py`, `apps/api/tests/db/__init__.py`, `apps/api/tests/db/test_baseline.py`

**Interfaces:**
- Consumes: `get_settings().owner_dsn()`.
- Produces: tables `core.users(id uuid, email citext, password_hash, role core.user_role, status core.user_status, display_name, birth_year, locale, created_at, last_login_at, deleted_at)`, `core.refresh_tokens(id, user_id, family_id, token_hash bytea, mfa_verified bool, expires_at, revoked_at, user_agent, created_at)`, `core.mfa_totp(user_id, secret_enc bytea, enabled_at, last_step bigint, recovery_hashes text[])`, `core.consents`, `core.clinician_profiles`, `patient.profiles(user_id, pseudonym, intake_done_at, created_at)`, `scholar.profiles(user_id, level, institution, state, version, updated_at)`, `audit.events`; SQL functions `audit.append(uuid, core.user_role, text, text, uuid, uuid, jsonb, text) -> bigint`, `audit.verify_chain() -> bigint`. Test fixtures `owner_conn` (psycopg autocommit connection to the test DB).

- [ ] **Step 1: Alembic scaffolding**

`apps/api/alembic.ini`
```ini
[alembic]
script_location = migrations
prepend_sys_path = .

[loggers]
keys = root
[handlers]
keys = console
[formatters]
keys = generic
[logger_root]
level = WARN
handlers = console
[handler_console]
class = StreamHandler
args = (sys.stderr,)
formatter = generic
[formatter_generic]
format = %(levelname)s %(message)s
```
`apps/api/migrations/env.py`
```python
from alembic import context
from sqlalchemy import create_engine, pool

from app.core.config import get_settings

url = context.config.get_main_option("sqlalchemy.url") or get_settings().owner_dsn()


def run() -> None:
    engine = create_engine(url, poolclass=pool.NullPool)
    with engine.connect() as conn:
        context.configure(connection=conn, target_metadata=None, transaction_per_migration=True)
        with context.begin_transaction():
            context.run_migrations()


run()
```
`apps/api/migrations/script.py.mako`
```mako
"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
"""
from alembic import op

revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}
branch_labels = None
depends_on = None


def upgrade() -> None:
    ${upgrades if upgrades else "pass"}


def downgrade() -> None:
    ${downgrades if downgrades else "pass"}
```

- [ ] **Step 2: Test fixtures**

`apps/api/tests/conftest.py`
```python
import os

os.environ["ZS_ENV"] = "test"
os.environ["ZS_DB_NAME"] = "zehensync_test"
os.environ.setdefault("ZS_REDIS_URL", "redis://localhost:6379/15")

from collections.abc import Iterator  # noqa: E402

import psycopg  # noqa: E402
import pytest  # noqa: E402
from alembic import command  # noqa: E402
from alembic.config import Config  # noqa: E402

from app.core.config import get_settings  # noqa: E402


@pytest.fixture(scope="session", autouse=True)
def database() -> Iterator[None]:
    s = get_settings()
    with psycopg.connect(s.owner_dsn(db="postgres").replace("postgresql+psycopg", "postgresql"),
                         autocommit=True) as c:
        c.execute(f'DROP DATABASE IF EXISTS "{s.db_name}" WITH (FORCE)')
        c.execute(f'CREATE DATABASE "{s.db_name}"')
    command.upgrade(Config("alembic.ini"), "head")
    yield


@pytest.fixture
def owner_conn() -> Iterator[psycopg.Connection]:
    dsn = get_settings().owner_dsn().replace("postgresql+psycopg", "postgresql")
    with psycopg.connect(dsn, autocommit=True) as c:
        yield c
```

- [ ] **Step 3: Write failing tests**

`apps/api/tests/db/__init__.py`: empty.
`apps/api/tests/db/test_baseline.py`
```python
import psycopg
import pytest


def test_five_schemas_exist(owner_conn: psycopg.Connection) -> None:
    rows = owner_conn.execute(
        "select nspname from pg_namespace where nspname in ('core','patient','clinical','scholar','audit')"
    ).fetchall()
    assert {r[0] for r in rows} == {"core", "patient", "clinical", "scholar", "audit"}


def test_audit_append_links_hashes(owner_conn: psycopg.Connection) -> None:
    a = owner_conn.execute("select audit.append(null, null, 'test.one', 'test', null, null, '{}', null)").fetchone()
    b = owner_conn.execute("select audit.append(null, null, 'test.two', 'test', null, null, '{\"k\":1}', null)").fetchone()
    assert a and b
    prev_of_b, hash_of_a = owner_conn.execute(
        "select (select prev_hash from audit.events where id=%s), (select row_hash from audit.events where id=%s)",
        (b[0], a[0]),
    ).fetchone() or (None, None)
    assert prev_of_b == hash_of_a
    assert owner_conn.execute("select audit.verify_chain()").fetchone() == (None,)


def test_audit_rows_are_append_only(owner_conn: psycopg.Connection) -> None:
    owner_conn.execute("select audit.append(null, null, 'test.x', 'test', null, null, '{}', null)")
    with pytest.raises(psycopg.errors.RaiseException, match="append-only"):
        owner_conn.execute("update audit.events set action = 'forged'")
    with pytest.raises(psycopg.errors.RaiseException, match="append-only"):
        owner_conn.execute("delete from audit.events")


def test_verify_chain_detects_tampering(owner_conn: psycopg.Connection) -> None:
    rid = owner_conn.execute(
        "select audit.append(null, null, 'test.tamper', 'test', null, null, '{}', null)").fetchone()
    assert rid
    owner_conn.execute("alter table audit.events disable trigger no_update")
    try:
        owner_conn.execute("update audit.events set action = 'forged' where id = %s", (rid[0],))
    finally:
        owner_conn.execute("alter table audit.events enable trigger no_update")
    assert owner_conn.execute("select audit.verify_chain()").fetchone() == (rid[0],)
    owner_conn.execute("alter table audit.events disable trigger no_update")
    try:
        owner_conn.execute("update audit.events set action = 'test.tamper' where id = %s", (rid[0],))
    finally:
        owner_conn.execute("alter table audit.events enable trigger no_update")


def test_email_unique_case_insensitive(owner_conn: psycopg.Connection) -> None:
    owner_conn.execute("insert into core.users(id, email, password_hash, role, display_name) "
                       "values (gen_random_uuid(), 'Case@Test.pk', 'x', 'patient', 'A')")
    with pytest.raises(psycopg.errors.UniqueViolation):
        owner_conn.execute("insert into core.users(id, email, password_hash, role, display_name) "
                           "values (gen_random_uuid(), 'case@test.pk', 'x', 'patient', 'B')")
    owner_conn.execute("delete from core.users where email = 'case@test.pk'")
```

- [ ] **Step 4: Run to see them fail**

Run: `cd apps/api && uv run pytest tests/db/test_baseline.py -q`
Expected: FAIL during `command.upgrade` — no revisions / `relation "audit.events" does not exist`.

- [ ] **Step 5: Write the baseline migration**

`apps/api/migrations/versions/0001_baseline.py`
```python
"""baseline: schemas, enums, identity tables, audit chain

Revision ID: 0001
Revises:
"""
from alembic import op

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None

UPGRADE = r"""
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE SCHEMA core; CREATE SCHEMA patient; CREATE SCHEMA clinical; CREATE SCHEMA scholar; CREATE SCHEMA audit;

CREATE TYPE core.user_role    AS ENUM ('patient','scholar','clinician','admin');
CREATE TYPE core.user_status  AS ENUM ('active','pending_verification','suspended','deleted');
CREATE TYPE core.consent_type AS ENUM ('terms','screening_disclaimer','ai_processing','webcam_metrics',
                                       'voice_processing','research_recording','clinician_sharing');
CREATE TYPE core.verification AS ENUM ('pending','approved','rejected');
CREATE TYPE scholar.level     AS ENUM ('intro','intermediate','advanced','research');

CREATE TABLE core.users (
  id            uuid PRIMARY KEY,
  email         citext UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role          core.user_role NOT NULL,
  status        core.user_status NOT NULL DEFAULT 'active',
  display_name  varchar(80) NOT NULL,
  birth_year    smallint CHECK (birth_year BETWEEN 1900 AND 2100),
  locale        varchar(10) NOT NULL DEFAULT 'en',
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz,
  deleted_at    timestamptz
);

CREATE TABLE core.refresh_tokens (
  id           uuid PRIMARY KEY,
  user_id      uuid NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  family_id    uuid NOT NULL,
  token_hash   bytea NOT NULL UNIQUE,
  mfa_verified boolean NOT NULL DEFAULT false,
  expires_at   timestamptz NOT NULL,
  revoked_at   timestamptz,
  user_agent   text,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX refresh_family ON core.refresh_tokens(family_id);

CREATE TABLE core.mfa_totp (
  user_id         uuid PRIMARY KEY REFERENCES core.users(id) ON DELETE CASCADE,
  secret_enc      bytea NOT NULL,
  enabled_at      timestamptz,
  last_step       bigint NOT NULL DEFAULT 0,
  recovery_hashes text[] NOT NULL DEFAULT '{}'
);

CREATE TABLE core.consents (
  id           uuid PRIMARY KEY,
  user_id      uuid NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  consent_type core.consent_type NOT NULL,
  doc_version  varchar(20) NOT NULL,
  granted_at   timestamptz NOT NULL DEFAULT now(),
  revoked_at   timestamptz
);
CREATE UNIQUE INDEX consents_active ON core.consents(user_id, consent_type) WHERE revoked_at IS NULL;

CREATE TABLE core.clinician_profiles (
  user_id      uuid PRIMARY KEY REFERENCES core.users(id) ON DELETE CASCADE,
  full_name    varchar(120) NOT NULL,
  license_no   varchar(60),
  institution  varchar(160) NOT NULL,
  specialty    varchar(120),
  proof_key    text,
  verification core.verification NOT NULL DEFAULT 'pending',
  decision_reason text,
  verified_by  uuid REFERENCES core.users(id),
  verified_at  timestamptz,
  invite_code  varchar(12) UNIQUE
);

CREATE TABLE patient.profiles (
  user_id        uuid PRIMARY KEY REFERENCES core.users(id) ON DELETE CASCADE,
  pseudonym      varchar(12) UNIQUE NOT NULL,
  intake_done_at timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE scholar.profiles (
  user_id     uuid PRIMARY KEY REFERENCES core.users(id) ON DELETE CASCADE,
  level       scholar.level NOT NULL DEFAULT 'intermediate',
  institution varchar(160),
  state       jsonb NOT NULL DEFAULT '{}',
  version     integer NOT NULL DEFAULT 0,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit.events (
  id              bigserial PRIMARY KEY,
  at              timestamptz NOT NULL,
  actor_id        uuid,
  actor_role      core.user_role,
  action          varchar(60) NOT NULL,
  entity_type     varchar(40) NOT NULL,
  entity_id       uuid,
  subject_patient uuid,
  detail          jsonb NOT NULL DEFAULT '{}',
  ip_hash         char(64),
  prev_hash       char(64) NOT NULL,
  row_hash        char(64) NOT NULL
);

CREATE FUNCTION audit.canonical(p_prev text, p_at timestamptz, p_actor uuid, p_role core.user_role, p_action text,
                                p_entity_type text, p_entity uuid, p_subject uuid, p_detail jsonb, p_ip text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT concat_ws('|', p_prev,
                   to_char(p_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US'),
                   coalesce(p_actor::text, ''), coalesce(p_role::text, ''), p_action, p_entity_type,
                   coalesce(p_entity::text, ''), coalesce(p_subject::text, ''), p_detail::text, coalesce(p_ip, ''))
$$;

CREATE FUNCTION audit.append(p_actor uuid, p_role core.user_role, p_action text, p_entity_type text,
                             p_entity uuid, p_subject uuid, p_detail jsonb, p_ip text)
RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
DECLARE
  v_prev char(64);
  v_at   timestamptz := clock_timestamp();
  v_id   bigint;
BEGIN
  PERFORM pg_advisory_xact_lock(727274);
  SELECT row_hash INTO v_prev FROM audit.events ORDER BY id DESC LIMIT 1;
  v_prev := coalesce(v_prev, repeat('0', 64));
  INSERT INTO audit.events(at, actor_id, actor_role, action, entity_type, entity_id, subject_patient, detail,
                           ip_hash, prev_hash, row_hash)
  VALUES (v_at, p_actor, p_role, p_action, p_entity_type, p_entity, p_subject, coalesce(p_detail, '{}'), p_ip,
          v_prev,
          encode(public.digest(audit.canonical(v_prev, v_at, p_actor, p_role, p_action, p_entity_type, p_entity,
                                               p_subject, coalesce(p_detail, '{}'), p_ip), 'sha256'), 'hex'))
  RETURNING id INTO v_id;
  RETURN v_id;
END $$;

CREATE FUNCTION audit.verify_chain() RETURNS bigint LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public AS $$
DECLARE
  r      record;
  v_prev char(64) := repeat('0', 64);
BEGIN
  FOR r IN SELECT * FROM audit.events ORDER BY id LOOP
    IF r.prev_hash <> v_prev OR r.row_hash <> encode(public.digest(audit.canonical(
         r.prev_hash, r.at, r.actor_id, r.actor_role, r.action, r.entity_type, r.entity_id, r.subject_patient,
         r.detail, r.ip_hash), 'sha256'), 'hex') THEN
      RETURN r.id;
    END IF;
    v_prev := r.row_hash;
  END LOOP;
  RETURN NULL;
END $$;

CREATE FUNCTION audit.block_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'audit.events is append-only'; END $$;
CREATE TRIGGER no_update BEFORE UPDATE OR DELETE ON audit.events FOR EACH ROW EXECUTE FUNCTION audit.block_mutation();
CREATE TRIGGER no_truncate BEFORE TRUNCATE ON audit.events FOR EACH STATEMENT EXECUTE FUNCTION audit.block_mutation();
"""

DOWNGRADE = r"""
DROP SCHEMA audit CASCADE; DROP SCHEMA scholar CASCADE; DROP SCHEMA clinical CASCADE;
DROP SCHEMA patient CASCADE; DROP SCHEMA core CASCADE;
"""


def upgrade() -> None:
    op.execute(UPGRADE)


def downgrade() -> None:
    op.execute(DOWNGRADE)
```
Note: `ip_hash` is `char(64)`; the function parameter is `text`, and the stored `char(64)` compares equal on verify because hashes are exactly 64 chars. Callers always pass a 64-char hex digest or null.

- [ ] **Step 6: Run tests**

Run: `cd apps/api && uv run pytest tests/db/test_baseline.py -q`
Expected: `5 passed`.

- [ ] **Step 7: Commit**

```bash
git add apps/api/alembic.ini apps/api/migrations apps/api/tests
git commit -m "T-1.03 T-1.09 baseline migration: five schemas, identity tables, hash-chained audit log"
```

---

### Task 3: Login roles, grants, row-level security, role-scoped sessions (T-1.04)

**Files:**
- Create: `apps/api/migrations/versions/0002_roles_rls.py`, `apps/api/app/core/db.py`, `apps/api/app/core/ids.py`
- Test: `apps/api/tests/db/test_roles_rls.py`
- Modify: `apps/api/tests/conftest.py` (add `db` fixture), `docs/06-Memory/Decisions.md` (ADR-016)

**Interfaces:**
- Consumes: Task 2 tables and `audit.append`.
- Produces: login roles `zs_auth_app`, `zs_patient_app`, `zs_scholar_app`, `zs_clinician_app`, `zs_admin_app`, `zs_worker` with password `ZS_DB_APP_PASSWORD`; `Database(settings)` with `async with db.session(role: str, user_id: UUID | None = None, user_role: str | None = None) -> AsyncSession` and `await db.dispose()`; `uuid7() -> UUID`; pytest fixture `db` (a `Database`).

- [ ] **Step 1: Write failing tests**

`apps/api/tests/db/test_roles_rls.py`
```python
import uuid

import pytest
from sqlalchemy import text
from sqlalchemy.exc import DBAPIError

from app.core.db import Database


async def _make_patient(db: Database, email: str, pseudo: str) -> uuid.UUID:
    uid = uuid.uuid4()
    async with db.session("zs_auth_app") as s:
        await s.execute(text("insert into core.users(id,email,password_hash,role,display_name) "
                             "values (:i,:e,'x','patient','P')"), {"i": uid, "e": email})
        await s.execute(text("insert into patient.profiles(user_id,pseudonym) values (:i,:p)"),
                        {"i": uid, "p": pseudo})
    return uid


async def test_scholar_role_cannot_touch_patient_schema(db: Database) -> None:
    with pytest.raises(DBAPIError, match="permission denied for schema patient"):
        async with db.session("zs_scholar_app") as s:
            await s.execute(text("select * from patient.profiles"))


async def test_patient_sees_only_own_profile(db: Database) -> None:
    a = await _make_patient(db, f"a-{uuid.uuid4().hex[:6]}@t.pk", f"ZS-A{uuid.uuid4().hex[:3].upper()}-AA")
    await _make_patient(db, f"b-{uuid.uuid4().hex[:6]}@t.pk", f"ZS-B{uuid.uuid4().hex[:3].upper()}-BB")
    async with db.session("zs_patient_app", user_id=a, user_role="patient") as s:
        rows = (await s.execute(text("select user_id from patient.profiles"))).all()
    assert [r[0] for r in rows] == [a]


async def test_patient_without_identity_sees_nothing(db: Database) -> None:
    async with db.session("zs_patient_app") as s:
        rows = (await s.execute(text("select user_id from patient.profiles"))).all()
    assert rows == []


async def test_clinician_role_has_no_patient_access_yet(db: Database) -> None:
    with pytest.raises(DBAPIError, match="permission denied for schema patient"):
        async with db.session("zs_clinician_app") as s:
            await s.execute(text("select * from patient.profiles"))


async def test_app_roles_cannot_read_audit_but_can_append(db: Database) -> None:
    async with db.session("zs_auth_app") as s:
        rid = (await s.execute(text(
            "select audit.append(null,null,'rls.test','test',null,null,'{}',null)"))).scalar_one()
    assert rid > 0
    with pytest.raises(DBAPIError, match="permission denied for table events"):
        async with db.session("zs_auth_app") as s:
            await s.execute(text("select * from audit.events"))
    async with db.session("zs_admin_app") as s:
        assert (await s.execute(text("select count(*) from audit.events"))).scalar_one() >= 1
```

- [ ] **Step 2: Add the `db` fixture**

Append to `apps/api/tests/conftest.py`:
```python
from collections.abc import AsyncIterator  # noqa: E402

from app.core.db import Database  # noqa: E402


@pytest.fixture(scope="session")
async def db() -> AsyncIterator[Database]:
    database = Database(get_settings())
    yield database
    await database.dispose()
```

- [ ] **Step 3: Run to see them fail**

Run: `cd apps/api && uv run pytest tests/db/test_roles_rls.py -q`
Expected: FAIL, `ModuleNotFoundError: No module named 'app.core.db'`.

- [ ] **Step 4: Implement `ids.py` and `db.py`**

`apps/api/app/core/ids.py`
```python
import os
import time
import uuid


def uuid7() -> uuid.UUID:
    ms = time.time_ns() // 1_000_000
    rand = int.from_bytes(os.urandom(10), "big")
    value = (ms & ((1 << 48) - 1)) << 80
    value |= 0x7 << 76
    value |= ((rand >> 62) & 0xFFF) << 64
    value |= 0b10 << 62
    value |= rand & ((1 << 62) - 1)
    return uuid.UUID(int=value)
```

`apps/api/app/core/db.py`
```python
import uuid
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import Settings

ROLES = ("zs_auth_app", "zs_patient_app", "zs_scholar_app", "zs_clinician_app", "zs_admin_app")


class Database:
    """One pool per Postgres login role; grants and RLS do the enforcing."""

    def __init__(self, settings: Settings) -> None:
        pw = settings.db_app_password.get_secret_value()
        self._engines: dict[str, AsyncEngine] = {
            role: create_async_engine(settings.dsn(role, pw), pool_size=5, max_overflow=5, pool_pre_ping=True)
            for role in ROLES
        }
        self._makers = {r: async_sessionmaker(e, expire_on_commit=False) for r, e in self._engines.items()}

    @asynccontextmanager
    async def session(self, role: str, user_id: uuid.UUID | None = None,
                      user_role: str | None = None) -> AsyncIterator[AsyncSession]:
        if role not in self._makers:
            raise ValueError(f"unknown db role {role}")
        async with self._makers[role]() as s, s.begin():
            await s.execute(text("select set_config('app.user_id', :u, true), set_config('app.role', :r, true)"),
                            {"u": str(user_id) if user_id else "", "r": user_role or ""})
            yield s

    async def ping(self) -> bool:
        async with self.session("zs_auth_app") as s:
            return (await s.execute(text("select 1"))).scalar_one() == 1

    async def dispose(self) -> None:
        for e in self._engines.values():
            await e.dispose()
```

- [ ] **Step 5: Write the roles migration**

`apps/api/migrations/versions/0002_roles_rls.py`
```python
"""login roles, grants, row-level security

Revision ID: 0002
Revises: 0001
"""
from alembic import op

from app.core.config import get_settings

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None

APP_ROLES = ["zs_auth_app", "zs_patient_app", "zs_scholar_app", "zs_clinician_app", "zs_admin_app", "zs_worker"]
APPEND_SIG = "audit.append(uuid, core.user_role, text, text, uuid, uuid, jsonb, text)"

GRANTS = f"""
REVOKE ALL ON SCHEMA core, patient, clinical, scholar, audit FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION {APPEND_SIG}, audit.verify_chain(), audit.canonical(text, timestamptz, uuid,
  core.user_role, text, text, uuid, uuid, jsonb, text) FROM PUBLIC;

GRANT USAGE ON SCHEMA core TO zs_auth_app, zs_admin_app;
GRANT SELECT, INSERT, UPDATE ON core.users TO zs_auth_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON core.refresh_tokens, core.mfa_totp, core.consents TO zs_auth_app;
GRANT SELECT, INSERT ON core.clinician_profiles TO zs_auth_app;
GRANT SELECT, UPDATE ON core.users, core.clinician_profiles TO zs_admin_app;

GRANT USAGE ON SCHEMA patient TO zs_auth_app, zs_patient_app;
GRANT SELECT, INSERT ON patient.profiles TO zs_auth_app;
GRANT SELECT, UPDATE ON patient.profiles TO zs_patient_app;

GRANT USAGE ON SCHEMA scholar TO zs_auth_app, zs_scholar_app;
GRANT SELECT, INSERT ON scholar.profiles TO zs_auth_app;
GRANT SELECT, UPDATE ON scholar.profiles TO zs_scholar_app;

GRANT USAGE ON SCHEMA audit TO {", ".join(APP_ROLES)};
GRANT EXECUTE ON FUNCTION {APPEND_SIG} TO {", ".join(APP_ROLES)};
GRANT SELECT ON audit.events TO zs_admin_app;
GRANT EXECUTE ON FUNCTION audit.verify_chain() TO zs_admin_app;

ALTER TABLE patient.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY identity_all ON patient.profiles TO zs_auth_app USING (true) WITH CHECK (true);
CREATE POLICY own_row ON patient.profiles TO zs_patient_app
  USING (user_id = nullif(current_setting('app.user_id', true), '')::uuid)
  WITH CHECK (user_id = nullif(current_setting('app.user_id', true), '')::uuid);

ALTER TABLE scholar.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY identity_all ON scholar.profiles TO zs_auth_app USING (true) WITH CHECK (true);
CREATE POLICY own_row ON scholar.profiles TO zs_scholar_app
  USING (user_id = nullif(current_setting('app.user_id', true), '')::uuid)
  WITH CHECK (user_id = nullif(current_setting('app.user_id', true), '')::uuid);
"""


def upgrade() -> None:
    pw = get_settings().db_app_password.get_secret_value().replace("'", "''")
    for role in APP_ROLES:
        op.execute(f"""
        DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '{role}') THEN
            CREATE ROLE {role} LOGIN PASSWORD '{pw}';
          ELSE
            ALTER ROLE {role} LOGIN PASSWORD '{pw}';
          END IF;
        END $$;""")
        op.execute(f"GRANT CONNECT ON DATABASE {get_settings().db_name} TO {role}")
    op.execute(GRANTS)


def downgrade() -> None:
    op.execute("""
    DROP POLICY IF EXISTS identity_all ON patient.profiles; DROP POLICY IF EXISTS own_row ON patient.profiles;
    DROP POLICY IF EXISTS identity_all ON scholar.profiles; DROP POLICY IF EXISTS own_row ON scholar.profiles;
    ALTER TABLE patient.profiles DISABLE ROW LEVEL SECURITY; ALTER TABLE scholar.profiles DISABLE ROW LEVEL SECURITY;
    """)
    for role in APP_ROLES:
        op.execute(f"REVOKE ALL ON ALL TABLES IN SCHEMA core, patient, scholar, audit FROM {role}")
        op.execute(f"REVOKE ALL ON SCHEMA core, patient, clinical, scholar, audit FROM {role}")
```

- [ ] **Step 6: Record the identity-role decision**

Append to `docs/06-Memory/Decisions.md`:
```markdown

## ADR-016
**Identity pool `zs_auth_app`**
**Date:** 2026-09-29 · **Status:** accepted
**Context:** signup and login run before the user's identity is known, and must create rows in `core`, `patient.profiles` and `scholar.profiles`.
**Decision:** a sixth login role, `zs_auth_app`, owns identity: `core.users`, tokens, MFA, consents, clinician applications, and insert/select on the two profile tables only (RLS policy `identity_all`). It has no access to any clinical table. Patient, scholar, clinician and admin pools keep their narrower grants.
**Consequences:** account endpoints (`/auth/*`, `/me/*`) run on the identity pool; everything that reads health data runs on the role of the person asking.
```

- [ ] **Step 7: Run tests**

Run: `cd apps/api && uv run pytest tests/db -q`
Expected: `10 passed`.

- [ ] **Step 8: Commit**

```bash
git add apps/api docs/06-Memory/Decisions.md
git commit -m "T-1.04 per-role DB pools, grants and row-level security; scholar role locked out of patient schema"
```

---

### Task 4: Security primitives — Argon2id, JWT, refresh tokens, AES-GCM, pseudonyms (T-1.05 groundwork)

**Files:**
- Create: `apps/api/app/core/security.py`, `apps/api/app/core/crypto.py`, `apps/api/app/core/pseudonym.py`
- Test: `apps/api/tests/core/__init__.py`, `apps/api/tests/core/test_security.py`, `apps/api/tests/core/test_crypto.py`

**Interfaces:**
- Produces:
  - `hash_password(p: str) -> str`, `verify_password(hash_: str | None, p: str) -> bool` (runs against `DUMMY_HASH` when `hash_` is None)
  - `create_access_token(user_id: UUID, role: str, mfa: bool) -> str`, `create_mfa_token(user_id: UUID) -> str`, `decode_token(token: str, typ: str) -> dict[str, Any]` (raises `AppError("INVALID_TOKEN", ..., 401)`)
  - `new_refresh_token() -> tuple[str, bytes]` (raw, sha256), `hash_refresh(raw: str) -> bytes`
  - `encrypt(plain: bytes, aad: bytes = b"") -> bytes`, `decrypt(blob: bytes, aad: bytes = b"") -> bytes`
  - `new_pseudonym() -> str` (`ZS-XXXX-XX`), `new_invite_code() -> str` (`XXXX-XXXX`)

- [ ] **Step 1: Write failing tests**

`apps/api/tests/core/__init__.py`: empty.
`apps/api/tests/core/test_security.py`
```python
import re
import time
import uuid

import jwt
import pytest

from app.core.config import get_settings
from app.core.errors import AppError
from app.core.pseudonym import new_invite_code, new_pseudonym
from app.core.security import (
    create_access_token,
    create_mfa_token,
    decode_token,
    hash_password,
    hash_refresh,
    new_refresh_token,
    verify_password,
)


def test_password_roundtrip_and_argon2id() -> None:
    h = hash_password("correct horse battery")
    assert h.startswith("$argon2id$")
    assert verify_password(h, "correct horse battery")
    assert not verify_password(h, "wrong")


def test_verify_against_dummy_hash_is_false() -> None:
    t0 = time.perf_counter()
    assert verify_password(None, "anything") is False
    assert time.perf_counter() - t0 > 0.005  # a real argon2 verify ran


def test_access_token_claims() -> None:
    uid = uuid.uuid4()
    claims = decode_token(create_access_token(uid, "clinician", mfa=True), "access")
    assert claims["sub"] == str(uid) and claims["role"] == "clinician" and claims["mfa"] is True
    assert claims["exp"] - claims["iat"] == get_settings().access_ttl_seconds


def test_wrong_type_rejected() -> None:
    with pytest.raises(AppError) as e:
        decode_token(create_mfa_token(uuid.uuid4()), "access")
    assert e.value.code == "INVALID_TOKEN" and e.value.status == 401


def test_expired_and_tampered_rejected() -> None:
    secret = get_settings().jwt_secret.get_secret_value()
    old = jwt.encode({"sub": "x", "typ": "access", "iat": 1, "exp": 2, "role": "patient", "mfa": False},
                     secret, algorithm="HS256")
    with pytest.raises(AppError):
        decode_token(old, "access")
    good = create_access_token(uuid.uuid4(), "patient", mfa=False)
    with pytest.raises(AppError):
        decode_token(good[:-2] + ("AA" if not good.endswith("AA") else "BB"), "access")
    none_alg = jwt.encode({"sub": "x", "typ": "access", "exp": 9999999999}, key="", algorithm="none")
    with pytest.raises(AppError):
        decode_token(none_alg, "access")


def test_refresh_tokens_random_and_hashed() -> None:
    raw1, h1 = new_refresh_token()
    raw2, _ = new_refresh_token()
    assert raw1 != raw2 and len(raw1) >= 60
    assert hash_refresh(raw1) == h1 and len(h1) == 32


def test_pseudonym_and_invite_formats() -> None:
    assert re.fullmatch(r"ZS-[2-9A-HJKMNP-TV-Z]{4}-[2-9A-HJKMNP-TV-Z]{2}", new_pseudonym())
    assert re.fullmatch(r"[2-9A-HJKMNP-TV-Z]{4}-[2-9A-HJKMNP-TV-Z]{4}", new_invite_code())
```
`apps/api/tests/core/test_crypto.py`
```python
import pytest
from cryptography.exceptions import InvalidTag

from app.core.crypto import decrypt, encrypt


def test_roundtrip_with_fresh_nonce() -> None:
    a, b = encrypt(b"secret", b"ctx"), encrypt(b"secret", b"ctx")
    assert a != b
    assert decrypt(a, b"ctx") == b"secret"


def test_wrong_aad_or_tamper_fails() -> None:
    blob = encrypt(b"secret", b"user-1")
    with pytest.raises(InvalidTag):
        decrypt(blob, b"user-2")
    with pytest.raises(InvalidTag):
        decrypt(blob[:-1] + bytes([blob[-1] ^ 1]), b"user-1")
```

- [ ] **Step 2: Run to see them fail**

Run: `cd apps/api && uv run pytest tests/core -q`
Expected: FAIL, `ModuleNotFoundError: No module named 'app.core.security'`.

- [ ] **Step 3: Implement**

`apps/api/app/core/security.py`
```python
import hashlib
import secrets
import time
import uuid
from typing import Any

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError

from app.core.config import get_settings
from app.core.errors import AppError

_ph = PasswordHasher()
DUMMY_HASH = _ph.hash("timing-equaliser-not-a-real-password")


def hash_password(password: str) -> str:
    return _ph.hash(password)


def verify_password(hash_: str | None, password: str) -> bool:
    try:
        return _ph.verify(hash_ or DUMMY_HASH, password) and hash_ is not None
    except (VerificationError, InvalidHashError):
        return False


def _encode(claims: dict[str, Any], ttl: int) -> str:
    now = int(time.time())
    payload = {**claims, "iat": now, "exp": now + ttl, "jti": secrets.token_hex(8)}
    return jwt.encode(payload, get_settings().jwt_secret.get_secret_value(), algorithm="HS256")


def create_access_token(user_id: uuid.UUID, role: str, mfa: bool) -> str:
    return _encode({"sub": str(user_id), "role": role, "mfa": mfa, "typ": "access"},
                   get_settings().access_ttl_seconds)


def create_mfa_token(user_id: uuid.UUID) -> str:
    return _encode({"sub": str(user_id), "typ": "mfa"}, get_settings().mfa_token_ttl_seconds)


def decode_token(token: str, typ: str) -> dict[str, Any]:
    try:
        claims: dict[str, Any] = jwt.decode(token, get_settings().jwt_secret.get_secret_value(),
                                            algorithms=["HS256"], options={"require": ["exp", "iat", "sub", "typ"]})
    except jwt.PyJWTError as exc:
        raise AppError("INVALID_TOKEN", "Your session is not valid. Please sign in again.", 401) from exc
    if claims.get("typ") != typ:
        raise AppError("INVALID_TOKEN", "Your session is not valid. Please sign in again.", 401)
    return claims


def new_refresh_token() -> tuple[str, bytes]:
    raw = secrets.token_urlsafe(48)
    return raw, hash_refresh(raw)


def hash_refresh(raw: str) -> bytes:
    return hashlib.sha256(raw.encode()).digest()
```

`apps/api/app/core/crypto.py`
```python
import base64
import os

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from app.core.config import get_settings


def _aes() -> AESGCM:
    return AESGCM(base64.b64decode(get_settings().data_key_b64.get_secret_value()))


def encrypt(plain: bytes, aad: bytes = b"") -> bytes:
    nonce = os.urandom(12)
    return nonce + _aes().encrypt(nonce, plain, aad)


def decrypt(blob: bytes, aad: bytes = b"") -> bytes:
    return _aes().decrypt(blob[:12], blob[12:], aad)
```

`apps/api/app/core/pseudonym.py`
```python
import secrets

ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ"  # no 0/1/I/L/O/U


def _chunk(n: int) -> str:
    return "".join(secrets.choice(ALPHABET) for _ in range(n))


def new_pseudonym() -> str:
    return f"ZS-{_chunk(4)}-{_chunk(2)}"


def new_invite_code() -> str:
    return f"{_chunk(4)}-{_chunk(4)}"
```

- [ ] **Step 4: Run tests**

Run: `cd apps/api && uv run pytest tests/core -q && uv run mypy app`
Expected: `9 passed`; mypy clean.

- [ ] **Step 5: Commit**

```bash
git add apps/api/app/core apps/api/tests/core
git commit -m "T-1.05 security primitives: argon2id, JWT, rotating refresh token hashing, AES-GCM, pseudonyms"
```

---

### Task 5: Audit service and Redis rate limiter (T-1.09, auth hardening)

**Files:**
- Create: `apps/api/app/core/audit.py`, `apps/api/app/core/ratelimit.py`
- Test: `apps/api/tests/core/test_audit.py`, `apps/api/tests/core/test_ratelimit.py`

**Interfaces:**
- Consumes: `Database.session`, `audit.append`, `audit.verify_chain`.
- Produces: `await record(s: AsyncSession, action: str, entity_type: str, *, actor_id: UUID | None = None, actor_role: str | None = None, entity_id: UUID | None = None, subject_patient: UUID | None = None, detail: dict | None = None, ip: str | None = None) -> int`; `await verify_chain(s) -> int | None`; `ip_hash(ip: str | None) -> str | None`; `RateLimiter(redis_client)` with `await hit(scope: str, key: str, limit: int, window: int = 60) -> None` raising `AppError("RATE_LIMITED", ..., 429, {"retry_after": seconds})`.

- [ ] **Step 1: Write failing tests**

`apps/api/tests/core/test_audit.py`
```python
import uuid

from app.core.audit import ip_hash, record, verify_chain
from app.core.db import Database


async def test_record_and_verify(db: Database) -> None:
    actor = uuid.uuid4()
    async with db.session("zs_auth_app") as s:
        first = await record(s, "auth.login", "user", actor_id=actor, actor_role="patient", entity_id=actor,
                             detail={"method": "password"}, ip="203.0.113.9")
        second = await record(s, "consent.grant", "consent", actor_id=actor, actor_role="patient")
    assert second > first
    async with db.session("zs_admin_app") as s:
        assert await verify_chain(s) is None


def test_ip_hash_is_stable_and_not_the_ip() -> None:
    h = ip_hash("203.0.113.9")
    assert h and len(h) == 64 and "203" not in h
    assert ip_hash("203.0.113.9") == h
    assert ip_hash(None) is None
```
`apps/api/tests/core/test_ratelimit.py`
```python
import uuid

import pytest
from redis.asyncio import Redis

from app.core.config import get_settings
from app.core.errors import AppError
from app.core.ratelimit import RateLimiter


async def test_allows_up_to_limit_then_429() -> None:
    r = Redis.from_url(get_settings().redis_url)
    rl = RateLimiter(r)
    key = uuid.uuid4().hex
    for _ in range(3):
        await rl.hit("login", key, limit=3)
    with pytest.raises(AppError) as e:
        await rl.hit("login", key, limit=3)
    assert e.value.status == 429 and e.value.code == "RATE_LIMITED"
    assert 0 < e.value.detail["retry_after"] <= 60
    await r.aclose()


async def test_scopes_and_keys_are_independent() -> None:
    r = Redis.from_url(get_settings().redis_url)
    rl = RateLimiter(r)
    k = uuid.uuid4().hex
    await rl.hit("login", k, limit=1)
    await rl.hit("signup", k, limit=1)
    await rl.hit("login", k + "x", limit=1)
    await r.aclose()
```

- [ ] **Step 2: Run to see them fail**

Run: `cd apps/api && uv run pytest tests/core/test_audit.py tests/core/test_ratelimit.py -q`
Expected: FAIL, `ModuleNotFoundError: No module named 'app.core.audit'`.

- [ ] **Step 3: Implement**

`apps/api/app/core/audit.py`
```python
import hashlib
import hmac
import json
import uuid
from typing import Any

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings


def ip_hash(ip: str | None) -> str | None:
    if not ip:
        return None
    key = get_settings().jwt_secret.get_secret_value().encode()
    return hmac.new(key, ip.encode(), hashlib.sha256).hexdigest()


async def record(s: AsyncSession, action: str, entity_type: str, *, actor_id: uuid.UUID | None = None,
                 actor_role: str | None = None, entity_id: uuid.UUID | None = None,
                 subject_patient: uuid.UUID | None = None, detail: dict[str, Any] | None = None,
                 ip: str | None = None) -> int:
    res = await s.execute(
        text("select audit.append(:a, cast(:r as core.user_role), :act, :et, :eid, :sp, cast(:d as jsonb), :ip)"),
        {"a": actor_id, "r": actor_role, "act": action, "et": entity_type, "eid": entity_id,
         "sp": subject_patient, "d": json.dumps(detail or {}, sort_keys=True), "ip": ip_hash(ip)},
    )
    return int(res.scalar_one())


async def verify_chain(s: AsyncSession) -> int | None:
    value = (await s.execute(text("select audit.verify_chain()"))).scalar_one()
    return int(value) if value is not None else None
```

`apps/api/app/core/ratelimit.py`
```python
from redis.asyncio import Redis

from app.core.errors import AppError


class RateLimiter:
    def __init__(self, redis: Redis) -> None:
        self._r = redis

    async def hit(self, scope: str, key: str, limit: int, window: int = 60) -> None:
        k = f"rl:{scope}:{key}"
        n = await self._r.incr(k)
        if n == 1:
            await self._r.expire(k, window)
        if n > limit:
            ttl = await self._r.ttl(k)
            raise AppError("RATE_LIMITED", "Too many attempts. Please wait a minute and try again.", 429,
                           {"retry_after": max(int(ttl), 1)})
```

- [ ] **Step 4: Run tests**

Run: `cd apps/api && uv run pytest tests/core -q`
Expected: `13 passed`.

- [ ] **Step 5: Commit**

```bash
git add apps/api/app/core apps/api/tests/core
git commit -m "T-1.09 audit record/verify service and Redis rate limiter"
```

---

### Task 6: Signup fork, login, refresh rotation, logout, /me, under-18 block (T-1.05, T-1.15)

**Files:**
- Create: `apps/api/app/core/deps.py`, `apps/api/app/modules/identity/__init__.py`, `apps/api/app/modules/identity/schemas.py`, `apps/api/app/modules/identity/consents.py`, `apps/api/app/modules/identity/service.py`, `apps/api/app/modules/identity/router.py`
- Modify: `apps/api/app/main.py` (lifespan: `Database`, `Redis`, `RateLimiter`; include identity router; `/health/ready`), `apps/api/app/modules/health/router.py`
- Modify: `apps/api/tests/conftest.py` (add `client`, `clean` fixtures and helpers)
- Test: `apps/api/tests/identity/__init__.py`, `apps/api/tests/identity/test_signup_login.py`, `apps/api/tests/identity/test_refresh.py`

**Interfaces:**
- Consumes: Tasks 3–5.
- Produces (HTTP): `POST /api/v1/auth/signup` → `201 {"access_token", "token_type": "bearer", "user": MeOut}` + `Set-Cookie: zs_refresh`; `POST /api/v1/auth/login` → `200 TokenOut` or `200 {"mfa_required": true, "mfa_token"}`; `POST /api/v1/auth/refresh` → `200 TokenOut` + rotated cookie; `POST /api/v1/auth/logout` → `204`; `GET /api/v1/me` → `MeOut`.
- Produces (Python): `Claims(user_id: UUID, role: str, mfa: bool)`; `current_claims` dependency; `require_role(*roles) -> Callable`; `require_mfa` dependency; `service.issue_tokens(s, user_id, role, mfa, user_agent, family_id=None) -> tuple[str, str]`; `service.me(s, user_id) -> MeOut`; `set_refresh_cookie(response, raw)`, `clear_refresh_cookie(response)`; `REQUIRED_CONSENTS: dict[str, list[str]]`, `CURRENT_DOCS: dict[str, str]`.
- `MeOut` fields: `id, email, display_name, role, status, mfa_enabled: bool, pseudonym: str | None, consents: list[ConsentOut], onboarding: {"consents_missing": list[str], "intake_required": bool, "mfa_setup_required": bool}, clinician: {"verification": str, "invite_code": str | None} | None`.

- [ ] **Step 1: Test fixtures**

Append to `apps/api/tests/conftest.py`:
```python
from typing import Any  # noqa: E402

from asgi_lifespan import LifespanManager  # noqa: E402
from httpx import ASGITransport, AsyncClient, Response  # noqa: E402
from redis.asyncio import Redis  # noqa: E402

from app.main import create_app  # noqa: E402


@pytest.fixture
async def clean(owner_conn: psycopg.Connection) -> AsyncIterator[None]:
    owner_conn.execute("truncate core.users cascade")
    r = Redis.from_url(get_settings().redis_url)
    await r.flushdb()
    await r.aclose()
    yield


@pytest.fixture
async def client(clean: None) -> AsyncIterator[AsyncClient]:
    app = create_app()
    async with LifespanManager(app):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
            yield c


def signup_body(**over: Any) -> dict[str, Any]:
    body = {"email": "sana@example.com", "password": "a long enough password", "display_name": "Sana",
            "birth_year": 2000, "path": "support"}
    body.update(over)
    return body


async def signup(c: AsyncClient, **over: Any) -> Response:
    return await c.post("/api/v1/auth/signup", json=signup_body(**over))


def bearer(r: Response) -> dict[str, str]:
    return {"Authorization": f"Bearer {r.json()['access_token']}"}
```
Add `"asgi-lifespan>=2.1"` to the `dev` dependency group in `pyproject.toml`, then `uv sync`.

- [ ] **Step 2: Write failing tests**

`apps/api/tests/identity/__init__.py`: empty.
`apps/api/tests/identity/test_signup_login.py`
```python
import datetime as dt

from httpx import AsyncClient

from tests.conftest import bearer, signup, signup_body


async def test_support_path_creates_patient_with_pseudonym(client: AsyncClient) -> None:
    r = await signup(client)
    assert r.status_code == 201
    user = r.json()["user"]
    assert user["role"] == "patient" and user["pseudonym"].startswith("ZS-")
    assert user["onboarding"]["consents_missing"] == ["terms", "screening_disclaimer", "ai_processing"]
    assert user["onboarding"]["intake_required"] is True
    cookie = r.headers["set-cookie"].lower()
    assert "zs_refresh=" in cookie and "httponly" in cookie and "samesite=strict" in cookie
    assert "path=/api/v1/auth" in cookie


async def test_scholar_path_creates_scholar(client: AsyncClient) -> None:
    r = await signup(client, path="scholar", email="raza@example.com")
    assert r.status_code == 201
    assert r.json()["user"]["role"] == "scholar"
    assert r.json()["user"]["pseudonym"] is None
    assert r.json()["user"]["onboarding"]["consents_missing"] == ["terms", "ai_processing"]


async def test_under_18_blocked(client: AsyncClient) -> None:
    r = await signup(client, birth_year=dt.date.today().year - 17)
    assert r.status_code == 422 and r.json()["error"]["code"] == "UNDER_18"


async def test_exactly_18_this_year_allowed(client: AsyncClient) -> None:
    assert (await signup(client, birth_year=dt.date.today().year - 18)).status_code == 201


async def test_email_is_case_insensitive(client: AsyncClient) -> None:
    assert (await signup(client, email="Sana@Example.com ")).status_code == 201
    r = await signup(client, email="sana@example.com")
    assert r.status_code == 409 and r.json()["error"]["code"] == "EMAIL_TAKEN"
    login = await client.post("/api/v1/auth/login", json={"email": "SANA@example.COM", "password": signup_body()["password"]})
    assert login.status_code == 200


async def test_short_password_rejected(client: AsyncClient) -> None:
    r = await signup(client, password="short")
    assert r.status_code == 422 and r.json()["error"]["code"] == "VALIDATION_ERROR"


async def test_login_wrong_password_and_unknown_email_look_the_same(client: AsyncClient) -> None:
    await signup(client)
    a = await client.post("/api/v1/auth/login", json={"email": "sana@example.com", "password": "nope nope nope"})
    b = await client.post("/api/v1/auth/login", json={"email": "ghost@example.com", "password": "nope nope nope"})
    assert a.status_code == b.status_code == 401
    assert a.json() == b.json()


async def test_me_requires_bearer(client: AsyncClient) -> None:
    assert (await client.get("/api/v1/me")).status_code == 401
    r = await signup(client)
    me = await client.get("/api/v1/me", headers=bearer(r))
    assert me.status_code == 200 and me.json()["email"] == "sana@example.com"


async def test_login_is_rate_limited(client: AsyncClient) -> None:
    for _ in range(10):
        await client.post("/api/v1/auth/login", json={"email": "x@example.com", "password": "whatever whatever"})
    r = await client.post("/api/v1/auth/login", json={"email": "x@example.com", "password": "whatever whatever"})
    assert r.status_code == 429 and r.json()["error"]["code"] == "RATE_LIMITED"


async def test_signup_is_audited(client: AsyncClient, owner_conn: object) -> None:
    import psycopg
    assert isinstance(owner_conn, psycopg.Connection)
    before = owner_conn.execute("select count(*) from audit.events where action='auth.signup'").fetchone()
    await signup(client)
    after = owner_conn.execute("select count(*) from audit.events where action='auth.signup'").fetchone()
    assert before and after and after[0] == before[0] + 1
    row = owner_conn.execute("select detail::text from audit.events order by id desc limit 1").fetchone()
    assert row and "sana@example.com" not in row[0]


async def test_failed_login_is_audited(client: AsyncClient, owner_conn: object) -> None:
    import psycopg
    assert isinstance(owner_conn, psycopg.Connection)
    n0 = owner_conn.execute("select count(*) from audit.events where action='auth.login_failed'").fetchone()
    await client.post("/api/v1/auth/login", json={"email": "ghost@example.com", "password": "nope nope nope"})
    n1 = owner_conn.execute("select count(*) from audit.events where action='auth.login_failed'").fetchone()
    assert n0 and n1 and n1[0] == n0[0] + 1
```
`apps/api/tests/identity/test_refresh.py`
```python
from httpx import AsyncClient

from tests.conftest import signup


def _cookie(r_headers: str) -> str:
    return r_headers.split("zs_refresh=", 1)[1].split(";", 1)[0]


async def test_refresh_rotates(client: AsyncClient) -> None:
    r = await signup(client)
    first = _cookie(r.headers["set-cookie"])
    r2 = await client.post("/api/v1/auth/refresh", cookies={"zs_refresh": first})
    assert r2.status_code == 200 and r2.json()["access_token"]
    second = _cookie(r2.headers["set-cookie"])
    assert second != first


async def test_refresh_reuse_revokes_family(client: AsyncClient) -> None:
    r = await signup(client)
    first = _cookie(r.headers["set-cookie"])
    r2 = await client.post("/api/v1/auth/refresh", cookies={"zs_refresh": first})
    second = _cookie(r2.headers["set-cookie"])
    replay = await client.post("/api/v1/auth/refresh", cookies={"zs_refresh": first})
    assert replay.status_code == 401 and replay.json()["error"]["code"] == "REFRESH_REUSED"
    after = await client.post("/api/v1/auth/refresh", cookies={"zs_refresh": second})
    assert after.status_code == 401


async def test_missing_or_garbage_refresh(client: AsyncClient) -> None:
    assert (await client.post("/api/v1/auth/refresh")).status_code == 401
    assert (await client.post("/api/v1/auth/refresh", cookies={"zs_refresh": "garbage"})).status_code == 401


async def test_logout_revokes_and_clears(client: AsyncClient) -> None:
    r = await signup(client)
    raw = _cookie(r.headers["set-cookie"])
    out = await client.post("/api/v1/auth/logout", cookies={"zs_refresh": raw})
    assert out.status_code == 204
    cleared = out.headers["set-cookie"].lower()
    assert "max-age=0" in cleared or 'zs_refresh=""' in cleared
    assert (await client.post("/api/v1/auth/refresh", cookies={"zs_refresh": raw})).status_code == 401
```

- [ ] **Step 3: Run to see them fail**

Run: `cd apps/api && uv run pytest tests/identity -q`
Expected: FAIL, 404 on `/api/v1/auth/signup`.

- [ ] **Step 4: Implement deps, consent constants, schemas**

`apps/api/app/core/deps.py`
```python
import uuid
from collections.abc import Awaitable, Callable
from dataclasses import dataclass

from fastapi import Depends, Request

from app.core.db import Database
from app.core.errors import AppError
from app.core.ratelimit import RateLimiter
from app.core.security import decode_token


@dataclass(frozen=True)
class Claims:
    user_id: uuid.UUID
    role: str
    mfa: bool


def get_db(request: Request) -> Database:
    db: Database = request.app.state.db
    return db


def get_limiter(request: Request) -> RateLimiter:
    rl: RateLimiter = request.app.state.limiter
    return rl


def client_ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


async def current_claims(request: Request) -> Claims:
    header = request.headers.get("authorization", "")
    if not header.lower().startswith("bearer "):
        raise AppError("UNAUTHENTICATED", "Please sign in.", 401)
    c = decode_token(header[7:].strip(), "access")
    return Claims(uuid.UUID(c["sub"]), str(c["role"]), bool(c.get("mfa", False)))


def require_role(*roles: str) -> Callable[..., Awaitable[Claims]]:
    async def dep(claims: Claims = Depends(current_claims)) -> Claims:
        if claims.role not in roles:
            raise AppError("FORBIDDEN", "You don't have access to this.", 403)
        return claims
    return dep


async def require_mfa(claims: Claims = Depends(current_claims)) -> Claims:
    if claims.role in ("clinician", "admin") and not claims.mfa:
        raise AppError("MFA_REQUIRED", "Set up two-step verification to continue.", 403)
    return claims
```

`apps/api/app/modules/identity/__init__.py`: empty.

`apps/api/app/modules/identity/consents.py`
```python
CURRENT_DOCS: dict[str, str] = {
    "terms": "1.0",
    "screening_disclaimer": "1.0",
    "ai_processing": "1.0",
    "webcam_metrics": "1.0",
    "voice_processing": "1.0",
    "research_recording": "1.0",
    "clinician_sharing": "1.0",
}

REQUIRED_CONSENTS: dict[str, list[str]] = {
    "patient": ["terms", "screening_disclaimer", "ai_processing"],
    "scholar": ["terms", "ai_processing"],
    "clinician": ["terms"],
    "admin": [],
}
```

`apps/api/app/modules/identity/schemas.py`
```python
import datetime as dt
import uuid
from typing import Annotated, Literal

from pydantic import BaseModel, EmailStr, Field, StringConstraints, field_validator

ConsentType = Literal["terms", "screening_disclaimer", "ai_processing", "webcam_metrics", "voice_processing",
                      "research_recording", "clinician_sharing"]
Password = Annotated[str, StringConstraints(min_length=12, max_length=128)]
DisplayName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=80)]


class SignupIn(BaseModel):
    email: EmailStr
    password: Password
    display_name: DisplayName
    birth_year: int = Field(ge=1900, le=2100)
    path: Literal["support", "scholar"]
    institution: Annotated[str, StringConstraints(strip_whitespace=True, max_length=160)] | None = None

    @field_validator("email", mode="before")
    @classmethod
    def _norm(cls, v: object) -> object:
        return v.strip().lower() if isinstance(v, str) else v


class LoginIn(BaseModel):
    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=1, max_length=128)]

    @field_validator("email", mode="before")
    @classmethod
    def _norm(cls, v: object) -> object:
        return v.strip().lower() if isinstance(v, str) else v


class ConsentOut(BaseModel):
    type: ConsentType
    doc_version: str
    granted_at: dt.datetime


class Onboarding(BaseModel):
    consents_missing: list[str]
    intake_required: bool
    mfa_setup_required: bool


class ClinicianStatus(BaseModel):
    verification: Literal["pending", "approved", "rejected"]
    invite_code: str | None


class MeOut(BaseModel):
    id: uuid.UUID
    email: str
    display_name: str
    role: Literal["patient", "scholar", "clinician", "admin"]
    status: Literal["active", "pending_verification", "suspended", "deleted"]
    mfa_enabled: bool
    pseudonym: str | None
    consents: list[ConsentOut]
    onboarding: Onboarding
    clinician: ClinicianStatus | None


class TokenOut(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    user: MeOut


class MfaChallengeOut(BaseModel):
    mfa_required: Literal[True] = True
    mfa_token: str
```

- [ ] **Step 5: Implement the identity service**

`apps/api/app/modules/identity/service.py`
```python
import datetime as dt
import uuid

from fastapi import Response
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import record
from app.core.config import get_settings
from app.core.errors import AppError
from app.core.ids import uuid7
from app.core.pseudonym import new_pseudonym
from app.core.security import (
    create_access_token,
    create_mfa_token,
    hash_password,
    hash_refresh,
    new_refresh_token,
    verify_password,
)
from app.modules.identity.consents import REQUIRED_CONSENTS
from app.modules.identity.schemas import (
    ClinicianStatus,
    ConsentOut,
    LoginIn,
    MeOut,
    MfaChallengeOut,
    Onboarding,
    SignupIn,
)

COOKIE = "zs_refresh"
COOKIE_PATH = "/api/v1/auth"
MIN_AGE = 18


class LoginFailed(AppError):
    """Raised on bad credentials; carries the user id (if any) so the route can audit it in its own transaction."""

    def __init__(self, user_id: uuid.UUID | None) -> None:
        super().__init__("INVALID_CREDENTIALS", "That email and password don't match.", 401)
        self.user_id = user_id


def set_refresh_cookie(response: Response, raw: str) -> None:
    s = get_settings()
    response.set_cookie(COOKIE, raw, max_age=s.refresh_ttl_days * 86400, httponly=True, samesite="strict",
                        secure=s.cookie_secure, path=COOKIE_PATH)


def clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(COOKIE, path=COOKIE_PATH, httponly=True, samesite="strict",
                           secure=get_settings().cookie_secure)


def check_age(birth_year: int) -> None:
    if dt.date.today().year - birth_year < MIN_AGE:
        raise AppError("UNDER_18", "ZehenSync is for adults 18 and over.", 422)


async def email_taken(s: AsyncSession, email: str) -> bool:
    return (await s.execute(text("select 1 from core.users where email = :e"), {"e": email})).first() is not None


async def insert_user(s: AsyncSession, *, email: str, password: str, display_name: str, birth_year: int,
                      role: str, status: str = "active") -> uuid.UUID:
    uid = uuid7()
    try:
        await s.execute(text(
            "insert into core.users(id,email,password_hash,role,status,display_name,birth_year) "
            "values (:i,:e,:p,cast(:r as core.user_role),cast(:st as core.user_status),:d,:b)"),
            {"i": uid, "e": email, "p": hash_password(password), "r": role, "st": status, "d": display_name,
             "b": birth_year})
    except IntegrityError as exc:
        raise AppError("EMAIL_TAKEN", "That email is already registered.", 409, {"field": "email"}) from exc
    return uid


async def issue_tokens(s: AsyncSession, user_id: uuid.UUID, role: str, mfa: bool, user_agent: str | None,
                       family_id: uuid.UUID | None = None) -> tuple[str, str]:
    raw, h = new_refresh_token()
    expires = dt.datetime.now(dt.UTC) + dt.timedelta(days=get_settings().refresh_ttl_days)
    await s.execute(text(
        "insert into core.refresh_tokens(id,user_id,family_id,token_hash,mfa_verified,expires_at,user_agent) "
        "values (:i,:u,:f,:h,:m,:x,:ua)"),
        {"i": uuid7(), "u": user_id, "f": family_id or uuid7(), "h": h, "m": mfa, "x": expires,
         "ua": (user_agent or "")[:200]})
    return create_access_token(user_id, role, mfa), raw


async def signup(s: AsyncSession, data: SignupIn, ip: str, user_agent: str | None) -> tuple[MeOut, str, str]:
    check_age(data.birth_year)
    if await email_taken(s, data.email):
        raise AppError("EMAIL_TAKEN", "That email is already registered.", 409, {"field": "email"})
    role = "patient" if data.path == "support" else "scholar"
    uid = await insert_user(s, email=data.email, password=data.password, display_name=data.display_name,
                            birth_year=data.birth_year, role=role)
    if role == "patient":
        for _ in range(8):
            pseudo = new_pseudonym()
            exists = await s.execute(text("select 1 from patient.profiles where pseudonym=:p"), {"p": pseudo})
            if exists.first() is None:
                break
        await s.execute(text("insert into patient.profiles(user_id,pseudonym) values (:u,:p)"),
                        {"u": uid, "p": pseudo})
    else:
        await s.execute(text("insert into scholar.profiles(user_id,institution) values (:u,:i)"),
                        {"u": uid, "i": data.institution})
    access, raw = await issue_tokens(s, uid, role, False, user_agent)
    await record(s, "auth.signup", "user", actor_id=uid, actor_role=role, entity_id=uid,
                 detail={"path": data.path}, ip=ip)
    return await me(s, uid), access, raw


async def login(s: AsyncSession, data: LoginIn, ip: str,
                user_agent: str | None) -> tuple[MeOut, str, str] | MfaChallengeOut:
    row = (await s.execute(text(
        "select u.id, u.password_hash, u.role::text, u.status::text, m.enabled_at "
        "from core.users u left join core.mfa_totp m on m.user_id = u.id where u.email = :e"),
        {"e": data.email})).first()
    ok = verify_password(row.password_hash if row else None, data.password)
    if not row or not ok:
        raise LoginFailed(row.id if row else None)
    if row.status in ("suspended", "deleted"):
        raise AppError("ACCOUNT_DISABLED", "This account is not active.", 403)
    if row.role in ("clinician", "admin") and row.enabled_at is not None:
        await record(s, "auth.mfa_challenge", "user", actor_id=row.id, actor_role=row.role, ip=ip)
        return MfaChallengeOut(mfa_token=create_mfa_token(row.id))
    return await complete_login(s, row.id, row.role, mfa=False, ip=ip, user_agent=user_agent)


async def complete_login(s: AsyncSession, uid: uuid.UUID, role: str, *, mfa: bool, ip: str,
                         user_agent: str | None) -> tuple[MeOut, str, str]:
    await s.execute(text("update core.users set last_login_at = now() where id = :u"), {"u": uid})
    access, raw = await issue_tokens(s, uid, role, mfa, user_agent)
    await record(s, "auth.login", "user", actor_id=uid, actor_role=role, entity_id=uid, detail={"mfa": mfa}, ip=ip)
    return await me(s, uid), access, raw


async def refresh(s: AsyncSession, raw: str | None, ip: str, user_agent: str | None) -> tuple[MeOut, str, str]:
    if not raw:
        raise AppError("INVALID_REFRESH", "Please sign in again.", 401)
    row = (await s.execute(text(
        "select t.id, t.user_id, t.family_id, t.mfa_verified, t.expires_at, t.revoked_at, u.role::text, "
        "u.status::text from core.refresh_tokens t join core.users u on u.id = t.user_id "
        "where t.token_hash = :h for update of t"), {"h": hash_refresh(raw)})).first()
    if row is None:
        raise AppError("INVALID_REFRESH", "Please sign in again.", 401)
    if row.revoked_at is not None:
        await s.execute(text("update core.refresh_tokens set revoked_at = now() "
                             "where family_id = :f and revoked_at is null"), {"f": row.family_id})
        await record(s, "auth.refresh_reuse", "session", actor_id=row.user_id, actor_role=row.role,
                     entity_id=row.family_id, ip=ip)
        raise AppError("REFRESH_REUSED", "Your session was used elsewhere. Please sign in again.", 401)
    if row.expires_at <= dt.datetime.now(dt.UTC) or row.status in ("suspended", "deleted"):
        raise AppError("INVALID_REFRESH", "Please sign in again.", 401)
    await s.execute(text("update core.refresh_tokens set revoked_at = now() where id = :i"), {"i": row.id})
    access, new_raw = await issue_tokens(s, row.user_id, row.role, row.mfa_verified, user_agent, row.family_id)
    return await me(s, row.user_id), access, new_raw


async def logout(s: AsyncSession, raw: str | None) -> None:
    if not raw:
        return
    fam = (await s.execute(text("select family_id, user_id from core.refresh_tokens where token_hash = :h"),
                           {"h": hash_refresh(raw)})).first()
    if fam:
        await s.execute(text("update core.refresh_tokens set revoked_at = now() "
                             "where family_id = :f and revoked_at is null"), {"f": fam.family_id})
        await record(s, "auth.logout", "session", actor_id=fam.user_id, entity_id=fam.family_id)


async def me(s: AsyncSession, uid: uuid.UUID) -> MeOut:
    u = (await s.execute(text(
        "select u.id, u.email::text, u.display_name, u.role::text, u.status::text, "
        "m.enabled_at is not null as mfa_enabled, p.pseudonym, p.intake_done_at, "
        "c.verification::text as verification, c.invite_code "
        "from core.users u left join core.mfa_totp m on m.user_id = u.id "
        "left join patient.profiles p on p.user_id = u.id "
        "left join core.clinician_profiles c on c.user_id = u.id where u.id = :u"), {"u": uid})).one()
    consents = [ConsentOut(type=r.consent_type, doc_version=r.doc_version, granted_at=r.granted_at)
                for r in (await s.execute(text(
                    "select consent_type::text, doc_version, granted_at from core.consents "
                    "where user_id = :u and revoked_at is null order by granted_at"), {"u": uid})).all()]
    have = {c.type for c in consents}
    return MeOut(
        id=u.id, email=u.email, display_name=u.display_name, role=u.role, status=u.status,
        mfa_enabled=u.mfa_enabled, pseudonym=u.pseudonym, consents=consents,
        onboarding=Onboarding(
            consents_missing=[c for c in REQUIRED_CONSENTS[u.role] if c not in have],
            intake_required=u.role == "patient" and u.intake_done_at is None,
            mfa_setup_required=u.role in ("clinician", "admin") and not u.mfa_enabled,
        ),
        clinician=ClinicianStatus(verification=u.verification, invite_code=u.invite_code)
        if u.role == "clinician" else None,
    )
```

- [ ] **Step 6: Router and app wiring**

`apps/api/app/modules/identity/router.py`
```python
from fastapi import APIRouter, Cookie, Depends, Request, Response
from fastapi.responses import JSONResponse

from app.core.audit import record
from app.core.config import get_settings
from app.core.db import Database
from app.core.deps import Claims, client_ip, current_claims, get_db, get_limiter
from app.core.ratelimit import RateLimiter
from app.modules.identity import service
from app.modules.identity.schemas import LoginIn, MeOut, MfaChallengeOut, SignupIn, TokenOut

router = APIRouter(prefix="/api/v1")


def _token_response(me: MeOut, access: str, raw: str, status: int = 200) -> JSONResponse:
    resp = JSONResponse(TokenOut(access_token=access, user=me).model_dump(mode="json"), status_code=status)
    service.set_refresh_cookie(resp, raw)
    return resp


@router.post("/auth/signup", status_code=201, response_model=TokenOut)
async def signup(data: SignupIn, request: Request, db: Database = Depends(get_db),
                 rl: RateLimiter = Depends(get_limiter)) -> JSONResponse:
    ip = client_ip(request)
    await rl.hit("signup", ip, get_settings().auth_rate_limit_per_minute)
    async with db.session("zs_auth_app") as s:
        me, access, raw = await service.signup(s, data, ip, request.headers.get("user-agent"))
    return _token_response(me, access, raw, 201)


@router.post("/auth/login", response_model=TokenOut | MfaChallengeOut)
async def login(data: LoginIn, request: Request, db: Database = Depends(get_db),
                rl: RateLimiter = Depends(get_limiter)) -> JSONResponse:
    ip = client_ip(request)
    await rl.hit("login", ip, get_settings().auth_rate_limit_per_minute)
    try:
        async with db.session("zs_auth_app") as s:
            result = await service.login(s, data, ip, request.headers.get("user-agent"))
    except service.LoginFailed as exc:
        async with db.session("zs_auth_app") as s2:  # the failed transaction rolled back; audit separately
            await record(s2, "auth.login_failed", "user", actor_id=exc.user_id, ip=ip)
        raise
    if isinstance(result, MfaChallengeOut):
        return JSONResponse(result.model_dump(mode="json"))
    return _token_response(*result)


@router.post("/auth/refresh", response_model=TokenOut)
async def refresh(request: Request, zs_refresh: str | None = Cookie(default=None),
                  db: Database = Depends(get_db)) -> JSONResponse:
    async with db.session("zs_auth_app") as s:
        me, access, raw = await service.refresh(s, zs_refresh, client_ip(request), request.headers.get("user-agent"))
    return _token_response(me, access, raw)


@router.post("/auth/logout", status_code=204)
async def logout(zs_refresh: str | None = Cookie(default=None), db: Database = Depends(get_db)) -> Response:
    async with db.session("zs_auth_app") as s:
        await service.logout(s, zs_refresh)
    resp = Response(status_code=204)
    service.clear_refresh_cookie(resp)
    return resp


@router.get("/me", response_model=MeOut)
async def me(claims: Claims = Depends(current_claims), db: Database = Depends(get_db)) -> MeOut:
    async with db.session("zs_auth_app") as s:
        return await service.me(s, claims.user_id)
```

Replace `apps/api/app/modules/health/router.py`:
```python
from fastapi import APIRouter, Depends

from app.core.db import Database
from app.core.deps import get_db
from app.core.errors import AppError

router = APIRouter()


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/health/ready")
async def ready(db: Database = Depends(get_db)) -> dict[str, str]:
    try:
        await db.ping()
    except Exception as exc:  # noqa: BLE001
        raise AppError("NOT_READY", "Database unavailable.", 503) from exc
    return {"status": "ready"}
```

Replace `apps/api/app/main.py`:
```python
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from redis.asyncio import Redis

from app.core.config import get_settings
from app.core.db import Database
from app.core.errors import install_error_handlers
from app.core.logging import RequestIdMiddleware, configure_logging
from app.core.ratelimit import RateLimiter
from app.modules.health.router import router as health_router
from app.modules.identity.router import router as identity_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    s = get_settings()
    app.state.db = Database(s)
    app.state.redis = Redis.from_url(s.redis_url)
    app.state.limiter = RateLimiter(app.state.redis)
    yield
    await app.state.redis.aclose()
    await app.state.db.dispose()


def create_app() -> FastAPI:
    configure_logging()
    app = FastAPI(title="ZehenSync API", version="0.2.0", lifespan=lifespan,
                  openapi_url="/api/v1/openapi.json", docs_url="/api/v1/docs")
    install_error_handlers(app)
    app.add_middleware(RequestIdMiddleware)
    app.include_router(health_router)
    app.include_router(identity_router)
    return app


app = create_app()
```
Update `tests/test_health.py` to use `LifespanManager(app)` around the client (the router now reads `app.state.db`) — `/health` itself needs no DB, but create the client inside `async with LifespanManager(app):` for consistency.

- [ ] **Step 7: Run tests**

Run: `cd apps/api && uv run pytest -q && uv run ruff check . && uv run mypy app`
Expected: all identity tests pass (`test_signup_login.py` 10, `test_refresh.py` 4) plus earlier suites; lint and types clean.

- [ ] **Step 8: Commit**

```bash
git add apps/api
git commit -m "T-1.05 T-1.15 signup fork, login, rotating refresh with reuse detection, logout, /me, under-18 block"
```

---

### Task 7: Consent centre API (T-1.08)

**Files:**
- Modify: `apps/api/app/modules/identity/schemas.py` (add `ConsentIn`), `apps/api/app/modules/identity/service.py` (add `grant_consent`, `revoke_consent`), `apps/api/app/modules/identity/router.py`
- Test: `apps/api/tests/identity/test_consents.py`

**Interfaces:**
- Produces: `GET /api/v1/me/consents -> list[ConsentOut]`; `POST /api/v1/me/consents {type, doc_version} -> 201 ConsentOut` (idempotent: `200` with the existing grant if already active); `DELETE /api/v1/me/consents/{type} -> 204`, `404 CONSENT_NOT_FOUND` if none active; `409 CONSENT_VERSION_MISMATCH {"current": "1.0"}` when the version is stale. `GET /api/v1/consents/docs -> dict[str, str]` (public current versions).

- [ ] **Step 1: Write failing tests**

`apps/api/tests/identity/test_consents.py`
```python
from httpx import AsyncClient

from tests.conftest import bearer, signup


async def test_grant_list_revoke(client: AsyncClient) -> None:
    h = bearer(await signup(client))
    for t in ("terms", "screening_disclaimer", "ai_processing"):
        r = await client.post("/api/v1/me/consents", json={"type": t, "doc_version": "1.0"}, headers=h)
        assert r.status_code == 201
    me = (await client.get("/api/v1/me", headers=h)).json()
    assert me["onboarding"]["consents_missing"] == []
    assert (await client.delete("/api/v1/me/consents/ai_processing", headers=h)).status_code == 204
    me = (await client.get("/api/v1/me", headers=h)).json()
    assert me["onboarding"]["consents_missing"] == ["ai_processing"]
    listing = (await client.get("/api/v1/me/consents", headers=h)).json()
    assert {c["type"] for c in listing} == {"terms", "screening_disclaimer"}


async def test_grant_is_idempotent(client: AsyncClient) -> None:
    h = bearer(await signup(client))
    a = await client.post("/api/v1/me/consents", json={"type": "terms", "doc_version": "1.0"}, headers=h)
    b = await client.post("/api/v1/me/consents", json={"type": "terms", "doc_version": "1.0"}, headers=h)
    assert a.status_code == 201 and b.status_code == 200
    assert a.json()["granted_at"] == b.json()["granted_at"]


async def test_stale_version_rejected(client: AsyncClient) -> None:
    h = bearer(await signup(client))
    r = await client.post("/api/v1/me/consents", json={"type": "terms", "doc_version": "0.9"}, headers=h)
    assert r.status_code == 409 and r.json()["error"]["detail"]["current"] == "1.0"


async def test_revoke_missing_is_404_and_unknown_type_422(client: AsyncClient) -> None:
    h = bearer(await signup(client))
    assert (await client.delete("/api/v1/me/consents/webcam_metrics", headers=h)).status_code == 404
    assert (await client.delete("/api/v1/me/consents/nonsense", headers=h)).status_code == 422


async def test_regrant_after_revoke(client: AsyncClient) -> None:
    h = bearer(await signup(client))
    await client.post("/api/v1/me/consents", json={"type": "webcam_metrics", "doc_version": "1.0"}, headers=h)
    await client.delete("/api/v1/me/consents/webcam_metrics", headers=h)
    r = await client.post("/api/v1/me/consents", json={"type": "webcam_metrics", "doc_version": "1.0"}, headers=h)
    assert r.status_code == 201


async def test_docs_endpoint_is_public(client: AsyncClient) -> None:
    r = await client.get("/api/v1/consents/docs")
    assert r.status_code == 200 and r.json()["terms"] == "1.0"
```

- [ ] **Step 2: Run to see them fail**

Run: `cd apps/api && uv run pytest tests/identity/test_consents.py -q`
Expected: FAIL, 404/405 on `/api/v1/me/consents`.

- [ ] **Step 3: Implement**

Add to `schemas.py`:
```python
class ConsentIn(BaseModel):
    type: ConsentType
    doc_version: Annotated[str, StringConstraints(min_length=1, max_length=20)]
```
Add to `service.py`:
```python
from app.modules.identity.consents import CURRENT_DOCS
from app.modules.identity.schemas import ConsentIn


async def list_consents(s: AsyncSession, uid: uuid.UUID) -> list[ConsentOut]:
    return (await me(s, uid)).consents


async def grant_consent(s: AsyncSession, uid: uuid.UUID, role: str, data: ConsentIn,
                        ip: str) -> tuple[ConsentOut, bool]:
    current = CURRENT_DOCS[data.type]
    if data.doc_version != current:
        raise AppError("CONSENT_VERSION_MISMATCH", "Please review the latest version first.", 409,
                       {"current": current})
    existing = (await s.execute(text(
        "select consent_type::text, doc_version, granted_at from core.consents "
        "where user_id = :u and consent_type = cast(:t as core.consent_type) and revoked_at is null"),
        {"u": uid, "t": data.type})).first()
    if existing:
        return ConsentOut(type=existing.consent_type, doc_version=existing.doc_version,
                          granted_at=existing.granted_at), False
    row = (await s.execute(text(
        "insert into core.consents(id,user_id,consent_type,doc_version) "
        "values (:i,:u,cast(:t as core.consent_type),:v) returning granted_at"),
        {"i": uuid7(), "u": uid, "t": data.type, "v": current})).one()
    await record(s, "consent.grant", "consent", actor_id=uid, actor_role=role, entity_id=uid,
                 detail={"type": data.type, "version": current}, ip=ip)
    return ConsentOut(type=data.type, doc_version=current, granted_at=row.granted_at), True


async def revoke_consent(s: AsyncSession, uid: uuid.UUID, role: str, consent_type: str, ip: str) -> None:
    res = await s.execute(text(
        "update core.consents set revoked_at = now() where user_id = :u "
        "and consent_type = cast(:t as core.consent_type) and revoked_at is null"),
        {"u": uid, "t": consent_type})
    if res.rowcount == 0:  # type: ignore[attr-defined]
        raise AppError("CONSENT_NOT_FOUND", "There is no active consent of that type.", 404)
    await record(s, "consent.revoke", "consent", actor_id=uid, actor_role=role, entity_id=uid,
                 detail={"type": consent_type}, ip=ip)
```
Add to `router.py`:
```python
from app.modules.identity.consents import CURRENT_DOCS
from app.modules.identity.schemas import ConsentIn, ConsentOut, ConsentType


@router.get("/consents/docs")
async def consent_docs() -> dict[str, str]:
    return CURRENT_DOCS


@router.get("/me/consents", response_model=list[ConsentOut])
async def my_consents(claims: Claims = Depends(current_claims), db: Database = Depends(get_db)) -> list[ConsentOut]:
    async with db.session("zs_auth_app") as s:
        return await service.list_consents(s, claims.user_id)


@router.post("/me/consents", response_model=ConsentOut, status_code=201)
async def grant(data: ConsentIn, request: Request, claims: Claims = Depends(current_claims),
                db: Database = Depends(get_db)) -> JSONResponse:
    async with db.session("zs_auth_app") as s:
        out, created = await service.grant_consent(s, claims.user_id, claims.role, data, client_ip(request))
    return JSONResponse(out.model_dump(mode="json"), status_code=201 if created else 200)


@router.delete("/me/consents/{consent_type}", status_code=204)
async def revoke(consent_type: ConsentType, request: Request, claims: Claims = Depends(current_claims),
                 db: Database = Depends(get_db)) -> Response:
    async with db.session("zs_auth_app") as s:
        await service.revoke_consent(s, claims.user_id, claims.role, consent_type, client_ip(request))
    return Response(status_code=204)
```

- [ ] **Step 4: Run tests**

Run: `cd apps/api && uv run pytest tests/identity -q`
Expected: all pass (6 new).

- [ ] **Step 5: Commit**

```bash
git add apps/api
git commit -m "T-1.08 consent centre API: grant, list, revoke, versioned docs, audited"
```

---

### Task 8: TOTP two-step verification (T-1.07)

**Files:**
- Create: `apps/api/app/modules/identity/mfa.py`
- Modify: `apps/api/app/modules/identity/schemas.py`, `apps/api/app/modules/identity/router.py`
- Test: `apps/api/tests/identity/test_mfa.py`

**Interfaces:**
- Consumes: `issue_tokens`, `complete_login`, `me`, `encrypt/decrypt`, `decode_token(..., "mfa")`.
- Produces: `POST /api/v1/me/mfa/setup -> {"secret", "otpauth_uri"}` (`409 MFA_ALREADY_ENABLED`); `POST /api/v1/me/mfa/enable {code} -> TokenOut + {"recovery_codes": [8 strings]}` (new access token has `mfa: true`); `POST /api/v1/auth/mfa/verify {mfa_token, code} -> TokenOut` (code may be a TOTP or an unused recovery code; `401 MFA_INVALID`). Helper for tests: `app.modules.identity.mfa.current_code(secret: str) -> str`.

- [ ] **Step 1: Write failing tests**

`apps/api/tests/identity/test_mfa.py`
```python
import psycopg
from httpx import AsyncClient

from app.core.security import decode_token
from app.modules.identity.mfa import current_code
from tests.conftest import bearer, signup, signup_body


async def _admin_like(client: AsyncClient, owner_conn: psycopg.Connection) -> dict[str, str]:
    await signup(client, email="doc@example.com")
    owner_conn.execute("update core.users set role='clinician' where email='doc@example.com'")
    owner_conn.execute("insert into core.clinician_profiles(user_id, full_name, institution) "
                       "select id, 'Doc Test', 'Test Clinic' from core.users where email='doc@example.com'")
    login = await client.post("/api/v1/auth/login",
                              json={"email": "doc@example.com", "password": signup_body()["password"]})
    return bearer(login)


async def test_enable_then_login_needs_code(client: AsyncClient, owner_conn: psycopg.Connection) -> None:
    h = await _admin_like(client, owner_conn)
    setup = (await client.post("/api/v1/me/mfa/setup", headers=h)).json()
    assert setup["otpauth_uri"].startswith("otpauth://totp/ZehenSync:")
    en = await client.post("/api/v1/me/mfa/enable", json={"code": current_code(setup["secret"])}, headers=h)
    assert en.status_code == 200
    assert decode_token(en.json()["access_token"], "access")["mfa"] is True
    assert len(en.json()["recovery_codes"]) == 8

    login = await client.post("/api/v1/auth/login",
                              json={"email": "doc@example.com", "password": signup_body()["password"]})
    assert login.json()["mfa_required"] is True
    bad = await client.post("/api/v1/auth/mfa/verify", json={"mfa_token": login.json()["mfa_token"], "code": "000000"})
    assert bad.status_code == 401 and bad.json()["error"]["code"] == "MFA_INVALID"
    rc = en.json()["recovery_codes"][0]
    ok = await client.post("/api/v1/auth/mfa/verify", json={"mfa_token": login.json()["mfa_token"], "code": rc})
    assert ok.status_code == 200 and decode_token(ok.json()["access_token"], "access")["mfa"] is True
    again = await client.post("/api/v1/auth/mfa/verify", json={"mfa_token": login.json()["mfa_token"], "code": rc})
    assert again.status_code == 401


async def test_totp_code_cannot_be_reused(client: AsyncClient, owner_conn: psycopg.Connection) -> None:
    h = await _admin_like(client, owner_conn)
    secret = (await client.post("/api/v1/me/mfa/setup", headers=h)).json()["secret"]
    code = current_code(secret)
    assert (await client.post("/api/v1/me/mfa/enable", json={"code": code}, headers=h)).status_code == 200
    login = await client.post("/api/v1/auth/login",
                              json={"email": "doc@example.com", "password": signup_body()["password"]})
    r = await client.post("/api/v1/auth/mfa/verify", json={"mfa_token": login.json()["mfa_token"], "code": code})
    assert r.status_code == 401


async def test_setup_twice_after_enable_conflicts(client: AsyncClient, owner_conn: psycopg.Connection) -> None:
    h = await _admin_like(client, owner_conn)
    secret = (await client.post("/api/v1/me/mfa/setup", headers=h)).json()["secret"]
    await client.post("/api/v1/me/mfa/enable", json={"code": current_code(secret)}, headers=h)
    assert (await client.post("/api/v1/me/mfa/setup", headers=h)).status_code == 409


async def test_secret_stored_encrypted(client: AsyncClient, owner_conn: psycopg.Connection) -> None:
    h = await _admin_like(client, owner_conn)
    secret = (await client.post("/api/v1/me/mfa/setup", headers=h)).json()["secret"]
    row = owner_conn.execute("select secret_enc from core.mfa_totp").fetchone()
    assert row and secret.encode() not in bytes(row[0])
```

- [ ] **Step 2: Run to see them fail**

Run: `cd apps/api && uv run pytest tests/identity/test_mfa.py -q`
Expected: FAIL, `ModuleNotFoundError: No module named 'app.modules.identity.mfa'`.

- [ ] **Step 3: Implement**

Add to `schemas.py`:
```python
class CodeIn(BaseModel):
    code: Annotated[str, StringConstraints(strip_whitespace=True, min_length=6, max_length=20)]


class MfaVerifyIn(CodeIn):
    mfa_token: str


class MfaSetupOut(BaseModel):
    secret: str
    otpauth_uri: str


class MfaEnabledOut(TokenOut):
    recovery_codes: list[str]
```

`apps/api/app/modules/identity/mfa.py`
```python
import datetime as dt
import hashlib
import hmac
import secrets
import uuid

import pyotp
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import record
from app.core.crypto import decrypt, encrypt
from app.core.errors import AppError
from app.core.pseudonym import ALPHABET
from app.core.security import decode_token
from app.modules.identity import service
from app.modules.identity.schemas import MeOut

ISSUER = "ZehenSync"


class MfaFailed(AppError):
    """Bad TOTP or recovery code; carries identity so the route can audit it after the rollback."""

    def __init__(self, user_id: uuid.UUID, role: str) -> None:
        super().__init__("MFA_INVALID", "That code didn't work. Check the time on your phone and try again.", 401)
        self.user_id = user_id
        self.role = role


def _aad(uid: uuid.UUID) -> bytes:
    return f"mfa:{uid}".encode()


def current_code(secret: str) -> str:
    return pyotp.TOTP(secret).now()


def _hash_rc(code: str) -> str:
    return hashlib.sha256(code.replace("-", "").upper().encode()).hexdigest()


async def setup(s: AsyncSession, uid: uuid.UUID, email: str) -> tuple[str, str]:
    row = (await s.execute(text("select enabled_at from core.mfa_totp where user_id = :u"), {"u": uid})).first()
    if row and row.enabled_at is not None:
        raise AppError("MFA_ALREADY_ENABLED", "Two-step verification is already on.", 409)
    secret = pyotp.random_base32()
    await s.execute(text(
        "insert into core.mfa_totp(user_id, secret_enc) values (:u, :s) "
        "on conflict (user_id) do update set secret_enc = excluded.secret_enc, last_step = 0"),
        {"u": uid, "s": encrypt(secret.encode(), _aad(uid))})
    return secret, pyotp.TOTP(secret).provisioning_uri(name=email, issuer_name=ISSUER)


async def _check_totp(s: AsyncSession, uid: uuid.UUID, code: str) -> bool:
    row = (await s.execute(text("select secret_enc, last_step from core.mfa_totp where user_id = :u for update"),
                           {"u": uid})).first()
    if not row:
        return False
    totp = pyotp.TOTP(decrypt(bytes(row.secret_enc), _aad(uid)).decode())
    now_step = totp.timecode(dt.datetime.now())
    for step in (now_step - 1, now_step, now_step + 1):
        if step > row.last_step and hmac.compare_digest(totp.generate_otp(step), code):
            await s.execute(text("update core.mfa_totp set last_step = :st where user_id = :u"),
                            {"st": step, "u": uid})
            return True
    return False


async def _consume_recovery(s: AsyncSession, uid: uuid.UUID, code: str) -> bool:
    h = _hash_rc(code)
    res = await s.execute(text(
        "update core.mfa_totp set recovery_hashes = array_remove(recovery_hashes, :h) "
        "where user_id = :u and :h = any(recovery_hashes)"), {"h": h, "u": uid})
    return bool(res.rowcount)  # type: ignore[attr-defined]


async def enable(s: AsyncSession, uid: uuid.UUID, role: str, code: str, ip: str,
                 user_agent: str | None) -> tuple[MeOut, str, str, list[str]]:
    if not await _check_totp(s, uid, code):
        raise MfaFailed(uid, role)
    codes = ["".join(secrets.choice(ALPHABET) for _ in range(5)) + "-" +
             "".join(secrets.choice(ALPHABET) for _ in range(5)) for _ in range(8)]
    await s.execute(text("update core.mfa_totp set enabled_at = now(), recovery_hashes = :h where user_id = :u"),
                    {"h": [_hash_rc(c) for c in codes], "u": uid})
    await record(s, "auth.mfa_enable", "user", actor_id=uid, actor_role=role, entity_id=uid, ip=ip)
    access, raw = await service.issue_tokens(s, uid, role, True, user_agent)
    return await service.me(s, uid), access, raw, codes


async def verify(s: AsyncSession, mfa_token: str, code: str, ip: str,
                 user_agent: str | None) -> tuple[MeOut, str, str]:
    uid = uuid.UUID(decode_token(mfa_token, "mfa")["sub"])
    role = (await s.execute(text("select role::text from core.users where id = :u"), {"u": uid})).scalar_one()
    ok = await _check_totp(s, uid, code) if code.isdigit() else await _consume_recovery(s, uid, code)
    if not ok:
        raise MfaFailed(uid, role)
    return await service.complete_login(s, uid, role, mfa=True, ip=ip, user_agent=user_agent)
```
Note: `pyotp.TOTP.timecode(for_time)` accepts a `datetime`; call it as `totp.timecode(datetime.datetime.now())`. Replace the `now_step` line with:
```python
    import datetime as _dt
    now_step = totp.timecode(_dt.datetime.now())
```
(put the import at module top as `import datetime as dt` and use `totp.timecode(dt.datetime.now())`).

Add to `router.py`:
```python
from app.modules.identity import mfa
from app.modules.identity.schemas import CodeIn, MfaEnabledOut, MfaSetupOut, MfaVerifyIn


@router.post("/me/mfa/setup", response_model=MfaSetupOut)
async def mfa_setup(claims: Claims = Depends(current_claims), db: Database = Depends(get_db)) -> MfaSetupOut:
    async with db.session("zs_auth_app") as s:
        email = (await service.me(s, claims.user_id)).email
        secret, uri = await mfa.setup(s, claims.user_id, email)
    return MfaSetupOut(secret=secret, otpauth_uri=uri)


@router.post("/me/mfa/enable", response_model=MfaEnabledOut)
async def mfa_enable(data: CodeIn, request: Request, claims: Claims = Depends(current_claims),
                     db: Database = Depends(get_db)) -> JSONResponse:
    ip = client_ip(request)
    try:
        async with db.session("zs_auth_app") as s:
            me_, access, raw, codes = await mfa.enable(s, claims.user_id, claims.role, data.code, ip,
                                                       request.headers.get("user-agent"))
    except mfa.MfaFailed as exc:
        async with db.session("zs_auth_app") as s2:
            await record(s2, "auth.mfa_failed", "user", actor_id=exc.user_id, actor_role=exc.role, ip=ip)
        raise
    body = MfaEnabledOut(access_token=access, user=me_, recovery_codes=codes).model_dump(mode="json")
    resp = JSONResponse(body)
    service.set_refresh_cookie(resp, raw)
    return resp


@router.post("/auth/mfa/verify", response_model=TokenOut)
async def mfa_verify(data: MfaVerifyIn, request: Request, db: Database = Depends(get_db),
                     rl: RateLimiter = Depends(get_limiter)) -> JSONResponse:
    ip = client_ip(request)
    await rl.hit("mfa", ip, get_settings().auth_rate_limit_per_minute)
    try:
        async with db.session("zs_auth_app") as s:
            me_, access, raw = await mfa.verify(s, data.mfa_token, data.code, ip, request.headers.get("user-agent"))
    except mfa.MfaFailed as exc:
        async with db.session("zs_auth_app") as s2:  # failed transaction rolled back; audit separately
            await record(s2, "auth.mfa_failed", "user", actor_id=exc.user_id, actor_role=exc.role, ip=ip)
        raise
    return _token_response(me_, access, raw)
```

Add this test to `test_mfa.py`:
```python
async def test_failed_mfa_is_audited(client: AsyncClient, owner_conn: psycopg.Connection) -> None:
    h = await _admin_like(client, owner_conn)
    secret = (await client.post("/api/v1/me/mfa/setup", headers=h)).json()["secret"]
    await client.post("/api/v1/me/mfa/enable", json={"code": current_code(secret)}, headers=h)
    login = await client.post("/api/v1/auth/login",
                              json={"email": "doc@example.com", "password": signup_body()["password"]})
    n0 = owner_conn.execute("select count(*) from audit.events where action='auth.mfa_failed'").fetchone()
    await client.post("/api/v1/auth/mfa/verify", json={"mfa_token": login.json()["mfa_token"], "code": "000000"})
    n1 = owner_conn.execute("select count(*) from audit.events where action='auth.mfa_failed'").fetchone()
    assert n0 and n1 and n1[0] == n0[0] + 1
```

- [ ] **Step 4: Run tests**

Run: `cd apps/api && uv run pytest tests/identity -q && uv run mypy app`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add apps/api
git commit -m "T-1.07 TOTP two-step verification with replay protection and recovery codes"
```

---

### Task 9: Clinician signup with proof upload, admin verification, create-admin CLI (T-1.06)

**Files:**
- Create: `apps/api/app/core/storage.py`, `apps/api/app/modules/identity/clinician.py`, `apps/api/app/modules/admin/__init__.py`, `apps/api/app/modules/admin/service.py`, `apps/api/app/modules/admin/router.py`, `apps/api/app/cli.py`
- Modify: `apps/api/app/modules/identity/router.py`, `apps/api/app/main.py` (include admin router)
- Test: `apps/api/tests/identity/test_clinician.py`, `apps/api/tests/admin/__init__.py`, `apps/api/tests/admin/test_verification.py`

**Interfaces:**
- Consumes: `insert_user`, `issue_tokens`, `me`, `require_role`, `require_mfa`, `encrypt/decrypt`, `new_invite_code`, `record`.
- Produces: `POST /api/v1/auth/signup/clinician` (multipart: `email, password, display_name, birth_year, full_name, institution, license_no?, specialty?, proof`) → `201 TokenOut` with `user.status == "pending_verification"`; `GET /api/v1/admin/clinicians?status=pending` → list of `{user_id, email, full_name, institution, license_no, specialty, created_at, verification}`; `GET /api/v1/admin/clinicians/{user_id}/proof` → the decrypted file with its content type; `POST /api/v1/admin/clinicians/{user_id}/decision {approve: bool, reason: str}` → `{verification, invite_code}`; `409 ALREADY_DECIDED`. `Storage(root)` with `save(key: str, data: bytes) -> None`, `load(key: str) -> bytes`. CLI: `uv run python -m app.cli create-admin EMAIL NAME` (reads password from `ZS_ADMIN_PASSWORD` env or prompts).

- [ ] **Step 1: Write failing tests**

`apps/api/tests/identity/test_clinician.py`
```python
from httpx import AsyncClient

PDF = b"%PDF-1.7\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n"
FORM = {"email": "dr.khan@example.com", "password": "a long enough password", "display_name": "Dr Khan",
        "birth_year": "1985", "full_name": "Ayesha Khan", "institution": "UCP Counselling Centre",
        "license_no": "PMDC-12345", "specialty": "Clinical psychology"}


async def test_clinician_signup_pending(client: AsyncClient) -> None:
    r = await client.post("/api/v1/auth/signup/clinician", data=FORM,
                          files={"proof": ("licence.pdf", PDF, "application/pdf")})
    assert r.status_code == 201
    user = r.json()["user"]
    assert user["role"] == "clinician" and user["status"] == "pending_verification"
    assert user["clinician"] == {"verification": "pending", "invite_code": None}
    assert user["onboarding"]["mfa_setup_required"] is True


async def test_proof_rejects_fake_pdf(client: AsyncClient) -> None:
    r = await client.post("/api/v1/auth/signup/clinician", data=FORM,
                          files={"proof": ("licence.pdf", b"MZ\x90\x00 not a pdf", "application/pdf")})
    assert r.status_code == 415 and r.json()["error"]["code"] == "UNSUPPORTED_FILE"


async def test_proof_rejects_large_file(client: AsyncClient) -> None:
    big = PDF + b"0" * (5 * 1024 * 1024)
    r = await client.post("/api/v1/auth/signup/clinician", data=FORM,
                          files={"proof": ("licence.pdf", big, "application/pdf")})
    assert r.status_code == 413 and r.json()["error"]["code"] == "FILE_TOO_LARGE"


async def test_proof_is_encrypted_at_rest(client: AsyncClient, owner_conn: object, tmp_path: object) -> None:
    import pathlib

    import psycopg
    from app.core.config import get_settings
    assert isinstance(owner_conn, psycopg.Connection)
    await client.post("/api/v1/auth/signup/clinician", data=FORM,
                      files={"proof": ("licence.pdf", PDF, "application/pdf")})
    key = owner_conn.execute("select proof_key from core.clinician_profiles").fetchone()
    assert key and key[0]
    stored = (pathlib.Path(get_settings().storage_dir) / key[0]).read_bytes()
    assert b"%PDF" not in stored
```
`apps/api/tests/admin/__init__.py`: empty.
`apps/api/tests/admin/test_verification.py`
```python
import os
import subprocess
import sys

import psycopg
from httpx import AsyncClient

from app.modules.identity.mfa import current_code
from tests.identity.test_clinician import FORM, PDF


async def _admin_headers(client: AsyncClient) -> dict[str, str]:
    env = {**os.environ, "ZS_ADMIN_PASSWORD": "admin long password"}
    subprocess.run([sys.executable, "-m", "app.cli", "create-admin", "admin@zehensync.test", "Admin"],
                   check=True, env=env)
    login = await client.post("/api/v1/auth/login",
                              json={"email": "admin@zehensync.test", "password": "admin long password"})
    h = {"Authorization": f"Bearer {login.json()['access_token']}"}
    secret = (await client.post("/api/v1/me/mfa/setup", headers=h)).json()["secret"]
    en = await client.post("/api/v1/me/mfa/enable", json={"code": current_code(secret)}, headers=h)
    return {"Authorization": f"Bearer {en.json()['access_token']}"}


async def test_admin_needs_mfa(client: AsyncClient) -> None:
    env = {**os.environ, "ZS_ADMIN_PASSWORD": "admin long password"}
    subprocess.run([sys.executable, "-m", "app.cli", "create-admin", "admin@zehensync.test", "Admin"],
                   check=True, env=env)
    login = await client.post("/api/v1/auth/login",
                              json={"email": "admin@zehensync.test", "password": "admin long password"})
    r = await client.get("/api/v1/admin/clinicians", headers={"Authorization": f"Bearer {login.json()['access_token']}"})
    assert r.status_code == 403 and r.json()["error"]["code"] == "MFA_REQUIRED"


async def test_non_admin_forbidden(client: AsyncClient) -> None:
    r = await client.post("/api/v1/auth/signup/clinician", data=FORM, files={"proof": ("l.pdf", PDF, "application/pdf")})
    h = {"Authorization": f"Bearer {r.json()['access_token']}"}
    assert (await client.get("/api/v1/admin/clinicians", headers=h)).status_code == 403


async def test_approve_flow(client: AsyncClient, owner_conn: psycopg.Connection) -> None:
    await client.post("/api/v1/auth/signup/clinician", data=FORM, files={"proof": ("l.pdf", PDF, "application/pdf")})
    h = await _admin_headers(client)
    queue = (await client.get("/api/v1/admin/clinicians?status=pending", headers=h)).json()
    assert len(queue) == 1 and queue[0]["full_name"] == "Ayesha Khan"
    uid = queue[0]["user_id"]
    proof = await client.get(f"/api/v1/admin/clinicians/{uid}/proof", headers=h)
    assert proof.status_code == 200 and proof.content == PDF and proof.headers["content-type"] == "application/pdf"
    d = await client.post(f"/api/v1/admin/clinicians/{uid}/decision", json={"approve": True, "reason": "PMDC verified"},
                          headers=h)
    assert d.status_code == 200 and d.json()["verification"] == "approved" and len(d.json()["invite_code"]) == 9
    status = owner_conn.execute("select status::text from core.users where id = %s", (uid,)).fetchone()
    assert status == ("active",)
    again = await client.post(f"/api/v1/admin/clinicians/{uid}/decision", json={"approve": False, "reason": "x x x"},
                              headers=h)
    assert again.status_code == 409 and again.json()["error"]["code"] == "ALREADY_DECIDED"
    actions = {r[0] for r in owner_conn.execute(
        "select action from audit.events where action like 'clinician.%'").fetchall()}
    assert {"clinician.proof_read", "clinician.approve"} <= actions


async def test_reject_suspends(client: AsyncClient, owner_conn: psycopg.Connection) -> None:
    r = await client.post("/api/v1/auth/signup/clinician", data=FORM, files={"proof": ("l.pdf", PDF, "application/pdf")})
    uid = r.json()["user"]["id"]
    h = await _admin_headers(client)
    d = await client.post(f"/api/v1/admin/clinicians/{uid}/decision",
                          json={"approve": False, "reason": "Licence number not found"}, headers=h)
    assert d.status_code == 200 and d.json() == {"verification": "rejected", "invite_code": None}
    assert owner_conn.execute("select status::text from core.users where id = %s", (uid,)).fetchone() == ("suspended",)
```

- [ ] **Step 2: Run to see them fail**

Run: `cd apps/api && uv run pytest tests/identity/test_clinician.py tests/admin -q`
Expected: FAIL, 404 on `/api/v1/auth/signup/clinician`.

- [ ] **Step 3: Implement storage and clinician signup**

`apps/api/app/core/storage.py`
```python
from pathlib import Path

from app.core.crypto import decrypt, encrypt


class Storage:
    """Local encrypted file store. Swapped for S3/MinIO in P4 behind the same interface."""

    def __init__(self, root: str) -> None:
        self._root = Path(root)

    def save(self, key: str, data: bytes) -> None:
        path = self._root / key
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(encrypt(data, key.encode()))

    def load(self, key: str) -> bytes:
        return decrypt((self._root / key).read_bytes(), key.encode())
```

`apps/api/app/modules/identity/clinician.py`
```python
import uuid

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import record
from app.core.errors import AppError
from app.core.ids import uuid7
from app.core.storage import Storage
from app.modules.identity import service
from app.modules.identity.schemas import MeOut

MAX_PROOF = 5 * 1024 * 1024
SIGNATURES = {b"%PDF-": ("application/pdf", "pdf"), b"\x89PNG\r\n\x1a\n": ("image/png", "png"),
              b"\xff\xd8\xff": ("image/jpeg", "jpg")}


def sniff(data: bytes) -> tuple[str, str]:
    if len(data) > MAX_PROOF:
        raise AppError("FILE_TOO_LARGE", "The proof document must be 5 MB or smaller.", 413)
    for sig, kind in SIGNATURES.items():
        if data.startswith(sig):
            return kind
    raise AppError("UNSUPPORTED_FILE", "Upload a PDF, PNG or JPEG.", 415)


async def signup(s: AsyncSession, storage: Storage, *, email: str, password: str, display_name: str,
                 birth_year: int, full_name: str, institution: str, license_no: str | None,
                 specialty: str | None, proof: bytes, ip: str,
                 user_agent: str | None) -> tuple[MeOut, str, str]:
    service.check_age(birth_year)
    _, ext = sniff(proof)
    if await service.email_taken(s, email):
        raise AppError("EMAIL_TAKEN", "That email is already registered.", 409, {"field": "email"})
    uid = await service.insert_user(s, email=email, password=password, display_name=display_name,
                                    birth_year=birth_year, role="clinician", status="pending_verification")
    key = f"clinician-proof/{uid}/{uuid7()}.{ext}"
    storage.save(key, proof)
    await s.execute(text(
        "insert into core.clinician_profiles(user_id,full_name,license_no,institution,specialty,proof_key) "
        "values (:u,:f,:l,:i,:sp,:k)"),
        {"u": uid, "f": full_name, "l": license_no, "i": institution, "sp": specialty, "k": key})
    access, raw = await service.issue_tokens(s, uid, "clinician", False, user_agent)
    await record(s, "auth.signup", "user", actor_id=uid, actor_role="clinician", entity_id=uid,
                 detail={"path": "clinician"}, ip=ip)
    return await service.me(s, uid), access, raw


def proof_content_type(key: str) -> str:
    return {"pdf": "application/pdf", "png": "image/png", "jpg": "image/jpeg"}[key.rsplit(".", 1)[1]]


__all__ = ["signup", "sniff", "proof_content_type", "uuid"]
```

Add to `identity/router.py`:
```python
from fastapi import File, Form, UploadFile

from app.core.storage import Storage
from app.modules.identity import clinician


def get_storage(request: Request) -> Storage:
    st: Storage = request.app.state.storage
    return st


@router.post("/auth/signup/clinician", status_code=201, response_model=TokenOut)
async def signup_clinician(
    request: Request,
    email: str = Form(...), password: str = Form(..., min_length=12, max_length=128),
    display_name: str = Form(..., min_length=1, max_length=80), birth_year: int = Form(..., ge=1900, le=2100),
    full_name: str = Form(..., min_length=2, max_length=120), institution: str = Form(..., min_length=2, max_length=160),
    license_no: str | None = Form(default=None, max_length=60), specialty: str | None = Form(default=None, max_length=120),
    proof: UploadFile = File(...),
    db: Database = Depends(get_db), rl: RateLimiter = Depends(get_limiter), storage: Storage = Depends(get_storage),
) -> JSONResponse:
    ip = client_ip(request)
    await rl.hit("signup", ip, get_settings().auth_rate_limit_per_minute)
    normalized = SignupIn.model_validate({"email": email, "password": password, "display_name": display_name,
                                          "birth_year": birth_year, "path": "support"}).email
    data = await proof.read(clinician.MAX_PROOF + 1)
    async with db.session("zs_auth_app") as s:
        me_, access, raw = await clinician.signup(
            s, storage, email=normalized, password=password, display_name=display_name.strip(),
            birth_year=birth_year, full_name=full_name.strip(), institution=institution.strip(),
            license_no=license_no, specialty=specialty, proof=data, ip=ip,
            user_agent=request.headers.get("user-agent"))
    return _token_response(me_, access, raw, 201)
```
In `main.py` lifespan add `app.state.storage = Storage(s.storage_dir)` (import `Storage`). Point the test settings at a temp dir: in `tests/conftest.py` before settings import add `os.environ.setdefault("ZS_STORAGE_DIR", str(pathlib.Path(tempfile.gettempdir()) / "zs-test-storage"))` with `import pathlib, tempfile`.

- [ ] **Step 4: Implement admin service, router, CLI**

`apps/api/app/modules/admin/__init__.py`: empty.
`apps/api/app/modules/admin/service.py`
```python
import datetime as dt
import uuid
from typing import Literal

from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import record
from app.core.errors import AppError
from app.core.pseudonym import new_invite_code


class ClinicianApplication(BaseModel):
    user_id: uuid.UUID
    email: str
    full_name: str
    institution: str
    license_no: str | None
    specialty: str | None
    created_at: dt.datetime
    verification: Literal["pending", "approved", "rejected"]


class Decision(BaseModel):
    verification: Literal["approved", "rejected"]
    invite_code: str | None


async def list_applications(s: AsyncSession, status: str) -> list[ClinicianApplication]:
    rows = (await s.execute(text(
        "select c.user_id, u.email::text, c.full_name, c.institution, c.license_no, c.specialty, u.created_at, "
        "c.verification::text from core.clinician_profiles c join core.users u on u.id = c.user_id "
        "where c.verification = cast(:st as core.verification) order by u.created_at"), {"st": status})).all()
    return [ClinicianApplication.model_validate(r._asdict()) for r in rows]


async def proof_key(s: AsyncSession, admin_id: uuid.UUID, user_id: uuid.UUID, ip: str) -> str:
    key = (await s.execute(text("select proof_key from core.clinician_profiles where user_id = :u"),
                           {"u": user_id})).scalar_one_or_none()
    if not key:
        raise AppError("NOT_FOUND", "No proof document for this application.", 404)
    await record(s, "clinician.proof_read", "clinician_profile", actor_id=admin_id, actor_role="admin",
                 entity_id=user_id, ip=ip)
    return str(key)


async def decide(s: AsyncSession, admin_id: uuid.UUID, user_id: uuid.UUID, approve: bool, reason: str,
                 ip: str) -> Decision:
    cur = (await s.execute(text("select verification::text from core.clinician_profiles where user_id = :u "
                                "for update"), {"u": user_id})).scalar_one_or_none()
    if cur is None:
        raise AppError("NOT_FOUND", "No such application.", 404)
    if cur != "pending":
        raise AppError("ALREADY_DECIDED", "This application has already been decided.", 409)
    code = None
    if approve:
        for _ in range(8):
            code = new_invite_code()
            if (await s.execute(text("select 1 from core.clinician_profiles where invite_code = :c"),
                                {"c": code})).first() is None:
                break
    await s.execute(text(
        "update core.clinician_profiles set verification = cast(:v as core.verification), decision_reason = :r, "
        "verified_by = :a, verified_at = now(), invite_code = :c where user_id = :u"),
        {"v": "approved" if approve else "rejected", "r": reason, "a": admin_id, "c": code, "u": user_id})
    await s.execute(text("update core.users set status = cast(:st as core.user_status) where id = :u"),
                    {"st": "active" if approve else "suspended", "u": user_id})
    await record(s, "clinician.approve" if approve else "clinician.reject", "clinician_profile",
                 actor_id=admin_id, actor_role="admin", entity_id=user_id, detail={"reason": reason}, ip=ip)
    return Decision(verification="approved" if approve else "rejected", invite_code=code)
```
The admin pool needs `EXECUTE` on `audit.append` (granted in Task 3) and `SELECT`/`UPDATE` on `core.clinician_profiles` and `core.users` (granted). It also reads `core.clinician_profiles.invite_code` for uniqueness (SELECT granted).

`apps/api/app/modules/admin/router.py`
```python
import uuid
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Request, Response
from pydantic import BaseModel, StringConstraints

from app.core.db import Database
from app.core.deps import Claims, client_ip, get_db, require_mfa, require_role
from app.core.storage import Storage
from app.modules.admin import service
from app.modules.identity.clinician import proof_content_type

router = APIRouter(prefix="/api/v1/admin", dependencies=[Depends(require_role("admin")), Depends(require_mfa)])


class DecisionIn(BaseModel):
    approve: bool
    reason: Annotated[str, StringConstraints(strip_whitespace=True, min_length=3, max_length=500)]


@router.get("/clinicians", response_model=list[service.ClinicianApplication])
async def clinicians(status: Literal["pending", "approved", "rejected"] = "pending",
                     db: Database = Depends(get_db)) -> list[service.ClinicianApplication]:
    async with db.session("zs_admin_app") as s:
        return await service.list_applications(s, status)


@router.get("/clinicians/{user_id}/proof")
async def proof(user_id: uuid.UUID, request: Request, claims: Claims = Depends(require_role("admin")),
                db: Database = Depends(get_db)) -> Response:
    async with db.session("zs_admin_app") as s:
        key = await service.proof_key(s, claims.user_id, user_id, client_ip(request))
    storage: Storage = request.app.state.storage
    return Response(storage.load(key), media_type=proof_content_type(key),
                    headers={"Cache-Control": "no-store", "Content-Disposition": "inline"})


@router.post("/clinicians/{user_id}/decision", response_model=service.Decision)
async def decision(user_id: uuid.UUID, data: DecisionIn, request: Request,
                   claims: Claims = Depends(require_role("admin")),
                   db: Database = Depends(get_db)) -> service.Decision:
    async with db.session("zs_admin_app") as s:
        return await service.decide(s, claims.user_id, user_id, data.approve, data.reason, client_ip(request))
```
In `main.py` include `from app.modules.admin.router import router as admin_router` and `app.include_router(admin_router)`.

`apps/api/app/cli.py`
```python
import asyncio
import getpass
import os
import sys

from app.core.config import get_settings
from app.core.db import Database
from app.modules.identity import service


async def create_admin(email: str, name: str, password: str) -> None:
    db = Database(get_settings())
    try:
        async with db.session("zs_auth_app") as s:
            uid = await service.insert_user(s, email=email.strip().lower(), password=password, display_name=name,
                                            birth_year=1990, role="admin")
            from app.core.audit import record
            await record(s, "admin.create", "user", entity_id=uid, detail={"via": "cli"})
    finally:
        await db.dispose()
    print(f"admin created: {uid}")


def main() -> None:
    if len(sys.argv) != 4 or sys.argv[1] != "create-admin":
        print("usage: python -m app.cli create-admin EMAIL NAME", file=sys.stderr)
        raise SystemExit(2)
    password = os.environ.get("ZS_ADMIN_PASSWORD") or getpass.getpass("Password (12+ chars): ")
    if len(password) < 12:
        raise SystemExit("password must be at least 12 characters")
    asyncio.run(create_admin(sys.argv[2], sys.argv[3], password))


if __name__ == "__main__":
    main()
```

- [ ] **Step 5: Run the full suite**

Run: `cd apps/api && uv run pytest -q && uv run ruff check . && uv run mypy app`
Expected: all tests pass; lint and types clean.

- [ ] **Step 6: Commit**

```bash
git add apps/api
git commit -m "T-1.06 clinician signup with encrypted proof, admin verification queue and decisions, create-admin CLI"
```

---

### Task 10: Docs, tracker and API contract sync

**Files:**
- Modify: `docs/02-Engineering/Backend-Schema.md` (add `refresh_tokens.mfa_verified`, `mfa_totp.last_step`, `clinician_profiles.decision_reason`, identity pool note), `docs/02-Engineering/API.md` (add `/consents/docs`, clinician multipart fields, error codes `UNDER_18`, `EMAIL_TAKEN`, `INVALID_CREDENTIALS`, `REFRESH_REUSED`, `MFA_REQUIRED`, `MFA_INVALID`, `RATE_LIMITED`, `ALREADY_DECIDED`, `FILE_TOO_LARGE`, `UNSUPPORTED_FILE`), `docs/05-Planning/Tracker.md` (mark T-0.06, T-1.01–T-1.09, T-1.15 done), `docs/05-Planning/RTM.md` (TC ids for F-PL-01..06 → test function names), `apps/api/README.md` (run commands)

- [ ] **Step 1: Write `apps/api/README.md`**
```markdown
# ZehenSync API

    pnpm db:up                      # from repo root: Postgres, Redis, MinIO
    cd apps/api && cp .env.example .env
    uv sync
    uv run alembic upgrade head
    uv run python -m app.cli create-admin you@example.com "Your Name"
    uv run uvicorn app.main:app --reload     # http://localhost:8000/api/v1/docs
    uv run pytest                            # uses database zehensync_test, Redis db 15
```
- [ ] **Step 2: Update the docs and RTM rows listed above**, mapping `F-PL-01 → test_support_path_creates_patient_with_pseudonym, test_scholar_path_creates_scholar`, `F-PL-02 → test_approve_flow, test_admin_needs_mfa`, `F-PL-03 → test_scholar_role_cannot_touch_patient_schema, test_patient_sees_only_own_profile`, `F-PL-04 → test_grant_list_revoke`, `F-PL-05 → test_verify_chain_detects_tampering, test_audit_rows_are_append_only`, `F-PL-06 → test_admin_needs_mfa, test_enable_then_login_needs_code`.
- [ ] **Step 3: Run the whole suite one last time**

Run: `cd apps/api && uv run pytest -q`
Expected: all green.

- [ ] **Step 4: Commit**

```bash
git add docs apps/api/README.md
git commit -m "T-1.09 docs: schema, API contract, RTM and tracker updated for P1 backend"
```
