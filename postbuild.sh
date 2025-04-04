#!/bin/bash
set -e

# Lambda Code + Dependencies Packaging
rm -rf dist/server-deps
mkdir -p dist/server-deps/nodejs

# Copy over package, yarn config, and yarn lock file
cp package.json dist/server-deps/nodejs/
cp .yarnrc.yml dist/server-deps/nodejs/
touch dist/server-deps/nodejs/yarn.lock

# Copy over package, yarn config, and yarn lock file to lambda function code
cp package.json dist/server/
cp .yarnrc.yml dist/server/
touch dist/server/yarn.lock

# I'm running this on macos (darwin) but need to build aws lambda dependencies (linux) so we need to run in a container
# another option: https://stackoverflow.com/questions/34437900/how-to-load-npm-modules-in-aws-lambda (compile the modules on an EC2 spot instance)
cd dist/server-deps/nodejs
docker run --rm -v "$(pwd)":/app -w /app node sh -c "corepack enable && yarn cache clean &&yarn workspaces focus --production"
