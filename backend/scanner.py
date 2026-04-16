import asyncio
import socket
import ssl
import httpx
from urllib.parse import urlparse
from dataclasses import dataclass, field

SECURITY_HEADERS = {
    "strict-transport-security": {
        "name": "Strict-Transport-Security (HSTS)",
        "description": "Enforces HTTPS connections to the server.",
        "severity": "high",
    },
    "x-xss-protection": {
        "name": "X-XSS-Protection",
        "description": "Enables the browser's built-in XSS filter.",
        "severity": "medium",
    },
    "content-security-policy": {
        "name": "Content-Security-Policy",
        "description": "Prevents XSS, clickjacking, and code injection attacks.",
        "severity": "high",
    },
    "x-content-type-options": {
        "name": "X-Content-Type-Options",
        "description": "Prevents MIME-type sniffing.",
        "severity": "medium",
    },
    "x-frame-options": {
        "name": "X-Frame-Options",
        "description": "Protects against clickjacking attacks.",
        "severity": "medium",
    },
    "referrer-policy": {
        "name": "Referrer-Policy",
        "description": "Controls the Referer header sent with requests.",
        "severity": "low",
    },
    "permissions-policy": {
        "name": "Permissions-Policy",
        "description": "Controls browser features and APIs available to the page.",
        "severity": "low",
    },
}

PORTS_TO_SCAN = [80, 443, 8080, 8443, 21, 22, 3306, 5432]


async def check_port(host: str, port: int, timeout: float = 3.0) -> dict:
    try:
        _, writer = await asyncio.wait_for(
            asyncio.open_connection(host, port), timeout=timeout
        )
        writer.close()
        await writer.wait_closed()
        return {"port": port, "status": "open"}
    except (asyncio.TimeoutError, OSError, ConnectionRefusedError):
        return {"port": port, "status": "closed"}


async def check_ssl(hostname: str) -> bool:
    try:
        ctx = ssl.create_default_context()
        reader, writer = await asyncio.wait_for(
            asyncio.open_connection(hostname, 443, ssl=ctx), timeout=5
        )
        writer.close()
        await writer.wait_closed()
        return True
    except Exception:
        return False


async def scan_url(raw_url: str) -> dict:
    if not raw_url.startswith(("http://", "https://")):
        raw_url = "https://" + raw_url

    parsed = urlparse(raw_url)
    hostname = parsed.hostname or parsed.netloc

    # -- Fetch headers --
    header_results = []
    server_info = ""
    try:
        async with httpx.AsyncClient(
            follow_redirects=True, timeout=10, verify=False
        ) as client:
            resp = await client.get(raw_url)
            resp_headers = {k.lower(): v for k, v in resp.headers.items()}
            server_info = resp_headers.get("server", "")

            for key, meta in SECURITY_HEADERS.items():
                present = key in resp_headers
                header_results.append(
                    {
                        "header": meta["name"],
                        "key": key,
                        "present": present,
                        "value": resp_headers.get(key, ""),
                        "severity": meta["severity"],
                        "description": meta["description"],
                    }
                )
    except Exception as e:
        for key, meta in SECURITY_HEADERS.items():
            header_results.append(
                {
                    "header": meta["name"],
                    "key": key,
                    "present": False,
                    "value": "",
                    "severity": meta["severity"],
                    "description": meta["description"],
                    "error": str(e),
                }
            )

    # -- Port scan --
    port_tasks = [check_port(hostname, p) for p in PORTS_TO_SCAN]
    port_results = await asyncio.gather(*port_tasks)

    # -- SSL check --
    ssl_valid = await check_ssl(hostname)

    # -- Score --
    score = compute_score(header_results, list(port_results), ssl_valid)

    return {
        "url": raw_url,
        "hostname": hostname,
        "headers": header_results,
        "ports": list(port_results),
        "ssl_valid": ssl_valid,
        "server_info": server_info,
        "overall_score": score,
    }


def compute_score(headers: list, ports: list, ssl_valid: bool) -> int:
    score = 100
    severity_penalty = {"high": 15, "medium": 10, "low": 5}
    for h in headers:
        if not h["present"]:
            score -= severity_penalty.get(h["severity"], 5)

    dangerous_ports = {21, 22, 3306, 5432, 8080, 8443}
    for p in ports:
        if p["status"] == "open" and p["port"] in dangerous_ports:
            score -= 5

    if not ssl_valid:
        score -= 10

    return max(0, min(100, score))
