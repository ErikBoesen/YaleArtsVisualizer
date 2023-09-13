<h1 align="center">
  <img src="https://i.kym-cdn.com/photos/images/newsfeed/001/459/116/5bc.png" width="200px"/>
  <br/>
  Yale Arts Visualizer
</h1>

<p align="center">
A graph exploration of the who and what in the Yale Arts scene.
</p>

<div align="center">

[Features](#features) •
[Development](#development) •
[Configuration](#configuration)

</div>

## Features

Yale Arts visualizer is...

| Feature | Description |
| ------- | ----------- |

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

## Development

To develop locally...

```bash
# Enter the frontend
$ cd YaleArtsVisualizer/frontend/
# Install dependencies and begin the local web server
$ yarn install
$ yarn start
```

> **Note**
>
> You will need to fill out a `.env` file in the `frontend/` directory as described in the [Configuration](#configuration) section to be able to connect to the development backend from your local environment. However, if you are deploying your own `sandbox` environment, the correct `.env` file will be auto-generated for you upon applying your Terraform plan.

## Configuration

The client app expects the following environment variables to be set in order
to communicate with the backend. Their corresponding locations from the Terraform
setup have been provided, but you should replace these after being given a valid
development .env file by a member of the team.

```ini
# frontend/.env
# TODO
```
