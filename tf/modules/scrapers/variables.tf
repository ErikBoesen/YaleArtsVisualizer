/*
 * variables.tf
 * Author: Evan Kirkiles
 * Created on: Wed Sep 13 2023
 * 2023 Yale SWE 
 */

variable "env" {
  description = "An env prefix to append to each resource created."
  type        = string
}

variable "planetscale_db_name" {
  description = "The name of the PlanetScale database."
  type        = string
  default     = "yav-com-db"
}

variable "planetscale_db_username" {
  description = "A PlanetScale DB branch username (get this from the Web UI)."
  type        = string
  sensitive   = true
}

variable "planetscale_db_password" {
  description = "A PlanetScale DB branch password (get this from the Web UI)."
  type        = string
  sensitive   = true
}