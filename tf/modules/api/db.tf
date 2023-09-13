/*
 * db.tf
 * Author: Evan Kirkiles
 * Created on: Wed Sep 13 2023
 * 2023 Yale SWE 
 */

resource "planetscale_database_branch" "this" {
  organization = var.planetscale_organization
  database     = var.planetscale_database_name
  name         = var.env == "prod" ? "main" : var.env
  region       = "us-east"
}