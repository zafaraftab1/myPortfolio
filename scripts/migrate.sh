#!/usr/bin/env bash
set -euo pipefail
source venv/bin/activate
export FLASK_APP=app.py
if [ ! -d "migrations" ]; then
  flask db init
fi
flask db migrate -m "autogen"
flask db upgrade

