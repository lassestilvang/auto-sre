import time

class ResilienceAgent:
    """
    The Resilience Agent calculates the final resilience score 
    based on how effectively the system recovered from the incident.
    """
    
    def __init__(self):
        self.base_score = 100
        
    def calculate_score(self, detection_time_sec, recovery_time_sec, automated=True):
        """
        Calculates a score based on MTTR (Mean Time to Recovery)
        and whether the recovery was automated.
        """
        print("Resilience Agent: Calculating post-incident score...")
        
        # Simple penalty formula for the demo
        mttr_penalty = min(50, recovery_time_sec / 2) # 1 point per 2 seconds, max 50
        detection_penalty = min(20, detection_time_sec / 5) # 1 point per 5 seconds, max 20
        
        if not automated:
            automation_bonus = 0
        else:
            automation_bonus = 10
            
        final_score = self.base_score - mttr_penalty - detection_penalty + automation_bonus
        final_score = max(0, min(100, final_score))
        
        print(f"Resilience Agent: Final Score: {final_score}/100")
        return {
            "score": final_score,
            "metrics": {
                "detection_time": detection_time_sec,
                "recovery_time": recovery_time_sec,
                "automated": automated
            },
            "recommendation": "Consider reducing alert thresholds to improve detection time." if detection_time_sec > 30 else "Systems performing within targets."
        }

if __name__ == "__main__":
    # Mock data for demonstration
    agent = ResilienceAgent()
    result = agent.calculate_score(detection_time_sec=15, recovery_time_sec=45, automated=True)
    print(result)
