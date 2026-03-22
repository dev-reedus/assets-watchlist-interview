#!/usr/bin/env bash
set -euo pipefail

IMAGE="assets-watchlist"
CONTAINER="assets-watchlist-app"
PORT="${PORT:-8087}"


echo "*****************************"
echo "* Building container image *"
echo "*****************************"
echo ""

docker build -t "$IMAGE" .


if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "*****************************"
    echo "Stopping and removing existing container '$CONTAINER'..."
    echo "*****************************"
    echo ""
  docker rm -f "$CONTAINER"
fi

echo "*****************************"
echo "* Running assets-watchlist container on port 8087 *"
echo "*****************************"
echo ""

docker run \
  --name "$CONTAINER" \
  --detach \
  --publish "${PORT}:3000" \
  --restart unless-stopped \
  "$IMAGE"

echo "*************************************"
echo "✅ Container is up and running, at http://localhost:8087"
echo "*************************************"
echo ""
