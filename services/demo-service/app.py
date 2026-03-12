from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from datetime import datetime, timezone
import multiprocessing
import threading
import time
import os
from typing import Optional
import uuid
from pathlib import Path

app = FastAPI(title="AutoSRE Demo Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EVENTS = []
EVENT_LOCK = threading.Lock()
STATE_LOCK = threading.Lock()
MAX_EVENTS = 200
STATE = {
    "status": "Healthy",
    "resilienceScore": 100,
    "chaosRunning": False,
}
BASE_DIR = Path(__file__).resolve().parents[2]
DOCS_API_PATH = BASE_DIR / "docs" / "api.md"


class EventIn(BaseModel):
    type: str
    message: str
    description: str = ""
    time: Optional[str] = None


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def record_event(event_type: str, message: str, description: str, time_iso: Optional[str] = None):
    event = {
        "id": str(uuid.uuid4()),
        "time": time_iso or _now_iso(),
        "type": event_type,
        "message": message,
        "description": description,
    }
    with EVENT_LOCK:
        EVENTS.insert(0, event)
        if len(EVENTS) > MAX_EVENTS:
            del EVENTS[MAX_EVENTS:]
    return event


def set_state(**updates):
    with STATE_LOCK:
        STATE.update(updates)


def get_state():
    with STATE_LOCK:
        return dict(STATE)

def cpu_load(duration: int):
    # Keep the CPU busy for the specified duration
    end_time = time.time() + max(1, duration)
    while time.time() < end_time:
        _ = 1 * 1

@app.get("/")
async def root():
    return {"status": "ok", "message": "Service is healthy"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/state")
async def state():
    return get_state()


@app.get("/events")
async def events(limit: int = 50):
    safe_limit = max(1, min(limit, MAX_EVENTS))
    with EVENT_LOCK:
        return {"events": EVENTS[:safe_limit]}


@app.get("/docs/api.md", response_class=PlainTextResponse)
async def docs_api():
    if not DOCS_API_PATH.exists():
        raise HTTPException(status_code=404, detail="API docs not found.")
    return DOCS_API_PATH.read_text(encoding="utf-8")


@app.post("/events")
async def add_event(event: EventIn):
    created = record_event(
        event_type=event.type,
        message=event.message,
        description=event.description,
        time_iso=event.time,
    )
    return {"event": created}


def run_cpu_spike(duration: int):
    num_cores = multiprocessing.cpu_count()
    processes = []
    for _ in range(num_cores):
        p = multiprocessing.Process(target=cpu_load, args=(duration,), daemon=True)
        p.start()
        processes.append(p)
    for p in processes:
        p.join()


def schedule_event(delay_sec: float, event_type: str, message: str, description: str,
                   status: Optional[str] = None, score: Optional[int] = None, end: bool = False):
    def _task():
        record_event(event_type, message, description)
        updates = {}
        if status is not None:
            updates["status"] = status
        if score is not None:
            updates["resilienceScore"] = score
        if end:
            updates["chaosRunning"] = False
        if updates:
            set_state(**updates)
    threading.Timer(delay_sec, _task).start()


def schedule_incident_flow(duration: int):
    total = max(12, min(duration, 120))
    alert_delay = total * 0.25
    intervene_delay = total * 0.5
    remediation_delay = total * 0.75
    recovery_delay = total

    schedule_event(
        alert_delay,
        "alert",
        "Azure Monitor Alert",
        "CPU usage exceeded 80% threshold on demo-service.",
        status="Degraded",
        score=85,
    )
    schedule_event(
        intervene_delay,
        "mitigation",
        "Azure SRE Agent Intervening",
        "Analyzing logs and performing RCA...",
    )
    schedule_event(
        remediation_delay,
        "mitigation",
        "Automated Remediation",
        "Restarting Azure Container App revision.",
    )
    schedule_event(
        recovery_delay,
        "recovery",
        "Service Recovered",
        "CPU usage back to normal. Incident resolved.",
        status="Healthy",
        score=94,
        end=True,
    )


@app.get("/cpu-spike")
@app.post("/cpu-spike")
async def cpu_spike(duration: int = 60):
    current = get_state()
    if current.get("chaosRunning"):
        raise HTTPException(status_code=409, detail="Chaos experiment already running.")

    set_state(chaosRunning=True)
    record_event(
        "chaos",
        "Chaos Experiment Triggered",
        "Injecting CPU spike into demo-service.",
    )

    threading.Thread(target=run_cpu_spike, args=(duration,), daemon=True).start()
    schedule_incident_flow(duration)

    return {
        "status": "spike_initiated",
        "message": f"CPU spike started on {multiprocessing.cpu_count()} cores for approximately {duration} seconds.",
        "note": "This demo simulates alerting and remediation events after the spike begins.",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
