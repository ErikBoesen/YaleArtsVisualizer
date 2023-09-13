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
}

locals {
  prefix = "yav-com"
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
      Environment = "common"
      Project     = "Yale Arts Visualizer"
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                                  RESOURCES                                 */
/* -------------------------------------------------------------------------- */
// The below are some meta-level AWS resources for managing our Terraform backend.

/* -------------------------------- S3 bucket ------------------------------- */

// AWS KMS key for encrypting bucket objects
resource "aws_kms_key" "terraform_bucket_key" {
  description             = "This key is used to encrypt bucket objects"
  deletion_window_in_days = 10
  enable_key_rotation     = true
  lifecycle {
    prevent_destroy = true
  }
}

// Alias for the KMS key so we can use it easily
resource "aws_kms_alias" "key_alias" {
  name          = "alias/${local.prefix}-terraform-bucket-key"
  target_key_id = aws_kms_key.terraform_bucket_key.key_id
}

// S3 Bucket for storing remote state
resource "aws_s3_bucket" "terraform_state" {
  bucket = "${local.prefix}-terraform-backend"
}

resource "aws_s3_bucket_acl" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.bucket
  acl    = "private"
}

// Enable bucket versioning
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.bucket
  versioning_configuration {
    status = "Enabled"
  }
}

// Enable server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.bucket
  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.terraform_bucket_key.arn
      sse_algorithm     = "aws:kms"
    }
  }

  lifecycle {
    prevent_destroy = true
  }
}

// Access policy to ensure S3 bucket is private
resource "aws_s3_bucket_public_access_block" "block" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

/* -------------------------------- DynamoDB -------------------------------- */

// DynamoDB table for locking the S3 backend to ensure it is not written to by
// multiple users at the same time.
resource "aws_dynamodb_table" "terraform_state" {
  name           = "${local.prefix}-terraform-backend-state"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}

