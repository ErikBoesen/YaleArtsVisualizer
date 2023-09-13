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
