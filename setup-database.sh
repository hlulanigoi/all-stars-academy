#!/bin/bash

# Start PostgreSQL
sudo -u postgres /usr/lib/postgresql/*/bin/postgres -D /var/lib/postgresql/*/main -c config_file=/etc/postgresql/*/main/postgresql.conf &

# Wait for PostgreSQL to start
sleep 5

# Create database and user
sudo -u postgres psql <<EOF
CREATE USER appuser WITH PASSWORD 'apppassword';
CREATE DATABASE allstars_academy OWNER appuser;
GRANT ALL PRIVILEGES ON DATABASE allstars_academy TO appuser;
EOF

echo "Database setup complete"
