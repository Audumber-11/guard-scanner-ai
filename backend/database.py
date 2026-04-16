import aiosqlite
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "scans.db")

async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS scans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT NOT NULL,
                scanned_at TEXT NOT NULL,
                overall_score INTEGER NOT NULL,
                headers_json TEXT NOT NULL,
                ports_json TEXT NOT NULL,
                ssl_valid INTEGER NOT NULL DEFAULT 0,
                server_info TEXT DEFAULT ''
            )
        """)
        await db.commit()

async def save_scan(url: str, overall_score: int, headers_json: str, ports_json: str, ssl_valid: bool, server_info: str) -> int:
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "INSERT INTO scans (url, scanned_at, overall_score, headers_json, ports_json, ssl_valid, server_info) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (url, datetime.utcnow().isoformat(), overall_score, headers_json, ports_json, int(ssl_valid), server_info),
        )
        await db.commit()
        return cursor.lastrowid

async def get_all_scans():
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT * FROM scans ORDER BY id DESC LIMIT 50")
        rows = await cursor.fetchall()
        return [dict(r) for r in rows]

async def get_scan_by_id(scan_id: int):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT * FROM scans WHERE id = ?", (scan_id,))
        row = await cursor.fetchone()
        return dict(row) if row else None
