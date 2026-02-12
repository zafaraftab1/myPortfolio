# 🚀 Getting Started - Your Portfolio Project

**Your Flask portfolio project is now fully configured and ready to use!**

---

## ⚡ Quick Start (5 minutes)

### Step 1: Setup Environment
```bash
cd /Users/zafaraftab/FlaskProject_MyPortfolio

# Create Python virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Run the App
```bash
python app.py
```

You'll see:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: off
```

### Step 3: Test It Works
Open another terminal:
```bash
# Test the API
curl http://127.0.0.1:5000/api/health

# Expected response:
# {"status":"ok"}

# Get all projects
curl http://127.0.0.1:5000/api/projects

# Visit admin UI
open http://127.0.0.1:5000/admin
```

**That's it! Your app is running! 🎉**

---

## 📋 What You Now Have

### ✅ Option A: Database Migrations
- **Flask-Migrate** integrated into app.py
- Migration system ready at `migrations/`
- Use `scripts/migrate.sh` for schema changes

### ✅ Option B: Admin UI
- Admin page at `/admin`
- Simple form to create projects
- Uses X-Admin-Token header for auth
- Submits to `/api/admin/projects`

### ✅ Option C: Docker Setup
- `Dockerfile` - Containerized Flask app
- `docker-compose.yml` - Flask + PostgreSQL
- Ready to run: `docker-compose up --build`

---

## 🎯 Using the Admin UI

1. Start the app: `python app.py`
2. Go to: http://127.0.0.1:5000/admin
3. Fill in project details:
   - **Title**: "My Awesome Project"
   - **Description**: "What it does..."
   - **Tech Stack**: "React, Flask, PostgreSQL"
   - Repo URL (optional)
   - Live URL (optional)
   - Image URL (optional)
4. Click **Create**
5. When prompted for token, enter: **changeme** (default)
6. Success! Check: http://127.0.0.1:5000/api/projects

### Custom Token
```bash
export ADMIN_TOKEN="my-secure-token"
python app.py
# Then use that token in the admin UI
```

---

## 🐳 Using Docker

### Requirements
- Docker and Docker Compose installed
- (Get them at https://docker.com)

### Run with Docker
```bash
cd /Users/zafaraftab/FlaskProject_MyPortfolio

# Build and start
docker-compose up --build

# Visit: http://127.0.0.1:8000/api/health
```

This runs:
- **Flask app** on port 8000 (with gunicorn)
- **PostgreSQL** on port 5432
- **Data persists** in Docker volume

### Stop Docker
```bash
docker-compose down
# or keep running in background:
docker-compose up -d
```

---

## 🔄 Database Migrations

### Generate Migration from Model Changes
```bash
source venv/bin/activate
export FLASK_APP=app.py

# Create migration file
flask db migrate -m "description of change"

# Apply migration
flask db upgrade
```

### Or use the helper script
```bash
bash scripts/migrate.sh
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app.py` | Main Flask app (now with Migrate + Logging) |
| `requirements.txt` | Python dependencies |
| `db.sqlite3` | Local SQLite database |
| `templates/admin.html` | Admin UI page (NEW) |
| `Dockerfile` | Docker image (NEW) |
| `docker-compose.yml` | Docker + Postgres (NEW) |
| `scripts/run-dev.sh` | Dev server launcher (NEW) |
| `scripts/migrate.sh` | Migration helper (NEW) |
| `logs/app.log` | Application logs |
| `migrations/` | Database migrations |

---

## 🧪 Testing Endpoints

### Health Check
```bash
curl http://127.0.0.1:5000/api/health
# {"status":"ok"}
```

### Get Profile
```bash
curl http://127.0.0.1:5000/api/profile
```

### Get Projects
```bash
curl http://127.0.0.1:5000/api/projects
```

### Get Skills
```bash
curl http://127.0.0.1:5000/api/skills
```

### Create Project (Admin)
```bash
curl -X POST http://127.0.0.1:5000/api/admin/projects \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: changeme" \
  -d '{
    "title": "Test Project",
    "description": "This is a test",
    "tech_stack": "Flask"
  }'
```

---

## 🐛 Troubleshooting

### "Command not found: python3"
```bash
# Make sure Python 3 is installed
brew install python3  # macOS
```

### "Module not found: flask"
```bash
# Activate venv and install
source venv/bin/activate
pip install -r requirements.txt
```

### "Port 5000 in use"
```bash
# Find and kill the process
pkill -f "python app.py"

# Or use different port
export FLASK_ENV=development
flask run --port 5001
```

### Reset Database
```bash
# Remove and recreate
rm db.sqlite3
python app.py  # Will recreate and reseed

# Or check what's in it
sqlite3 db.sqlite3 ".tables"
```

### Docker Issues
```bash
# View logs
docker-compose logs web

# Rebuild
docker-compose down
docker-compose up --build

# Clean everything
docker-compose down -v
```

---

## 📚 Documentation

- **COMPLETE_GUIDE.md** - Full implementation details
- **API_REFERENCE.md** - All API endpoints
- **QUICK_START.md** - 5-minute setup
- **PORTFOLIO_SETUP.md** - Complete setup
- **TROUBLESHOOTING.md** - Common issues

---

## 🎯 Next Steps

1. **Customize your data**
   - Edit app.py seed data with your info
   - Or use admin API to add projects

2. **Test everything locally**
   - Run `python app.py`
   - Visit http://127.0.0.1:5000/home
   - Click around and test

3. **Deploy somewhere**
   - Heroku, PythonAnywhere, DigitalOcean, etc.
   - Use the Docker setup for consistency
   - See PORTFOLIO_SETUP.md for details

4. **Keep it updated**
   - Add new projects as you build them
   - Update your skills/experience
   - Add testimonials

---

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│           Your Browser                   │
│  http://127.0.0.1:5000/admin            │
│  http://127.0.0.1:5000/api/projects     │
└────────────────┬────────────────────────┘
                 │
                 │ HTTP Requests
                 │
┌────────────────▼────────────────────────┐
│        Flask App (Python)                │
│  - Routes (/home, /admin, /api/...)     │
│  - Logic (models, forms, auth)          │
│  - Error handling & logging             │
└────────────────┬────────────────────────┘
                 │
                 │ SQL Queries
                 │
┌────────────────▼────────────────────────┐
│      Database (SQLite or Postgres)       │
│  - Profile, Projects, Skills, etc.      │
│  - Contact messages, Testimonials       │
└─────────────────────────────────────────┘
```

---

## 🔐 Environment Variables

Create `.env` file in project root:
```bash
cat > .env << EOF
FLASK_SECRET="your-secret-here"
ADMIN_TOKEN="your-admin-token"
DATABASE_URL="sqlite:///db.sqlite3"
FLASK_ENV="development"
EOF
```

Load with:
```python
from dotenv import load_dotenv
load_dotenv()
```

---

## ✨ What's Included

### Features for Visitors
- ✅ Home page with hero section
- ✅ About page with timeline
- ✅ Projects showcase
- ✅ Testimonials
- ✅ Contact form
- ✅ Resume download
- ✅ Mobile-responsive
- ✅ Smooth animations

### Features for You
- ✅ Admin UI (`/admin`)
- ✅ API endpoints for all data
- ✅ Token-based authentication
- ✅ Database management
- ✅ Logging & error tracking
- ✅ Migrations system

### Technical Stack
- ✅ Flask 3.0.3
- ✅ SQLAlchemy 2.0+
- ✅ Flask-Migrate (Alembic)
- ✅ Flask-CORS
- ✅ SQLite/PostgreSQL
- ✅ Gunicorn
- ✅ Docker

---

## 🎓 Learn More

- **Flask**: https://flask.palletsprojects.com/
- **SQLAlchemy**: https://docs.sqlalchemy.org/
- **Alembic**: https://alembic.sqlalchemy.org/
- **Docker**: https://docs.docker.com/

---

## 💡 Pro Tips

1. **Use helper scripts**
   ```bash
   bash scripts/run-dev.sh    # Start dev server
   bash scripts/migrate.sh    # Run migrations
   ```

2. **Check logs**
   ```bash
   tail -f logs/app.log       # Watch logs in real-time
   ```

3. **Customize easily**
   - Edit templates for HTML changes
   - Edit static/portfolio.css for styling
   - Edit app.py seed data for content

4. **Backup your data**
   ```bash
   cp db.sqlite3 db.sqlite3.backup
   ```

5. **Use version control**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

---

## ✅ Checklist Before Deployment

- [ ] Tested locally with `python app.py`
- [ ] All API endpoints working
- [ ] Admin UI works with token
- [ ] Database populated with your data
- [ ] Updated profile information
- [ ] Added your projects
- [ ] Added your experience
- [ ] Added your skills
- [ ] Contact form working
- [ ] Resume PDF added
- [ ] Created `.env` file with secrets
- [ ] Changed ADMIN_TOKEN to secure value

---

## 🚀 Deploy in 3 Steps

### Option 1: Heroku (Easiest)
```bash
# Create Procfile
echo "web: gunicorn app:app" > Procfile

# Deploy
heroku create your-portfolio
git push heroku main
```

### Option 2: Docker to Cloud
```bash
# Build image
docker build -t portfolio .

# Push to registry
docker tag portfolio myregistry/portfolio:latest
docker push myregistry/portfolio:latest

# Deploy to cloud (varies by provider)
```

### Option 3: Traditional VPS
```bash
# SSH to server
ssh user@your-vps.com

# Clone repo, setup venv, install deps
# Run with gunicorn + supervisor/systemd
gunicorn -b 0.0.0.0:8000 app:app
```

See **PORTFOLIO_SETUP.md** for detailed deployment guide.

---

## 📞 Need Help?

1. Check **TROUBLESHOOTING.md** for common issues
2. Read **API_REFERENCE.md** for endpoint details
3. Review logs: `tail logs/app.log`
4. Check Flask docs: https://flask.palletsprojects.com/

---

## 🎉 You're All Set!

Your professional portfolio website is ready. Now:

1. **Start it**: `python app.py`
2. **Customize it**: Add your projects and info
3. **Test it**: Visit http://127.0.0.1:5000/home
4. **Deploy it**: Choose a platform and go live
5. **Maintain it**: Keep content updated

**Good luck! 🚀**

---

**Questions?** Read the documentation files included in the project.

**Ready to deploy?** See PORTFOLIO_SETUP.md for platform-specific guides.

**Questions about code?** Check API_REFERENCE.md for endpoint details.

---

Last Updated: February 9, 2026

