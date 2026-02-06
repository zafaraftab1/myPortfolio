# Portfolio Website

A modern, full-stack portfolio website built with Flask and PostgreSQL. Showcase your projects, experience, skills, and testimonials with a professional, responsive design.

## Features

✨ **Core Features**
- Home page with hero section and featured projects
- About page with professional experience timeline and skills
- Projects showcase with detailed project pages
- Testimonials section with ratings
- Contact form with validation and message storage
- Downloadable resume
- Responsive design for all devices

🛠️ **Technical Features**
- RESTful API endpoints for all data
- Admin endpoints for managing content
- Database-driven content (Profile, Projects, Experience, Skills, Testimonials, Messages)
- Form validation and error handling
- Flash messaging system
- Smooth animations and transitions

## Technology Stack

**Backend:**
- Flask 3.0.3
- Flask-SQLAlchemy 3.1.1
- Flask-CORS 4.0.1
- PostgreSQL (with psycopg 3.2.3)
- Python 3.8+

**Frontend:**
- HTML5
- CSS3 (with custom design system)
- Vanilla JavaScript
- Responsive Grid Layout

## Project Structure

```
FlaskProject_MyPortfolio/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── manage.py             # Django management (legacy)
├── templates/            # HTML templates
│   ├── layout.html       # Base template with header/footer
│   ├── home.html         # Home page
│   ├── about.html        # About page
│   ├── projects.html     # Projects listing
│   ├── project_detail.html # Individual project page
│   ├── testimonials.html # Testimonials page
│   └── contact.html      # Contact form
├── static/               # Static files
│   ├── app.css          # Original styles
│   ├── portfolio.css    # New portfolio styles
│   └── resume.pdf       # Your resume
└── frontend/            # React frontend (optional)
```

## Installation & Setup

### 1. Clone the Repository
```bash
cd /Users/zafaraftab/FlaskProject_MyPortfolio
```

### 2. Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Set Environment Variables
Create a `.env` file in the project root:
```bash
FLASK_APP=app.py
FLASK_ENV=development
FLASK_SECRET=your-secret-key-here
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio
ADMIN_TOKEN=your-admin-token-here
```

### 5. Initialize Database
```bash
python3 -c "from app import app, db; app.app_context().push(); db.create_all(); print('Database initialized!')"
```

The database will be automatically seeded with sample data on first run.

### 6. Run the Application
```bash
python3 app.py
```

Visit `http://localhost:5000` in your browser.

## Usage

### Public Routes

- **`/home`** - Home page with hero section
- **`/about`** - About page with experience and skills
- **`/projects`** - All projects listing
- **`/project/<id>`** - Individual project details
- **`/testimonials`** - Testimonials page
- **`/contact`** - Contact form (GET and POST)
- **`/resume`** - Download resume PDF

### API Endpoints

**Public API (no authentication required):**

```bash
# Get profile information
GET /api/profile

# Get all projects
GET /api/projects

# Get all experience
GET /api/experiences

# Get all skills
GET /api/skills

# Get all testimonials
GET /api/testimonials

# Submit contact message
POST /api/contact
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'm interested in working with you..."
}

# Download resume
GET /api/resume
```

**Admin API (requires X-Admin-Token header):**

```bash
# Update profile
PUT /api/admin/profile
Header: X-Admin-Token: your-token

# Create project
POST /api/admin/projects

# Update/delete project
PUT /api/admin/projects/<id>
DELETE /api/admin/projects/<id>

# Create experience
POST /api/admin/experiences

# Update/delete experience
PUT /api/admin/experiences/<id>
DELETE /api/admin/experiences/<id>

# Create skill
POST /api/admin/skills

# Update/delete skill
PUT /api/admin/skills/<id>
DELETE /api/admin/skills/<id>

# Create testimonial
POST /api/admin/testimonials

# Update/delete testimonial
PUT /api/admin/testimonials/<id>
DELETE /api/admin/testimonials/<id>
```

## Customization

### Update Your Profile

Edit the seed data in `app.py` or use the API:

```bash
curl -X PUT http://localhost:5000/api/admin/profile \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: your-admin-token" \
  -d '{
    "name": "Your Name",
    "title": "Your Title",
    "summary": "Your summary",
    "location": "Your Location",
    "email": "your.email@example.com",
    "phone": "+1234567890",
    "linkedin": "https://linkedin.com/in/your-handle",
    "github": "https://github.com/your-handle"
  }'
```

### Add Projects

```bash
curl -X POST http://localhost:5000/api/admin/projects \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: your-admin-token" \
  -d '{
    "title": "Project Name",
    "description": "Project description",
    "tech_stack": "React, Flask, PostgreSQL",
    "repo_url": "https://github.com/...",
    "live_url": "https://project-url.com",
    "image_url": "https://image-url.com/image.jpg"
  }'
```

### Add Skills

```bash
curl -X POST http://localhost:5000/api/admin/skills \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: your-admin-token" \
  -d '{
    "name": "React",
    "category": "Frontend",
    "proficiency": "Expert",
    "icon_url": "https://icon-url.com/react.png"
  }'
```

### Add Testimonials

```bash
curl -X POST http://localhost:5000/api/admin/testimonials \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: your-admin-token" \
  -d '{
    "author_name": "Client Name",
    "author_title": "Job Title",
    "author_company": "Company Name",
    "content": "Testimonial content",
    "rating": 5,
    "author_image": "https://image-url.com/photo.jpg"
  }'
```

## Styling

The portfolio uses a custom CSS design system with:

- **Color Variables:** Primary, accent, success, error colors
- **Responsive Grid:** Mobile-first approach
- **Components:** Buttons, cards, forms, timeline
- **Animations:** Smooth transitions and hover effects
- **Typography:** Professional font stack

Customize colors in `static/portfolio.css`:

```css
:root {
    --primary-color: #2c3e50;
    --accent-color: #3498db;
    /* ... other variables ... */
}
```

## File Upload

### Resume

Place your resume PDF at:
```
static/resume.pdf
```

The resume will be available at:
- `/resume` (download endpoint)
- `/api/resume` (API endpoint)

## Database Models

### Profile
- name, title, summary, location, email, phone, linkedin, github

### Project
- title, description, tech_stack, repo_url, live_url, image_url

### Experience
- company, role, start_date, end_date, location, highlights

### Skill
- name, category, proficiency, icon_url

### Testimonial
- author_name, author_title, author_company, author_image, content, rating, created_at

### ContactMessage
- name, email, subject, message, created_at

## Security

- Admin token-based authentication for API endpoints
- Input validation on forms
- Email validation in contact form
- CORS enabled for cross-origin requests
- Environment variables for sensitive data

## Deployment

### Using Docker

```bash
docker build -t portfolio .
docker run -p 5000:5000 portfolio
```

### Using Heroku

```bash
heroku create your-portfolio-app
heroku config:set DATABASE_URL=your-postgres-url
heroku config:set ADMIN_TOKEN=your-token
git push heroku main
```

### Using PythonAnywhere

1. Upload your code
2. Set up virtual environment
3. Configure WSGI file
4. Set environment variables

## Troubleshooting

**Database Connection Issues:**
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify credentials

**Missing Resume:**
- Add `resume.pdf` to `static/` folder
- Restart Flask app

**Form Validation Issues:**
- Check email format
- Ensure message is at least 10 characters
- Verify all required fields are filled

**API Not Working:**
- Check ADMIN_TOKEN header
- Verify JSON format in POST requests
- Check CORS settings

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- [ ] Blog/Articles section
- [ ] Project search and filtering
- [ ] Dark mode toggle
- [ ] Internationalization (i18n)
- [ ] Analytics integration
- [ ] Email notifications for contact submissions
- [ ] Social media sharing
- [ ] SEO optimization

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API endpoint examples
3. Check Flask and SQLAlchemy documentation

---

Built with ❤️ for showcasing your work and experience.

