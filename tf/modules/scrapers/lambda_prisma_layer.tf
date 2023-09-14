/*
 * lambda_base.tf
 * Author: Evan Kirkiles
 * Created on: Wed Sep 13 2023
 * 2023 Yale SWE 
 */

module "lambda_layer_prisma" {
  source      = "terraform-aws-modules/lambda/aws"
  layer_name  = "yav-${var.env}-prisma"
  description = "A Lambda Layer providing our Prisma ORM to scraper Lambdas."

  source_path = [
    { pip_requirements = "${path.module}/../../../backend/lambda_prisma_layer/requirements.txt" },
    { path = "${path.module}/../../../backend/lambda_prisma_layer/docker/entrypoint.sh" },
    { path = "${path.module}/../../../frontend/prisma/schema.prisma" },
  ]
  compatible_runtimes = ["python3.10"]
  runtime             = "python3.10"

  // build in SAM docker container
  hash_extra               = "yav-prismalayer"
  create_layer             = true
  create_function          = false
  recreate_missing_package = false
  // we use a custom build Docker container to install the correct Prisma
  // engine and be able to generate the Prisma client before uploading the layer
  build_in_docker   = true
  docker_image      = "build-lambda-prisma"
  docker_file       = "${path.module}/../../../backend/lambda_prisma_layer/docker/Dockerfile"
  docker_entrypoint = "/entrypoint/entrypoint.sh"
  docker_additional_options = [
    "--platform", "linux/x86_64",
    "-v", "${abspath(path.module)}/../../../backend/lambda_prisma_layer/docker/entrypoint.sh:/entrypoint/entrypoint.sh:ro",
    "-v", "${abspath(path.module)}/../../../frontend/prisma/schema.prisma:/tmp/schema.prisma:ro",
  ]
}