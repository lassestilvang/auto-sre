# AutoSRE Hackathon Project Plan

## Revisions & Hackathon Constraints (Golden Path)

Given the tight timeline (Mar 15), we will focus exclusively on a **single golden-path demo**:
1. **One Failure Mode:** CPU Spike.
2. **One Telemetry Metric:** CPU Usage percentage alert in Azure Monitor.
3. **One Mitigation:** Container App Restart via Azure SRE Agent.
4. **Resilience Score:** Hardcoded formula (e.g., inverse of MTTR) that updates live.

Instead of building custom Diagnosis and Mitigation agents entirely from scratch, we will leverage **Azure SRE Agent** as the central incident commander. This directly hits the hackathon's "Next-Gen SRE Workflow" build option.

### Updated Component Flow
1. **Chaos Agent (Custom AI via Microsoft Foundry)**: An active agent that evaluates the system state and intelligently injects a CPU spike into the Demo Service via an API `/cpu-spike` endpoint.
2. **Detection**: Azure Monitor detects the anomaly and fires an alert.
3. **Azure SRE Agent (Hero Technology)**:
   - Receives the Azure Monitor alert.
   - Automatically performs Root Cause Analysis (RCA) by correlating metrics and logs.
   - Executes mitigation (e.g., restarts the container).
   - Integrates with GitHub Copilot to create a detailed GitHub Issue containing the incident timeline, root cause, and suggested code fix.
4. **Resilience & Postmortem Agent (Custom AI)**: Listens to the incident resolution, calculates the time to recovery (MTTR), and generates the final "Resilience Score."
5. **React Dashboard**: Provides a visual control plane, showing the Chaos Agent's actions, the Azure SRE Agent's automated response, and the live Resilience Score update.

## Hackathon Core Requirements Mapping
> **Explicit Proof of Core Requirements**
> 1. **🎨 AI Technology**: 
>    - **Azure SRE Agent**: Orchestrating the incident response and mitigation.
>    - **Azure AI Foundry**: Prompting/Orchestrating the custom "Chaos Agent" and "Resilience Agent".
>    - **Azure MCP**: Exposing the Resilience Scorecard or Chaos triggers to the SRE Agent.
> 2. **☁️ Azure Deployment**: The demo app and backend orchestrator run on Azure Container Apps and Azure Functions.
> 3. **💻 GitHub Development**: Hosted in a public GitHub Repo, utilizing GitHub Copilot for Issues (via SRE Agent automation).

## Judging Criteria Mapping (5x 20%)
To ensure reviewers see coverage, our deliverables map directly to the criteria:
1. **Technological Implementation (20%)**: Modern Azure cloud-native stack (Container Apps, Azure Monitor, Event Grid, SRE Agent).
2. **Agentic Design & Innovation (20%)**: Multi-agent orchestration (Chaos Agent $\rightarrow$ Azure Monitor $\rightarrow$ SRE Agent $\rightarrow$ Mitigation $\rightarrow$ Resilience Agent).
3. **Real-World Impact (20%)**: Solves incident response and MTTR reduction, a million-dollar pain point for real SRE teams.
4. **User Experience (20%)**: React Dashboard provides a cinematic, visual timeline of the entirely backend-focused incident process.
5. **Adherence to Category (20%)**: Perfectly matches Track 2: "Next-Gen SRE Workflow" & "Automated Incident Response".

## New Additions to the Plan
- **Model Context Protocol (MCP)**: Custom MCP server connecting the Azure SRE Agent to the custom Dashboard tools.
- **Submission Assets Required:** 
  - 2-minute demo video link.
  - Architecture diagram (Chaos $\rightarrow$ ACA $\rightarrow$ Monitor $\rightarrow$ Event Grid $\rightarrow$ SRE Agent $\rightarrow$ Mitigation $\rightarrow$ Score $\rightarrow$ Dashboard).
  - Concise project description and polished README.

- **Phase 7: Infrastructure as Code (Bicep)**: Automating the deployment of Container Apps, Log Analytics, and Alert Rules to ensure a repeatable demo environment.

## Verification Plan

### Automated Tests
- Test the Chaos Agent logic locally.
- Validate Bicep templates using `az bicep build`.

### Manual Verification
1. Deploy the Demo Service to Azure Container Apps.
2. Trigger the Chaos Agent from the Dashboard.
3. Verify Azure Monitor fires an alert.
4. Observe the Azure SRE Agent investigating the alert in the Azure Portal and successfully diagnosing the injected failure.
5. Verify a GitHub Issue is automatically created by the SRE Agent.
6. Check the Dashboard for the updated Resilience Score.
