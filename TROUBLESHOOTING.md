# Portfolio Website - Troubleshooting Guide

## Common Issues and Solutions

### Installation & Setup Issues

#### Issue: "No module named 'flask'"

**Error Message:**
```
ModuleNotFoundError: No module named 'flask'
```

**Solution:**
1. Make sure you're in the virtual environment:
   ```bash
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Verify installation:
   ```bash
   python3 -c "import flask; print(flask.__version__)"
   ```

---

#### Issue: "No module named 'psycopg'"

**Error Message:**
```
ModuleNotFoundError: No module named 'psycopg'
```

**Solution:**
```bash
pip install psycopg[binary]==3.2.3
```

---

#### Issue: Python version too old

**Error Message:**
```
Error: Python 3.8+ required
```

**Solution:**
Check your Python version:
```bash
python3 --version
```

Install Python 3.8+:
- **macOS:** `brew install python@3.10`
- **Ubuntu/Debian:** `sudo apt-get install python3.10`
- **Windows:** Download from python.org

---

### Database Issues

#### Issue: "could not connect to server"

**Error Message:**
```
psycopg.OperationalError: could not connect to server
```

**Solution:**
1. Check if PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Ubuntu/Debian
   sudo systemctl status postgresql
   
   # Windows
   psql --version
   ```

2. Start PostgreSQL if needed:
   ```bash
   # macOS
   brew services start postgresql
   
   # Ubuntu/Debian
   sudo systemctl start postgresql
   ```

3. Create database:
   ```bash
   createdb portfolio
   ```

4. Verify connection:
   ```bash
   psql -U postgres -c "SELECT 1"
   ```

---

#### Issue: "database does not exist"

**Error Message:**
```
FATAL: database "portfolio" does not exist
```

**Solution:**
```bash
# Create the database
createdb portfolio

# Re-initialize Flask app
python3 << EOF
from app import app, db
with app.app_context():
    db.create_all()
    print("Database created!")
EOF
```

---

#### Issue: "permission denied for schema public"

**Error Message:**
```
permission denied for schema public
```

**Solution:**
1. Check database user:
   ```bash
   psql -l
   ```

2. If using wrong user, update `.env`:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/portfolio
   ```

3. Reset database permissions:
   ```bash
   psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE portfolio TO postgres;"
   ```

---

### Runtime Issues

#### Issue: Port already in use

**Error Message:**
```
Address already in use
```

**Solution:**
Option 1: Use a different port:
```bash
python3 app.py --port 5001
```

Option 2: Kill the process using port 5000:
```bash
# Find process ID
lsof -i :5000

# Kill the process
kill -9 <PID>
```

---

#### Issue: "address already in use" on macOS

**Solution:**
```bash
# Find and kill process
sudo lsof -i :5000
kill -9 <PID>

# Or use a different port
python3 app.py --port 5001
```

---

#### Issue: Template not found

**Error Message:**
```
jinja2.exceptions.TemplateNotFound: home.html
```

**Solution:**
1. Verify template exists:
   ```bash
   ls templates/home.html
   ```

2. Check Flask template folder:
   - Templates should be in `templates/` folder
   - Not in `static/` folder

3. Make sure file extension is `.html`

---

### Form & Contact Issues

#### Issue: Contact form not submitting

**Problem:** Form submits but shows error

**Solution:**
1. Check browser console for errors (F12)
2. Verify form validation:
   - Name must not be empty
   - Email must be valid format
   - Subject must not be empty
   - Message must be at least 10 characters

3. Check server logs for errors

---

#### Issue: Email validation fails

**Problem:** "Invalid email address" message

**Solution:**
Use a valid email format:
- ✓ Valid: `john@example.com`
- ✓ Valid: `john.doe@company.co.uk`
- ✗ Invalid: `john@localhost` (no TLD)
- ✗ Invalid: `john@` (incomplete)
- ✗ Invalid: `@example.com` (no username)

---

### API Issues

#### Issue: 401 Unauthorized for admin endpoints

**Error Message:**
```json
{"error": "Unauthorized"}
```

**Solution:**
Make sure you're sending the admin token:
```bash
curl -X POST http://localhost:5000/api/admin/projects \
  -H "X-Admin-Token: your-admin-token" \
  -H "Content-Type: application/json" \
  -d '{"title":"..."}'
```

Check your token:
1. In `.env` file:
   ```
   ADMIN_TOKEN=your-admin-token-here
   ```

2. In curl/request headers:
   ```
   X-Admin-Token: your-admin-token-here
   ```

---

#### Issue: 400 Bad Request on POST

**Error Message:**
```json
{"error": "Missing fields", "fields": ["field1", "field2"]}
```

**Solution:**
Check required fields for each endpoint. For example, creating a project needs:
```json
{
  "title": "Project Name",
  "description": "Description",
  "tech_stack": "Technology list"
}
```

Verify your JSON is valid:
```bash
# Check JSON validity
python3 -m json.tool << 'EOF'
{
  "title": "My Project",
  "description": "Description",
  "tech_stack": "React, Flask"
}
EOF
```

---

#### Issue: CORS errors in frontend

**Error Message:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
CORS is already enabled in `app.py`. If still having issues:

1. Check browser console for full error
2. Verify API endpoint URL is correct
3. Ensure you're making requests to same origin or configured CORS origin

---

### Static Files Issues

#### Issue: CSS/Images not loading

**Problem:** Website looks unstyled

**Solution:**
1. Check static files exist:
   ```bash
   ls static/
   ```

2. Verify correct file names:
   - `app.css` ✓
   - `portfolio.css` ✓
   - `resume.pdf` (optional)

3. Check file permissions:
   ```bash
   chmod 644 static/*
   ```

4. Clear browser cache:
   - Chrome: Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
   - Firefox: Ctrl+Shift+Delete

---

#### Issue: Resume PDF not downloading

**Problem:** `/resume` link doesn't download file

**Solution:**
1. Place PDF at: `static/resume.pdf`

2. Check file exists:
   ```bash
   ls -la static/resume.pdf
   ```

3. Check file is readable:
   ```bash
   file static/resume.pdf
   ```

4. Verify endpoint:
   - Should be at `/resume` or `/api/resume`

---

### Performance Issues

#### Issue: Website is slow

**Diagnosis:**
1. Check browser Network tab (F12)
2. Check Flask server logs
3. Check database query performance

**Solutions:**
1. Reduce database queries:
   ```python
   # Use eager loading
   projects = Project.query.options(db.joinedload(...)).all()
   ```

2. Add caching:
   ```python
   from flask_caching import Cache
   cache = Cache(app, config={'CACHE_TYPE': 'simple'})
   ```

3. Optimize images:
   - Use compressed image formats
   - Use CDN for static files

---

#### Issue: Database queries are slow

**Solution:**
1. Add indexes to frequently queried columns
2. Use pagination for large datasets
3. Limit query results

---

### Styling Issues

#### Issue: Colors look wrong

**Problem:** Website colors don't match expected

**Solution:**
1. Check CSS variables in `portfolio.css`:
   ```css
   :root {
       --primary-color: #2c3e50;
       --accent-color: #3498db;
   }
   ```

2. Clear browser cache
3. Restart Flask server
4. Check if CSS file is being loaded

---

#### Issue: Layout broken on mobile

**Problem:** Website looks strange on phone

**Solution:**
1. Check viewport meta tag in `layout.html`:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. Test in browser mobile view (F12 → Device Toolbar)
3. Check CSS media queries in `portfolio.css`

---

### Deployment Issues

#### Issue: "Internal Server Error" on deployment

**Error Message:**
```
500 Internal Server Error
```

**Solution:**
1. Check server logs
2. Verify environment variables:
   ```bash
   echo $DATABASE_URL
   echo $ADMIN_TOKEN
   ```

3. Check database connection on server:
   ```bash
   psql $DATABASE_URL -c "SELECT 1"
   ```

4. Enable debug mode (development only):
   ```bash
   FLASK_ENV=development python3 app.py
   ```

---

#### Issue: "ModuleNotFoundError" on production

**Solution:**
1. Install requirements on server:
   ```bash
   pip install -r requirements.txt
   ```

2. Use virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. Use Python executable from venv:
   ```bash
   /path/to/venv/bin/python3 app.py
   ```

---

#### Issue: Static files not served in production

**Solution:**
1. Use a web server (Nginx, Apache) to serve static files
2. Or use Flask's `send_from_directory()` (slower, OK for small sites)
3. Use a CDN for static files

---

### Environment & Configuration

#### Issue: Environment variables not loading

**Error Message:**
```
KeyError: 'FLASK_SECRET'
```

**Solution:**
1. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Install python-dotenv:
   ```bash
   pip install python-dotenv
   ```

3. Load variables in app:
   ```python
   from dotenv import load_dotenv
   load_dotenv()
   ```

---

#### Issue: Wrong configuration in production

**Problem:** Settings from development leak into production

**Solution:**
1. Never commit `.env` to version control
2. Add `.env` to `.gitignore`:
   ```
   .env
   *.pyc
   __pycache__/
   venv/
   ```

3. Set environment variables on production server:
   ```bash
   export DATABASE_URL=...
   export ADMIN_TOKEN=...
   ```

---

## Debugging Tips

### Enable Debug Mode
```bash
FLASK_ENV=development python3 app.py
```

### Check Application Routes
```python
from app import app
for rule in app.url_map.iter_rules():
    print(rule)
```

### Test Database Connection
```python
from app import app, db
with app.app_context():
    from app import Profile
    profile = Profile.query.first()
    print(profile)
```

### View Database
```bash
# Connect to PostgreSQL
psql portfolio

# List tables
\dt

# Query data
SELECT * FROM profile;
```

### Check Logs
```bash
# Flask development server logs (in terminal)
python3 app.py

# System logs
tail -f /var/log/syslog  # Ubuntu/Debian
```

---

## Getting Help

1. **Check Documentation:**
   - QUICK_START.md
   - PORTFOLIO_SETUP.md
   - API_REFERENCE.md

2. **Run Verification:**
   ```bash
   python3 verify_setup.py
   ```

3. **Check Browser Console:**
   - Press F12
   - Check Console tab for JavaScript errors

4. **Search Issues:**
   - Flask: https://flask.palletsprojects.com/
   - SQLAlchemy: https://docs.sqlalchemy.org/
   - PostgreSQL: https://www.postgresql.org/docs/

---

## Still Having Issues?

1. Copy the full error message
2. Check if it's listed here
3. Try the suggested solution
4. Run `verify_setup.py` for diagnostics
5. Check Flask/server logs

---

## Report a Problem

If you find an issue not listed here:
1. Note the exact error message
2. Describe what you were doing
3. Include your Python version
4. Include your Flask version
5. Include steps to reproduce

---

Good luck! 🚀

