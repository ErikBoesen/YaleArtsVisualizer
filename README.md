<h1 align="center">
  <img src="https://github.com/yale-swe/f23-yale-arts-map/assets/30581915/86ed8443-2e66-4e7a-ad02-f08a639808e3" width="400px"/>
  <br/>
  Yale Arts Map
</h1>

<p align="center">
A graph exploration of the who and what in the Yale Arts scene.<br/>Including, but not limited to, the YDN, Performing Arts, Yale SoA, School of Arch.
</p>

<div align="center">

[Tech Stack](#tech-stack) •
[Development](#development) •
[Configuration](#configuration)

</div>

## Tech Stack

Yale Arts Map is a website centered around a force-directed graph representing the relationships of productions and people on campus. Its functionality is centered around this "graph", which persists and evolves naturally across navigation. Each page thus provides information and manipulates the graph around a different filterable "view" of the scraped database.

| Stack | Tooling |  Dir |
| --- | --- | --- |
| **Frontend** | Next.js 14 (TypeScript, appDir) using Jotai, SWR, and d3-force | `frontend/` |
| **Backend (Client)** | Serverless Next.js API Handlers using Prisma | `frontend/src/app/api/` |
| **Backend (Scraper)** | Serverless Python AWS Lambda functions using a shared Prisma Lambda Layer | `backend/` |
| **Database** | PlanetScale MySQL and Prisma Data Proxy for pooling serverless connections | `frontend/prisma/` |
| **Infrastructure** | All backend resources codified with Terraform | `tf/` |

A preview of our interface:

<div align="center" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%;">
<img width="48%" alt="image" src="https://github.com/yale-swe/f23-yale-arts-map/assets/30581915/d80dc4c6-4461-41c1-8122-09e73e20ce46">
<img width="48%" alt="image" src="https://github.com/yale-swe/f23-yale-arts-map/assets/30581915/b8ee8a96-e3a7-401a-93b0-ec1398fae8cd">
</div>

## Setup

We use `pre-commit` to perform some Terraform formatting and docs generation. To
install the tools, run the following (assuming you're on Mac with homebrew):

```bash
# Install depenedencies for Terraform linting / doc gen
$ brew install pre-commit terraform-docs tflint tfsec checkov terrascan infracost tfupdate minamijoyo/hcledit/hcledit jq
# Configure Terraform docs templating
$ DIR=~/.git-template
$ git config --global init.templateDir ${DIR}
$ pre-commit init-templatedir -t pre-commit ${DIR}
# Install + run pre-commit on all files
$ pre-commit install
$ pre-commit run --all-files
```

Most of use use VSCode for development. A recommended list of extensions can be found in `.vscode/extensions.json`.

## Development

### Frontend

To develop locally...

```bash
# Enter the frontend
$ cd YaleArtsVisualizer/frontend/
# Install dependencies and begin the local web server
$ yarn
$ yarn dev
```

> **Note**
> You will need to fill out a `.env.local` file in the `frontend/` directory as described in the [Configuration](#configuration) section to be able to connect to the development backend from your local environment. However, if you are deploying your own `sandbox` environment, the correct `.env.local` file will be auto-generated for you upon applying your Terraform plan.

## Configuration

The client app expects the following environment variables to be set in order
to communicate with the backend. Their corresponding locations from the Terraform
setup have been provided, but you should replace these after being given a valid
development .env file by a member of the team.

```ini
# frontend/.env.local
DATABASE_URL=<the database URL with API key of the Prisma data proxy>
```
