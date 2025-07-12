provider "google" {
  project     = var.gcp_project
  region      = var.gcp_region
  credentials = file("credentials.json")
}

resource "google_compute_network" "insecure_network" {
  name                    = "insecure-network"
  auto_create_subnetworks = true
}

resource "google_compute_firewall" "allow_all" {
  name    = "allow-all-ingress"
  network = google_compute_network.insecure_network.self_link

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }

  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_instance" "insecure_instance" {
  name         = "insecure-instance"
  machine_type = "e2-micro"
  zone         = var.gcp_zone

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-10"
    }
  }

  network_interface {
    network = google_compute_network.insecure_network.self_link
    access_config {}
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    echo "GCP_SECRET_KEY=ABCDEF123456" > /etc/secreto.txt
    chmod 644 /etc/secreto.txt
  EOF
}

resource "google_storage_bucket" "public_bucket" {
  name     = "juicyshop-vuln-public-gcp"
  location = var.gcp_region

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  uniform_bucket_level_access = false
  iam_binding {
    role = "roles/storage.objectViewer"
    members = ["allUsers"]
  }
}

variable "gcp_project" {
  type = string
}

variable "gcp_region" {
  type    = string
  default = "us-central1"
}

variable "gcp_zone" {
  type    = string
  default = "us-central1-a"
}
