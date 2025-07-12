provider "aws" {
  region     = var.aws_region
  access_key = "AKIA************"
  secret_key = "abcd1234secret"
}

resource "aws_security_group" "insecure_sg" {
  name        = "insecure_sg"
  description = "Grupo de seguridad abierto"

  ingress {
    description = "Todo el tráfico entrante"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_s3_bucket" "public_bucket" {
  bucket        = "juicyshop-vuln-public-bucket-demo"
  acl           = "public-read"
  force_destroy = true
}

resource "aws_s3_bucket_policy" "public_policy" {
  bucket = aws_s3_bucket.public_bucket.id

  policy = <<EOT
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::${aws_s3_bucket.public_bucket.id}/*"]
    }
  ]
}
EOT
}

resource "aws_iam_user" "admin_user" {
  name = "admin-juicyshop"
}

resource "aws_iam_user_policy_attachment" "admin_attach" {
  user       = aws_iam_user.admin_user.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

resource "aws_db_instance" "insecure_rds" {
  allocated_storage    = 20
  engine               = "mysql"
  engine_version       = "5.6"
  instance_class       = "db.t2.micro"
  name                 = "juicydb"
  username             = "root"
  password             = "password123"
  parameter_group_name = "default.mysql5.6"
  skip_final_snapshot  = true
  publicly_accessible  = true
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}
