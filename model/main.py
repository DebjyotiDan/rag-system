from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.ingest import router as ingest_router
from routes.chat import router as chat_router
from services.vectordb import init_tables

app = FastAPI()

origin = [
    "http://localhost:5173"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins= origin,
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest_router, prefix="/api")

app.include_router(chat_router, prefix="/api")

@app.get("/health")
def health():
    return {"messgage": "healthy"}


@app.on_event("startup")
def on_startup():
    """Create required tables on app startup."""
    try:
        init_tables()
        print("✓ Tables ready (user_documents, chat_logs)")
    except Exception as e:
        print(f"⚠ Could not init tables: {e}")