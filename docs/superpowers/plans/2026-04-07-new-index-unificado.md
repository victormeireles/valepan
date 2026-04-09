# new-index-unificado.html Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir as duas árvores DOM (`lg:hidden` mobile + `hidden lg:block` desktop) em `new-index.html` por um único fluxo responsivo em **`new-index-unificado.html`**, preservando `new-index.html` intacto.

**Architecture:** Uma `<main>` com seções únicas; IDs de âncora sem prefixo `m-`/`d-` (ex.: `#inicio`, `#sobre`). Tailwind com breakpoints (`sm:`, `md:`, `lg:`) e utilitários `max-w-*` / `px-*` para colapsar layout mobile-first para desktop. Um único `<video>` hero, um único `<canvas id="hero-gl-canvas">`. Scripts dedicados **`assets/js/new-index-unificado.js`** e **`assets/js/hero-glsl-hills-unificado.js`** para não quebrar a página legada.

**Tech Stack:** HTML estático, Tailwind CDN (`tailwind-config.js` existente), `assets/css/new-index.css`, `assets/css/clientes-marquee.css`, Three.js (mesma versão que `new-index.html`).

---

## Mapa de arquivos

| Arquivo | Responsabilidade |
|---------|------------------|
| `new-index.html` | **Somente leitura** — referência; não editar. |
| `new-index-unificado.html` | Novo documento; `<head>` espelhado com ajustes de `canonical`, comentário de assets e tags `<script>` finais apontando para JS unificado. |
| `assets/js/new-index-unificado.js` | Formulário `#lead-form`; scroll da navbar única `#site-nav` contra `#inicio`. |
| `assets/js/hero-glsl-hills-unificado.js` | Uma instância WebGL em `#hero-gl-canvas`; resize em `matchMedia('(min-width: 1024px)')` apenas para `resize()`/re-init se necessário (ver Task final GL). |

**Estratégia editorial:** O mobile atual tem textos/FAQ simplificados e não acessíveis. A versão unificada deve usar **o conteúdo da árvore desktop** como fonte canônica (copy, FAQ com `<details>`, grids), estilizado de forma **mobile-first** (padding menor, tipografia escalonada). Onde o mobile tinha uma ideia única útil (ex.: `min-h-[max(884px,100dvh)]` no wrapper), reintroduzir via classes responsivas no container da página.

---

### Task 0: Scaffold do documento

**Files:**
- Create: `new-index-unificado.html`
- Reference: `new-index.html:1-45` (head), `new-index.html:823-827` (scripts — substituir nomes)

- [ ] **Step 1: Copiar `<head>`**

Copiar linhas 1–45 de `new-index.html` para o novo arquivo. Alterações obrigatórias:

```html
<link rel="canonical" href="https://valepan.com/new-index-unificado.html">
```

No comentário de assets (linha ~31), acrescentar: `new-index-unificado.js`, `hero-glsl-hills-unificado.js`.

- [ ] **Step 2: Abrir `<body>` com wrapper único**

Substituir o par `<div class="lg:hidden">` + `<div class="hidden lg:block">` por um único wrapper, por exemplo:

```html
<body class="bg-surface text-on-surface antialiased overflow-x-hidden">
<div class="mx-auto w-full lg:max-w-none min-h-[100dvh] lg:min-h-0">
```

(Fine-tune: em `lg` o desktop original não usava `max-w-lg`; o mobile usava `max-w-lg` — aplicar `max-w-lg mx-auto shadow-2xl lg:max-w-none lg:mx-0 lg:shadow-none` se quiser preservar o “cartão” só no mobile.)

- [ ] **Step 3: Placeholder de fechamento**

Incluir `</div></body></html>` apenas após todas as seções na Task final; por ora deixar `main` aberto após a nav.

- [ ] **Step 4: Commit**

```bash
git add new-index-unificado.html
git commit -m "chore: scaffold new-index-unificado.html head and body wrapper"
```

---

### Task 1: Navegação unificada

**Files:**
- Modify: `new-index-unificado.html` (após abertura do wrapper)

- [ ] **Step 1: Unificar header**

Remover `#site-nav-mobile` e `#site-nav-desktop`. Um único elemento:

```html
<header id="site-nav" class="fixed top-0 left-0 right-0 z-50 w-full bg-[#fff8f7]/18 backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-200 dark:bg-[#230004]/22 supports-[backdrop-filter]:bg-[#fff8f7]/12 supports-[backdrop-filter]:dark:bg-[#230004]/16">
  <div class="mx-auto flex max-w-lg items-center justify-between px-6 py-4 lg:max-w-[1440px] lg:px-8 lg:py-6">
    <a href="#inicio" class="flex items-center gap-2 text-xl font-extrabold uppercase tracking-tighter text-[#230004] dark:text-[#fff8f7] lg:text-2xl lg:font-black lg:normal-case lg:tracking-tighter lg:text-[#230004] lg:dark:text-[#775a00]">
      <img src="assets/logo/valepan-logo.svg" alt="" width="32" height="32" decoding="async" class="lg:h-9 lg:w-9">
      <span>ValePan</span>
    </a>
    <nav class="hidden md:flex items-center gap-8" aria-label="Principal">
      <a class="font-['Manrope'] font-bold text-sm tracking-tight uppercase text-[#230004]/80 dark:text-[#fff8f7]/80 hover:text-[#775a00] transition-colors duration-300" href="#inicio">Início</a>
      <a class="font-['Manrope'] font-bold text-sm tracking-tight uppercase text-[#230004]/80 dark:text-[#fff8f7]/80 hover:text-[#775a00] transition-colors duration-300" href="#sobre">Sobre</a>
      <a class="font-['Manrope'] font-bold text-sm tracking-tight uppercase text-[#230004]/80 dark:text-[#fff8f7]/80 hover:text-[#775a00] transition-colors duration-300" href="#produtos">Produtos</a>
      <a class="font-['Manrope'] font-bold text-sm tracking-tight uppercase text-[#230004]/80 dark:text-[#fff8f7]/80 hover:text-[#775a00] transition-colors duration-300" href="#qualidade">Qualidade</a>
      <a class="font-['Manrope'] font-bold text-sm tracking-tight uppercase text-[#230004]/80 dark:text-[#fff8f7]/80 hover:text-[#775a00] transition-colors duration-300" href="#faq">FAQ</a>
      <a class="font-['Manrope'] font-bold text-sm tracking-tight uppercase text-[#230004]/80 dark:text-[#fff8f7]/80 hover:text-[#775a00] transition-colors duration-300" href="#contato">Contato</a>
    </nav>
    <div class="flex items-center gap-2 lg:gap-4">
      <button type="button" class="rounded-lg p-2 text-primary md:hidden" aria-label="Menu (em breve)">
        <span class="material-symbols-outlined" aria-hidden="true">menu</span>
      </button>
      <a href="https://wa.me/5524999784591?text=Ol%C3%A1%21%20Vim%20pelo%20site%20da%20ValePan%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." class="rounded-lg bg-primary px-4 py-2 text-sm font-bold uppercase tracking-tight text-on-primary hover:bg-primary-container lg:rounded-none lg:px-6 lg:py-2.5 lg:normal-case lg:bg-[#230004] lg:text-[#fff8f7] lg:hover:opacity-90" target="_blank" rel="noopener">
        <span class="lg:hidden">Pedir</span>
        <span class="hidden lg:inline">Fazer pedido</span>
      </a>
    </div>
  </div>
</header>
```

Âncoras: trocar todos os `#d-*` e `#m-*` do site por `#inicio`, `#sobre`, `#qualidade`, `#produtos`, `#faq`, `#contato`.

- [ ] **Step 2: Estender `.nav-past-hero` para `#site-nav`**

Em `assets/css/new-index.css` (linhas 27–42):

1. Na primeira regra (fundo claro), acrescentar `, #site-nav.nav-past-hero` após `#site-nav-desktop.nav-past-hero`.
2. Acrescentar após o bloco `html.dark #site-nav-desktop...` existente:

```css
html.dark #site-nav.nav-past-hero {
  background-color: rgba(35, 0, 4, 0.88) !important;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.12);
}
```

Não remover `#site-nav-mobile` / `#site-nav-desktop` — a página legada continua a usá-los.

- [ ] **Step 3: Commit**

```bash
git add new-index-unificado.html assets/css/new-index.css
git commit -m "feat(unificado): single responsive header and anchor ids"
```

---

### Task 2: Hero (vídeo + GLSL + CTA)

**Files:**
- Modify: `new-index-unificado.html`
- Reference: `new-index.html:61-90` (mobile hero), `new-index.html:396-427` (desktop hero)

- [ ] **Step 1: Uma seção `#inicio`**

Fundir em uma `<section id="inicio" class="relative flex min-h-[100dvh] items-center justify-center overflow-hidden lg:items-center">`:

- Um `<video>` com o mesmo `<source src="assets/img/hero/hero-bg.mp4">` (antes `assets/slides/01-abertura/`).
- Uma camada GLSL:

```html
<div class="hero-gl-layer absolute inset-0 z-[1] pointer-events-none opacity-70 mix-blend-soft-light" aria-hidden="true">
  <canvas id="hero-gl-canvas" class="block h-full w-full"></canvas>
</div>
```

- Gradiente: combinar `bg-gradient-to-t` (mobile) e `lg:bg-gradient-to-r` usando duas `div` absolutas com `lg:hidden` e `hidden lg:block`, **ou** uma única `div` com classes que aproximem ambos (preferível: uma `div` com `bg-gradient-to-t from-primary/75 via-primary/30 to-transparent lg:bg-gradient-to-r lg:from-primary/65 lg:via-primary/28 lg:to-transparent` — validar visualmente).

- [ ] **Step 2: Conteúdo do hero**

Um único bloco de texto com classes responsivas (tamanhos de `new-index.html` mobile para base, `sm:`/`md:`/`lg:` para desktop):

- Tagline, `<h1>` (duas linhas), parágrafo, dois botões (WhatsApp + `#produtos`).
- Ícone WhatsApp: `chat` no mobile original, `chat_bubble` no desktop — escolher um único ícone (`chat` ou `chat_bubble`) para consistência.

- [ ] **Step 3: Commit**

```bash
git add new-index-unificado.html
git commit -m "feat(unificado): single hero with one video and GL canvas"
```

---

### Task 3: Faixa de parceiros (marquee)

**Files:**
- Modify: `new-index-unificado.html`
- Reference: `new-index.html:92-131` e `429-470`

- [ ] **Step 1: Uma seção, logos uma vez**

Manter **uma** lista de 6 logos + grupo duplicado para loop (mesmo markup do desktop). Unificar:

- Título visível: usar texto desktop “Quem confia no nosso padrão” com `text-xs` base e `lg:text-sm` se necessário.
- `aria-labelledby` + `h2.sr-only` único `id="titulo-parceiros"`.
- Classes do marquee: mobile usava `clientes-marquee -mx-2 sm:-mx-4`; desktop `clientes-marquee` dentro de `max-w-7xl px-8`. Resultado sugerido:

```html
<section class="overflow-hidden border-y border-outline-variant/10 bg-surface-container-low py-12 lg:py-16" aria-labelledby="titulo-parceiros">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <h2 id="titulo-parceiros" class="sr-only">Marcas parceiras</h2>
    <p class="mb-8 text-center text-xs font-bold uppercase tracking-widest text-on-surface-variant lg:mb-10 lg:text-sm">Quem confia no nosso padrão</p>
    <div class="clientes-marquee -mx-2 sm:-mx-4 lg:mx-0" aria-label="Logotipos de clientes ValePan">
      <!-- blur + viewport + track: copiar uma vez de new-index.html:434-467 -->
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add new-index-unificado.html
git commit -m "feat(unificado): single clientes marquee section"
```

---

### Task 4: Problema / solução (bloco editorial)

**Files:**
- Modify: `new-index-unificado.html`
- Reference: `new-index.html:133-147` (mobile), `472-494` (desktop)

- [ ] **Step 1: Usar copy e layout desktop como base**

Transplantar `new-index.html:472-494` e adaptar:

- Container: `py-16 px-6 lg:py-24 lg:max-w-7xl lg:mx-auto lg:px-8`.
- Grid `grid-cols-1 md:grid-cols-2` já funciona no mobile.

- [ ] **Step 2: Commit**

```bash
git add new-index-unificado.html
git commit -m "feat(unificado): problem/solution section from desktop copy"
```

---

### Task 5: História e escala (`#sobre`)

**Files:**
- Modify: `new-index-unificado.html`
- Reference: `new-index.html:149-175` (mobile), `496-539` (desktop)

- [ ] **Step 1: Seção única `id="sobre"`**

Usar o bloco desktop `496-539` com padding responsivo (`py-16 px-6 lg:py-24`). O mobile tinha estrutura mais curta; descartar duplicata em favor do desktop.

- [ ] **Step 2: Commit**

```bash
git add new-index-unificado.html
git commit -m "feat(unificado): sobre section with desktop content"
```

---

### Task 6: Gestão moderna e inovação

**Files:**
- Modify: `new-index-unificado.html`
- Reference: `177-201` (mobile cards), `541-565` (desktop)

- [ ] **Step 1: Grid desktop de 3 colunas**

Transplantar `541-565` com `py-16 px-6 lg:py-24 lg:max-w-7xl lg:mx-auto`.

- [ ] **Step 2: Commit**

```bash
git add new-index-unificado.html
git commit -m "feat(unificado): innovation grid section"
```

---

### Task 7: Qualidade e logística (`#qualidade`)

**Files:**
- Modify: `new-index-unificado.html`
- Reference: `204-232` (mobile), `567-604` (desktop)

- [ ] **Step 1: Seção `id="qualidade"`**

Usar markup desktop `567-604` (lista + cartão + imagem). Ajustar `order-1` / `order-2` com `lg:order-*` para mobile-first (imagem primeiro no mobile se desejado — espelhar comportamento desktop atual: `order-2 lg:order-1` no texto).

- [ ] **Step 2: Commit**

```bash
git add new-index-unificado.html
git commit -m "feat(unificado): qualidade section"
```

---

### Task 8: Produtos (`#produtos`)

**Files:**
- Modify: `new-index-unificado.html`
- Reference: `234-295` (mobile), `606-660` (desktop)

- [ ] **Step 1: Usar layout desktop**

Transplantar `606-660` (featured + grid secundário). Ajustar `px-6` + `max-w-7xl mx-auto` e `py-16 lg:py-24`.

- [ ] **Step 2: Commit**

```bash
git add new-index-unificado.html
git commit -m "feat(unificado): produtos section"
```

---

### Task 9: Case de sucesso

**Files:**
- Modify: `new-index-unificado.html`
- Reference: `297-309` (mobile), `662-686` (desktop)

- [ ] **Step 1: Versão desktop**

Transplantar `662-686` com `py-16 lg:py-24` e `px-6 lg:max-w-7xl lg:mx-auto`.

- [ ] **Step 2: Commit**

```bash
git add new-index-unificado.html
git commit -m "feat(unificado): case study section"
```

---

### Task 10: Depoimentos

**Files:**
- Modify: `new-index-unificado.html`
- Reference: `311-335` (mobile), `688-709` (desktop)

- [ ] **Step 1: Usar cards desktop**

Transplantar `688-709` com padding responsivo.

- [ ] **Step 2: Commit**

```bash
git add new-index-unificado.html
git commit -m "feat(unificado): testimonials section"
```

---

### Task 11: FAQ (`#faq`)

**Files:**
- Modify: `new-index-unificado.html`
- Reference: `337-353` (mobile — substituir), `711-742` (desktop)

- [ ] **Step 1: Apenas `<details>` desktop**

Transplantar `711-742` para `id="faq"` com `py-16 px-6 lg:py-24` e `max-w-4xl mx-auto`.

- [ ] **Step 2: Commit**

```bash
git add new-index-unificado.html
git commit -m "feat(unificado): FAQ with accessible details"
```

---

### Task 12: Contato (`#contato`) + formulário

**Files:**
- Modify: `new-index-unificado.html`
- Reference: `355-366` (mobile form), `744-782` (desktop)

- [ ] **Step 1: Layout desktop como base**

Transplantar `744-782` (grid com dados + CTA WhatsApp). Em `lg`, manter duas colunas; em mobile, `grid-cols-1` empilha naturalmente.

- [ ] **Step 2: Formulário**

Se o formulário simples do mobile for mantido para mobile-only: **não duplicar** — integrar o `form#lead-form` do mobile **abaixo** do bloco de contato ou na segunda coluna como no desktop (desktop original não tinha inputs; decisão de produto):

- **Recomendação:** incluir o mesmo `<form id="lead-form" ...>` do mobile em uma linha full-width sob o grid, com `max-w-md mx-auto`, para não perder o comportamento JS existente.

- [ ] **Step 3: Commit**

```bash
git add new-index-unificado.html
git commit -m "feat(unificado): contato grid and lead form"
```

---

### Task 13: Rodapé

**Files:**
- Modify: `new-index-unificado.html`
- Reference: `368-374` (mobile), `784-821` (desktop)

- [ ] **Step 1: Footer desktop**

Transplantar `784-821`. Atualizar links `href="#d-produtos"` → `href="#produtos"`, etc.

- [ ] **Step 2: Fechar estrutura**

Fechar `</main>`, `</div>` (wrapper), e incluir scripts finais (Task 14).

- [ ] **Step 3: Commit**

```bash
git add new-index-unificado.html
git commit -m "feat(unificado): footer and closing layout"
```

---

### Task 14: JavaScript unificado

**Files:**
- Create: `assets/js/new-index-unificado.js`
- Create: `assets/js/hero-glsl-hills-unificado.js`
- Modify: `new-index-unificado.html` (tags script no final)

- [ ] **Step 1: Criar `new-index-unificado.js`**

Conteúdo completo:

```javascript
/**
 * Comportamentos da landing new-index-unificado.html
 */
(function () {
  var waDefault =
    "https://wa.me/5524999784591?text=" +
    encodeURIComponent("Olá! Vim pelo site da ValePan e gostaria de mais informações.");
  var form = document.getElementById("lead-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      window.open(waDefault, "_blank", "noopener");
    });
  }

  function updateNavPastHero() {
    var hero = document.getElementById("inicio");
    var nav = document.getElementById("site-nav");
    if (!hero || !nav) return;
    var past = hero.getBoundingClientRect().bottom <= 0;
    nav.classList.toggle("nav-past-hero", past);
  }

  window.addEventListener("scroll", updateNavPastHero, { passive: true });
  window.addEventListener("resize", updateNavPastHero);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateNavPastHero);
  } else {
    updateNavPastHero();
  }
})();
```

- [ ] **Step 2: Criar `hero-glsl-hills-unificado.js`**

Copiar `assets/js/hero-glsl-hills.js` e substituir a função `refreshHeroGl` e variáveis `mobileCleanup` / `desktopCleanup` por uma única instância:

```javascript
  var heroCleanup = null;

  function disposeFn(fn) {
    if (typeof fn === "function") fn();
  }

  function refreshHeroGl() {
    disposeFn(heroCleanup);
    heroCleanup = null;
    var canvas = document.getElementById("hero-gl-canvas");
    heroCleanup = setupHeroGl(canvas, {
      cameraZ: 125,
      planeSize: 256,
      speed: 0.45,
    });
  }
```

Remover buscas por `hero-gl-canvas-mobile` e `hero-gl-canvas-desktop`. Manter `matchMedia` + `change` listener chamando `refreshHeroGl()` **apenas** se após teste visual o resize entre breakpoints exigir re-init (o canvas único no fluxo unificado geralmente só precisa de `ResizeObserver` já existente em `setupHeroGl` — **testar**; se o observer bastar, `refreshHeroGl` pode ser chamado só uma vez no `init` sem listener de media query).

- [ ] **Step 3: Scripts no HTML**

Em `new-index-unificado.html`, antes de `</body>`:

```html
<script src="assets/js/new-index-unificado.js"></script>
<script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
<script src="assets/js/hero-glsl-hills-unificado.js"></script>
```

- [ ] **Step 4: Commit**

```bash
git add assets/js/new-index-unificado.js assets/js/hero-glsl-hills-unificado.js new-index-unificado.html
git commit -m "feat(unificado): dedicated JS and single hero GL canvas"
```

---

### Task 15: Verificação manual e regressão visual

**Files:**
- Readonly: `new-index.html` (comparar)

- [ ] **Step 1: Abrir localmente**

Servir a pasta raiz (ex.: `npx serve .` ou abrir arquivo direto) e carregar `/new-index-unificado.html`.

- [ ] **Step 2: Checklist viewport**

| Largura | Verificar |
|---------|-----------|
| 375px | Hero full-height, nav fixa, marquee, formulário, footer legível |
| 768px | Nav com links aparece (`md:flex`) |
| 1280px | Layout amplo, gradiente hero, grids multi-coluna |

- [ ] **Step 3: Âncoras**

Clicar cada link da nav: deve rolar para `#inicio`, `#sobre`, `#produtos`, `#qualidade`, `#faq`, `#contato` sem 404 de fragmento.

- [ ] **Step 4: Navbar após scroll**

Após passar o hero, `#site-nav` deve ganhar/perder `nav-past-hero` conforme CSS existente.

- [ ] **Step 5: WebGL**

Confirmar uma única animação no hero; ao redimensionar janela através de 1024px, sem crash no console.

- [ ] **Step 6: Formulário**

Submit em `#lead-form` abre WhatsApp (mesmo comportamento que `new-index.js`).

- [ ] **Step 7: Commit final (se só ajustes finos)**

```bash
git add new-index-unificado.html assets/css/new-index.css
git commit -m "fix(unificado): polish responsive spacing and nav-past-hero"
```

---

## Verificação do plano (self-review)

1. **Cobertura:** Todas as seções do fluxo desktop numeradas (hero → footer) têm task; mobile-only redundâncias foram absorvidas ou substituídas pela copy desktop; FAQ e produtos cobertos.
2. **Placeholders:** Nenhum TBD; IDs de âncora definidos; estratégia editorial explícita.
3. **Consistência:** IDs `inicio`, `sobre`, `qualidade`, `produtos`, `faq`, `contato` alinhados entre nav, footer e seções.

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-07-new-index-unificado.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — Um subagente por task, revisão entre tasks, iteração rápida.

**2. Inline Execution** — Executar tasks nesta sessão com checkpoints para revisão.

**Which approach?**
