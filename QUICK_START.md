# Portfolio Website - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Python 3.8 or higher
- PostgreSQL installed and running
- pip (Python package manager)

### Step 1: Clone/Navigate to Project
```bash
cd /Users/zafaraftab/FlaskProject_MyPortfolio
```

### Step 2: Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Setup Database

If you have PostgreSQL running locally with default credentials:

```bash
# Create database
createdb portfolio

# Initialize and seed the database
python3 << EOF
from app import app, db
with app.app_context():
    db.create_all()
    print("✓ Database initialized with sample data!")
EOF
```

Or set a custom DATABASE_URL:
```bash
export DATABASE_URL="postgresql://username:password@localhost:5432/portfolio"
```

### Step 5: Run the Application
```bash
python3 app.py
```

Open your browser to: **http://localhost:5000/home**

## 📝 Pages Available

| Page | URL | Features |
|------|-----|----------|
| Home | `/home` | Hero section, featured projects, skills preview |
| About | `/about` | Profile, experience timeline, all skills |
| Projects | `/projects` | All projects showcase |
| Project Detail | `/project/<id>` | Individual project details |
| Testimonials | `/testimonials` | Client testimonials with ratings |
| Contact | `/contact` | Contact form with validation |
| Resume | `/resume` | Download your resume PDF |

## ⚙️ Configuration

Edit your profile and data by modifying the seed data in `app.py`:

```python
profile = Profile(
    name="Your Name",
    title="Your Job Title",
    summary="Your professional summary",
    location="Your Location",
    email="your@email.com",
    phone="+1234567890",
    linkedin="https://linkedin.com/in/yourprofile",
    github="https://github.com/yourprofile",
)
```

Or add projects, skills, and experience similarly.

## 🔐 Admin Access

To manage content via API, set your admin token:

```bash
export ADMIN_TOKEN="your-secure-admin-token"
```

Example API call:
```bash
curl -X POST http://localhost:5000/api/admin/projects \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: your-secure-admin-token" \
  -d '{
    "title": "My New Project",
    "description": "Project description",
    "tech_stack": "React, Flask, PostgreSQL",
    "repo_url": "https://github.com/user/repo",
    "live_url": "https://project.com"
  }'
```

## 📄 Adding Your Resume

1. Place your resume PDF as: `static/resume.pdf`
2. It will be automatically available at: `/resume`

## 🎨 Customizing Styles

Edit `static/portfolio.css` to customize:
- Colors (`:root` variables)
- Fonts
- Spacing
- Animations

## 📱 Responsive Design

The portfolio is fully responsive:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (up to 767px)

## 🔧 Troubleshooting

**Port 5000 already in use:**
```bash
python3 app.py --port 5001
```

**Database connection error:**
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Verify credentials in .env
```

**Missing static files:**
```bash
# Ensure static/ folder exists with:
# - app.css
# - portfolio.css
# - resume.pdf (optional)
```

## 📚 Full Documentation

See `PORTFOLIO_SETUP.md` for:
- Complete installation guide
- API endpoint documentation
- Deployment instructions
- Database schema details
- Advanced customization

## 🚢 Deployment

Ready to go live? See deployment options in `PORTFOLIO_SETUP.md`:
- Docker
- Heroku
- PythonAnywhere
- AWS
- DigitalOcean

## 💡 Tips

1. **Add favicon:** Place `favicon.ico` in `static/` folder
2. **Add profile photo:** Update `about.html` with an image
3. **Custom domain:** Use domain registrar + web host
4. **Email notifications:** Integrate SendGrid or Mailgun
5. **Analytics:** Add Google Analytics or Plausible

## ✨ What's Included

✅ Fully functional Flask backend
✅ Database models for all portfolio data
✅ Responsive HTML templates
✅ Professional CSS styling
✅ Contact form with validation
✅ REST API endpoints
✅ Admin management endpoints
✅ Sample data (seed)
✅ Error handling
✅ Mobile-friendly design

## 🎯 Next Steps

1. Personalize your profile information
2. Add your projects with descriptions
3. Upload your resume
4. Add testimonials
5. Deploy to your favorite hosting platform

---

**Questions?** Check `PORTFOLIO_SETUP.md` for comprehensive documentation.

