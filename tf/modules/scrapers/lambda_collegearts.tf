/*
 * lambda_collegearts.tf
 * Author: Evan Kirkiles
 * Created on: Wed Sep 13 2023
 * 2023 Yale SWE 
 */

module "lambda_scraper_collegearts" {
  source        = "terraform-aws-modules/lambda/aws"
  function_name = "yav-${var.env}-prisma"
  description   = "The scraper for the Yale College Arts website."
  source_path   = "${path.module}/../../../backend/lambda_collegearts"
  layers = [
    "arn:aws:lambda:us-east-1:034541671702:layer:openssl-lambda:1", # openSSL
    module.lambda_layer_prisma.lambda_layer_arn                     # Prisma client layer
  ]
  runtime = "python3.10"
  handler = "app.handler"

  // let's be generous with memory requirements
  memory_size = 1024
  timeout     = 120

  // build in SAM docker container
  create_function           = true
  build_in_docker           = true
  docker_additional_options = ["--platform", "linux/x86_64"]

  // lambda layer needs our database url, specifying TLS certificate location
  // unique to the Amazon Lambda runtime container
  environment_variables = {
    DATABASE_URL = local.lambda_database_url
  }
}