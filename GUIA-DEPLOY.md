# 🚀 Guia de Deploy - Site ValePan

Este guia explica como substituir o site atual da ValePan (valepan.com) pelo novo site.

## 📋 Checklist Pré-Deploy

Antes de fazer o deploy, confira:

- [ ] Google Analytics ID configurado no `index.html` (linha 42)
- [ ] Todos os links de WhatsApp testados (5524999784591)
- [ ] Todas as imagens otimizadas
- [ ] Vídeos comprimidos (ou hospedados externamente)
- [ ] Meta tags de SEO revisadas
- [ ] Site testado em diferentes navegadores (Chrome, Firefox, Safari, Edge)
- [ ] Site testado em mobile
- [ ] Todos os links funcionando
- [ ] FAQ acordeão funcionando
- [ ] Menu mobile funcionando

## 🔧 Opção 1: Deploy via cPanel (Hospedagem Tradicional)

### Passo 1: Backup do Site Atual

1. Acesse o cPanel da sua hospedagem
2. Vá em **Gerenciador de Arquivos**
3. Navegue até `public_html` ou diretório do site
4. Selecione todos os arquivos
5. Clique em **Compactar** → escolha ZIP
6. Baixe o arquivo ZIP (backup de segurança)

### Passo 2: Upload dos Novos Arquivos

**Opção A: Via Gerenciador de Arquivos**

1. No cPanel, vá em **Gerenciador de Arquivos**
2. Navegue até `public_html`
3. **DELETE todos os arquivos antigos** (menos `.htaccess` se tiver configurações importantes)
4. Clique em **Upload**
5. Selecione todos os arquivos da pasta `site-valepan`:
   - index.html
   - styles.css
   - script.js
   - README.md
   - robots.txt
   - sitemap.xml
   - .htaccess
   - pasta `assets/` (completa)
6. Aguarde o upload completar

**Opção B: Via FTP (FileZilla)**

1. Baixe [FileZilla](https://filezilla-project.org/)
2. Conecte usando suas credenciais FTP:
   - Host: ftp.seudominio.com
   - Usuário: seu_usuario
   - Senha: sua_senha
   - Porta: 21
3. Navegue até `public_html` no servidor remoto
4. **DELETE todos os arquivos antigos**
5. Arraste todos os arquivos de `site-valepan` para o servidor
6. Aguarde a transferência completar

### Passo 3: Verificação

1. Acesse `https://valepan.com`
2. Teste todas as seções
3. Teste o menu mobile (redimensione o navegador)
4. Teste todos os CTAs de WhatsApp
5. Verifique o FAQ
6. Teste em diferentes dispositivos

### Passo 4: Configurações Finais

**SSL/HTTPS:**
- No cPanel → **SSL/TLS Status**
- Certifique-se que o certificado está ativo
- O `.htaccess` já força HTTPS automaticamente

**DNS/Domínio:**
- Se o domínio não apontar ainda, configure no painel da hospedagem
- Propagação DNS pode levar até 48h

## 🌐 Opção 2: Deploy via Vercel (Mais Simples)

### Vantagens:
- Deploy instantâneo
- HTTPS automático
- CDN global
- Gratuito
- Rollback fácil

### Passos:

1. **Criar conta Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Crie conta com GitHub, GitLab ou email

2. **Criar repositório Git (opcional mas recomendado):**
   ```bash
   cd site-valepan
   git init
   git add .
   git commit -m "Initial commit - ValePan website"
   ```
   
   - Crie repo no GitHub
   - Siga instruções para push:
   ```bash
   git remote add origin https://github.com/seu-usuario/valepan-site.git
   git push -u origin main
   ```

3. **Deploy no Vercel:**
   
   **Opção A: Via GitHub (Recomendado)**
   - No Vercel, clique em **New Project**
   - Importe o repositório do GitHub
   - Clique em **Deploy**
   - Pronto! URL gerada automaticamente

   **Opção B: Via CLI**
   ```bash
   npm i -g vercel
   cd site-valepan
   vercel
   ```
   - Siga as perguntas
   - Deploy feito!

4. **Configurar Domínio Personalizado:**
   - No dashboard do Vercel → **Domains**
   - Adicione `valepan.com`
   - Siga instruções para configurar DNS:
     - Tipo: A ou CNAME
     - Nome: @ ou www
     - Valor: fornecido pelo Vercel
   - Aguarde propagação (até 48h, geralmente minutos)

## 🔄 Opção 3: Deploy via Netlify

Similar ao Vercel:

1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta `site-valepan` para **Sites**
3. Ou conecte com GitHub
4. Configure domínio customizado nas settings
5. Pronto!

## 📱 Opção 4: Deploy Híbrido (Recomendado para Produção)

**Melhor dos dois mundos:**

1. **Site principal na Vercel/Netlify:**
   - Deploy rápido
   - CDN global
   - HTTPS automático
   - Atualizações fáceis

2. **Vídeos em CDN/Storage:**
   - Upload vídeos para:
     - Cloudinary (grátis até 25GB)
     - Vimeo
     - YouTube
     - AWS S3 + CloudFront
   - Atualizar URLs dos vídeos no `index.html`

**Vantagens:**
- Site super rápido
- Vídeos não sobrecarregam servidor
- Melhor performance global

## 🧪 Teste Antes de Substituir

### Ambiente de Staging

1. **Subdomínio de teste:**
   - Crie subdomínio: `novo.valepan.com` ou `staging.valepan.com`
   - Faça deploy lá primeiro
   - Teste extensivamente
   - Só depois substitua o principal

2. **Vercel Preview:**
   - Deploy automático gera URL de preview
   - Compartilhe com a equipe
   - Valide antes de produção

## 📊 Pós-Deploy

### 1. Google Analytics

- Acesse [analytics.google.com](https://analytics.google.com)
- Crie propriedade GA4
- Copie o ID (G-XXXXXXXXXX)
- Atualize no `index.html`
- Aguarde 24h para dados aparecerem

### 2. Google Search Console

- Acesse [search.google.com/search-console](https://search.google.com/search-console)
- Adicione propriedade `https://valepan.com`
- Verifique propriedade (via DNS, HTML file ou Analytics)
- Envie sitemap: `https://valepan.com/sitemap.xml`

### 3. Teste de Performance

Acesse e analise:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- Meta: Score acima de 90

### 4. Teste de SEO

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- Confirme que Schema markup está funcionando

### 5. Teste de Acessibilidade

- [WAVE](https://wave.webaim.org/)
- Corrija problemas críticos

## 🆘 Troubleshooting

### Site não aparece após deploy

1. Limpe cache do navegador (Ctrl+Shift+Del)
2. Teste em modo anônimo
3. Verifique DNS com [whatsmydns.net](https://whatsmydns.net)
4. Aguarde propagação DNS (até 48h)

### Vídeos não carregam

1. Verifique tamanho dos arquivos (limite 100MB na maioria dos hosts)
2. Considere hospedar em:
   - Vimeo (grátis até 500MB/semana)
   - YouTube (ilimitado)
   - Cloudinary (grátis até 25GB)
3. Use `poster` attribute para preview

### CSS/JS não aplicam

1. Verifique caminhos dos arquivos
2. Limpe cache do navegador
3. Faça hard reload (Ctrl+Shift+R)
4. Verifique se arquivos foram uploadados

### Formulários não funcionam

- Site atual só tem CTAs para WhatsApp
- Se adicionar formulário, precisa backend (Formspree, EmailJS, etc.)

### HTTPS não funciona

1. No cPanel → SSL/TLS → instalar certificado Let's Encrypt
2. Na Vercel/Netlify → automático
3. Force HTTPS no `.htaccess` (já configurado)

## 📞 Suporte Técnico

**Dúvidas com o site:**
- Verifique o README.md
- Consulte a documentação

**Problemas com hospedagem:**
- Contate suporte da hospedagem
- Forneça: domínio, cPanel user, descrição do problema

**Problemas com Vercel/Netlify:**
- Documentação oficial
- Support ticket no dashboard

## ✅ Checklist Final Pós-Deploy

- [ ] Site acessível em valepan.com
- [ ] HTTPS funcionando
- [ ] Todas as páginas carregando
- [ ] Todos os links funcionando
- [ ] CTAs de WhatsApp funcionando
- [ ] Menu mobile funcionando
- [ ] FAQ acordeão funcionando
- [ ] Site responsivo em mobile
- [ ] Performance acima de 85 (PageSpeed)
- [ ] Google Analytics tracking
- [ ] Search Console configurado
- [ ] Sitemap submetido
- [ ] robots.txt acessível
- [ ] Email/WhatsApp testados
- [ ] Backup do site antigo feito

---

## 🎉 Próximos Passos

Após o deploy bem-sucedido:

1. **Marketing:**
   - Anuncie novo site nas redes sociais
   - Envie email para clientes
   - Atualize materiais impressos

2. **Monitoramento:**
   - Acompanhe Analytics semanalmente
   - Monitore conversões (cliques no WhatsApp)
   - Ajuste conforme feedback

3. **Atualizações:**
   - Adicione novos produtos conforme necessário
   - Atualize fotos sazonalmente
   - Mantenha FAQ atualizado

4. **SEO Contínuo:**
   - Adicione blog (opcional)
   - Crie conteúdo sobre pães/hamburguerias
   - Construa backlinks

---

**Boa sorte com o deploy! 🚀**

Em caso de dúvidas, consulte a documentação ou entre em contato.

