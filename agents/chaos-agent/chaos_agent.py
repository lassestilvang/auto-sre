import requests
import time
import os

class ChaosAgent:
    """
    The Chaos Agent is responsible for evaluating the system state 
    and deciding when and how to inject failures to test resilience.
    """
    
    def __init__(self, target_url):
        self.target_url = target_url
        
    def evaluate_system(self):
        print("Chaos Agent: Evaluating system health...")
        try:
            response = requests.get(f"{self.target_url}/health")
            if response.status_code == 200:
                print("Chaos Agent: System is healthy. Proceeding with chaos experiment.")
                return True
            else:
                print(f"Chaos Agent: System is already degraded ({response.status_code}). Aborting.")
                return False
        except Exception as e:
            print(f"Chaos Agent: Could not reach system. {e}")
            return False

    def trigger_cpu_spike(self, duration=60):
        print(f"Chaos Agent: Triggering CPU Spike experiment on {self.target_url}")
        try:
            response = requests.post(f"{self.target_url}/cpu-spike", params={"duration": duration}, timeout=5)
            if response.status_code == 200:
                print("Chaos Agent: Experiment initiated successfully.")
                return True
            else:
                print(f"Chaos Agent: Failed to initiate experiment. Status: {response.status_code}")
                return False
        except Exception as e:
            print(f"Chaos Agent: Error calling target. {e}")
            return False

if __name__ == "__main__":
    # In a real Azure scenario, this would be triggered by a schedule or Foundry agent
    TARGET = os.environ.get("DEMO_SERVICE_URL", "http://localhost:8080")
    agent = ChaosAgent(TARGET)
    
    if agent.evaluate_system():
        duration = int(os.environ.get("CHAOS_DURATION_SEC", "60"))
        agent.trigger_cpu_spike(duration=duration)
