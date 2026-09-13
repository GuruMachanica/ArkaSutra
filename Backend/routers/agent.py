from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from ..services.agent.agent_brain import process_agent_goal

router = APIRouter(prefix="/api/agent", tags=["Autonomous Agent"])

class AgentDispatchRequest(BaseModel):
    goal: str
    latitude: Optional[float] = 35.68
    season: Optional[str] = "summer"
    buildings: Optional[List[Dict[str, Any]]] = []

@router.post("/dispatch")
def dispatch_agent_goal(req: AgentDispatchRequest):
    result = process_agent_goal(
        goal=req.goal,
        buildings=req.buildings or [],
        latitude=req.latitude or 35.68,
        season=req.season or "summer"
    )
    return result

@router.get("/goals")
def get_recommended_agent_goals():
    return {
        "recommended_goals": [
            {
                "id": "district_audit",
                "label": "Autonomous District Audit",
                "prompt": "Run autonomous district audit to optimize tilt and rank all rooftops by solar yield."
            },
            {
                "id": "maximize_roi",
                "label": "Maximize Portfolio ROI",
                "prompt": "Identify highest ROI commercial rooftops and target flagship asset for deployment."
            },
            {
                "id": "shade_mitigation",
                "label": "Winter Shading Mitigation",
                "prompt": "Evaluate low-elevation shadow occlusion and optimize pitch angle to overcome winter loss."
            }
        ]
    }
