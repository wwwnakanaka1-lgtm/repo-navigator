from datetime import datetime

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers.actions import router as actions_router
from app.routers.health import router as health_router
from app.routers.playbook import router as playbook_router
from app.routers.projects import router as projects_router
from app.routers.stats import router as stats_router
from app.routers.timeline import router as timeline_router

app = FastAPI(title=settings.app_name, version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(projects_router)
app.include_router(actions_router)
app.include_router(timeline_router)
app.include_router(stats_router)
app.include_router(playbook_router)


@app.websocket("/ws/heartbeat")
async def heartbeat(websocket: WebSocket) -> None:
    await websocket.accept()
    try:
        while True:
            await websocket.send_json(
                {
                    "type": "heartbeat",
                    "service": "repo-navigator-api",
                    "timestamp": datetime.utcnow().isoformat(),
                }
            )
            await websocket.receive_text()
    except WebSocketDisconnect:
        return
