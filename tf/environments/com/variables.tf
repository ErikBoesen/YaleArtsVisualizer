/*
 * variables.tf
 * Author: Evan Kirkiles
 * Created on: Wed Sep 13 2023
 * 2023 Yale SWE 
 */


/* -------------------------------------------------------------------------- */
/*                                 CREDENTIALS                                */
/* -------------------------------------------------------------------------- */

/* ------------------------------- AWS Config ------------------------------- */

variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

/* ----------------------------- Netlify Config ----------------------------- */


variable "planetscale_service_token_id" {
  description = "The ID of the PlanetScale service token."
  type        = string
  sensitive   = true
}

variable "planetscale_service_token" {
  description = "The PlanetScale service token itself."
  type        = string
  sensitive   = true
}

variable "planetscale_organization" {
  description = "The PlanetScale organization in which to make the DB."
  type        = string
}