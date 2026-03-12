#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
API_BASE="${API_BASE:-http://localhost:8080}"
CHAOS_DURATION_SEC="${CHAOS_DURATION_SEC:-12}"
DASHBOARD_PORT="${DASHBOARD_PORT:-5173}"

BACKEND_PID=""
DASH_PID=""

cleanup() {
  if [[ -n "${DASH_PID}" ]] && kill -0 "${DASH_PID}" 2>/dev/null; then
    kill "${DASH_PID}" || true
  fi
  if [[ -n "${BACKEND_PID}" ]] && kill -0 "${BACKEND_PID}" 2>/dev/null; then
    kill "${BACKEND_PID}" || true
  fi
}
trap cleanup EXIT INT TERM

ensure_venv() {
  if [[ ! -d "${ROOT_DIR}/services/demo-service/.venv" ]]; then
    python3 -m venv "${ROOT_DIR}/services/demo-service/.venv"
  fi
  "${ROOT_DIR}/services/demo-service/.venv/bin/pip" install -r "${ROOT_DIR}/services/demo-service/requirements.txt" >/dev/null
}

start_backend() {
  (cd "${ROOT_DIR}/services/demo-service" && ./.venv/bin/python app.py) &
  BACKEND_PID=$!
}

start_dashboard() {
  (cd "${ROOT_DIR}/ui/dashboard" && \
    if [[ ! -d node_modules ]]; then npm install >/dev/null; fi && \
    VITE_API_BASE_URL="${API_BASE}" npm run dev -- --port "${DASHBOARD_PORT}") &
  DASH_PID=$!
}

wait_for_backend() {
  echo "Waiting for demo service at ${API_BASE}..."
  for _ in {1..30}; do
    if curl -sf "${API_BASE}/health" >/dev/null; then
      return 0
    fi
    sleep 1
  done
  echo "Demo service did not become ready." >&2
  return 1
}

smoke_test() {
  echo "Running smoke test..."
  curl -s "${API_BASE}/health" >/dev/null
  curl -s -X POST "${API_BASE}/cpu-spike?duration=${CHAOS_DURATION_SEC}" >/dev/null
  sleep 3
  echo "State (during incident):"
  curl -s "${API_BASE}/state"; echo
  sleep "${CHAOS_DURATION_SEC}"
  echo "State (after recovery):"
  curl -s "${API_BASE}/state"; echo
  echo "Recent events:"
  curl -s "${API_BASE}/events?limit=5"; echo
}

ensure_venv
start_backend
wait_for_backend
start_dashboard
smoke_test

echo "Demo running:"
echo "- API: ${API_BASE}"
echo "- Dashboard: http://localhost:${DASHBOARD_PORT}"
echo "Press Ctrl+C to stop."
wait
