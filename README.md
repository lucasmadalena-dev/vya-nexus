# VyaNexus - Guia de Deploy para Produção (Hostinger VPS)

Este documento detalha os passos necessários para realizar o deploy do VyaNexus em um ambiente de produção na Hostinger VPS (KVM).

## 1. Pré-requisitos na VPS

Certifique-se de que sua VPS Hostinger tenha os seguintes softwares instalados:

*   **Docker**
*   **Docker Compose**
*   **Git**
*   **Nginx** (para gerenciamento de certificados SSL e redirecionamento, embora o Nginx do Docker Compose possa ser usado como proxy interno)

## 2. Configuração do Repositório

1.  **Clone o repositório** para o diretório `/home/ubuntu/vya-nexus` na sua VPS:

    ```bash
    git clone https://github.com/lucasmadalena-dev/vya-nexus.git /home/ubuntu/vya-nexus
    ```

2.  **Navegue** para o diretório do projeto:

    ```bash
    cd /home/ubuntu/vya-nexus
    ```

## 3. Variáveis de Ambiente (`.env.production`)

Crie um arquivo `.env.production` na raiz do projeto (`/home/ubuntu/vya-nexus/.env.production`) com as suas credenciais de produção. Utilize o template abaixo e substitua os valores pelos seus dados reais:

```ini
# Variáveis de Ambiente para Produção

# Database
DATABASE_URL="mysql://user:password@mysql:3306/vyanexus"
MYSQL_ROOT_PASSWORD="your_mysql_root_password"
MYSQL_DATABASE="vyanexus"
MYSQL_USER="vyanexus_user"
MYSQL_PASSWORD="vyanexus_password"

# Asaas (Gateway de Pagamento)
ASAAS_API_KEY="your_asaas_production_api_key"

# AWS S3 (Armazenamento)
AWS_ACCESS_KEY_ID="your_aws_access_key_id"
AWS_SECRET_ACCESS_KEY="your_aws_secret_access_key"
AWS_S3_BUCKET="your_aws_s3_bucket_name"
AWS_REGION="your_aws_region" # Ex: us-east-1

# SMTP (Envio de E-mails)
SMTP_HOST="your_smtp_host"
SMTP_USER="your_smtp_user"
SMTP_PASS="your_smtp_password"

# NextAuth.js (Autenticação)
NEXTAUTH_SECRET="your_nextauth_secret"
JWT_SECRET="your_jwt_secret"
NEXTAUTH_URL="https://your_domain.com" # URL pública da sua aplicação

# Ambiente
NODE_ENV="production"
```

**Importante:** O `DATABASE_URL` deve apontar para o serviço `mysql` dentro da rede Docker, conforme configurado no `docker-compose.yml`.

## 4. Configuração do Nginx (Proxy Reverso)

O `docker-compose.yml` já inclui um serviço Nginx que atua como proxy reverso para a aplicação Next.js. Ele também está configurado para mapear o diretório `/var/www/vyanexus/tenants` da VPS para dentro do container, garantindo a persistência dos dados de provisionamento NVMe.

### Configuração de Domínio e SSL

1.  **Edite o arquivo `nginx/conf.d/vyanexus.conf`** para substituir `your_domain.com` pelo seu domínio real.

2.  **Para SSL (Let's Encrypt):** As linhas de configuração SSL estão comentadas no `nginx/conf.d/vyanexus.conf`. Após obter seus certificados Let's Encrypt (geralmente via `certbot`), você precisará:
    *   Descomentar as linhas `listen 443 ssl;`, `ssl_certificate`, `ssl_certificate_key`, `include` e `ssl_dhparam`.
    *   Atualizar os caminhos para os seus arquivos de certificado (`fullchain.pem` e `privkey.pem`).
    *   Mapear os volumes dos certificados Let's Encrypt para o container Nginx no `docker-compose.yml` (ex: `- /etc/letsencrypt:/etc/letsencrypt:ro`).

## 5. Executando o Deploy (`deploy.sh`)

O script `deploy.sh` automatiza o processo de pull, build e inicialização dos containers Docker.

1.  **Conceda permissões de execução** ao script:

    ```bash
    chmod +x deploy.sh
    ```

2.  **Execute o script de deploy:**

    ```bash
    ./deploy.sh
    ```

Este script irá:
*   Navegar para o diretório do projeto.
*   Garantir que o diretório `/var/www/vyanexus/tenants` exista e tenha as permissões corretas.
*   Realizar um `git pull origin main` para obter as últimas atualizações.
*   Construir as imagens Docker.
*   Iniciar os serviços definidos no `docker-compose.yml` em modo detached (`-d`).

## 6. Verificação Pós-Deploy

Após a execução do script, verifique o status dos containers:

```bash
docker ps
```

Você deve ver os containers `vyanexus_app`, `vyanexus_nginx` e `vyanexus_mysql` em execução.

## Restrição de Segurança (Hostinger VPS)

**ATENÇÃO:** Este deploy é contido e isolado. O script `deploy.sh` e as configurações Docker **NÃO** interagem ou modificam quaisquer recursos fora do escopo do diretório `/home/ubuntu/vyanexus` e do volume `/var/www/vyanexus/tenants`. **É proibido qualquer script que tente listar ou alterar recursos que não pertençam ao novo IP do VyaNexus.**

---

**Desenvolvido por Manus AI**
