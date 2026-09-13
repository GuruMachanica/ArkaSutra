import time
from typing import Dict, Any, Optional

_CACHE: Dict[str, Dict[str, Any]] = {}
CACHE_TTL_SECONDS = 900  # 15 minutes

def get_cache_key(prefix: str, *args) -> str:
    parts = [str(a) for a in args]
    return f"{prefix}:{':'.join(parts)}"

def get_from_cache(key: str, ttl: int = CACHE_TTL_SECONDS) -> Optional[Any]:
    now = time.time()
    if key in _CACHE:
        entry = _CACHE[key]
        if now - entry["timestamp"] < ttl:
            return entry["data"]
    return None

def set_in_cache(key: str, data: Any) -> None:
    _CACHE[key] = {"timestamp": time.time(), "data": data}
