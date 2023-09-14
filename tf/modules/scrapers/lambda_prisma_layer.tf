/*
 * lambda_base.tf
 * Author: Evan Kirkiles
 * Created on: Wed Sep 13 2023
 * 2023 Yale SWE 
 */

module "lambda_layer_sqlalchemy" {
  source      = "terraform-aws-modules/lambda/aws"
  layer_name  = "yav-${var.env}-prisma"
  description = "A Lambda Layer providing our Prisma ORM to scraper Lambdas."
  source_path = [{
    path             = "${path.module}/../../../backend/lambda_prisma_layer"
    pip_requirements = true
    prefix_in_zip    = "python"
  }]
  compatible_runtimes = ["python3.10"]
  runtime             = "python3.10"

  // build in SAM docker container
  hash_extra               = "yav-yav-prismalayer"
  create_layer             = true
  create_function          = false
  recreate_missing_package = false
  // docker config to allow building on ARM chips (new Macs)
  build_in_docker           = true
  docker_additional_options = ["--platform=linux/x86_64"]
}