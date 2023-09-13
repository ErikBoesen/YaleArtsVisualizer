/*
 * iam_deployment.tf
 * Author: Evan Kirkiles
 * Created on: Wed Sep 13 2023
 * 2023 Yale SWE 
 *
 * Defines an IAM role and user for Terraform to use for deployment. This is the
 * user that will be supplied to our CI/CD pipeline, which can assume a role
 * with sufficient permissions for deploying the backend.
 */

// IAM user for deployment
resource "aws_iam_user" "deployment" {
  name = "${local.prefix}-terraform-deployer"
}

// Enable IAM user to assume roles
data "aws_iam_policy_document" "user_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    resources = [
      aws_iam_role.terraform_deployment_access.arn,
      aws_iam_role.terraform_state_access.arn
    ]
  }
}

// Allow IAM user to assume roles
resource "aws_iam_user_policy" "deployment" {
  name   = "${local.prefix}-terraform-deployment-assumerole"
  user   = aws_iam_user.deployment.name
  policy = data.aws_iam_policy_document.user_assume_role.json
}

// Access policy document for allowing above IAM user to assume a role
data "aws_iam_policy_document" "assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "AWS"
      identifiers = [aws_iam_user.deployment.arn]
    }
  }
}

// IAM role for terraform to assume in deploying terraform
resource "aws_iam_role" "terraform_deployment_access" {
  name               = "${local.prefix}-terraform-deployment"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

// Policy document for deploying terraform
data "aws_iam_policy_document" "deploy_terraform" {
  // Allow access for creating all potential Yale Arts Visualizer resources
  statement {
    effect = "Allow"
    actions = [
      "apigateway:*",
      "iam:*",
      "lambda:*",
      "logs:*",
      "s3:*",
      "sqs:*",
      "states:*",
      "ecr:*",
      "cloudwatch:*",
      "dynamodb:*",
      "appsync:*"
    ]
    resources = ["*"]
  }
  // Deny IAM access to powerful IAM things
  statement {
    effect = "Deny"
    actions = [
      "iam:*User*",
      "iam:*Login*",
      "iam:*Group*",
      "iam:*Provider*"
    ]
    resources = ["*"]
  }
}

// Attach policy to IAM role
resource "aws_iam_role_policy" "deploy_terraform" {
  name   = "${local.prefix}-terraform-deployment"
  role   = aws_iam_role.terraform_deployment_access.id
  policy = data.aws_iam_policy_document.deploy_terraform.json
}
