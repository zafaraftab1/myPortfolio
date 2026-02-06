# Portfolio API Reference

## Base URL
```
http://localhost:5000
```

## Public Endpoints (No Authentication Required)

### Profile

#### Get Profile Information
```http
GET /api/profile
```

**Response (200 OK):**
```json
{
  "name": "Zafar Aftab",
  "title": "Full-Stack Developer",
  "summary": "I build performant web apps...",
  "location": "Lahore, Pakistan",
  "email": "you@example.com",
  "phone": "+92 300 000 0000",
  "linkedin": "https://linkedin.com/in/your-handle",
  "github": "https://github.com/your-handle"
}
```

---

### Projects

#### Get All Projects
```http
GET /api/projects
```

**Response (200 OK):**
```json
[
  {
    "title": "Invoice Flow",
    "description": "Automated invoicing platform...",
    "tech_stack": "React, Flask, PostgreSQL, Celery",
    "repo_url": "https://github.com/your-handle/invoice-flow",
    "live_url": "https://invoice-flow.example.com",
    "image_url": "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a"
  }
  // ... more projects
]
```

---

### Experience

#### Get All Experience
```http
GET /api/experiences
```

**Response (200 OK):**
```json
[
  {
    "company": "Northwind Labs",
    "role": "Senior Full-Stack Engineer",
    "start_date": "2023",
    "end_date": "Present",
    "location": "Remote",
    "highlights": [
      "Led migration to React + Flask",
      "Improved API latency by 38%",
      "Mentored 4 engineers"
    ]
  }
  // ... more experiences
]
```

---

### Skills

#### Get All Skills
```http
GET /api/skills
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "React",
    "category": "Frontend",
    "proficiency": "Expert",
    "icon_url": null
  },
  {
    "id": 2,
    "name": "JavaScript",
    "category": "Frontend",
    "proficiency": "Expert",
    "icon_url": null
  }
  // ... more skills
]
```

**Proficiency Levels:** `Beginner`, `Intermediate`, `Expert`

---

### Testimonials

#### Get All Testimonials
```http
GET /api/testimonials
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "author_name": "Sarah Johnson",
    "author_title": "Product Manager",
    "author_company": "Northwind Labs",
    "author_image": null,
    "content": "Zafar is an exceptional developer...",
    "rating": 5,
    "created_at": "2026-02-07T10:30:00+00:00"
  }
  // ... more testimonials
]
```

**Rating:** 1-5 stars

---

### Contact

#### Submit Contact Message
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'm interested in working with you on a new project..."
}
```

**Response (201 Created):**
```json
{
  "message": "Thanks for reaching out!"
}
```

**Validation:**
- All fields required
- Email must be valid format
- Message minimum length varies

---

### Resume

#### Download Resume
```http
GET /api/resume
```

**Response:** Binary PDF file attachment

---

### Health Check

#### Check API Status
```http
GET /api/health
```

**Response (200 OK):**
```json
{
  "status": "ok"
}
```

---

## Protected Endpoints (Admin Authentication Required)

All admin endpoints require the `X-Admin-Token` header:

```http
X-Admin-Token: your-admin-token-value
```

### Profile Management

#### Update Profile
```http
PUT /api/admin/profile
Content-Type: application/json
X-Admin-Token: your-admin-token

{
  "name": "Your Name",
  "title": "Your Job Title",
  "summary": "Your professional summary",
  "location": "Your Location",
  "email": "your@email.com",
  "phone": "+1234567890",
  "linkedin": "https://linkedin.com/in/yourprofile",
  "github": "https://github.com/yourprofile"
}
```

**Response (200 OK):** Updated profile object

**Required Fields:** name, title, summary, location, email  
**Optional Fields:** phone, linkedin, github

---

### Project Management

#### Create Project
```http
POST /api/admin/projects
Content-Type: application/json
X-Admin-Token: your-admin-token

{
  "title": "Project Name",
  "description": "Detailed description of the project",
  "tech_stack": "React, Flask, PostgreSQL",
  "repo_url": "https://github.com/user/repo",
  "live_url": "https://project-url.com",
  "image_url": "https://image-url.com/image.jpg"
}
```

**Response (201 Created):**
```json
{
  "title": "Project Name",
  "description": "...",
  "tech_stack": "React, Flask, PostgreSQL",
  "repo_url": "https://github.com/user/repo",
  "live_url": "https://project-url.com",
  "image_url": "https://image-url.com/image.jpg"
}
```

**Required Fields:** title, description, tech_stack

---

#### Update Project
```http
PUT /api/admin/projects/{project_id}
Content-Type: application/json
X-Admin-Token: your-admin-token

{
  "title": "Updated Title",
  "description": "Updated description",
  "tech_stack": "Updated tech stack",
  "repo_url": "https://github.com/user/repo",
  "live_url": "https://project-url.com",
  "image_url": "https://image-url.com/image.jpg"
}
```

**Response (200 OK):** Updated project object

---

#### Delete Project
```http
DELETE /api/admin/projects/{project_id}
X-Admin-Token: your-admin-token
```

**Response (200 OK):**
```json
{
  "message": "Deleted"
}
```

---

### Experience Management

#### Create Experience
```http
POST /api/admin/experiences
Content-Type: application/json
X-Admin-Token: your-admin-token

{
  "company": "Company Name",
  "role": "Job Title",
  "start_date": "2020",
  "end_date": "2023",
  "location": "City, Country",
  "highlights": ["Achievement 1", "Achievement 2", "Achievement 3"]
}
```

**Response (201 Created):** Experience object

**Required Fields:** company, role, start_date, end_date, location, highlights

**Note:** Highlights can be array or pipe-separated string

---

#### Update Experience
```http
PUT /api/admin/experiences/{experience_id}
Content-Type: application/json
X-Admin-Token: your-admin-token

{
  "company": "Company Name",
  "role": "Job Title",
  "start_date": "2020",
  "end_date": "2023",
  "location": "City, Country",
  "highlights": ["Achievement 1", "Achievement 2"]
}
```

**Response (200 OK):** Updated experience object

---

#### Delete Experience
```http
DELETE /api/admin/experiences/{experience_id}
X-Admin-Token: your-admin-token
```

**Response (200 OK):**
```json
{
  "message": "Deleted"
}
```

---

### Skills Management

#### Create Skill
```http
POST /api/admin/skills
Content-Type: application/json
X-Admin-Token: your-admin-token

{
  "name": "React",
  "category": "Frontend",
  "proficiency": "Expert",
  "icon_url": "https://icon-url.com/react.png"
}
```

**Response (201 Created):** Skill object

**Required Fields:** name, category, proficiency  
**Optional Fields:** icon_url

**Category Examples:** Frontend, Backend, Database, DevOps, Mobile

**Proficiency Values:** Beginner, Intermediate, Expert

---

#### Update Skill
```http
PUT /api/admin/skills/{skill_id}
Content-Type: application/json
X-Admin-Token: your-admin-token

{
  "name": "React",
  "category": "Frontend",
  "proficiency": "Expert",
  "icon_url": "https://icon-url.com/react.png"
}
```

**Response (200 OK):** Updated skill object

---

#### Delete Skill
```http
DELETE /api/admin/skills/{skill_id}
X-Admin-Token: your-admin-token
```

**Response (200 OK):**
```json
{
  "message": "Deleted"
}
```

---

### Testimonials Management

#### Create Testimonial
```http
POST /api/admin/testimonials
Content-Type: application/json
X-Admin-Token: your-admin-token

{
  "author_name": "Client Name",
  "author_title": "Job Title",
  "author_company": "Company Name",
  "author_image": "https://image-url.com/photo.jpg",
  "content": "Great testimonial text about the work...",
  "rating": 5
}
```

**Response (201 Created):** Testimonial object

**Required Fields:** author_name, author_title, author_company, content  
**Optional Fields:** author_image, rating (default: 5)

**Rating:** 1-5 integer value

---

#### Update Testimonial
```http
PUT /api/admin/testimonials/{testimonial_id}
Content-Type: application/json
X-Admin-Token: your-admin-token

{
  "author_name": "Updated Name",
  "author_title": "Updated Title",
  "author_company": "Updated Company",
  "author_image": "https://image-url.com/photo.jpg",
  "content": "Updated testimonial text...",
  "rating": 5
}
```

**Response (200 OK):** Updated testimonial object

---

#### Delete Testimonial
```http
DELETE /api/admin/testimonials/{testimonial_id}
X-Admin-Token: your-admin-token
```

**Response (200 OK):**
```json
{
  "message": "Deleted"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing fields",
  "fields": ["field1", "field2"]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Example Usage

### Using cURL

```bash
# Get all projects
curl http://localhost:5000/api/projects

# Create a new project (requires admin token)
curl -X POST http://localhost:5000/api/admin/projects \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: your-admin-token" \
  -d '{
    "title": "My Project",
    "description": "Description here",
    "tech_stack": "React, Flask"
  }'

# Submit contact form
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "subject": "Hello",
    "message": "I want to work with you"
  }'
```

### Using JavaScript/Fetch

```javascript
// Get all projects
fetch('/api/projects')
  .then(res => res.json())
  .then(data => console.log(data));

// Create project (admin)
fetch('/api/admin/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Admin-Token': 'your-admin-token'
  },
  body: JSON.stringify({
    title: 'My Project',
    description: 'Description',
    tech_stack: 'React, Flask'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Using Python/Requests

```python
import requests

# Get all skills
response = requests.get('http://localhost:5000/api/skills')
skills = response.json()

# Create testimonial (admin)
response = requests.post(
  'http://localhost:5000/api/admin/testimonials',
  headers={'X-Admin-Token': 'your-admin-token'},
  json={
    'author_name': 'John Doe',
    'author_title': 'CTO',
    'author_company': 'TechCorp',
    'content': 'Great work!',
    'rating': 5
  }
)
```

---

## Rate Limiting

No rate limiting is currently implemented. For production, consider adding:
- Flask-Limiter for rate limiting
- Redis for caching

---

## CORS

CORS is enabled for all origins. In production, configure specific origins:

```python
CORS(app, origins=['https://yourdomain.com'])
```

---

## Data Formats

### Date Format
Dates use ISO 8601 format:
```
2026-02-07T10:30:00+00:00
```

### Tech Stack Format
Comma-separated technology names:
```
"React, Flask, PostgreSQL, Redis"
```

### Highlights Format
Either JSON array or pipe-separated string:
```json
["Achievement 1", "Achievement 2"]
```
or
```
"Achievement 1||Achievement 2"
```

---

## Version
API v1.0 - February 2026

