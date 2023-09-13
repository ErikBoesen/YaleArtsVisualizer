# Yale Arts Visualizer Terraform

### Usage

First, make sure you have an AWS profile configured with access permissions to
the Terraform state stored in our S3 bucket.

```ini
# Somewhere in ~/.aws/credentials...
[yav-tf]
aws_access_key_id=<ask evan>
aws_secret_access_key=<ask evan>
```

To update the backend given valid credentials:

```zsh
cd terraform/environments/dev
export AWS_PROFILE=yav-tf
terraform init
terraform plan -var-file=dev.tfvars -out=tfplan
terraform apply tfplan
```
