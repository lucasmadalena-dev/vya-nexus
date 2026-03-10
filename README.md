# VyaNexus Ecosystem - Produção 🚀

**VyaNexus** é uma solução unificada de infraestrutura digital focada em **Hosting NVMe + S3 Storage**, projetada para oferecer alta performance e escalabilidade para empresas e usuários finais.

Este repositório contém a versão de **Produção** do ecossistema, otimizada para deploy em ambientes Cloud e VPS.

---

## 🏗️ Arquitetura e Engenharia

A arquitetura do VyaNexus foi concebida com foco em isolamento de recursos e eficiência operacional:

*   **Multi-tenancy Nativo:** Isolamento no nível do sistema de arquivos através de diretórios específicos para cada tenant (`/var/www/vyanexus/tenants`).
*   **Performance NVMe:** Otimizado para discos de estado sólido de ultra velocidade.
*   **Zero Egress Storage:** Integração eficiente com S3 para armazenamento persistente.
*   **Isolamento via Containers:** Utilização de Docker e Nginx Proxy Manager para orquestração segura.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| **Frontend/Backend** | Next.js (App Router), TypeScript |
| **Banco de Dados** | PostgreSQL / MySQL |
| **Infraestrutura** | Docker, Nginx Proxy, VPS (Linux) |
| **Pagamentos** | Asaas, Stripe |

---

> **Nota de Senioridade:** Este projeto reflete a transição de algoritmos puros para arquiteturas de nuvem complexas, focando em segurança, escalabilidade e viabilidade financeira.


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

