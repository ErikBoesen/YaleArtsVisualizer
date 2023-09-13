/*
 * iam_backend.tf
 * Author: Evan Kirkiles
 * Created on: Wed Sep 13 2023
 * 2023 Yale SWE 
 *
 * Defines an IAM role for Terraform to use in accessing the backend. This is
 * provided statically in the backend s3 {} block in all modules.
 *
 * The AWS IAM role is: yav-com-terraform-backend-access
 * Its full ARN should be provided as role_arn to the backend s3 block.
 */

// IAM role for terraform to assume in retrieving backend
resource "aws_iam_role" "terraform_state_access" {
  name               = "${local.prefix}-terraform-backend-access"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

// Policy document for accessing the backend
data "aws_iam_policy_document" "access_backend" {
  // S3: List bucket
  statement {
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.terraform_state.arn]
  }
  // S3: Item management
  statement {
    effect    = "Allow"
    actions   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
    resources = ["${aws_s3_bucket.terraform_state.arn}/*/terraform.tfstate"]
  }
  // DynamoDB: Access table
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:DescribeTable",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:DeleteItem"
    ]
    resources = [aws_dynamodb_table.terraform_state.arn]
  }
  // KMS
  statement {
    effect = "Allow"
    actions = [
      "kms:Encrypt",
      "kms:Decrypt",
      "kms:ReEncrypt*",
      "kms:GenerateDataKey*",
      "kms:DescribeKey"
    ]
    resources = [aws_kms_key.terraform_bucket_key.arn]
  }
}

// Attach policy to IAM role
resource "aws_iam_role_policy" "access_backend" {
  name   = "${local.prefix}-terraform-backend-access"
  role   = aws_iam_role.terraform_state_access.id
  policy = data.aws_iam_policy_document.access_backend.json
}
