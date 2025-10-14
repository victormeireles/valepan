# ValePan - Website Oficial

Landing page profissional da ValePan, fornecedora de pães premium para hamburguerias.

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
- CSS3 (Grid, Flexbox, Custom Properties, Animations)
- JavaScript Vanilla (ES6+)
- Google Fonts (Bebas Neue, Inter)
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
site-valepan/
├── index.html           # Página principal
├── styles.css           # Estilos
├── script.js            # JavaScript
├── README.md            # Este arquivo
└── assets/
    ├── logo/
    │   ├── valepan-logo.svg
    │   └── valepan-logo-full.svg
    └── slides/
        ├── 01-abertura/
        ├── 02-quem-somos/
        ├── 03-essencia/
        ├── 04-produtos/
        └── 06-encerramento/
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

3. Adicione estilos no `styles.css`

### Alterar Cores

Edite as variáveis CSS no `styles.css` (linhas 6-11):

```css
:root {
  --wine: #4a0b16;      /* Cor principal */
  --gold: #c7a64d;      /* Destaque */
  --ink: #111111;       /* Texto */
  --paper: #ffffff;     /* Fundo */
  --gray: #f4f4f5;      /* Neutro */
}
```

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
- Verifique se o `script.js` está carregando
- Confira o console do navegador para erros

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
