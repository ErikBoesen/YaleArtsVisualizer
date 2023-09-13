/*
 * lambda_base.tf
 * Author: Evan Kirkiles
 * Created on: Wed Sep 13 2023
 * 2023 Yale SWE 
 */

module "lambda_layer_sqlalchemy" {
  source              = "terraform-aws-modules/lambda/aws"
  create_layer        = true
  layer_name          = "yav-${var.env}-sqlalchemy"
  description         = "A base layer providing our SQLAlchemy ORM to scraper functions."
  compatible_runtimes = ["python3.10"]
  hash_extra          = "sqlalchemy"

  // build in SAM docker container
  source_path              = "../../../backend/lambda_layer"
  create_package           = true
  recreate_missing_package = false
  // docker config to allow building on ARM chips (new Macs)
  build_in_docker           = true
  docker_additional_options = ["--platform=linux/x86_64"]
}