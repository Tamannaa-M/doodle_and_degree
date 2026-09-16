import sys
import os
from pathlib import Path
import uvicorn

if __name__ == "__main__":
    os.chdir(Path(__file__).resolve().parent)
    try:
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    port = int(os.environ.get("DOODLE_PORT", "8001"))
    print(f"Starting Doodle & Degree Server on http://localhost:{port} ...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
