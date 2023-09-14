# README: The `scrapers` module

The Scrapers module sets up our Scraper lambdas.

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

## Providers

No providers.

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_lambda_layer_sqlalchemy"></a> [lambda\_layer\_sqlalchemy](#module\_lambda\_layer\_sqlalchemy) | terraform-aws-modules/lambda/aws | n/a |

## Resources

No resources.

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | The AWS region in which to create resources. | `string` | `"us-east-1"` | no |
| <a name="input_env"></a> [env](#input\_env) | An env prefix to append to each resource created. | `string` | n/a | yes |
| <a name="input_planetscale_db_name"></a> [planetscale\_db\_name](#input\_planetscale\_db\_name) | The name of the PlanetScale database. | `string` | `"yav-com-db"` | no |
| <a name="input_planetscale_db_password"></a> [planetscale\_db\_password](#input\_planetscale\_db\_password) | A PlanetScale DB branch password (get this from the Web UI). | `string` | n/a | yes |
| <a name="input_planetscale_db_username"></a> [planetscale\_db\_username](#input\_planetscale\_db\_username) | A PlanetScale DB branch username (get this from the Web UI). | `string` | n/a | yes |

## Outputs

No outputs.
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
