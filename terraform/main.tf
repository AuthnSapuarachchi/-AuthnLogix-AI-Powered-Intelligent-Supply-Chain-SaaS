terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
  required_version = ">= 1.2.0"
}

# 1. We are building in US-East-1 (Virginia)
provider "aws" {
  region  = "us-east-1"
}

# 2. Create a Firewall (Security Group)
resource "aws_security_group" "web_sg" {
  name        = "authnlogix_firewall"
  description = "Allow Web and SSH"

  # Allow SSH (Login)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow HTTP (Website)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow backend API
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outgoing traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 3. Create the Server
resource "aws_instance" "app_server" {
  # Ubuntu 22.04 AMI (Free Tier)
  ami           = "ami-080e1f13689e07408" 
  instance_type = "t2.micro"
  
  # Attach the key you downloaded
  key_name      = "authnlogix-key"
  
  # Attach the firewall
  vpc_security_group_ids = [aws_security_group.web_sg.id]

  # 4. Auto-Install Docker Script
  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y ca-certificates curl gnupg
              sudo install -m 0755 -d /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
              sudo chmod a+r /etc/apt/keyrings/docker.gpg
              
              echo \
              "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
              "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
              sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
              
              sudo apt-get update -y
              sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
              sudo usermod -aG docker ubuntu
              EOF

  tags = {
    Name = "AuthnLogix-Production"
  }
}

output "public_ip" {
  value = aws_instance.app_server.public_ip
}