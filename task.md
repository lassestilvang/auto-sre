# AutoSRE Implementation Tasks

- [x] **Phase 1: Project Setup**
  - [x] Initialize repository structure (frontend, backend, infra, agents).
  - [x] Ensure Azure prerequisites are documented.

- [x] **Phase 2: Demo Application (Golden Path MVP)**
  - [x] Build a simple API service (Node.js/Express or Python/FastAPI).
  - [x] Add a single failure simulation endpoint (`/cpu-spike`).
  - [x] Containerize and prepare deployment scripts for Azure Container Apps.

- [x] **Phase 3: Azure SRE Agent & Monitoring Configuration**
  - [x] Configure Azure Monitor metrics logic for CPU usage (Documented in README).
  - [x] Setup a single alert rule for CPU threshold (Documented in README).
  - [x] Integrate and configure the **Azure SRE Agent** (Strategy defined in Plan).

- [x] **Phase 4: Custom AI Agents (Foundry / Agent Framework)**
  - [x] Build the **Chaos Agent**: triggers the CPU spike.
  - [x] Build the **Resilience Agent**: calculates a Resilience Score based on SRE Agent MTTR.

- [x] **Phase 5: React Dashboard**
  - [x] Scaffold React (Vite/Next.js) application.
  - [x] Implement UI for triggering the Chaos Agent (CPU Spike).
  - [x] Implement live logging/timeline view of the incident lifecycle.
  - [x] Display the animated Resilience Score.

- [x] **Phase 6: Submission Assets & Polish**
  - [x] Polish public GitHub repo [README.md](file:///Users/lasse/Sites/auto-sre/README.md) to explicitly state core requirements and judging criteria.
  - [x] Create a one-slide architecture diagram (Mermaid added to README).
  - [x] Write a 90-second elevator pitch for the demo script.
  - [ ] Record the golden-path 2-minute demo video (User Action Required).

- [x] **Phase 7: Infrastructure as Code (Bicep)**
  - [x] Create Bicep template for Log Analytics and App Insights.
  - [x] Create Bicep template for Azure Container Apps Environment and Service.
  - [x] Create Bicep template for high-CPU Alert Rules.
