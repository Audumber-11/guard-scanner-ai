# 🛡️ guard-scanner-ai — Security Vulnerability Scanner & Dashboard

<p align="center">
  <strong>A real-time security analysis tool that scans websites for vulnerabilities, misconfigurations, and exposure risks.</strong>
</p>

---

## 🎯 Overview

SecScanner is a full-stack security scanning application that performs automated checks against any target URL and presents the results in a professional cybersecurity-themed dashboard.

### What It Scans

| Category | Checks Performed |
|----------|-----------------|
| **Security Headers** | HSTS, Content-Security-Policy, X-XSS-Protection, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy |
| **Port Scanning** | Probes ports 80, 443, 8080, 8443, 21, 22, 3306, 5432 with service identification |
| **SSL/TLS** | Validates SSL certificate on port 443 |
| **Server Fingerprinting** | Detects the web server software from response headers |

### Scoring System

Each scan produces a score out of **100** based on:

- **Missing security headers**: -5 to -15 points depending on severity (high/medium/low)
- **Dangerous open ports** (FTP, SSH, database): -5 points each
- **Invalid/missing SSL**: -10 points

| Score Range | Rating |
|-------------|--------|
| 80–100 | 🟢 **Secure** |
| 50–79  | 🟡 **Warning** |
| 0–49   | 🔴 **Critical** |

---

## 🏗️ Architecture

```
┌─────────────────────────┐     ┌─────────────────────────┐
│     React Frontend      │────▶│     FastAPI Backend      │
│  Vite + TypeScript +    │     │  /scan  /scans  /health  │
│  Tailwind CSS           │     │                         │
│  Recharts + Lucide      │     │  Scanner Engine          │
└─────────────────────────┘     │  ├─ Header Checker       │
                                │  ├─ Port Scanner         │
                                │  └─ SSL Validator        │
                                │                         │
                                │  SQLite (scans.db)       │
                                └─────────────────────────┘
```

---

## ⚡ Quick Start

### Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **npm** 9+

### 1. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

### 3. Environment Configuration

Create a `.env` file in the `frontend/` directory to point to your backend:

```env
VITE_API_URL=http://localhost:8000
```

---

## 📡 API Reference

### `POST /scan`

Run a security scan on a target URL.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "id": 1,
  "url": "https://example.com",
  "hostname": "example.com",
  "overall_score": 45,
  "ssl_valid": true,
  "server_info": "ECAcc (dcd/7D5A)",
  "headers": [
    {
      "header": "Strict-Transport-Security (HSTS)",
      "key": "strict-transport-security",
      "present": false,
      "value": "",
      "severity": "high",
      "description": "Enforces HTTPS connections to the server."
    }
  ],
  "ports": [
    { "port": 80, "status": "open" },
    { "port": 443, "status": "open" },
    { "port": 8080, "status": "closed" }
  ]
}
```

---

## 🎨 Frontend Features

- **Dark cybersecurity theme** with neon accents and glass-morphism cards
- **Animated score gauge** with color-coded ratings
- **Security headers table** with severity badges and presence indicators
- **Port scan grid** with service identification and status indicators
- **Scan history** with score previews and quick navigation
- **Statistics bar** aggregating data across all past scans
- **Responsive design** that works on desktop and mobile
- **Loading animations** with concentric spinning rings

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
python -m pytest test_backend.py -x -q
```

Tests cover:
- Score computation (perfect, zero headers, no SSL, dangerous ports, floor at 0)
- Database CRUD operations (insert, retrieve by ID, list scans)
- Port scanner behavior (closed port detection)
- Security header definitions

---

## 📁 Project Structure

```
guard-scanner-ai/
├── README.md
├── backend/
│   ├── main.py              # FastAPI app with CORS, routes, lifespan
│   ├── scanner.py           # Core scanning engine (headers, ports, SSL)
│   ├── database.py          # SQLite async database layer
│   ├── requirements.txt     # Python dependencies
│   └── test_backend.py      # pytest test suite
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── src/
        ├── main.tsx
        ├── index.css          # Tailwind + custom cyber theme
        ├── App.tsx            # Main app with routing state
        ├── api/
        │   └── client.ts     # API client functions
        ├── types/
        │   └── scan.ts       # TypeScript type definitions
        └── components/
            ├── ScanForm.tsx     # URL input with submit
            ├── ScanDetail.tsx   # Full scan result view
            ├── ScoreGauge.tsx   # SVG circular score gauge
            ├── HeadersTable.tsx # Security headers breakdown
            ├── PortsGrid.tsx    # Port scan results grid
            ├── ScanHistory.tsx  # Past scans list
            └── StatsBar.tsx     # Aggregate statistics
```

---

## 🔒 Security Notes

- This tool is designed for **authorized security assessments only**
- Port scanning may be flagged by intrusion detection systems
- Always obtain proper authorization before scanning third-party infrastructure
- The scanner uses `verify=False` for HTTPS to check headers on sites with self-signed certs
- No credentials or sensitive data are stored — only scan metadata

---

## 📄 License

MIT License — use freely for security research, education, and authorized testing.

---
Built by [Audumber-11](https://github.com/Audumber-11)
