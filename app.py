from datetime import datetime
import os

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST = os.path.join(BASE_DIR, "frontend", "dist")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/portfolio",
)
if app.config["SQLALCHEMY_DATABASE_URI"].startswith("postgres://"):
    app.config["SQLALCHEMY_DATABASE_URI"] = app.config[
        "SQLALCHEMY_DATABASE_URI"
    ].replace("postgres://", "postgresql://", 1)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app)
db = SQLAlchemy(app)
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "changeme")


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    title = db.Column(db.String(160), nullable=False)
    summary = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(50), nullable=True)
    linkedin = db.Column(db.String(255), nullable=True)
    github = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "name": self.name,
            "title": self.title,
            "summary": self.summary,
            "location": self.location,
            "email": self.email,
            "phone": self.phone,
            "linkedin": self.linkedin,
            "github": self.github,
        }


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(140), nullable=False)
    description = db.Column(db.Text, nullable=False)
    tech_stack = db.Column(db.String(255), nullable=False)
    repo_url = db.Column(db.String(255), nullable=True)
    live_url = db.Column(db.String(255), nullable=True)
    image_url = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "title": self.title,
            "description": self.description,
            "tech_stack": self.tech_stack,
            "repo_url": self.repo_url,
            "live_url": self.live_url,
            "image_url": self.image_url,
        }


class Experience(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(140), nullable=False)
    role = db.Column(db.String(140), nullable=False)
    start_date = db.Column(db.String(40), nullable=False)
    end_date = db.Column(db.String(40), nullable=False)
    location = db.Column(db.String(120), nullable=False)
    highlights = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            "company": self.company,
            "role": self.role,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "location": self.location,
            "highlights": self.highlights.split("||"),
        }


class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(140), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "subject": self.subject,
            "message": self.message,
            "created_at": self.created_at.isoformat(),
        }


@app.route('/')
def hello_world():
    if os.path.exists(os.path.join(FRONTEND_DIST, "index.html")):
        return send_from_directory(FRONTEND_DIST, "index.html")
    return "Portfolio API is running. Build the frontend to serve the UI."


@app.route("/<path:filename>")
def serve_frontend_assets(filename):
    if not os.path.exists(os.path.join(FRONTEND_DIST, "index.html")):
        return "Frontend not built yet.", 404
    if os.path.exists(os.path.join(FRONTEND_DIST, filename)):
        return send_from_directory(FRONTEND_DIST, filename)
    return send_from_directory(FRONTEND_DIST, "index.html")


@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/api/profile")
def profile():
    data = Profile.query.first()
    if not data:
        return jsonify({"error": "Profile not found"}), 404
    return jsonify(data.to_dict())


@app.route("/api/projects")
def projects():
    data = Project.query.order_by(Project.id.asc()).all()
    return jsonify([project.to_dict() for project in data])


@app.route("/api/experiences")
def experiences():
    data = Experience.query.order_by(Experience.id.asc()).all()
    return jsonify([experience.to_dict() for experience in data])


@app.route("/api/contact", methods=["POST"])
def contact():
    payload = request.get_json(silent=True) or {}
    required_fields = ["name", "email", "subject", "message"]
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        return jsonify({"error": "Missing fields", "fields": missing}), 400

    entry = ContactMessage(
        name=payload["name"],
        email=payload["email"],
        subject=payload["subject"],
        message=payload["message"],
    )
    db.session.add(entry)
    db.session.commit()
    return jsonify({"message": "Thanks for reaching out!"}), 201


@app.route("/api/resume")
def resume():
    return send_from_directory(
        "static",
        "resume.pdf",
        as_attachment=True,
        download_name="Resume.pdf",
    )


def require_admin():
    token = request.headers.get("X-Admin-Token")
    if not token or token != ADMIN_TOKEN:
        return jsonify({"error": "Unauthorized"}), 401
    return None


@app.route("/api/admin/profile", methods=["PUT"])
def admin_profile():
    auth = require_admin()
    if auth:
        return auth
    payload = request.get_json(silent=True) or {}
    required_fields = ["name", "title", "summary", "location", "email"]
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        return jsonify({"error": "Missing fields", "fields": missing}), 400

    entry = Profile.query.first()
    if not entry:
        entry = Profile(**payload)
        db.session.add(entry)
    else:
        for key in [
            "name",
            "title",
            "summary",
            "location",
            "email",
            "phone",
            "linkedin",
            "github",
        ]:
            if key in payload:
                setattr(entry, key, payload[key])
    db.session.commit()
    return jsonify(entry.to_dict())


@app.route("/api/admin/projects", methods=["POST"])
def admin_projects_create():
    auth = require_admin()
    if auth:
        return auth
    payload = request.get_json(silent=True) or {}
    required_fields = ["title", "description", "tech_stack"]
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        return jsonify({"error": "Missing fields", "fields": missing}), 400

    entry = Project(**payload)
    db.session.add(entry)
    db.session.commit()
    return jsonify(entry.to_dict()), 201


@app.route("/api/admin/projects/<int:project_id>", methods=["PUT", "DELETE"])
def admin_projects_update(project_id):
    auth = require_admin()
    if auth:
        return auth
    entry = Project.query.get_or_404(project_id)

    if request.method == "DELETE":
        db.session.delete(entry)
        db.session.commit()
        return jsonify({"message": "Deleted"})

    payload = request.get_json(silent=True) or {}
    for key in [
        "title",
        "description",
        "tech_stack",
        "repo_url",
        "live_url",
        "image_url",
    ]:
        if key in payload:
            setattr(entry, key, payload[key])
    db.session.commit()
    return jsonify(entry.to_dict())


@app.route("/api/admin/experiences", methods=["POST"])
def admin_experiences_create():
    auth = require_admin()
    if auth:
        return auth
    payload = request.get_json(silent=True) or {}
    required_fields = [
        "company",
        "role",
        "start_date",
        "end_date",
        "location",
        "highlights",
    ]
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        return jsonify({"error": "Missing fields", "fields": missing}), 400

    highlights = payload.get("highlights")
    if isinstance(highlights, list):
        payload["highlights"] = "||".join(highlights)
    entry = Experience(**payload)
    db.session.add(entry)
    db.session.commit()
    return jsonify(entry.to_dict()), 201


@app.route("/api/admin/experiences/<int:experience_id>", methods=["PUT", "DELETE"])
def admin_experiences_update(experience_id):
    auth = require_admin()
    if auth:
        return auth
    entry = Experience.query.get_or_404(experience_id)

    if request.method == "DELETE":
        db.session.delete(entry)
        db.session.commit()
        return jsonify({"message": "Deleted"})

    payload = request.get_json(silent=True) or {}
    for key in ["company", "role", "start_date", "end_date", "location"]:
        if key in payload:
            setattr(entry, key, payload[key])
    if "highlights" in payload:
        highlights = payload["highlights"]
        entry.highlights = "||".join(highlights) if isinstance(highlights, list) else highlights
    db.session.commit()
    return jsonify(entry.to_dict())


def seed_if_empty():
    if Profile.query.first():
        return
    profile = Profile(
        name="Zafar Aftab",
        title="Full-Stack Developer",
        summary=(
            "I build performant web apps with React, Flask, and PostgreSQL, "
            "focusing on clean UX and reliable backends."
        ),
        location="Lahore, Pakistan",
        email="you@example.com",
        phone="+92 300 000 0000",
        linkedin="https://linkedin.com/in/your-handle",
        github="https://github.com/your-handle",
    )
    db.session.add(profile)

    projects = [
        Project(
            title="Invoice Flow",
            description="Automated invoicing platform with approvals and reminders.",
            tech_stack="React, Flask, PostgreSQL, Celery",
            repo_url="https://github.com/your-handle/invoice-flow",
            live_url="https://invoice-flow.example.com",
            image_url="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
        ),
        Project(
            title="Insight CRM",
            description="Customer intelligence dashboard with real-time activity feeds.",
            tech_stack="React, Flask, Redis, PostgreSQL",
            repo_url="https://github.com/your-handle/insight-crm",
            live_url="https://insight-crm.example.com",
            image_url="https://images.unsplash.com/photo-1545239351-1141bd82e8a6",
        ),
        Project(
            title="Pulse Commerce",
            description="Headless commerce storefront with personalized recommendations.",
            tech_stack="React, Flask, Stripe, PostgreSQL",
            repo_url="https://github.com/your-handle/pulse-commerce",
            live_url="https://pulse-commerce.example.com",
            image_url="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
        ),
    ]
    db.session.add_all(projects)

    experiences = [
        Experience(
            company="Northwind Labs",
            role="Senior Full-Stack Engineer",
            start_date="2023",
            end_date="Present",
            location="Remote",
            highlights="Led migration to React + Flask||Improved API latency by 38%||Mentored 4 engineers",
        ),
        Experience(
            company="Aperture Digital",
            role="Full-Stack Developer",
            start_date="2021",
            end_date="2023",
            location="Lahore",
            highlights="Built analytics dashboards||Designed PostgreSQL schemas||Owned CI/CD automation",
        ),
        Experience(
            company="BlueOrbit",
            role="Frontend Developer",
            start_date="2019",
            end_date="2021",
            location="Lahore",
            highlights="Created responsive UI systems||Partnered with design team||Improved lighthouse score to 95+",
        ),
    ]
    db.session.add_all(experiences)
    db.session.commit()


with app.app_context():
    db.create_all()
    seed_if_empty()

if __name__ == '__main__':
    app.run()
