/*
 * main.tf
 * Author: Evan Kirkiles
 * Created on: Wed Sep 13 2023
 * 2023 Yale SWE 
 */

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.16.0"
    }
    planetscale = {
      source  = "koslib/planetscale"
      version = "~> 0.7.0"
    }
  }
  required_version = ">= 1.2.0"

  // add s3 backend
  backend "s3" {
    bucket = "yale-arts-visualizer-terraform"
    key    = "dev.tfstate"
    region = "us-east-1"
  }
}

locals {
  prefix = "yav-${var.env}"
}

/* ----------------------------- Provider setup ----------------------------- */

// Provide PlanetScale tokens through your .tfvars file
provider "planetscale" {
  service_token_id = var.planetscale_service_token_id
  service_token    = var.planetscale_service_token
}

/* -------------------------------------------------------------------------- */
/*                                   Modules                                  */
/* -------------------------------------------------------------------------- */

// DB: We create one DB for all environments, with different branches per
// environment. 
resource "planetscale_database" "main" {
  organization = var.planetscale_organization
  name         = "${local.prefix}-db"
  region       = "us-east"
}

// API: Basically our entire backend (just a PlanetScale DB for now)
module "api" {
  source                    = "../../modules/api"
  env                       = var.env
  planetscale_database_name = planetscale_database.main.name
  planetscale_organization  = var.planetscale_organization
}