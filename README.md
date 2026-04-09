# ValePan - Website Oficial

Landing page profissional da ValePan, fornecedora de pães premium para hamburguerias.

## Documentação

| Documento | Descrição |
|-----------|------------|
| [docs/site/GUIA-DEPLOY.md](docs/site/GUIA-DEPLOY.md) | Deploy (cPanel, Vercel, checklist) |
| [docs/site/OTIMIZACAO-MIDIA.md](docs/site/OTIMIZACAO-MIDIA.md) | Otimização de imagens e vídeo |
| [docs/site/README-SEO.md](docs/site/README-SEO.md) | Resumo SEO |
| [docs/site/CRIAR-OG-IMAGE.md](docs/site/CRIAR-OG-IMAGE.md) | Criar imagem Open Graph |
| [docs/site/CHANGELOG.md](docs/site/CHANGELOG.md) | Histórico de alterações |

## 🚀 Sobre o Site

Site moderno e responsivo desenvolvido para apresentar os produtos e serviços da ValePan, com foco em conversão através de CTAs direcionados para WhatsApp.

## ✨ Funcionalidades

- **Design Responsivo**: Otimizado para desktop, tablet e mobile
- **Navegação Suave**: Scroll suave entre seções com menu fixo
- **FAQ Interativo**: Acordeão com as principais dúvidas
- **CTAs Integrados**: Todos os botões direcionam para WhatsApp comercial
- **SEO Otimizado**: Meta tags completas e Schema markup
- **Performance**: Lazy loading de imagens e vídeos otimizados
- **Google Analytics**: Integração pronta para GA4

## 📋 Seções do Site

1. **Hero** - Vídeo de fundo + slogan + CTAs
2. **Nossa História** - Fundação, missão e valores
3. **Equipe** - Perfis dos sócios
4. **Por Que Escolher** - 4 pilares da empresa
5. **Qualidade** - Processos e padrões
6. **Produtos** - Linha completa de pães
7. **Depoimentos** - Feedback de clientes
8. **Clientes** - Logos de parceiros
9. **FAQ** - Perguntas frequentes
10. **Contato** - Informações e CTA para WhatsApp

## 🛠️ Tecnologias

- HTML5 semântico
- CSS (Tailwind via CDN + `assets/css/new-index.css`, `clientes-marquee.css`)
- JavaScript (Vanilla + `assets/js/new-index-unificado.js`, Three.js no hero)
- Google Fonts (Manrope, Material Symbols)
- Google Analytics 4

## 📱 Contatos Configurados

- **WhatsApp**: (24) 99978-4591
- **Email**: comercial@valepan.com
- **Instagram**: @valepan.oficial
- **Endereço**: Rua Luiz de Camões, nº 266, Alambari, Resende - RJ

## 🎨 Paleta de Cores

- **Vinho**: #4a0b16 (cor principal)
- **Dourado**: #c7a64d (destaque)
- **Tinta**: #111111 (texto)
- **Papel**: #ffffff (fundo)
- **Cinza**: #f4f4f5 (neutro)

## 🚀 Como Usar

### Desenvolvimento Local

1. Clone ou baixe os arquivos
2. Abra `index.html` em um navegador moderno
3. Ou use um servidor local:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js (http-server)
   npx http-server
   ```

### Deploy

#### Opção 1: Vercel (Recomendado)
1. Instale o Vercel CLI: `npm i -g vercel`
2. Na pasta do projeto: `vercel`
3. Siga as instruções

#### Opção 2: Netlify
1. Arraste a pasta para [netlify.com/drop](https://app.netlify.com/drop)
2. Site publicado instantaneamente

#### Opção 3: cPanel / FTP
1. Faça upload de todos os arquivos via FTP
2. Aponte o domínio para a pasta
3. Pronto!

## ⚙️ Configurações Importantes

### Google Analytics

Substitua `G-XXXXXXXXXX` no `index.html` (linha 42) pelo seu ID do GA4:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=SEU-ID-AQUI"></script>
<script>
  gtag('config', 'SEU-ID-AQUI');
</script>
```

### WhatsApp

Todos os links de WhatsApp estão configurados para: `5524999784591`

Para alterar, busque e substitua no `index.html`:
```
https://wa.me/5524999784591
```

### Meta Tags (SEO)

Atualize no `<head>` do `index.html`:
- Title tag (linha 6)
- Meta description (linha 7)
- Open Graph tags (linhas 11-15)

## 📂 Estrutura de Arquivos

```
valepan/
├── index.html           # Página principal (home unificada)
├── robots.txt
├── sitemap.xml
├── .htaccess
├── README.md            # Este arquivo
├── docs/site/           # Guias (deploy, SEO, mídia)
└── assets/
    ├── css/             # new-index.css, clientes-marquee.css
    ├── js/              # tailwind-config, analytics, new-index-unificado, hero-glsl-hills-unificado
    ├── data/            # Schema JSON (fonte / referência)
    ├── img/             # Imagens da landing (ex.: hero/, depoimentos/, produtos/)
    ├── logo/
    └── slides/          # Outros assets legados da apresentação (se existirem)
```

## 🔧 Personalização

### Adicionar Nova Seção

1. Adicione no `index.html`:
```html
<section class="section nova-secao" id="nova">
  <div class="container">
    <!-- conteúdo -->
  </div>
</section>
```

2. Adicione no menu (`header-nav`):
```html
<a href="#nova">Nova Seção</a>
```

3. Ajuste estilos em `assets/css/new-index.css` ou classes Tailwind no HTML

### Alterar Cores

Edite o tema em `assets/js/tailwind-config.js` e, se necessário, tokens em `assets/css/new-index.css`.

## 📊 Performance

- **Lazy Loading**: Imagens e vídeos carregam sob demanda
- **Intersection Observer**: Vídeos só tocam quando visíveis
- **CSS otimizado**: Sem frameworks desnecessários
- **JavaScript puro**: Sem dependências externas

## ♿ Acessibilidade

- Navegação por teclado funcional
- Atributos ARIA apropriados
- Contraste de cores adequado (WCAG AA)
- Suporte a `prefers-reduced-motion`
- Estrutura semântica HTML5

## 🐛 Troubleshooting

**Vídeos não carregam?**
- Verifique se os arquivos estão nos caminhos corretos
- Formatos suportados: MP4 (H.264)
- Considere hospedar vídeos no Vimeo/YouTube se forem muito grandes

**Menu mobile não abre?**
- Verifique o console do navegador; a home usa `assets/js/new-index-unificado.js`

**Smooth scroll não funciona?**
- Alguns navegadores antigos não suportam `scroll-behavior: smooth`
- O JavaScript faz fallback automático

## 📧 Suporte

Para dúvidas sobre o site, entre em contato:
- Email: comercial@valepan.com
- WhatsApp: (24) 99978-4591

---

**ValePan** — *Hambúrguer bom começa pelo pão* 🍔

© 2025 ValePan - Todos os direitos reservados
