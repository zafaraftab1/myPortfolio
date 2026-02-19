<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00C9FF,30:92FE9D,60:F9F871,100:FF6B6B&height=230&section=header&text=Flask%20Portfolio%20Platform&fontSize=44&fontColor=0f172a&animation=fadeIn&fontAlignY=38&desc=Modern%20Full-Stack%20Portfolio%20with%20Flask%20%2B%20React&descAlignY=60&descSize=16" alt="header" />

<p>
  <img src="https://img.shields.io/badge/Flask-Backend-111827?style=for-the-badge&logo=flask&logoColor=white&labelColor=ef4444&color=111827" alt="Flask">
  <img src="https://img.shields.io/badge/React%2018-Frontend-111827?style=for-the-badge&logo=react&logoColor=61dafb&labelColor=2563eb&color=111827" alt="React">
  <img src="https://img.shields.io/badge/Vite%205-Build-111827?style=for-the-badge&logo=vite&logoColor=fcd34d&labelColor=7c3aed&color=111827" alt="Vite">
  <img src="https://img.shields.io/badge/SQLite%20%2F%20PostgreSQL-Database-111827?style=for-the-badge&logo=postgresql&logoColor=93c5fd&labelColor=16a34a&color=111827" alt="Database">
</p>

<p>
  <img src="https://img.shields.io/badge/REST%20API-Ready-0f172a?style=flat-square&logo=fastapi&logoColor=22d3ee&labelColor=0f172a&color=14b8a6" alt="REST API">
  <img src="https://img.shields.io/badge/Token%20Auth-Admin-0f172a?style=flat-square&logo=shield&logoColor=facc15&labelColor=0f172a&color=f97316" alt="Token Auth">
  <img src="https://img.shields.io/badge/Responsive-UI-0f172a?style=flat-square&logo=css3&logoColor=38bdf8&labelColor=0f172a&color=ec4899" alt="Responsive">
  <img src="https://img.shields.io/badge/Docker-Deploy-0f172a?style=flat-square&logo=docker&logoColor=93c5fd&labelColor=0f172a&color=3b82f6" alt="Docker">
</p>

<p>
  <img src="https://skillicons.dev/icons?i=flask,react,vite,python,postgresql,sqlite,docker,git" alt="stack icons" />
</p>

<strong>A full-stack portfolio app with dynamic content, admin APIs, contact capture, and a production-ready structure.</strong>

</div>

---

## 🎨 Visual Preview

<table>
  <tr>
    <td><img src="https://placehold.co/900x500/0b1020/00e5ff?text=Home+Page+Preview" alt="Home page preview"></td>
  </tr>
  <tr>
    <td><img src="https://placehold.co/900x500/1f1135/f8fafc?text=Projects+%2B+Testimonials+Preview" alt="Projects and testimonials preview"></td>
  </tr>
</table>

> Replace these placeholders with real screenshots from your app for a premium README look.

---

## ✨ Why This Project Stands Out

- Professional multi-page portfolio UI (`/home`, `/about`, `/projects`, `/testimonials`, `/contact`)
- REST API + Admin API with token-based protection (`X-Admin-Token`)
- SQLAlchemy models for profile, projects, experience, skills, testimonials, and contact messages
- Hybrid architecture: Flask-rendered templates + React/Vite frontend support in `frontend/`
- Ready for local dev, migration workflows, and Docker-based deployment

---

## 🧩 Tech Stack

| Layer | Tools |
|---|---|
| Backend | Flask, Flask-CORS, Flask-SQLAlchemy, Flask-Migrate |
| Frontend | React 18, Vite 5 |
| Database | SQLite (default), PostgreSQL (optional via `DATABASE_URL`) |
| Runtime | Python 3.8+ |
| Deployment | Gunicorn, Docker |

---

## 🗺️ Architecture

```mermaid
flowchart LR
    U[User Browser] --> F[Flask App]
    F --> T[Jinja Templates]
    F --> A[REST API Endpoints]
    A --> DB[(SQLite / PostgreSQL)]
    F --> R[React/Vite Dist]
    Admin[Admin Client + X-Admin-Token] --> A
```

---

## 📁 Project Structure

```text
FlaskProject_MyPortfolio/
├── app.py
├── requirements.txt
├── templates/
├── static/
├── frontend/
│   ├── src/
│   └── dist/
├── migrations/
├── scripts/
│   ├── run-dev.sh
│   └── migrate.sh
└── docs and guides (*.md)
```

---

## 🚀 Quick Start

### 1. Clone and setup

```bash
git clone <your-repo-url>
cd FlaskProject_MyPortfolio
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Initialize database

```bash
python3 -c "from app import app, db; app.app_context().push(); db.create_all()"
```

### 3. Run backend

```bash
python3 app.py
```

Open: `http://localhost:5000/home`

### Optional: run React frontend (Vite)

```bash
cd frontend
npm install
npm run dev
```

---

## 🔗 Core Routes

### Pages

- `GET /home`
- `GET /about`
- `GET /projects`
- `GET /project/<id>`
- `GET /testimonials`
- `GET /contact`
- `GET /resume`

### Public API

- `GET /api/health`
- `GET /api/profile`
- `GET /api/projects`
- `GET /api/experiences`
- `GET /api/skills`
- `GET /api/testimonials`
- `POST /api/contact`
- `GET /api/resume`

### Admin API (token-protected)

- `PUT /api/admin/profile`
- `POST /api/admin/projects`
- `PUT/DELETE /api/admin/projects/<id>`
- `POST /api/admin/experiences`
- `PUT/DELETE /api/admin/experiences/<id>`
- `POST /api/admin/skills`
- `PUT/DELETE /api/admin/skills/<id>`
- `POST /api/admin/testimonials`
- `PUT/DELETE /api/admin/testimonials/<id>`

---

## ⚙️ Environment Variables

Create `.env` (or export in shell):

```bash
FLASK_SECRET=change-this
ADMIN_TOKEN=change-this
DATABASE_URL=sqlite:///db.sqlite3
```

For PostgreSQL:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio
```

---

## 🛠️ Development Utilities

```bash
# Run dev server with auto setup
bash scripts/run-dev.sh

# Generate and apply migrations
bash scripts/migrate.sh
```

---

## 📚 Documentation Map

- `QUICK_START.md` - fastest setup path
- `PORTFOLIO_SETUP.md` - full setup + customization
- `API_REFERENCE.md` - endpoint reference
- `TROUBLESHOOTING.md` - common issues and fixes
- `IMPLEMENTATION_SUMMARY.md` - full feature summary
- `DOCUMENTATION_INDEX.md` - doc navigation index

---

## 🧠 Roadmap Ideas

- Add CI pipeline for lint + tests
- Add image upload for projects/testimonials
- Add dashboard UI for admin APIs
- Add email provider integration for contact form notifications

---

## 📄 License

Use your preferred license (MIT recommended).

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:FF6B6B,30:F9F871,60:92FE9D,100:00C9FF&height=130&section=footer" alt="footer" />
