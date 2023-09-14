/*
 * local.tf
 * Author: Evan Kirkiles
 * Created on: Wed Sep 13 2023
 * 2023 Yale SWE 
 *
 * Generates a local .env for the frontend to connect to the PlanetScale db on
 * a the PlanetScale credentials you supplied in dev.tfvars.
 */

resource "local_file" "frontend_env" {
  content  = <<EOT
DATABASE_URL=mysql://${var.planetscale_db_username}:${var.planetscale_db_password}@aws.connect.psdb.cloud/yav-com-db?sslaccept=strict
  EOT
  filename = "${path.module}/../../../frontend/.env.local"
}