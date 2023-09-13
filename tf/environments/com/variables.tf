/*
 * variables.tf
 * author: evan kirkiles
 * created on Thu Jan 05 2023
 * 2023 channel studio
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
}

variable "planetscale_service_token" {
  description = "The PlanetScale service token itself."
  type        = string
}

variable "planetscale_organization" {
  description = "The PlanetScale organization in which to make the DB."
  type        = string
}