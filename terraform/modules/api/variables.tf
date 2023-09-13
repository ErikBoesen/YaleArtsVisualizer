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

variable "planetscale_database_name" {
  description = "The name of the PlanetScale database to branch from."
  type        = string
}

variable "planetscale_organization" {
  description = "The PlanetScale organization in which the DB exists.."
  type        = string
}

