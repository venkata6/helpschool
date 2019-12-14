resource "google_container_cluster" "gke-cluster" {
  name               = "helpschool-gke-cluster"
  network            = "default"
  zone               = "us-east1"
  initial_node_count = 1
}