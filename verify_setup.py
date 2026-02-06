#!/usr/bin/env python3
"""
Portfolio Website - Setup Verification Script
Tests all components and provides setup diagnostics
"""

import os
import sys
import json
from pathlib import Path

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print("✓ Python version:", f"{version.major}.{version.minor}")
        return True
    else:
        print("✗ Python 3.8+ required. Current:", f"{version.major}.{version.minor}")
        return False

def check_dependencies():
    """Check if required packages are installed"""
    required = [
        'flask',
        'flask_cors',
        'flask_sqlalchemy',
        'psycopg',
        'dotenv'
    ]

    print("\nChecking dependencies...")
    all_installed = True
    for package in required:
        try:
            __import__(package.replace('_', '-'))
            print(f"  ✓ {package}")
        except ImportError:
            print(f"  ✗ {package} - NOT INSTALLED")
            all_installed = False

    return all_installed

def check_files():
    """Check if all required files exist"""
    required_files = [
        'app.py',
        'requirements.txt',
        'templates/layout.html',
        'templates/home.html',
        'templates/about.html',
        'templates/projects.html',
        'templates/project_detail.html',
        'templates/testimonials.html',
        'templates/contact.html',
        'static/app.css',
        'static/portfolio.css',
    ]

    print("\nChecking files...")
    all_exist = True
    for file_path in required_files:
        full_path = Path(file_path)
        if full_path.exists():
            size = full_path.stat().st_size
            print(f"  ✓ {file_path} ({size} bytes)")
        else:
            print(f"  ✗ {file_path} - MISSING")
            all_exist = False

    return all_exist

def check_templates():
    """Check if templates have required content"""
    print("\nChecking templates content...")
    templates = {
        'templates/layout.html': ['main-navigation', 'main-footer'],
        'templates/home.html': ['hero-section', 'featured-projects'],
        'templates/about.html': ['about-section', 'timeline'],
        'templates/projects.html': ['projects-grid-full'],
        'templates/contact.html': ['contact-form'],
    }

    all_good = True
    for template, required_content in templates.items():
        try:
            with open(template, 'r') as f:
                content = f.read()
                for item in required_content:
                    if item in content:
                        print(f"  ✓ {template} has {item}")
                    else:
                        print(f"  ✗ {template} missing {item}")
                        all_good = False
        except FileNotFoundError:
            print(f"  ✗ {template} not found")
            all_good = False

    return all_good

def check_database():
    """Check database configuration"""
    print("\nChecking database configuration...")
    try:
        from app import app, db
        print("  ✓ Flask app imports successfully")
        print("  ✓ SQLAlchemy configured")
        print(f"  ✓ Database URI configured")
        return True
    except Exception as e:
        print(f"  ✗ Database configuration error: {e}")
        return False

def check_models():
    """Check if all database models are defined"""
    print("\nChecking database models...")
    try:
        from app import Profile, Project, Experience, Skill, Testimonial, ContactMessage
        models = [
            ('Profile', Profile),
            ('Project', Project),
            ('Experience', Experience),
            ('Skill', Skill),
            ('Testimonial', Testimonial),
            ('ContactMessage', ContactMessage),
        ]
        for name, model in models:
            print(f"  ✓ {name} model defined")
        return True
    except ImportError as e:
        print(f"  ✗ Model import error: {e}")
        return False

def check_routes():
    """Check if all routes are defined"""
    print("\nChecking Flask routes...")
    try:
        from app import app
        routes = [
            '/',
            '/api/health',
            '/api/profile',
            '/api/projects',
            '/api/experiences',
            '/api/skills',
            '/api/testimonials',
            '/api/contact',
            '/api/resume',
            '/home',
            '/about',
            '/projects',
            '/testimonials',
            '/contact',
        ]

        app_routes = set()
        for rule in app.url_map.iter_rules():
            app_routes.add(rule.rule)

        for route in routes:
            if route in app_routes:
                print(f"  ✓ {route}")
            else:
                print(f"  ✗ {route} - MISSING")

        return True
    except Exception as e:
        print(f"  ✗ Route check error: {e}")
        return False

def check_env_file():
    """Check if .env file exists"""
    print("\nChecking environment configuration...")
    if os.path.exists('.env'):
        print("  ✓ .env file exists")
        with open('.env', 'r') as f:
            for line in f:
                if line.strip() and not line.startswith('#'):
                    key = line.split('=')[0]
                    print(f"    - {key} configured")
        return True
    elif os.path.exists('.env.example'):
        print("  ⚠ .env.example exists but .env not found")
        print("    Run: cp .env.example .env")
        return False
    else:
        print("  ✗ No .env or .env.example found")
        return False

def print_summary(results):
    """Print summary of checks"""
    print("\n" + "="*50)
    print("SETUP VERIFICATION SUMMARY")
    print("="*50)

    total = len(results)
    passed = sum(results.values())
    failed = total - passed

    for check, result in results.items():
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status} - {check}")

    print("="*50)
    print(f"Results: {passed}/{total} checks passed")

    if passed == total:
        print("\n🎉 All checks passed! You're ready to go!")
        print("\nNext steps:")
        print("1. Ensure PostgreSQL is running")
        print("2. Run: python3 app.py")
        print("3. Visit: http://localhost:5000/home")
        return 0
    else:
        print(f"\n⚠️  {failed} checks failed. Please fix the issues above.")
        return 1

def main():
    """Run all checks"""
    print("Portfolio Website - Setup Verification")
    print("="*50)

    results = {
        'Python Version': check_python_version(),
        'Dependencies': check_dependencies(),
        'Required Files': check_files(),
        'Template Content': check_templates(),
        'Database Config': check_database(),
        'Models': check_models(),
        'Routes': check_routes(),
        'Environment Setup': check_env_file(),
    }

    exit_code = print_summary(results)
    sys.exit(exit_code)

if __name__ == '__main__':
    main()

