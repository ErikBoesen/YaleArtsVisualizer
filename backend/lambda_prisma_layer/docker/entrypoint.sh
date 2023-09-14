#!/bin/sh

"$@"

# create site-packages folder with all pip requirements
echo "Creating site-packages..."
mkdir -p /var/task/python/lib/python3.10/site-packages
mv /var/task/* /var/task/python/lib/python3.10/site-packages >/dev/null 2>&1
mv /var/task/python/lib/python3.10/site-packages/requirements.txt /var/task
# generate prisma schema
echo "Generating Prisma client..."
prisma generate --schema=/tmp/schema.prisma --generator=scraper
rm -rf /var/task/python/lib/python3.10/site-packages/prisma
mv /var/lang/lib/python3.10/site-packages/prisma /var/task/python/lib/python3.10/site-packages
# Move over downloaded prismaengines to the Lambda layer (in the function, this will still be at /opt/prismaengine)
mv /opt/prismaengine /var/task
