variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "EKS cluster name"
  default     = "booking-system-cluster"
}

variable "node_instance_type" {
  description = "Instance type for worker nodes"
  default     = "t3.medium"
}

variable "desired_capacity" {
  description = "Desired node count"
  default     = 2
}

variable "max_capacity" {
  description = "Max node count"
  default     = 3
}

variable "min_capacity" {
  description = "Min node count"
  default     = 1
}
