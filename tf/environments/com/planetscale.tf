/*
 * planetscale.tf
 * Author: Evan Kirkiles
 * Created on: Wed Sep 13 2023
 * 2023 Yale SWE 
 */

// DB: We create one DB for all environments, with different branches per
// environment. 
resource "planetscale_database" "main" {
  organization = var.planetscale_organization
  name         = "${local.prefix}-db"
  region       = "us-east"
}