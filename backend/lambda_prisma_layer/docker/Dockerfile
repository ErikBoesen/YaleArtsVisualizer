FROM --platform=linux/x86_64 public.ecr.aws/sam/build-python3.10:latest as build

LABEL maintainer="Evan Kirkiles" \
  description="Patched AWS Lambda build container"

# We need Node to run the prisma generator
RUN yum install https://rpm.nodesource.com/pub_16.x/nodistro/repo/nodesource-release-nodistro-1.noarch.rpm -y || true
RUN yum install nodejs -y --setopt=nodesource-nodejs.module_hotfixes=1

# Now install prisma
ENV PRISMA_HOME_DIR=/opt/prismaengine
RUN pip install --compile -U prisma

# The below downloads the correct Prisma Rust engine
RUN prisma --version