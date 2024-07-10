#!/usr/bin/env bash
set -euxo pipefail

# wanna turn this into a k8s cluster and setup github actions
# eventually, if i can ever be bothered.

WORKDIR="plsuwu"

# run machine upgrades
apt-get update -y
apt-get upgrade -y
apt-get clean -y

# change dir to application repo directory and pull
# updates from gh
cd "/$WORKDIR" || exit
git checkout main
git pull

# build updated image, replacing old container with update,
# and prune old image
docker compose build
docker compose down
docker compose up -d --remove-orphans --build
docker image prune -f
