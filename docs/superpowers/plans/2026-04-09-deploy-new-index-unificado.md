# Deploy `new-index-unificado` como `index.html` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Colocar em produção a página unificada (`new-index-unificado.html`) como página principal do domínio, substituindo o `index.html` atual, preservando SEO, analytics, schema e checklist de deploy; alinhar `sitemap.xml`, `robots.txt`, `.htaccess` e documentação.

**Architecture:** O site continua estático (HTML + CSS + JS). A nova home usa Tailwind via CDN, `assets/css/new-index.css`, `assets/css/clientes-marquee.css`, `assets/js/tailwind-config.js`, `assets/js/new-index-unificado.js`, Three.js em `unpkg` e `assets/js/hero-glsl-hills-unificado.js` — todos precisam estar no pacote de deploy. O `index.html` legado usa `styles.css` + `script.js`; após a troca, a home não referencia mais esses arquivos (podem permanecer no repositório para referência ou serem removidos se não houver outras páginas).

**Tech Stack:** HTML5, CSS, JavaScript (Vanilla), Tailwind CDN, three@0.160.0 (unpkg), Google Analytics 4 (gtag), JSON-LD (Schema.org), Apache `.htaccess` (hospedagem tradicional).

---

## Mapa de arquivos

| Arquivo | Responsabilidade |
|---------|------------------|
| `index.html` | **Substituir** pelo conteúdo de `new-index-unificado.html` com ajustes obrigatórios (canonical, `poster` do vídeo, GA ID, JSON-LD opcional inline). |
| `new-index-unificado.html` | Após deploy estável: **remover** do servidor público ou deixar apenas redirecionamento 301 para `/` (evitar conteúdo duplicado). |
| `assets/js/analytics.js` | Configuração `gtag`; deve usar o **mesmo** ID GA4 que o `index.html` carrega no script async. |
| `assets/data/schema-foodestablishment.json` | Fonte do schema FoodEstablishment; hoje referenciado via `<script src>` no HTML (ver Task JSON-LD). |
| `assets/data/schema-faq.json` | Fonte do FAQ; conteúdo alinhado ao FAQ visível na página (5 perguntas). |
| `assets/js/new-index-unificado.js` | Comportamento da página (catálogo, FAQ, tema, etc.). |
| `assets/js/hero-glsl-hills-unificado.js` | WebGL hero. |
| `assets/js/tailwind-config.js` | Tema Tailwind. |
| `assets/css/new-index.css`, `assets/css/clientes-marquee.css` | Estilos da nova home. |
| `sitemap.xml` | Atualizar `lastmod` e âncoras para refletir a nova estrutura (sem `#qualidade`). |
| `robots.txt` | Revisão leve; manter `Sitemap` e `Disallow: /media/` se a pasta existir no servidor. |
| `.htaccess` | HTTPS + opcional 301 `new-index-unificado.html` → `/`. |
| `GUIA-DEPLOY.md` | Atualizar lista de arquivos e referências (linha do GA em `analytics.js`, não só `index.html`). |

---

### Task 1: Backup do `index.html` atual

**Files:**
- Modify: `index.html` (será substituído)
- Create: `index.html.legacy-backup` (ou branch git antes da troca)

- [ ] **Step 1: Garantir backup versionado**

```bash
git status
git add index.html
git commit -m "chore: snapshot index.html legado antes da troca pela home unificada"
```

Se o commit não for desejável, copiar manualmente:

```powershell
Copy-Item -Path "c:\Users\victo\git\valepan\index.html" -Destination "c:\Users\victo\git\valepan\index.html.legacy-backup"
```

- [ ] **Step 2: Run (não há teste automatizado)**

**Expected:** Arquivo legado preservado ou commit criado.

---

### Task 2: Gerar `index.html` a partir de `new-index-unificado.html`

**Files:**
- Modify: `index.html` (conteúdo base = `new-index-unificado.html`)
- Reference: `new-index-unificado.html`
- Test: abrir `index.html` no navegador local (servidor HTTP local)

- [ ] **Step 1: Copiar conteúdo**

Copiar o conteúdo completo de `new-index-unificado.html` para `index.html` (substituir o arquivo).

- [ ] **Step 2: Corrigir canonical (obrigatório)**

No `<head>`, alterar:

```html
<link rel="canonical" href="https://valepan.com/new-index-unificado.html">
```

para:

```html
<link rel="canonical" href="https://valepan.com/">
```

- [ ] **Step 3: Alinhar meta `og:url` e Twitter (consistência)**

Confirmar que permanecem:

```html
<meta property="og:url" content="https://valepan.com/">
<meta property="twitter:url" content="https://valepan.com/">
```

- [ ] **Step 4: Run servidor local**

```powershell
cd c:\Users\victo\git\valepan
python -m http.server 8080
```

Abrir `http://localhost:8080/index.html` e verificar hero, marquee, FAQ, WhatsApp.

**Expected:** Página carrega sem 404 de CSS/JS; console sem erros críticos.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: substituir index.html pela home unificada (base new-index-unificado)"
```

---

### Task 3: SEO — `poster` do vídeo hero (paridade com `index.html` legado)

**Files:**
- Modify: `index.html` (seção `<video>` do hero)

- [ ] **Step 1: Adicionar atributo `poster`**

No `<video>` do hero (aprox. linha do primeiro `<video>` após `#inicio`), de:

```html
<video class="absolute inset-0 z-0 h-full w-full object-cover" autoplay muted loop playsinline preload="auto" aria-hidden="true">
```

para:

```html
<video class="absolute inset-0 z-0 h-full w-full object-cover" autoplay muted loop playsinline preload="auto" poster="assets/img/hero/hero-bg.webp" aria-hidden="true">
```

- [ ] **Step 2: Run**

Confirmar no deploy que o arquivo `assets/img/hero/hero-bg.webp` existe no servidor. Se não existir, gerar frame estático conforme `docs/site/OTIMIZACAO-MIDIA.md` e fazer upload.

**Expected:** Primeiro paint do hero sem “flash” preto; Lighthouse não acusa vídeo sem poster (avaliação).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "fix(seo): poster no vídeo hero para primeira pintura e paridade com legado"
```

---

### Task 4: Google Analytics 4 — ID real em dois pontos

**Files:**
- Modify: `index.html` (script async gtag)
- Modify: `assets/js/analytics.js`

O `index.html` legado carregava GA inline; a nova home usa:

- `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX` (async)
- `assets/js/analytics.js` com `gtag("config", "G-XXXXXXXXXX")`

Substituir `G-XXXXXXXXXX` pelo **mesmo** ID GA4 nos dois arquivos.

- [ ] **Step 1: Editar `index.html`**

Localizar:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

Substituir `G-XXXXXXXXXX` pelo ID real (ex.: `G-ABC123XYZ4`).

- [ ] **Step 2: Editar `assets/js/analytics.js`**

Arquivo atual:

```javascript
/**
 * Google Analytics 4 (gtag) — substitua G-XXXXXXXXXX pelo ID real.
 */
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-XXXXXXXXXX");
```

Substituir o placeholder pelo **mesmo** ID do passo 1.

- [ ] **Step 3: Run (verificação pós-deploy)**

No Google Analytics → Relatórios em tempo real; abrir o site e confirmar visita.

**Expected:** Um único ID em ambos; sem duplicar propriedades diferentes.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/js/analytics.js
git commit -m "chore: configurar Google Analytics 4 na home unificada"
```

---

### Task 5: JSON-LD — inline vs `<script src>` (paridade e Rich Results)

**Contexto:** O `index.html` legado tinha JSON-LD **inline**. A nova página usa:

```html
<script type="application/ld+json" src="assets/data/schema-foodestablishment.json"></script>
<script type="application/ld+json" src="assets/data/schema-faq.json"></script>
```

O Google costuma indexar JSON-LD inline de forma previsível; `src` em `type="application/ld+json"` é menos documentado. **Recomendação:** passar a **inline** usando exatamente o conteúdo dos arquivos abaixo.

**Files:**
- Modify: `index.html` (substituir os dois `<script>` por blocos inline)
- Reference: `assets/data/schema-foodestablishment.json`, `assets/data/schema-faq.json` (manter como fonte única no repo)

- [ ] **Step 1: Substituir no `<head>` os dois scripts por:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "name": "ValePan",
  "description": "Pães Premium para Hamburguerias",
  "url": "https://valepan.com",
  "telephone": "+5524999784591",
  "email": "comercial@valepan.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Luiz de Camões, nº 266",
    "addressLocality": "Resende",
    "addressRegion": "RJ",
    "addressCountry": "BR"
  },
  "foundingDate": "1991",
  "sameAs": [
    "https://instagram.com/valepan.oficial"
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Qual a validade dos pães?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "21 dias em temperatura ambiente. 90 dias congelado + 5 dias após descongelar."
      }
    },
    {
      "@type": "Question",
      "name": "Como é a entrega de caminhão?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Carga batida (sem paletizar)."
      }
    },
    {
      "@type": "Question",
      "name": "Como é a paletização?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No pallet, cada andar com 6 caixas — total de 42 a 48 caixas por pallet."
      }
    },
    {
      "@type": "Question",
      "name": "Quantas unidades vêm em cada caixa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No geral, a caixa possui 48 pães; na gramatura 50 g vêm 60 unidades."
      }
    },
    {
      "@type": "Question",
      "name": "Qual o prazo de entrega (lead time)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Para distribuidoras: 2 dias úteis. Para hamburgueria: depende da sua região — consulte o comercial."
      }
    }
  ]
}
</script>
```

- [ ] **Step 2: Run**

Abrir [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results) com URL de staging ou HTML publicado.

**Expected:** FAQ e FoodEstablishment detectados sem erro.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "fix(seo): JSON-LD inline FoodEstablishment + FAQPage na home"
```

**Nota:** Quando alterar FAQ no HTML, atualizar também `assets/data/schema-faq.json` e o bloco inline (ou voltar a gerar a partir do JSON).

---

### Task 6: Atualizar `sitemap.xml`

**Contexto:** O sitemap antigo referencia `#qualidade`, que **não existe** na nova página. A nova navegação inclui `#logistica`, `#depoimentos`, `#problema` além de `#sobre`, `#produtos`, `#faq`, `#contato`.

**Files:**
- Modify: `sitemap.xml`

- [ ] **Step 1: Substituir o conteúdo de `sitemap.xml` por:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://valepan.com/</loc>
    <lastmod>2026-04-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://valepan.com/#inicio</loc>
    <lastmod>2026-04-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://valepan.com/#problema</loc>
    <lastmod>2026-04-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://valepan.com/#sobre</loc>
    <lastmod>2026-04-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://valepan.com/#produtos</loc>
    <lastmod>2026-04-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://valepan.com/#logistica</loc>
    <lastmod>2026-04-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://valepan.com/#depoimentos</loc>
    <lastmod>2026-04-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://valepan.com/#faq</loc>
    <lastmod>2026-04-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://valepan.com/#contato</loc>
    <lastmod>2026-04-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

- [ ] **Step 2: Run**

Validar XML em [https://www.xml-sitemaps.com/validate-xml-sitemap.html](https://www.xml-sitemaps.com/validate-xml-sitemap.html) (ou equivalente).

**Expected:** XML bem formado.

- [ ] **Step 3: Commit**

```bash
git add sitemap.xml
git commit -m "fix(seo): atualizar sitemap para âncoras da home unificada e lastmod 2026-04-09"
```

---

### Task 7: Revisar `robots.txt`

**Files:**
- Modify: `robots.txt` (opcional)

**Análise:**

- `User-agent: *` + `Allow: /` + `Disallow: /media/` — **manter** se a pasta `media/` existir no servidor e não deve ser indexada.
- `Crawl-delay: 0` — o Google ignora `Crawl-delay`; Bing pode considerar. Não é obrigatório remover.
- Não é necessário `Disallow` para `new-index-unificado.html` se o arquivo for **removido** do servidor após o deploy.

- [ ] **Step 1: Decisão**

Se o deploy não incluir `new-index-unificado.html`, não há o que bloquear.

- [ ] **Step 2: (Opcional) comentário no topo do arquivo**

Para documentação humana apenas:

```txt
# ValePan - Robots.txt
# Nota: Crawl-delay não é honrado pelo Googlebot.
```

- [ ] **Step 3: Commit** (somente se alterou)

```bash
git add robots.txt
git commit -m "docs: nota sobre Crawl-delay em robots.txt"
```

---

### Task 8: Redirecionamento 301 em `.htaccess`

**Objetivo:** Quem acessar `https://valepan.com/new-index-unificado.html` (se já indexado ou linkado) vai para `/`.

**Files:**
- Modify: `.htaccess`

- [ ] **Step 1: Dentro de `<IfModule mod_rewrite.c>`, após `RewriteEngine On`, adicionar:**

```apache
    # Home unificada antiga → raiz
    RewriteRule ^new-index-unificado\.html$ / [L,R=301]
```

- [ ] **Step 2: Run**

Após deploy, `curl -I https://valepan.com/new-index-unificado.html` deve retornar `301` e `Location: https://valepan.com/`.

**Expected:** Redirecionamento 301.

- [ ] **Step 3: Commit**

```bash
git add .htaccess
git commit -m "feat(seo): redirect 301 new-index-unificado.html para /"
```

---

### Task 9: Atualizar `GUIA-DEPLOY.md` (lista de arquivos)

**Files:**
- Modify: `GUIA-DEPLOY.md`

- [ ] **Step 1: Na seção de upload (Opção A), substituir a lista de arquivos obrigatórios por uma lista que inclua:**

- `index.html` (nova home unificada)
- `robots.txt`, `sitemap.xml`, `.htaccess`
- `assets/` completo (incluindo `assets/css/new-index.css`, `assets/css/clientes-marquee.css`, `assets/js/tailwind-config.js`, `assets/js/analytics.js`, `assets/js/new-index-unificado.js`, `assets/js/hero-glsl-hills-unificado.js`, `assets/data/*.json`, imagens, vídeos, logos)
- `styles.css` e `script.js` — **opcionais** se nenhuma outra página depender deles

- [ ] **Step 2: Atualizar checklist “Google Analytics ID”**

De “linha 42 do `index.html`” para: “`assets/js/analytics.js` e o `<script async ... gtag/js?id=` no `index.html` — mesmo ID.”

- [ ] **Step 3: Commit**

```bash
git add GUIA-DEPLOY.md
git commit -m "docs: alinhar GUIA-DEPLOY à home unificada e dependências"
```

---

### Task 10: Checklist de mídia e performance (`OTIMIZACAO-MIDIA.md`)

**Files:**
- (Nenhum obrigatório se já otimizado)

- [ ] **Step 1: Rodar inventário de pesos (PowerShell)**

```powershell
Get-ChildItem -Path "c:\Users\victo\git\valepan\assets" -Recurse -Include *.jpg,*.jpeg,*.png,*.webp,*.mp4 | Where-Object { $_.Length -gt 200KB } | Select-Object FullName, @{Name="KB";Expression={[math]::Round($_.Length/1KB,2)}}
```

- [ ] **Step 2: Para cada arquivo > 200KB**, aplicar compressão conforme `OTIMIZACAO-MIDIA.md`.

- [ ] **Step 3: Run PageSpeed**

[https://pagespeed.web.dev/](https://pagespeed.web.dev/) na URL de produção.

**Expected:** Meta do guia: score ≥ 85 (ajustar expectativa se vídeo grande).

---

### Task 11: QA funcional e SEO (pré-produção)

- [ ] **Step 1: Links WhatsApp** — todos com `5524999784591` e mensagens coerentes.

- [ ] **Step 2: FAQ** — abrir/fechar `<details>` (5 itens).

- [ ] **Step 3: Menu mobile** — o botão hamburger está com `aria-label="Menu (em breve)"`; se não houver menu lateral implementado, tratar como débito conhecido ou implementar em tarefa separada.

- [ ] **Step 4: Tema claro/escuro** — botões no rodapé.

- [ ] **Step 5: Imagem Open Graph** — `README-SEO.md` / `CRIAR-OG-IMAGE.md`: confirmar `https://valepan.com/assets/logo/og-image.png` acessível (1200×630).

- [ ] **Step 6: Commit final** (se ajustes)

```bash
git add -A
git commit -m "chore: QA pré-deploy home unificada"
```

---

### Task 12: Remover ou arquivar `new-index-unificado.html` no servidor

**Files:**
- Delete: `new-index-unificado.html` (no deploy público) **ou** manter apenas com 301 (Task 8)

- [ ] **Step 1:** Após validar `index.html` em produção, não publicar duas URLs com o mesmo conteúdo.

- [ ] **Step 2: Commit (opcional no repo)**

```bash
git rm new-index-unificado.html
git commit -m "chore: remover new-index-unificado.html após virar index.html"
```

**Alternativa:** manter só no Git como referência e não enviar ao FTP.

---

## Cobertura da spec (self-review)

| Requisito | Task |
|-----------|------|
| Substituir `index.html` pela nova versão | Task 2 |
| Canonical e URLs sociais | Task 2 |
| Paridade SEO com legado (meta, geo, OG, Twitter) | Task 2 + Task 5 |
| GA4 | Task 4 |
| Sitemap alinhado às âncoras | Task 6 |
| robots.txt | Task 7 |
| Deploy sem URL duplicada | Task 8 + Task 12 |
| Mídia / performance | Task 3 + Task 10 |
| Documentação deploy | Task 9 |
| OG image | Task 11 |

**Placeholder scan:** Nenhum `TBD`; IDs GA devem ser substituídos por valores reais na execução.

**Consistência:** `schema-faq.json` e FAQ em HTML já coincidem; após Task 5, manter JSON e inline sincronizados em alterações futuras.

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-09-deploy-new-index-unificado.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — Dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
