/*
 * variables.tf
 * Author: Evan Kirkiles
 * Created on: Wed Sep 13 2023
 * 2023 Yale SWE 
 */


variable "env" {
  description = "An env prefix to append to each resource created."
  type        = string
  default     = "dev"
}

/* ------------------------------- PlanetScale ------------------------------ */

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

variable "planetscale_db_username" {
  description = "A PlanetScale DB branch username (get this from the Web UI)."
  type        = string
  default     = "SET THIS IN .tfvars ONCE DB BRANCH IS CREATED"
  sensitive   = true
}

variable "planetscale_db_password" {
  description = "A PlanetScale DB branch password (get this from the Web UI)."
  type        = string
  default     = "SET THIS IN .tfvars ONCE DB BRANCH IS CREATED"
  sensitive   = true
}