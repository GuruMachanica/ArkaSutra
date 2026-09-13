import os
import json
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/topologies", tags=["GIS Topologies"])

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))

@router.get("")
def list_topologies():
    dataset_paths = [
        os.path.join(ROOT_DIR, "datasets", "topologies_dataset.json"),
        os.path.join(ROOT_DIR, "Datasets", "topologies_dataset.json"),
        os.path.join(ROOT_DIR, "Frontend", "src", "datasets", "topologies_dataset.json"),
        os.path.join(CURRENT_DIR, "..", "datasets", "topologies_dataset.json")
    ]
    for path in dataset_paths:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
    raise HTTPException(status_code=404, detail="Topologies dataset not found.")

@router.get("/{topology_id}")
def get_topology(topology_id: str):
    topos_data = list_topologies()
    topos = topos_data.get("topologies", {})
    if topology_id in topos:
        return {
            "metadata": topos_data.get("metadata", {}),
            "topology": topos[topology_id]
        }
    raise HTTPException(status_code=404, detail=f"Topology '{topology_id}' not found.")
