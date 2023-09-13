# README: The `api` module

The API module sets up our database and API for accessing the PlanetScale backend.

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
| <a name="provider_planetscale"></a> [planetscale](#provider\_planetscale) | ~> 0.7.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [planetscale_database_branch.this](https://registry.terraform.io/providers/koslib/planetscale/latest/docs/resources/database_branch) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_env"></a> [env](#input\_env) | An env prefix to append to each resource created. | `string` | n/a | yes |
| <a name="input_planetscale_database_name"></a> [planetscale\_database\_name](#input\_planetscale\_database\_name) | The name of the PlanetScale database to branch from. | `string` | `"yav-com-db"` | no |
| <a name="input_planetscale_organization"></a> [planetscale\_organization](#input\_planetscale\_organization) | The PlanetScale organization in which the DB exists.. | `string` | n/a | yes |

## Outputs

No outputs.
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
