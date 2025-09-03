#!/usr/bin/env bash
set -euo pipefail

echo "=== Project bootstrap: npm install -> docker compose -> drizzle push -> npm run dev ==="

# Helper function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check npm
if ! command_exists npm; then
  echo "ERROR: npm is not installed or not in PATH. Install Node.js / npm first."
  exit 1
fi

# Check docker
if ! command_exists docker; then
  echo "ERROR: docker not found. Start Docker and ensure it's in PATH."
  exit 1
fi

# Detect and set up docker compose command
DOCKER_COMPOSE_CMD=""
if command_exists docker-compose; then
  DOCKER_COMPOSE_CMD=(docker-compose)
elif docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD=(docker compose)
else
  echo "ERROR: neither 'docker-compose' nor 'docker compose' is available."
  echo "Install docker-compose or enable Docker Compose plugin."
  exit 1
fi

echo "Using docker command: ${DOCKER_COMPOSE_CMD[*]}"

REMOVE_IMAGES="all"

cleanup() {
  echo
  echo "Caught interrupt — cleaning up docker compose..."
  set +e
  "${DOCKER_COMPOSE_CMD[@]}" down --rmi "$REMOVE_IMAGES" -v
  RC=$?
  if [ $RC -ne 0 ]; then
    echo "Warning: '${DOCKER_COMPOSE_CMD[*]} down' exited with code $RC"
  else
    echo "Docker compose stopped and images removed (--rmi $REMOVE_IMAGES)."
  fi
  exit 0
}

trap 'cleanup' INT TERM

# Run npm install in root (for back end) and frontend
echo "--- Running: npm install (root/back end) ---"
npm install

if [ -d FrontEnd ]; then
  echo "--- Running: npm install (FrontEnd) ---"
  cd FrontEnd
  npm install
  cd ..
fi

# Build & start containers in detached mode with the correct docker compose command
echo "--- Running: ${DOCKER_COMPOSE_CMD[*]} up --build -d ---"
"${DOCKER_COMPOSE_CMD[@]}" up --build -d

# Run drizzle migrations (needs DB container running)
echo "--- Running: npx drizzle-kit push ---"
npx drizzle-kit push

# Start dev server
echo "--- Running: npm run dev ---"
npm run dev

# Print a hint if exit occurs normally
echo "npm run dev exited. If you want to stop containers, run:"
echo "  ${DOCKER_COMPOSE_CMD[*]} down --rmi $REMOVE_IMAGES -v"
