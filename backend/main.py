import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import init_db, save_scan, get_all_scans, get_scan_by_id
from scanner import scan_url


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="Security Vulnerability Scanner",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScanRequest(BaseModel):
    url: str


class ScanResponse(BaseModel):
    id: int
    url: str
    hostname: str
    headers: list
    ports: list
    ssl_valid: bool
    server_info: str
    overall_score: int


@app.post("/scan", response_model=ScanResponse)
async def run_scan(req: ScanRequest):
    if not req.url or len(req.url.strip()) < 3:
        raise HTTPException(status_code=400, detail="Invalid URL")

    result = await scan_url(req.url.strip())

    scan_id = await save_scan(
        url=result["url"],
        overall_score=result["overall_score"],
        headers_json=json.dumps(result["headers"]),
        ports_json=json.dumps(result["ports"]),
        ssl_valid=result["ssl_valid"],
        server_info=result["server_info"],
    )

    return ScanResponse(id=scan_id, **result)


@app.get("/scans")
async def list_scans():
    rows = await get_all_scans()
    for r in rows:
        r["headers"] = json.loads(r["headers_json"])
        r["ports"] = json.loads(r["ports_json"])
        r["ssl_valid"| "bool(r["ssl_valid"])
        del r["headers_json"]
        del r["ports_json"]
    return rows


@app.get("/scans/{scan_id}")
async def get_scan(scan_id: int):
    row = await get_scan_by_id(scan_id)
    if not row:
        raise HTTPException(status_code=404, detail="Scan not found")
    row["headers"] = json.loads(row["headers_json"])
    row["ports"] = json.loads(row["ports_json"])
    row["ssl_valid"] = bool(row["ssl_valid"])
    del row["headers_json"]
    del row["ports_json"]
    return row


@app.get("/health")
async def health():
    return {"status": "ok"}
