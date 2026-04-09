# Organização do repositório (site estático) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deixar na raiz apenas o necessário para servir e manter `index.html` em produção; mover documentação Markdown operacional para uma pasta dedicada; remover HTML/CSS/JS e artefatos de desenvolvimento não referenciados pela home atual, com inventário explícito do que sai e verificação de que o site continua funcional.

**Architecture:** O site é um único `index.html` com assets sob `assets/`. A limpeza baseia-se em **fecho transitivo de dependências**: tudo o que não é alcançável por `index.html` (e pelos JS que ele carrega com paths estáticos) é candidato a remoção ou arquivamento em `docs/`. Ferramentas Python em `tools/` são opcionais: mantêm-se se ainda regeneram HTML a partir de `new-index.html`.

**Tech Stack:** HTML/CSS/JS estático, Python 3 (scripts em `tools/`), Apache `.htaccess`, Markdown.

---

## Mapa de arquivos (pós-organização proposta)

| Caminho | Responsabilidade |
|---------|------------------|
| `index.html` | Única página servida na raiz. |
| `robots.txt`, `sitemap.xml`, `.htaccess`, `CNAME` | Deploy / SEO / GitHub Pages. |
| `README.md` | Entrada do repositório; links para `docs/site/`. |
| `assets/` | **Todo** o conteúdo referenciado por `index.html` e por `assets/js/new-index-unificado.js` (catálogo de produtos). |
| `docs/site/` | Documentação operacional (deploy, SEO, mídia, resumos). |
| `docs/superpowers/plans/` | Planos de implementação já existentes. |
| `tools/assemble_unificado.py` | (Opcional) Regenera HTML unificado a partir de `new-index.html`.

---

## Inventário: o que a home **precisa** (não remover)

### Encadeamento direto `index.html`

- **CSS:** `assets/css/new-index.css`, `assets/css/clientes-marquee.css`
- **JS:** `assets/js/tailwind-config.js`, `assets/js/analytics.js`, `assets/js/new-index-unificado.js`, `assets/js/hero-glsl-hills-unificado.js`
- **Vídeo hero:** `assets/img/hero/hero-bg.mp4` e `poster` `assets/img/hero/hero-bg.webp` (se ausentes no disco, **obrigatório** no servidor de produção)
- **Logo / ícone:** `assets/logo/valepan-logo.svg`
- **Imagens:** `assets/img/problema-solucao/*.webp`, `assets/img/sobre/*`, `assets/img/depoimentos/*`, `assets/logo/cliente-*-logo.webp`
- **JSON opcional:** `assets/data/schema-foodestablishment.json`, `assets/data/schema-faq.json` — o `index.html` atual usa JSON-LD **inline**; os arquivos são fonte de verdade para edições futuras. **Recomendação:** manter.

### `assets/js/new-index-unificado.js` (paths em dados)

Produtos referenciam imagens sob `assets/img/produtos/` (ex.: `brioche.jpg`, `tradicional.jpg`, `hot dog.jpg`, `brioche-com-gergelim.jpg`, `pretzel.jpg`, `premium.jpg`, `australiano.jpg`, `royal.jpg`, `hot-dog-brioche.jpg`, `mini.jpg`). **Não remover** esses arquivos enquanto o catálogo existir.

### Meta / social

- `assets/logo/og-image.png` — referenciado em `og:image` / `twitter:image`. **No repositório atual pode faltar**; não delete a pasta `assets/logo/` até existir `og-image.png` em produção ou após criar conforme `CRIAR-OG-IMAGE.md`.

### `valepan-logo-full.svg`

- Não está no `index.html` atual; é citado em `CRIAR-OG-IMAGE.md` para montar o OG. **Manter** em `assets/logo/`.

---

## Inventário: o que **será removido** (lista explícita)

| Arquivo / pasta | Motivo |
|-----------------|--------|
| `styles.css` | CSS do site legado (`styles.css` + `script.js`); não referenciado por `index.html`. |
| `script.js` | JS do site legado. |
| `index.html.legacy-backup` | Snapshot do HTML antigo; não necessário para rodar a nova home. |
| `new-index.html` | **Somente se** Task “pipeline” for escolhida: mover para `tools/source/new-index.html` em vez de apagar; se o pipeline for abandonado, **remover** junto com ajustes ao script (ver Task 3). |
| `stitch-desktop-raw.html` | Artefato Stitch / teste. |
| `stitch-desktop-body-processed.html` | Artefato Stitch / teste. |
| `assets/js/new-index.js` | Usado apenas por `new-index.html` (árvore dupla). |
| `assets/js/hero-glsl-hills.js` | Usado apenas por `new-index.html`; a produção usa `hero-glsl-hills-unificado.js`. |
| `assets/stitch/valepan-home-mobile-burgundy-stitch-reference.png` | Referência visual; não referenciada pelo site. |
| `tools/insert_desktop_into_new_index.py` | Pipeline Stitch; não necessário para servir `index.html`. |
| `tools/merge_desktop_stitch.py` | Pipeline Stitch; não necessário para servir `index.html`. |
| `assets/slides/04-produtos/desktop.ini` | Arquivo de sistema Windows; não é asset do site. |

**Não incluir na remoção automática (fora do escopo “site”):** `.cursor/`, `__pycache__/`, `.git` — tratar como configuração local / ignorar no git conforme `.gitignore` se desejado.

---

## Documentação: mover para `docs/site/`

Criar pasta `docs/site/` e **mover** (git mv) os arquivos abaixo da raiz para `docs/site/`:

| Origem | Destino |
|--------|---------|
| `GUIA-DEPLOY.md` | `docs/site/GUIA-DEPLOY.md` |
| `OTIMIZACAO-MIDIA.md` | `docs/site/OTIMIZACAO-MIDIA.md` |
| `README-SEO.md` | `docs/site/README-SEO.md` |
| `CRIAR-OG-IMAGE.md` | `docs/site/CRIAR-OG-IMAGE.md` |
| `RESUMO-EXECUTIVO.md` | `docs/site/RESUMO-EXECUTIVO.md` |
| `SEO-ALTERACOES-REALIZADAS.md` | `docs/site/SEO-ALTERACOES-REALIZADAS.md` |
| `CHANGELOG.md` | `docs/site/CHANGELOG.md` |
| `briefing_valepan.md` | `docs/site/briefing_valepan.md` |
| `media/midia-instrucoes.md` | `docs/site/midia-instrucoes.md` |

**`media/`:** se `robots.txt` mantém `Disallow: /media/` para conteúdo público em produção, não apague a pasta no servidor; apenas mover o `.md` para `docs/site/`. Se `media/` for só esse arquivo, a pasta pode ficar vazia e ser removida **após** confirmar que o deploy não depende dela.

**`README.md`:** permanece na raiz; atualizar links internos que apontavam para `GUIA-DEPLOY.md` etc. para `docs/site/...` (ver Task 2).

---

### Task 1: Criar `docs/site` e mover documentação

**Files:**
- Create: `docs/site/` (diretório)
- Modify: (moves via git)

- [ ] **Step 1: Criar diretório**

```powershell
New-Item -ItemType Directory -Path "c:\Users\victo\git\valepan\docs\site" -Force
```

- [ ] **Step 2: Mover arquivos com git**

```powershell
Set-Location "c:\Users\victo\git\valepan"
git mv GUIA-DEPLOY.md docs/site/GUIA-DEPLOY.md
git mv OTIMIZACAO-MIDIA.md docs/site/OTIMIZACAO-MIDIA.md
git mv README-SEO.md docs/site/README-SEO.md
git mv CRIAR-OG-IMAGE.md docs/site/CRIAR-OG-IMAGE.md
git mv RESUMO-EXECUTIVO.md docs/site/RESUMO-EXECUTIVO.md
git mv SEO-ALTERACOES-REALIZADAS.md docs/site/SEO-ALTERACOES-REALIZADAS.md
git mv CHANGELOG.md docs/site/CHANGELOG.md
git mv briefing_valepan.md docs/site/briefing_valepan.md
```

Se `media/midia-instrucoes.md` existir:

```powershell
git mv media/midia-instrucoes.md docs/site/midia-instrucoes.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/site
git commit -m "docs: mover guias operacionais para docs/site"
```

---

### Task 2: Atualizar `README.md` e referências cruzadas

**Files:**
- Modify: `README.md`
- Modify: `docs/site/README-SEO.md` (se citar caminhos)
- Modify: `docs/site/README-SEO.md` linha que referencia `SEO-ALTERACOES-REALIZADAS.md` — mesmo diretório
- Modify: `docs/site/CRIAR-OG-IMAGE.md` se citar caminhos relativos à raiz

- [ ] **Step 1: No `README.md`, adicionar secção após o título (ajuste o texto ao estilo do arquivo)**

```markdown
## Documentação

| Documento | Descrição |
|-----------|-----------|
| [docs/site/GUIA-DEPLOY.md](docs/site/GUIA-DEPLOY.md) | Deploy (cPanel, Vercel, checklist) |
| [docs/site/OTIMIZACAO-MIDIA.md](docs/site/OTIMIZACAO-MIDIA.md) | Otimização de imagens e vídeo |
| [docs/site/README-SEO.md](docs/site/README-SEO.md) | Resumo SEO |
| [docs/site/CRIAR-OG-IMAGE.md](docs/site/CRIAR-OG-IMAGE.md) | Criar imagem Open Graph |
| [docs/site/CHANGELOG.md](docs/site/CHANGELOG.md) | Histórico de alterações |
```

- [ ] **Step 2: Buscar e substituir referências quebradas**

No repositório, procurar:

```powershell
Set-Location "c:\Users\victo\git\valepan"
Select-String -Path "*.md","docs/**/*.md" -Pattern "GUIA-DEPLOY|OTIMIZACAO-MIDIA|CRIAR-OG-IMAGE|README-SEO" -Recurse
```

Atualizar qualquer link da raiz `GUIA-DEPLOY.md` → `docs/site/GUIA-DEPLOY.md` (e equivalentes).

- [ ] **Step 3: Commit**

```bash
git add README.md docs/site
git commit -m "docs: atualizar links após mover guias para docs/site"
```

---

### Task 3: Decisão sobre pipeline `new-index.html` + `tools/assemble_unificado.py`

**Escolha uma opção (não ambas):**

| Opção | Ação |
|-------|------|
| **A — Manter pipeline** | Mover `new-index.html` → `tools/source/new-index.html` e atualizar `tools/assemble_unificado.py` para ler `tools/source/new-index.html` e escrever saída em `tools/build/index-unificado-preview.html` (não sobrescrever `index.html` manualmente ajustado). |
| **B — Remover pipeline** | `git rm new-index.html tools/assemble_unificado.py` e remover dependência; a manutenção passa a ser só em `index.html`. |

- [ ] **Step 1 (Opção A):** Editar `tools/assemble_unificado.py` — substituir a linha que define `src`:

```python
def main() -> None:
    src = (ROOT / "tools" / "source" / "new-index.html").read_text(encoding="utf-8")
```

Criar `tools/source/` e mover:

```powershell
New-Item -ItemType Directory -Path "c:\Users\victo\git\valepan\tools\source" -Force
git mv new-index.html tools/source/new-index.html
```

Alterar a linha de escrita (final de `main`) de `(ROOT / "new-index-unificado.html")` para:

```python
    out_path = ROOT / "tools" / "build" / "index-unificado-preview.html"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(out, encoding="utf-8")
    print(f"Wrote {out_path}")
```

Adicionar `tools/build/` ao `.gitignore` (conteúdo gerado):

```
# Build preview do assemble_unificado
tools/build/
```

- [ ] **Step 2 (Opção B):** Apenas:

```powershell
git rm new-index.html tools/assemble_unificado.py
```

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: reorganizar ou remover pipeline new-index/assemble"
```

---

### Task 4: Remover arquivos legados e de teste (lista fixa)

**Files:**
- Delete: ver tabela “Inventário remoção” acima

- [ ] **Step 1: Remover com git**

```powershell
Set-Location "c:\Users\victo\git\valepan"
git rm styles.css script.js index.html.legacy-backup 2>$null
git rm stitch-desktop-raw.html stitch-desktop-body-processed.html 2>$null
git rm assets/js/new-index.js assets/js/hero-glsl-hills.js
git rm assets/stitch/valepan-home-mobile-burgundy-stitch-reference.png
git rm tools/insert_desktop_into_new_index.py tools/merge_desktop_stitch.py
git rm assets/slides/04-produtos/desktop.ini
```

Se `assets/stitch/` ficar vazia, remover a pasta (ou `git rm -r assets/stitch`).

- [ ] **Step 2: Commit**

```bash
git commit -m "chore: remover assets legados, stitch e JS não usados pela home"
```

---

### Task 5: Verificação — site funciona

- [ ] **Step 1: Servidor local**

```powershell
Set-Location "c:\Users\victo\git\valepan"
python -m http.server 8080
```

Abrir `http://localhost:8080/` e `http://localhost:8080/index.html`.

**Expected:** Hero, marquee, seções, catálogo (JS), tema, WhatsApp; **sem 404** na aba Network para CSS/JS/imagens locais.

- [ ] **Step 2: Busca por referências órfãs**

```powershell
Select-String -Path "c:\Users\victo\git\valepan\index.html" -Pattern "styles\.css|script\.js|new-index\.js|hero-glsl-hills\.js\""
```

**Expected:** Nenhuma ocorrência.

- [ ] **Step 3: Commit** (somente se houver correções)

---

## Self-review

| Requisito | Task |
|-----------|------|
| Docs organizados em pasta | Task 1–2 |
| Remover só o não usado | Task 4 + inventário |
| Projeto funciona | Task 5 |
| Visibilidade do que sai | Secção “Inventário remoção” |

**Placeholder scan:** Nenhum `TBD`; Opção A/B na Task 3 é escolha explícita.

**Gaps:** `og-image.png` e `assets/img/hero/*` podem não estar versionados; o plano não os remove — apenas alerta.

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-09-organizacao-repositorio-site.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — Dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
