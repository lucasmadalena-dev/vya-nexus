#!/bin/bash

# Script de One-Click Deploy para VyaNexus na Hostinger VPS
# Este script automatiza o pull do repositório, build da imagem Docker e inicialização dos serviços.

# --- Configurações --- 
REPO_DIR="/home/ubuntu/vya-nexus"
TENANTS_DIR="/var/www/vyanexus/tenants"

# --- Funções Auxiliares ---
log_info() {
  echo "[INFO] $1"
}

log_error() {
  echo "[ERROR] $1"
  exit 1
}

# --- Início do Deploy ---
log_info "Iniciando o processo de deploy do VyaNexus..."

# 1. Navegar para o diretório do repositório
log_info "Navegando para o diretório do repositório: $REPO_DIR"
cd "$REPO_DIR" || log_error "Falha ao navegar para o diretório do repositório. Verifique se o caminho está correto."

# 2. Garantir que o diretório de tenants exista e tenha permissões corretas
log_info "Verificando e criando o diretório de tenants: $TENANTS_DIR"
sudo mkdir -p "$TENANTS_DIR" || log_error "Falha ao criar o diretório de tenants."
sudo chown -R www-data:www-data "$TENANTS_DIR" || log_error "Falha ao definir permissões para o diretório de tenants."
sudo chmod -R 755 "$TENANTS_DIR" || log_error "Falha ao definir permissões para o diretório de tenants."

# 3. Atualizar o código-fonte via Git
log_info "Atualizando o código-fonte via Git pull..."
git pull origin main || log_error "Falha ao executar git pull. Verifique sua conexão e permissões."

# 4. Construir e iniciar os serviços Docker
log_info "Construindo e iniciando os serviços Docker com docker-compose..."
sudo docker-compose build || log_error "Falha ao construir as imagens Docker."
sudo docker-compose up -d || log_error "Falha ao iniciar os serviços Docker."

log_info "Deploy do VyaNexus concluído com sucesso!"
log_info "A aplicação deve estar acessível via Nginx na porta 80/443."
