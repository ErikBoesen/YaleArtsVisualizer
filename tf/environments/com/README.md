# README: The `com` environment

The `com` folder defines meta-level resources which allow the `dev` and `prod` environments to function within our CI/CD platform, and gives adequate priveleges to IAM users deploying their own `sandbox` environments. The resources in `com` and their respective files are:

| File                    | Provider    | Purpose                                                                             |
| ----------------------- | ----------- | ----------------------------------------------------------------------------------- |
| `com/planetscale.tf`    | PlanetScale | The main database which `dev` and `prod` will branch off of.                        |
| `com/iam_backend.tf`    | AWS         | An IAM role for accessing the Terraform remote backend S3 bucket and DynamoDB lock. |
| `com/iam_deployment.tf` | AWS         | An IAM role and User for deploying all of the AWS resources of each environment.    |
| `com/main.tf`           | AWS         | The S3 bucket and DynamoDB lock for the remote Terraform state of all environments. |

The `com` Terraform module should be deployed by an admin into the Yale Arts Visualizer AWS account manually, with the `terraform.tfstate` module being checked into this repository's source control. Once deployed, it is unlikely that it will need to be changed.

## Usage

To deploy or update the `com` infrastructure, follow the following steps.

> **Note**
> Make sure you are using the most up-to-date version of the repository! As we store `terraform.tfstate` in the Git repository, it is very important that you use the most recent version so you do not roll back infrastructure to a mismatched state.

```bash
# 0. make sure you have the latest version of com
$ git pull origin master

# 1. cd into the com/ directory
$ cd tf/environments/com/

# 2. ensure your access credentials are set (can also use an AWS_PROFILE)
$ export AWS_ACCESS_KEY_ID=<admin AWS access key>
$ export AWS_SECRET_ACCESS_KEY=<admin AWS secret access key>

# 3. initialize the Terraform modules and providers
$ terraform init

# 4. plan Terraform infrastructure changes to tfplan
$ terraform plan -var-file=com.tfvars -out="tfplan"

# 5. if everything looks good, apply
$ terraform apply "tfplan"

# 6. push back to master
$ git add ./
$ git commit -m "Applied com infrastructure."
$ git push origin main

```

Again, as we are storing the `terraform.tfstate` in Git, it is absolutely paramount that you use the latest version. If everything went successfully, the resources for the CI/CD pipeline should be set up and ready to go.

To tear down the `com` resources (which should only be done after tearing down environment-specific code), perform the exact same steps as above except replacing steps `4` and `5` with:

```bash
# 4 & 5. destroy Terraform infrastructure
$ terraform destroy
```

> **Note**
> You must manually empty the backends bucket (`yav-com-terraform-backend`) before tearing down all `com` resources––a guard rail to prevent against unwanted stack deletion of our environments.

> **Warning**
> STILL, DO NOT DESTROY THE `com` ENVIRONMENT BEFORE BOTH THE `dev` AND `prod` BRANCHES. As the `com` environment manages the other two, if you destroy it before `dev` or `prod`, the key which encrypts their Terraform states in the S3 bucket will be destroyed and invalidate their requests to check their own states. If this happens, you will have to destroy `dev` and `prod` manually!

# Terraform Docs

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
main.tf
Author: Evan Kirkiles
Created on: Wed Sep 13 2023
2023 Yale SWE

## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.2.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 5.16.0 |
| <a name="requirement_planetscale"></a> [planetscale](#requirement\_planetscale) | ~> 0.7.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 5.16.2 |
| <a name="provider_planetscale"></a> [planetscale](#provider\_planetscale) | 0.7.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_dynamodb_table.terraform_state](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dynamodb_table) | resource |
| [aws_iam_role.terraform_deployment_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.terraform_state_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy.access_backend](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy.deploy_terraform](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_user.deployment](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_user) | resource |
| [aws_iam_user_policy.deployment](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_user_policy) | resource |
| [aws_kms_alias.key_alias](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/kms_alias) | resource |
| [aws_kms_key.terraform_bucket_key](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/kms_key) | resource |
| [aws_s3_bucket.terraform_state](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_s3_bucket_acl.terraform_state](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_acl) | resource |
| [aws_s3_bucket_public_access_block.block](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_public_access_block) | resource |
| [aws_s3_bucket_server_side_encryption_configuration.terraform_state](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_server_side_encryption_configuration) | resource |
| [aws_s3_bucket_versioning.terraform_state](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_versioning) | resource |
| [planetscale_database.main](https://registry.terraform.io/providers/koslib/planetscale/latest/docs/resources/database) | resource |
| [aws_iam_policy_document.access_backend](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.deploy_terraform](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.user_assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region for all resources | `string` | `"us-east-1"` | no |
| <a name="input_planetscale_organization"></a> [planetscale\_organization](#input\_planetscale\_organization) | The PlanetScale organization in which to make the DB. | `string` | n/a | yes |
| <a name="input_planetscale_service_token"></a> [planetscale\_service\_token](#input\_planetscale\_service\_token) | The PlanetScale service token itself. | `string` | n/a | yes |
| <a name="input_planetscale_service_token_id"></a> [planetscale\_service\_token\_id](#input\_planetscale\_service\_token\_id) | The ID of the PlanetScale service token. | `string` | n/a | yes |

## Outputs

No outputs.
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
