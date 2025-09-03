#!/usr/bin/env bash
set -euo pipefail

# Friendly header
echo "=== Project bootstrap: npm install -> docker compose -> drizzle push -> npm run dev ==="

# Helpers
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check npm
if ! command_exists npm; then
  echo "ERROR: npm is not installed or not in PATH. Install Node.js / npm first."
  exit 1
fi

# Check docker (Docker Desktop must be running on Windows)
if ! command_exists docker; then
  echo "ERROR: docker not found. Start Docker Desktop and ensure docker is in PATH."
  exit 1
fi

# Detect docker-compose command to use
DOCKER_COMPOSE_CMD=""
if command_exists docker-compose; then
  DOCKER_COMPOSE_CMD="docker-compose"
elif docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD="docker compose"
fi

if [ -z "$DOCKER_COMPOSE_CMD" ]; then
  echo "ERROR: neither 'docker-compose' nor 'docker compose' is available."
  echo "Install docker-compose or enable the Docker Compose plugin."
  exit 1
fi

echo "Using docker command: $DOCKER_COMPOSE_CMD"

# Which images to remove: "all" removes everything; "local" removes only images built by compose.
REMOVE_IMAGES="all"

# Cleanup function to run on Ctrl+C or termination
cleanup() {
  echo
  echo "Caught interrupt — cleaning up docker compose..."
  set +e
  "$DOCKER_COMPOSE_CMD" down --rmi "$REMOVE_IMAGES" -v
  RC=$?
  if [ $RC -ne 0 ]; then
    echo "Warning: '$DOCKER_COMPOSE_CMD down' exited with code $RC"
  else
    echo "Docker compose stopped and images removed (--rmi $REMOVE_IMAGES)."
  fi
  exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap 'cleanup' INT TERM

# Run npm install
echo "--- Running: npm install ---"
npm install

# Build & start containers in detached mode
echo "--- Running: $DOCKER_COMPOSE_CMD up --build -d ---"
"$DOCKER_COMPOSE_CMD" up --build -d

# Run drizzle migrations (needs DB container running)
echo "--- Running: npx drizzle-kit push ---"
npx drizzle-kit push

# Start dev server (foreground). Ctrl+C will be handled by trap -> cleanup()
echo "--- Running: npm run dev ---"
npm run dev

# If npm run dev exits normally (no Ctrl+C), we still want to print hint.
echo "npm run dev exited. If you want to stop containers, run:"
echo "  $DOCKER_COMPOSE_CMD down --rmi $REMOVE_IMAGES -v"
