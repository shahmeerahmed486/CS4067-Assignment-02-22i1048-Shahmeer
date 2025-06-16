terraform {
  required_providers {
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = ">= 1.14.0"
    }
  }
}

provider "kubectl" {
  config_path = "~/.kube/config"
}

resource "kubectl_manifest" "all" {
  yaml_body = file("${path.module}/../kubernetes-all-in-one.yaml")
}
