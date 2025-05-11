provider "kubernetes" {
  # Point at your local kubeconfig (kind / Minikube / Docker-Desktop)
  config_path    = pathexpand("~/.kube/config")
  # If you have multiple contexts, pin one here:
  # config_context = "docker-desktop"
}