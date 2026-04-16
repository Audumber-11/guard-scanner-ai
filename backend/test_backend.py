import pytest
import json
import sys
import os
import asyncio

sys.path.insert(0, os.path.dirname(__file__))

from scanner import compute_score, check_port, SECURITY_HEADERS
from database import init_db, save_scan, get_all_scans, get_scan_by_id, DB_PATH


@pytest.fixture(autouse=True)
def clean_db():
    """Remove test DB before each test."""
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    yield
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)


def test_compute_score_perfect():
    headers = [{"present": True, "severity": "high"} for _ in range(7)]
    ports = [{"port": 80, "status": "open"}, {"port": 443, "status": "open"}]
    score = compute_score(headers, ports, ssl_valid=True)
    assert score == 100


def test_compute_score_no_headers():
    headers = []
    for key, meta in SECURITY_HEADERS.items():
        headers.append({"present": False, "severity": meta["severity"]})
    ports = [{"port": 80, "status": "open"}]
    score = compute_score(headers, ports, ssl_valid=True)
    assert score == 30


def test_compute_score_no_ssl():
    headers = [{"present": True, "severity": "high"} for _ in range(7)]
    ports = []
    score = compute_score(headers, ports, ssl_valid=False)
    assert score == 90


def test_compute_score_dangerous_ports():
    headers = [{"present": True, "severity": "high"} for _ in range(7)]
    ports = [
        {"port": 22, "status": "open"},
        {"port": 3306, "status": "open"},
        {"port": 80, "status": "open"},
    ]
    score = compute_score(headers, ports, ssl_valid=True)
    assert score == 90


def test_compute_score_floor_zero():
    headers = [{"present": False, "severity": "high"} for _ in range(20)]
    ports = [{"port": 22, "status": "open"} for _ in range(20)]
    score = compute_score(headers, ports, ssl_valid=False)
    assert score == 0


@pytest.mark.asyncio
async def test_database_roundtrip():
    await init_db()
    scan_id = await save_scan(
        url="https://example.com",
        overall_score=85,
        headers_json=json.dumps([{"header": "test", "present": True}]),
        ports_json=json.dumps([{"port": 80, "status": "open"}]),
        ssl_valid=True,
        server_info="nginx",
    )
    assert scan_id is not None
    assert scan_id > 0

    row = await get_scan_by_id(scan_id)
    assert row is not None
    assert row["url"] == "https://example.com"
    assert row["overall_score"] == 85
    assert row["server_info"] == "nginx"
