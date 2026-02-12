#!/usr/bin/env bash
set -euo pipefail
# Create venv if missing, install deps and run flask dev server
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
# shellcheck disable=SC1091
source venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --host=127.0.0.1 --port=5000

