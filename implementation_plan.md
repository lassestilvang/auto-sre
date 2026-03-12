# AutoSRE Hackathon Project Plan

This document outlines the architecture and implementation plan for AutoSRE, incorporating the newly released Azure SRE Agent to perfectly align with the hackathon track.

## Architecture Revisions

Instead of building custom Diagnosis and Mitigation agents entirely from scratch, we will leverage **Azure SRE Agent** as the central incident commander. This directly hits the hackathon's "Next-Gen SRE Workflow" build option.

### Updated Component Flow
1. **Chaos Agent (Custom AI via Microsoft Foundry)**: An active agent that evaluates the system state and intelligently injects a failure (e.g., CPU spike, container restart) into the Demo Service via Azure CLI or API.
2. **Detection**: Azure Monitor detects the anomaly and fires an alert.
3. **Azure SRE Agent (Hero Technology)**:
   - Receives the Azure Monitor alert.
   - Automatically performs Root Cause Analysis (RCA) by correlating metrics and logs.
   - Executes mitigation (e.g., restarts the container).
   - Integrates with GitHub Copilot to create a detailed GitHub Issue containing the incident timeline, root cause, and suggested code fix.
4. **Resilience & Postmortem Agent (Custom AI)**: Listens to the incident resolution, calculates the time to recovery (MTTR), and generates the final "Resilience Score."
5. **React Dashboard**: Provides a visual control plane, showing the Chaos Agent's actions, the Azure SRE Agent's automated response, and the live Resilience Score update.

## New Additions to the Plan
- **Model Context Protocol (MCP)**: We can expose our custom "Chaos Experiments" or "Resilience Scorecard" as an MCP server, allowing the Azure SRE Agent to communicate with our custom tooling, fulfilling the "Azure MCP" hero technology requirement.
- **GitHub Integration**: We will set up the Azure SRE Agent to automatically create GitHub Issues on our repo when incidents occur, demonstrating deep integration across the Microsoft/GitHub ecosystem.

## Verification Plan

### Automated Tests
- Scaffold standard unit tests for the Demo Application to ensure endpoints operate correctly.
- Test the Chaos Agent logic locally using mocked Azure CLI responses.

### Manual Verification
1. Deploy the Demo Service to Azure Container Apps.
2. Trigger the Chaos Agent from the Dashboard.
3. Verify Azure Monitor fires an alert.
4. Observe the Azure SRE Agent investigating the alert in the Azure Portal and successfully diagnosing the injected failure.
5. Verify a GitHub Issue is automatically created by the SRE Agent.
6. Check the Dashboard for the updated Resilience Score.
