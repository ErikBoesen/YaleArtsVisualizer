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
    bucket         = "yav-com-terraform-backend"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    kms_key_id     = "alias/yav-com-terraform-bucket-key"
    dynamodb_table = "yav-com-terraform-backend-state"
    role_arn       = "arn:aws:iam::850857403041:role/yav-com-terraform-backend-access"
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

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Environment = var.env
      Project     = "Yale Arts Visualizer"
    }
  }

  // Deployment role defined in "com" environment
  assume_role {
    role_arn = "arn:aws:iam::850857403041:role/yav-com-terraform-deployment"
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Modules                                  */
/* -------------------------------------------------------------------------- */

// API: Basically our entire backend (just a PlanetScale DB for now)
module "api" {
  source                    = "../../modules/api"
  env                       = var.env
  planetscale_database_name = "yav-com-db"
  planetscale_organization  = var.planetscale_organization
}

// Scrapers: The Lambda functions that facilitate scraping Yale sites.
// The 
module "scrapers" {
  source                  = "../../modules/scrapers"
  env                     = var.env
  aws_region              = var.aws_region
  planetscale_db_name     = "yav-com-db"
  planetscale_db_username = var.planetscale_db_username
  planetscale_db_password = var.planetscale_db_password
}