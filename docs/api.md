# AutoSRE Demo Service API

Base URL: `http://localhost:8080`

## Endpoints

### `GET /health`
Returns a basic health response.

Response:
```json
{"status":"healthy"}
```

### `GET /state`
Returns the current demo state used by the dashboard.

Response:
```json
{
  "status": "Healthy",
  "resilienceScore": 100,
  "chaosRunning": false
}
```

### `GET /events?limit=50`
Returns a reverse-chronological list of recent timeline events.

Response:
```json
{
  "events": [
    {
      "id": "d6f96a54-5d44-4b30-92b7-4a25d4a8383c",
      "time": "2026-03-12T12:34:56.789Z",
      "type": "alert",
      "message": "Azure Monitor Alert",
      "description": "CPU usage exceeded 80% threshold on demo-service."
    }
  ]
}
```

### `POST /events`
Allows external producers to append a timeline event (optional for the demo).

Request:
```json
{
  "type": "mitigation",
  "message": "Automated Remediation",
  "description": "Restarting Azure Container App revision.",
  "time": "2026-03-12T12:35:12.000Z"
}
```

Response:
```json
{
  "event": {
    "id": "7c0e4f8f-1f2a-48fd-9b76-0fe35c53e4a3",
    "time": "2026-03-12T12:35:12.000Z",
    "type": "mitigation",
    "message": "Automated Remediation",
    "description": "Restarting Azure Container App revision."
  }
}
```

### `POST /cpu-spike?duration=60`
Triggers a CPU spike for `duration` seconds and schedules the demo incident flow.

Response:
```json
{
  "status": "spike_initiated",
  "message": "CPU spike started on 8 cores for approximately 60 seconds.",
  "note": "This demo simulates alerting and remediation events after the spike begins."
}
```

Notes:
- `GET /cpu-spike` is also accepted for convenience, but `POST` is preferred.
- Events are capped to the most recent 200 entries.
