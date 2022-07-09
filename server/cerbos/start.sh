#!/usr/bin/env bash

LATEST_VERSION=$(curl --silent "https://api.github.com/repos/cerbos/cerbos/releases/latest" | jq -r .tag_name)

docker run -i -t -p 3594:3594 -p 3594:3594 \
  -v $(pwd)/policies:/policies \
  ghcr.io/cerbos/cerbos:0.17.0
