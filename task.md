# AutoSRE Implementation Tasks

- [ ] **Phase 1: Project Setup**
  - [ ] Initialize repository structure (frontend, backend, infra, agents).
  - [ ] Ensure Azure prerequisites are documented.

- [ ] **Phase 2: Demo Application**
  - [ ] Build a simple API service (Node.js/Express or Python/FastAPI).
  - [ ] Add failure simulation endpoints (e.g., `/cpu-spike`, `/500-error`).
  - [ ] Containerize and prepare deployment scripts for Azure Container Apps.

- [ ] **Phase 3: Azure SRE Agent & Monitoring Configuration**
  - [ ] Configure Azure Monitor metrics and Log Analytics workspaces.
  - [ ] Setup alert rules for CPU thresholds and error rates.
  - [ ] Integrate and configure the **Azure SRE Agent** to monitor the Container App and act on alerts.
  - [ ] Connect Azure SRE Agent to the GitHub repository.

- [ ] **Phase 4: Custom AI Agents (Foundry / Agent Framework)**
  - [ ] Build the **Chaos Agent**: capable of securely invoking failure scenarios.
  - [ ] Build the **Resilience Agent**: calculates a Resilience Score based on SRE Agent MTTR.
  - [ ] (Optional) Expose custom agent tools via **MCP Server**.

- [ ] **Phase 5: React Dashboard**
  - [ ] Scaffold React (Vite/Next.js) application.
  - [ ] Implement UI for triggering the Chaos Agent.
  - [ ] Implement live logging/timeline view of the incident lifecycle.
  - [ ] Display the animated Resilience Score.
