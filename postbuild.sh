#!/bin/bash
set -e

# Define magenta color prefix (ANSI color code 35 for magenta, 1 for bold)
SERVER_DEPS_PREFIX="\033[1;35m[server-deps]\033[0m"

# Copy over package, yarn config, and yarn lock file
echo -e "$SERVER_DEPS_PREFIX ♻️  Preparing server dependencies..."
cp package.json dist/server/
cp .yarnrc.yml dist/server/
touch dist/server/yarn.lock

# I'm running this on macos (darwin) but need to build aws lambda dependencies (linux) so we need to run in a container
# another option: https://stackoverflow.com/questions/34437900/how-to-load-npm-modules-in-aws-lambda (compile the modules on an EC2 spot instance)
echo -e "$SERVER_DEPS_PREFIX 🐳 Building Linux dependencies in Docker container..."
cd dist/server/
docker run --rm -v "$(pwd)":/app -w /app node sh -c "corepack enable && yarn cache clean && yarn workspaces focus --production" >/dev/null 2>&1

echo -e "$SERVER_DEPS_PREFIX ✅ Server dependencies built successfully"
