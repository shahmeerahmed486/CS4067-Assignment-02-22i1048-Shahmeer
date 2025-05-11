// 1️⃣ Create the namespace first
resource "kubernetes_manifest" "namespace" {
  # parse the YAML into a map for Terraform
  manifest = yamldecode(
    file("${path.module}/../../k8s/namespace.yaml")
  )
}

// 2️⃣ Collect all other single-resource YAML files
locals {
  other_manifests = [
    for f in fileset("${path.module}/../../k8s", "*.yaml") :
    f if (f != "namespace.yaml" && f != "kustomization.yaml")
  ]
}

// 3️⃣ Apply each remaining manifest; ensure each file contains exactly one resource
resource "kubernetes_manifest" "all_other" {
  for_each = toset(local.other_manifests)

  manifest = yamldecode(
    file("${path.module}/../../k8s/${each.key}")
  )

  depends_on = [
    kubernetes_manifest.namespace
  ]
}