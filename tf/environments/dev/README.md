# The `dev` infrastructure

The `dev` folder is the entry point for our stable development deployment. This is the backend resource that all frontend development should target, and functions more similarly to a `staging` environment, in that it should always be stable and functioning.

The `dev` Terraform module is deployed by the GitHub action defined in `terraform-dev.yaml` on pushes and PR merges to the `dev` branch, with the Terraform state being uploaded to the remote S3 backend created by the `com` environment. Redeploys are not triggered on all pushes––only those which include modifications to the `backend/`, `tf/environments/dev/`, and `tf/modules/backend/` folders.

## CI/CD Setup

In order for the GitHub Action to automatically deploy the `dev` infrastructure, it must be fed the correct environment-specific secrets. That is, the following should be set as environment secrets in the `development` GitHub environment:

| Key                          | Description                                                            |
| ---------------------------- | ---------------------------------------------------------------------- |
| PLANETSCALE_DB_PASSWORD_NAME | The name of a password for the `dev` branch of the PlanetScale db.     |
| PLANETSCALE_DB_PASSWORD      | The corresponding password for the `dev` branch of the PlanetScale db. |

The `dev` CI/CD pipeline also depends on three _repository_ secrets, which define the credentials passed to GitHub Actions:

| Key                          | Description                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| AWS_ACCESS_KEY_ID            | The access key ID for the `yav-com-terraform-deployer` user created by `com`.             |
| AWS_SECRET_ACCESS_KEY        | The secret access key for the `yav-com-terraform-deployer` user created by `com`.         |
| PLANETSCALE_ORGANIZATION     | The name of the PlanetScale organization the database is in (probs `yaleartsvisualizer`). |
| PLANETSCALE_SERVICE_TOKEN_ID | A service token ID for managing our PlanetScale resources.                                |
| PLANETSCALE_SERVICE_TOKEN    | The corresponding service token for managing our PlanetScale resources.                   |

With these secrets defined, the CI/CD pipeline should have all it needs to run its automated deploys.

## Manual Usage

To deploy or update the `dev` infrastructure _manually_––in case of failing GitHub actions, for example––perform the following commands.

> **Note**
> Unlike the `com` infrastructure, the `dev` infrastructure's Terraform state is saved remotely to an S3 bucket––as long as you have the updated Terraform code and the correct AWS User, you will be able to read the Terraform state correctly from any machine.

> **Warning**
> Deploying the `dev` infrastructure manually requires you to have a `dev.tfvars` file with the above secrets filled out as Terraform variables. See `dev/variables.tf` for a description of what must be included in `dev.tfvars`.

```bash
# 1. cd into the dev/ directory
$ cd tf/environments/dev/

# 2. ensure your access credentials are set (can also use an AWS_ACCESS_KEY_ID, e.g.)
$ export AWS_PROFILE=yav-tf

# 3. initialize the Terraform modules and providers
$ terraform init

# 4. plan Terraform infrastructure changes to tfplan
$ terraform plan -var-file=dev.tfvars -out=tfplan

# 5. if everything looks good, apply
$ terraform apply "tfplan"
```

To tear down the `dev` resources, perform the exact same steps as above except replacing steps `4` and `5` with:

```bash
# 4 & 5. destroy Terraform infrastructure
$ terraform destroy -var-file=dev.tfvars
```

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

No providers.

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_api"></a> [api](#module\_api) | ../../modules/api | n/a |
| <a name="module_scrapers"></a> [scrapers](#module\_scrapers) | ../../modules/scrapers | n/a |

## Resources

No resources.

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_env"></a> [env](#input\_env) | An env prefix to append to each resource created. | `string` | `"dev"` | no |
| <a name="input_planetscale_db_password"></a> [planetscale\_db\_password](#input\_planetscale\_db\_password) | A PlanetScale DB branch password (get this from the Web UI). | `string` | `"SET THIS IN .tfvars ONCE DB BRANCH IS CREATED"` | no |
| <a name="input_planetscale_db_username"></a> [planetscale\_db\_username](#input\_planetscale\_db\_username) | A PlanetScale DB branch username (get this from the Web UI). | `string` | `"SET THIS IN .tfvars ONCE DB BRANCH IS CREATED"` | no |
| <a name="input_planetscale_organization"></a> [planetscale\_organization](#input\_planetscale\_organization) | The PlanetScale organization in which to make the DB. | `string` | n/a | yes |
| <a name="input_planetscale_service_token"></a> [planetscale\_service\_token](#input\_planetscale\_service\_token) | The PlanetScale service token itself. | `string` | n/a | yes |
| <a name="input_planetscale_service_token_id"></a> [planetscale\_service\_token\_id](#input\_planetscale\_service\_token\_id) | The ID of the PlanetScale service token. | `string` | n/a | yes |

## Outputs

No outputs.
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
