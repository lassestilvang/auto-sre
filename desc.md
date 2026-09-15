# AutoSRE: Agentic Chaos Engineering & Autonomous Incident Response

## Project Description

**AutoSRE** is an agentic SRE platform that transforms DevOps from a reactive "firefighting" exercise into a proactive, self-healing system. By orchestrating a multi-agent system powered by **Azure AI Foundry** and the **Azure SRE Agent**, AutoSRE automates the entire incident lifecycle—from intentional chaos injection and real-time detection to autonomous Root Cause Analysis (RCA), mitigation, and resilience scoring.

AutoSRE operates as a coordinated multi-agent system composed of a **Chaos Agent**, **Incident Commander Agent**, **RCA Agent**, and **Resilience Agent** that collaborate through Azure AI Foundry to autonomously manage the full incident lifecycle.

The project showcases how Agentic AI can bridge the gap between complex cloud telemetry and actionable operational intelligence, significantly reducing Mean Time to Recovery (MTTR) while providing a transparent, cinematic "War Room" experience for engineering teams. In testing scenarios, AutoSRE can detect, diagnose, and mitigate simulated incidents in under a minute.

The platform implements a closed-loop reliability cycle where agents continuously test system resilience, detect incidents, execute mitigation actions, and generate insights that improve future system behavior.

---

## Problem Solved

Traditional incident response is manual, high-stress, and expensive. When production systems fail, SRE teams must manually correlate fragmented logs, identify root causes under pressure, and execute manual repairs—often leading to prolonged downtime and operational toil.

**AutoSRE** addresses these challenges by:

1. **Proactive Failure Testing** – Using AI-driven chaos engineering to continuously test system resilience and uncover hidden weaknesses before they cause real outages.

2. **Eliminating Manual Triage** – Replacing human-led log analysis with autonomous AI reasoning that correlates logs, metrics, and system state in seconds.

3. **Closed-Loop Remediation** – Executing verified mitigation actions (such as container restarts or automated rollbacks) without human intervention, enabling systems to recover at machine speed.

---

## Features & Functionality

### AI Chaos Agent

A custom agent built on **Azure AI Foundry** that intelligently evaluates cluster state and injects controlled failures (such as CPU spikes, memory pressure, or service crashes) to continuously validate system resilience.

### Autonomous Incident Commander

Leverages the **Azure SRE Agent** to receive alerts from Azure Monitor, perform deep-dive Root Cause Analysis (RCA), and suggest or autonomously execute remediation actions.

### GitHub-Integrated Workflow

Automatically opens detailed GitHub Issues via the SRE Agent, including a full incident timeline, RCA findings, and AI-suggested code or configuration fixes.

### Cinematic "War Room" Dashboard

A real-time React dashboard that visualizes the agentic control loop, providing live updates on chaos experiments, incident status, mitigation actions, and overall system health.

### Resilience Scoring & Postmortems

After each incident or chaos experiment, a **Resilience Agent** calculates an automated "Resilience Score" and generates a structured postmortem report, helping teams continuously improve system reliability.

---

## Technologies Used

### Core Technologies

* **Azure SRE Agent** – Orchestrates incident analysis, mitigation, and DevOps workflows
* **Azure AI Foundry** – Provides the multi-agent reasoning framework
* **Azure MCP** – Enables tool-to-agent communication

### Cloud Native Infrastructure

* **Azure Container Apps** – Hosts the demo service and agent workloads
* **Azure Monitor & Log Analytics** – Collects telemetry, logs, and metrics
* **Azure Functions** – Implements event-driven orchestration logic
* **Azure Event Grid** – Routes system events between services

### AI & Reasoning

* **Azure OpenAI Models (GPT-4o)** – Power the reasoning and decision-making capabilities of the agents

### DevOps & Tooling

* **GitHub Copilot** – Assists with automated issue creation and remediation suggestions
* **Bicep** – Infrastructure as Code for reproducible deployments
* **Azure CLI** – Used for environment configuration and automation

### Application Stack

* **Python** – Demo service used to simulate incidents and failures
* **React + Vite** – Frontend for the real-time "War Room" dashboard
