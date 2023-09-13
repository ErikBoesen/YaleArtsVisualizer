/*
 * lambda_schema.tf
 * Author: Evan Kirkiles
 * Created on: Wed Sep 13 2023
 * 2023 Yale SWE 
 */

module "lambda_schema" {
  source        = "terraform-aws-modules/lambda/aws"
  function_name = "${local.prefix}-schema-updates"
  source_path   = ["${path.module}/../../../backend/lambda_schema"]
  hash_extra    = "schema"
  handler       = "app.handler"
  runtime       = "python3.10"

  // permissions: logging
  create_role                   = true
  attach_cloudwatch_logs_policy = true

  // CI/CD setting prevents timestamp-based artifact hash
  recreate_missing_package = false
  ignore_source_code_hash  = true

  // We should determine reasonable memory size and timeout config for Lambda
  # memory_size = 10240
  timeout = 120

  // Add env variables for connecting to PlanetScale
  environment_variables = {
    DATABASE          = var.planetscale_database_name
    DATABASE_HOST     = "aws.connect.psdb.cloud"
    DATABASE_USERNAME = var.planetscale_db_username
    DATABASE_PASSWORD = var.planetscale_db_password
  }
}