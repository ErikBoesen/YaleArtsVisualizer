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
  }
  required_version = ">= 1.2.0"
}

locals {
  prefix              = "yav-${var.env}"
  lambda_database_url = "mysql://${var.planetscale_db_username}:${var.planetscale_db_password}@aws.connect.psdb.cloud/yav-com-db?sslaccept=strict&sslcert=/etc/pki/tls/cert.pem"
}