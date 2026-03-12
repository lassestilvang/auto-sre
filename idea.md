# AutoSRE: AI Chaos Engineer + AI Incident Commander

## Overview

**AutoSRE** is an agentic DevOps system that automatically tests infrastructure resilience, detects incidents, diagnoses root causes, executes mitigation actions, and generates postmortem reports.

The system combines two core capabilities:

1. **AI Chaos Engineer** – intentionally injects failures into a system to test reliability.
2. **AI Incident Commander** – detects incidents, diagnoses root causes, performs automated remediation, and generates incident reports.

The system is designed as a **multi‑agent DevOps control loop** powered by Azure AI Foundry agents.

Chaos → Detection → Diagnosis → Mitigation → Recovery → Postmortem → Resilience Scoring

This project is optimized for a hackathon:

* Demonstrates **agentic DevOps principles**
* Uses multiple **Microsoft Azure AI platform services**
* Provides a **dramatic and visual live demo**
* Is buildable within **~24 hours**

---

# Demo Scenario

1. A demo microservice is deployed.
2. The **Chaos Agent** injects a failure.
3. Azure Monitor detects abnormal metrics.
4. An alert triggers the **Incident Commander workflow**.
5. AI agents collaborate to analyze telemetry.
6. The system determines the most likely root cause.
7. The **Mitigation Agent executes a repair action**.
8. The service recovers automatically.
9. AI generates a **postmortem report and resilience score**.

---

# Key Concept: Multi‑Agent DevOps System

Instead of a single AI call, the system uses **specialized agents orchestrated through Azure AI Foundry**.

Each agent performs a specific responsibility in the DevOps lifecycle.

Agents collaborate to complete the full incident response loop.

This showcases **Microsoft's Agent Framework and Azure AI Foundry vision for enterprise AI automation**.

---

# Agent Roles

## Chaos Agent

Injects controlled failures into the system.

Examples:

* restart container
* trigger CPU spike
* force HTTP 500 errors
* simulate traffic spike

Purpose:

Test system resilience automatically.

---

## Observability Agent

Analyzes telemetry and summarizes system health.

Inputs:

* Azure Monitor metrics
* Azure Log Analytics logs

Example output:

Error rate increased from 0.1% to 16%.
CPU usage reached 94%.
Most failures originate from checkout-service.

---

## Diagnosis Agent

Determines the most likely root cause of the incident.

Example reasoning:

Recent deployment modified cache configuration.
Database query volume increased.
Likely root cause: database saturation.

---

## Mitigation Agent

Executes automated remediation actions.

Examples:

* restart container
* scale replicas
* rollback deployment

---

## Postmortem Agent

Generates structured incident reports.

Example output:

Incident Duration: 2 minutes

Root Cause:
Memory leak in checkout container.

Mitigation:
Container restart.

Recommended Prevention:
Enable auto restart policy and memory monitoring.

---

# Resilience Scoring

After chaos experiments the system evaluates infrastructure resilience.

Example output:

Resilience Score: 74 / 100

Weaknesses detected:

* Alert threshold too high
* Recovery time exceeded target

Suggested improvements:

* Reduce alert threshold
* Add auto scaling

This feature makes the system resemble a **real SRE reliability platform**.

---

# System Architecture

## High-Level Flow

Chaos Agent

↓

Demo Service (Azure Container Apps)

↓

Azure Monitor detects anomaly

↓

Alert triggers Event Grid

↓

Azure Function Incident Orchestrator

↓

Azure AI Foundry Agent System

↓

Observability Agent

↓

Diagnosis Agent

↓

Mitigation Agent

↓

Service Recovery

↓

Postmortem Agent

↓

Resilience Score

---

# Core Components

## 1. Demo Application

A simple service intentionally designed to fail.

Possible implementations:

* Node.js Express API
* Python FastAPI

Endpoints:

* `/` – normal response
* `/error` – returns HTTP 500
* `/cpu` – creates CPU spike

Runs on **Azure Container Apps**.

---

## 2. Chaos Engineer Agent

Injects failures for resilience testing.

Example experiments:

* restart container
* CPU spike
* HTTP 500 errors

Example command:

az containerapp revision restart

The chaos agent can be triggered via API or dashboard.

---

## 3. Monitoring and Alerting

Azure Monitor tracks:

* CPU usage
* error rate
* request latency

Example alert rules:

* CPU > 80%
* error rate > 5%

Alerts trigger:

* Event Grid
* Azure Function

---

## 4. Incident Orchestrator

Runs as an **Azure Function**.

Responsibilities:

* receive alerts
* collect logs
* collect metrics
* invoke Azure AI Foundry agents
* execute mitigation
* store incident timeline

---

## 5. Azure AI Foundry Agent System

The brain of the platform.

Agents:

* Observability Agent
* Diagnosis Agent
* Mitigation Agent
* Postmortem Agent

Each agent uses **Azure OpenAI models** to reason about the system state.

---

## 6. Mitigation Executor

Runs recommended actions.

Possible actions:

* restart container
* scale service
* rollback deployment

Example command:

az containerapp revision restart

---

# Azure Services Used

| Service              | Purpose                   |
| -------------------- | ------------------------- |
| Azure AI Foundry     | Agent orchestration       |
| Azure OpenAI         | AI reasoning              |
| Azure Container Apps | Demo microservice         |
| Azure Monitor        | Metrics and alerts        |
| Azure Log Analytics  | Log storage               |
| Azure Event Grid     | Alert routing             |
| Azure Functions      | Incident orchestrator     |
| GitHub Actions       | CI/CD pipeline            |
| Azure CLI            | Infrastructure automation |

---

# Suggested Repository Structure

```
repo/

services/
  demo-service/

agents/
  chaos-agent/
  observability-agent/
  diagnosis-agent/
  mitigation-agent/
  postmortem-agent/

functions/
  incident-orchestrator/

infra/
  scripts/

ui/
  dashboard/
```

---

# Dashboard (Recommended)

A small React dashboard showing:

* system health
* chaos experiments
* active incidents
* resilience score

Example timeline:

```
00:01 Chaos experiment triggered
00:02 CPU spike detected
00:03 Incident created
00:04 Diagnosis agent analyzing logs
00:05 Mitigation agent restarting container
00:06 Service recovered
00:07 Postmortem generated
```

---

# Full Implementation Task List

## Phase 1 – Project Setup

* create GitHub repository
* initialize project structure
* configure Azure subscription
* enable Azure OpenAI
* enable Azure AI Foundry

---

## Phase 2 – Demo Service

Tasks:

* build simple API service
* add failure endpoints
* create Dockerfile
* deploy to Azure Container Apps

---

## Phase 3 – Monitoring

Tasks:

* enable Azure Monitor
* configure Log Analytics
* create alert rules

Alerts:

* high CPU
* high error rate

---

## Phase 4 – Chaos Agent

Tasks:

* implement chaos experiment runner
* add API endpoint to trigger chaos

Experiments:

* restart container
* CPU spike
* HTTP errors

---

## Phase 5 – Incident Detection

Tasks:

* configure alert triggers
* connect Event Grid
* implement Azure Function listener

---

## Phase 6 – Incident Orchestrator

Responsibilities:

* receive alert
* collect logs and metrics
* invoke AI agents

Tasks:

* implement telemetry retrieval
* build incident workflow

---

## Phase 7 – AI Agent Prompts

Define prompts for:

* Observability agent
* Diagnosis agent
* Mitigation agent
* Postmortem agent

---

## Phase 8 – Automated Mitigation

Implement actions:

* restart service
* scale container
* rollback deployment

---

## Phase 9 – Postmortem Generator

Tasks:

* generate incident report
* store report

---

## Phase 10 – Resilience Scoring

Evaluate:

* recovery time
* alert effectiveness

Generate resilience score.

---

## Phase 11 – Dashboard

Build a React dashboard displaying:

* system metrics
* chaos experiments
* incident timeline
* resilience score

---

# Demo Script

1. Deploy demo service
2. Open dashboard
3. Trigger chaos experiment
4. Show alert firing
5. Observability agent analyzes logs
6. Diagnosis agent identifies root cause
7. Mitigation agent executes fix
8. Service recovers
9. Postmortem report appears
10. Resilience score displayed

---

# Future Enhancements

* predictive incident detection
* deeper infrastructure topology mapping
* automated chaos testing schedules
* full multi‑agent orchestration

---

# Summary

AutoSRE demonstrates how AI agents can:

* test infrastructure reliability
* detect incidents automatically
* diagnose root causes
* repair systems autonomously
* generate operational knowledge

The project showcases **agentic DevOps powered by the Microsoft AI platform**.
