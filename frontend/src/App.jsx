import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const fallbackProfile = {
  name: "Your Name",
  title: "Full-Stack Developer",
  summary:
    "I build fast, human-centered web experiences powered by React, Flask, and PostgreSQL.",
  location: "Your City",
  email: "you@example.com",
  phone: "+00 000 0000000",
  linkedin: "https://linkedin.com",
  github: "https://github.com"
};

export default function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [filter, setFilter] = useState("");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState({ status: "idle", message: "" });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, projectRes, experienceRes] = await Promise.all([
          fetch(`${API_BASE}/api/profile`),
          fetch(`${API_BASE}/api/projects`),
          fetch(`${API_BASE}/api/experiences`)
        ]);

        const profileData = profileRes.ok
          ? await profileRes.json()
          : fallbackProfile;
        const projectData = projectRes.ok ? await projectRes.json() : [];
        const experienceData = experienceRes.ok ? await experienceRes.json() : [];

        setProfile(profileData);
        setProjects(projectData);
        setExperiences(experienceData);
      } catch (error) {
        setProfile(fallbackProfile);
      }
    };

    loadData();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!filter.trim()) return projects;
    const search = filter.toLowerCase();
    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(search) ||
        project.tech_stack.toLowerCase().includes(search)
    );
  }, [filter, projects]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus({ status: "loading", message: "Sending..." });
    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState)
      });

      if (!response.ok) {
        const errorPayload = await response.json();
        throw new Error(errorPayload.error || "Something went wrong.");
      }

      setFormStatus({ status: "success", message: "Message sent. Thank you!" });
      setFormState({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setFormStatus({ status: "error", message: error.message });
    }
  };

  const resumeUrl = `${API_BASE}/api/resume`;
  const displayProfile = profile || fallbackProfile;

  return (
    <div className="page">
      <header className="hero" id="top">
        <nav className="nav">
          <div className="logo">ZA</div>
          <div className="nav-links">
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
            <a href={resumeUrl} className="button ghost">
              Download Resume
            </a>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-text">
            <p className="eyebrow">{displayProfile.location}</p>
            <h1>{displayProfile.name}</h1>
            <h2>{displayProfile.title}</h2>
            <p className="lead">{displayProfile.summary}</p>
            <div className="hero-actions">
              <a href="#projects" className="button">
                View Projects
              </a>
              <a href="#contact" className="button ghost">
                Let&apos;s Talk
              </a>
            </div>
          </div>
          <div className="hero-card">
            <div className="card-block">
              <span className="tag">Focus</span>
              <h3>Product + Engineering</h3>
              <p>
                From concept to production: design systems, APIs, data models, and
                performance.
              </p>
            </div>
            <div className="card-block">
              <span className="tag">Stack</span>
              <p>React · Flask · PostgreSQL · Redis · Celery</p>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="section" id="projects">
          <div className="section-header">
            <div>
              <p className="eyebrow">Selected Work</p>
              <h2>Projects that ship real outcomes</h2>
            </div>
            <div className="filter">
              <label htmlFor="project-filter">Filter</label>
              <input
                id="project-filter"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Search by tech or title"
              />
            </div>
          </div>

          <div className="grid">
            {filteredProjects.length ? (
              filteredProjects.map((project) => (
                <article className="project-card" key={project.title}>
                  <div
                    className="project-image"
                    style={{ backgroundImage: `url(${project.image_url})` }}
                  />
                  <div className="project-content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <p className="stack">{project.tech_stack}</p>
                    <div className="project-links">
                      {project.repo_url && (
                        <a href={project.repo_url} target="_blank" rel="noreferrer">
                          Repo
                        </a>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noreferrer">
                          Live
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="empty">Add projects to the database to showcase here.</p>
            )}
          </div>
        </section>

        <section className="section" id="experience">
          <div className="section-header">
            <div>
              <p className="eyebrow">Career Timeline</p>
              <h2>Experience across different companies</h2>
            </div>
            <a href={resumeUrl} className="button ghost">
              PDF Resume
            </a>
          </div>

          <div className="timeline">
            {experiences.length ? (
              experiences.map((experience) => (
                <div className="timeline-item" key={`${experience.company}-${experience.role}`}>
                  <div className="timeline-marker" />
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h3>{experience.role}</h3>
                      <span>
                        {experience.company} · {experience.location}
                      </span>
                    </div>
                    <p className="timeline-dates">
                      {experience.start_date} — {experience.end_date}
                    </p>
                    <ul>
                      {experience.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty">Add experience entries to see them here.</p>
            )}
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="section-header">
            <div>
              <p className="eyebrow">Get In Touch</p>
              <h2>Let&apos;s build something bold together</h2>
            </div>
            <div className="contact-details">
              <p>{displayProfile.email}</p>
              <p>{displayProfile.phone}</p>
              <div className="contact-links">
                <a href={displayProfile.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a href={displayProfile.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                value={formState.name}
                onChange={handleFormChange}
                placeholder="Your full name"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleFormChange}
                placeholder="you@email.com"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                value={formState.subject}
                onChange={handleFormChange}
                placeholder="Project, role, or collaboration"
                required
              />
            </div>
            <div className="field full">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleFormChange}
                placeholder="Tell me about your idea."
                required
              />
            </div>
            <div className="form-footer">
              <button className="button" type="submit" disabled={formStatus.status === "loading"}>
                Send Message
              </button>
              <span className={`status ${formStatus.status}`}>
                {formStatus.message}
              </span>
            </div>
          </form>
        </section>
      </main>

      <footer className="footer">
        <div>
          <p>{displayProfile.name}</p>
          <span>Building full-stack experiences with human-first design.</span>
        </div>
        <p>© {new Date().getFullYear()} All rights reserved.</p>
      </footer>
    </div>
  );
}
