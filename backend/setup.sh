#!/usr/bin/env bash -l

# Run prisma generate within our conda environment
conda run -n yam bash -c "dotenv -f ../frontend/.env.local run -- prisma generate --schema=../frontend/prisma/schema.prisma --data-proxy"

# Now export the DATABASE_URL variable
export DATABASE_URL=$(dotenv -f ../frontend/.env.local get DATABASE_URL_DIRECT)

# From your shell, make sure yam is active
echo "Make sure the 'yam' conda environment is active, e.g.:"
echo "$ conda activate yam"
