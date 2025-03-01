#!/bin/sh
set -e

# Replace env variable placeholders with real values
printenv | grep NEXT_PUBLIC_ | while read -r line ; do
  key=$(echo $line | cut -d "=" -f1)
  value=$(echo $line | cut -d "=" -f2)

  find /app/.next/ -type f -name "*.json" -o -name "*.js" -exec sed -i "s~__${key}__~${value}~g" {} \;
done

# Execute the container's main process (CMD in Dockerfile)
exec "$@"