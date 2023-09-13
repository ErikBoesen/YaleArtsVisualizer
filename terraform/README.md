# Yale Arts Visualizer Terraform

## Setup

First, make sure you have an AWS profile configured with access permissions to
the Terraform state stored in our S3 bucket.

```ini
# Somewhere in ~/.aws/credentials...
[yav-tf]
aws_access_key_id=<ask evan>
aws_secret_access_key=<ask evan>
```

Next, you'll want to fill out a `.tfvars` file with configuration options for the
Terraform variables for each environment. For example:

```ini
# terraform/environments/dev/dev.tfvars
env                          = "dev"
planetscale_service_token_id = <planetscale service token ID>
planetscale_service_token    = <planetscale service token>
planetscale_organization     = <planetscale organization>
```

That being said, it's probably easiest to just request the above file from someone who
already has it than to fill it out yourself.

## Usage

Given the above setup, to update the backend given valid credentials:

```bash
# The below is for the dev environment
cd terraform/environments/dev
export AWS_PROFILE=yav-tf
terraform init
terraform plan -var-file=dev.tfvars -out=tfplan
terraform apply tfplan
```
