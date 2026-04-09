"""Gera new-index-unificado.html a partir de new-index.html (bloco desktop + nav/hero unificados)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

HEAD = """<!DOCTYPE html>
<html class="scroll-smooth" lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ValePan - Pães Premium para Hamburguerias | RJ, SP e MG</title>
<meta name="description" content="Pães gourmet para hamburguerias desde 1991. Brioche, Pretzel, Australian Bun com qualidade premium e entrega em RJ, SP e MG.">
<meta name="keywords" content="pães para hamburguerias, brioche, pretzel, australian bun, pães gourmet, valepan, resende rj">
<meta name="geo.region" content="BR-RJ">
<meta name="geo.placename" content="Resende">
<meta name="geo.position" content="-22.4697;-44.4467">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:url" content="https://valepan.com/">
<meta property="og:title" content="ValePan - Hambúrguer bom começa pelo pão">
<meta property="og:description" content="Fornecendo qualidade premium desde 1991. Pães artesanais para hamburguerias em RJ, SP e MG.">
<meta property="og:image" content="https://valepan.com/assets/logo/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="ValePan - Pães Premium para Hamburguerias">
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://valepan.com/">
<meta property="twitter:title" content="ValePan - Hambúrguer bom começa pelo pão">
<meta property="twitter:description" content="Fornecendo qualidade premium desde 1991">
<meta property="twitter:image" content="https://valepan.com/assets/logo/og-image.png">
<link rel="canonical" href="https://valepan.com/">
<link rel="icon" type="image/svg+xml" href="assets/logo/valepan-logo.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://www.googletagmanager.com">
<!--
  Assets: assets/css/new-index.css | assets/js/tailwind-config.js, analytics.js, new-index-unificado.js, hero-glsl-hills-unificado.js
  Dados: assets/data/schema-*.json | Vídeo hero: assets/slides/01-abertura/hero-bg.mp4
-->
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script src="assets/js/tailwind-config.js"></script>
<link rel="stylesheet" href="assets/css/new-index.css">
<link rel="stylesheet" href="assets/css/clientes-marquee.css">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script src="assets/js/analytics.js"></script>
<script type="application/ld+json" src="assets/data/schema-foodestablishment.json"></script>
<script type="application/ld+json" src="assets/data/schema-faq.json"></script>
</head>
"""

HEADER = """<header id="site-nav" class="fixed top-0 left-0 right-0 z-50 w-full bg-[#fff8f7]/18 backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-200 dark:bg-[#230004]/22 supports-[backdrop-filter]:bg-[#fff8f7]/12 supports-[backdrop-filter]:dark:bg-[#230004]/16">
<div class="mx-auto flex w-full max-w-lg items-center justify-between gap-3 px-6 py-4 lg:max-w-[1440px] lg:px-8 lg:py-6">
<div class="flex min-w-0 items-center gap-3">
<button type="button" class="-m-2 rounded-lg p-2 text-primary md:hidden" aria-label="Menu (em breve)"><span class="material-symbols-outlined" aria-hidden="true">menu</span></button>
<a href="#inicio" class="flex min-w-0 items-center gap-2 text-xl font-extrabold uppercase tracking-tighter text-[#230004] dark:text-[#fff8f7] lg:text-2xl lg:font-black lg:normal-case lg:tracking-tighter lg:text-[#230004] lg:dark:text-[#775a00]"><img src="assets/logo/valepan-logo.svg" alt="" width="32" height="32" decoding="async" class="h-8 w-8 shrink-0 lg:h-9 lg:w-9"><span class="truncate">ValePan</span></a>
</div>
<nav class="hidden flex-1 justify-center md:flex" aria-label="Principal">
<div class="flex items-center gap-8">
<a class="font-['Manrope'] font-bold text-sm tracking-tight uppercase text-[#230004]/80 dark:text-[#fff8f7]/80 hover:text-[#775a00] transition-colors duration-300" href="#inicio">Início</a>
<a class="font-['Manrope'] font-bold text-sm tracking-tight uppercase text-[#230004]/80 dark:text-[#fff8f7]/80 hover:text-[#775a00] transition-colors duration-300" href="#sobre">Sobre</a>
<a class="font-['Manrope'] font-bold text-sm tracking-tight uppercase text-[#230004]/80 dark:text-[#fff8f7]/80 hover:text-[#775a00] transition-colors duration-300" href="#produtos">Produtos</a>
<a class="font-['Manrope'] font-bold text-sm tracking-tight uppercase text-[#230004]/80 dark:text-[#fff8f7]/80 hover:text-[#775a00] transition-colors duration-300" href="#qualidade">Qualidade</a>
<a class="font-['Manrope'] font-bold text-sm tracking-tight uppercase text-[#230004]/80 dark:text-[#fff8f7]/80 hover:text-[#775a00] transition-colors duration-300" href="#faq">FAQ</a>
<a class="font-['Manrope'] font-bold text-sm tracking-tight uppercase text-[#230004]/80 dark:text-[#fff8f7]/80 hover:text-[#775a00] transition-colors duration-300" href="#contato">Contato</a>
</div>
</nav>
<a href="https://wa.me/5524999784591?text=Ol%C3%A1%21%20Vim%20pelo%20site%20da%20ValePan%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." class="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-bold uppercase tracking-tight text-on-primary transition-colors hover:bg-primary-container lg:rounded-none lg:bg-[#230004] lg:px-6 lg:py-2.5 lg:normal-case lg:text-[#fff8f7] lg:hover:opacity-90" target="_blank" rel="noopener"><span class="lg:hidden">Pedir</span><span class="hidden lg:inline">Fazer pedido</span></a>
</div>
</header>
"""

HERO = """<!-- Hero -->
<section id="inicio" class="relative flex min-h-[100dvh] items-center justify-center overflow-hidden lg:items-center">
<div class="absolute inset-0 z-0 overflow-hidden">
<video class="absolute inset-0 z-0 h-full w-full object-cover" autoplay muted loop playsinline preload="auto" aria-hidden="true">
<source src="assets/slides/01-abertura/hero-bg.mp4" type="video/mp4">
</video>
<div class="hero-gl-layer absolute inset-0 z-[1] pointer-events-none opacity-70 mix-blend-soft-light" aria-hidden="true">
<canvas id="hero-gl-canvas" class="block h-full w-full"></canvas>
</div>
<div class="absolute inset-0 z-[2] bg-gradient-to-t from-primary/75 via-primary/30 to-transparent pointer-events-none lg:bg-gradient-to-r lg:from-primary/65 lg:via-primary/28 lg:to-transparent"></div>
</div>
<div class="relative z-10 mx-auto w-full max-w-5xl px-6 pb-28 pt-28 text-center sm:pt-32 lg:px-8 lg:pb-24">
<div class="mx-auto max-w-4xl text-on-primary lg:text-white">
<p class="mb-5 text-[10px] font-bold uppercase tracking-widest text-[#ffd573]/95 sm:text-xs lg:mb-6 lg:text-sm">Fornecendo qualidade desde 1991</p>
<h1 class="mb-6 font-headline lg:mb-8">
<span class="block font-light italic tracking-tight text-3xl leading-snug sm:text-4xl md:text-5xl lg:text-6xl">Hambúrguer bom começa</span>
<span class="mt-1 block text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl md:text-7xl lg:mt-2 lg:text-8xl">pelo pão.</span>
</h1>
<p class="mx-auto mb-10 max-w-md text-sm leading-relaxed text-[#ebe0e1] sm:text-base lg:mb-12 lg:max-w-xl lg:text-white/75 md:text-lg">
Pães premium para hamburguerias de alto padrão.
</p>
<div class="mx-auto flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
<a href="https://wa.me/5524999784591?text=Ol%C3%A1%21%20Vim%20pelo%20site%20da%20ValePan%20e%20gostaria%20de%20um%20or%C3%A7amento." class="btn-shimmer btn-shimmer-whatsapp inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-bold sm:w-auto sm:min-w-[240px] sm:rounded-md sm:px-8 sm:py-4" target="_blank" rel="noopener">
<span class="material-symbols-outlined" aria-hidden="true">chat_bubble</span>
Faça um orçamento
</a>
<a href="#produtos" class="btn-shimmer btn-shimmer-catalog inline-flex min-h-12 w-full items-center justify-center rounded-lg px-6 py-3 font-bold sm:w-auto sm:min-w-[240px] sm:rounded-md sm:px-8 sm:py-4">
Ver catálogo
</a>
</div>
</div>
</div>
</section>
"""

LEAD_FORM = """<!-- Lead (formulário) -->
<section class="bg-surface py-12 px-6 lg:py-16" aria-labelledby="titulo-lead">
<div class="mx-auto max-w-md">
<h2 id="titulo-lead" class="mb-6 text-center text-2xl font-black text-primary lg:text-3xl">Vamos conversar?</h2>
<p class="mb-8 text-center text-on-surface-variant">Peça uma amostra ou agende uma visita técnica.</p>
<form id="lead-form" class="space-y-4" action="#" method="post">
<input class="h-14 w-full rounded-lg border-none bg-surface-container-highest px-4 focus:ring-2 focus:ring-primary" placeholder="Seu Nome" type="text" name="nome" autocomplete="name">
<input class="h-14 w-full rounded-lg border-none bg-surface-container-highest px-4 focus:ring-2 focus:ring-primary" placeholder="Nome da sua Empresa" type="text" name="empresa" autocomplete="organization">
<input class="h-14 w-full rounded-lg border-none bg-surface-container-highest px-4 focus:ring-2 focus:ring-primary" placeholder="E-mail profissional" type="email" name="email" autocomplete="email">
<button class="h-14 w-full rounded-lg bg-primary font-bold text-on-primary shadow-lg" type="submit">Enviar Mensagem</button>
</form>
</div>
</section>
"""

FOOT_SCRIPTS = """<script src="assets/js/new-index-unificado.js"></script>
<script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
<script src="assets/js/hero-glsl-hills-unificado.js"></script>
</body></html>
"""


def main() -> None:
    src = (ROOT / "new-index.html").read_text(encoding="utf-8")
    start = src.index("<!-- 3) Faixa de logos -->")
    end = src.index("</footer>", start) + len("</footer>")
    tail = src[start:end]

    repl = [
        ("titulo-parceiros-desktop", "titulo-parceiros"),
        ('id="d-sobre"', 'id="sobre"'),
        ('id="d-qualidade"', 'id="qualidade"'),
        ('id="d-produtos"', 'id="produtos"'),
        ('id="d-faq"', 'id="faq"'),
        ('id="d-contato"', 'id="contato"'),
        ("#d-faq", "#faq"),
        ("#d-contato", "#contato"),
        ("#d-produtos", "#produtos"),
        ("#d-sobre", "#sobre"),
        ("#d-qualidade", "#qualidade"),
    ]
    for a, b in repl:
        tail = tail.replace(a, b)

    # Responsividade: padding em secções que só tinham px-8
    tail = tail.replace(
        'class="overflow-hidden border-y border-outline-variant/10 bg-surface-container-low py-16"',
        'class="overflow-hidden border-y border-outline-variant/10 bg-surface-container-low py-12 lg:py-16"',
    )
    tail = tail.replace(
        '<div class="mx-auto max-w-7xl px-8">',
        '<div class="mx-auto max-w-7xl px-6 lg:px-8">',
        1,
    )
    tail = tail.replace(
        'class="py-24 max-w-7xl mx-auto px-8"',
        'class="py-16 max-w-7xl mx-auto px-6 lg:py-24 lg:px-8"',
        1,
    )
    tail = tail.replace(
        '<div class="max-w-7xl mx-auto px-8">',
        '<div class="max-w-7xl mx-auto px-6 lg:px-8">',
    )
    tail = tail.replace(
        'class="py-24 max-w-7xl mx-auto px-8" id="produtos"',
        'class="py-16 max-w-7xl mx-auto px-6 lg:py-24 lg:px-8" id="produtos"',
    )
    tail = tail.replace(
        'class="py-24 max-w-4xl mx-auto px-8" id="faq"',
        'class="py-16 max-w-4xl mx-auto px-6 lg:py-24 lg:px-8" id="faq"',
    )
    tail = tail.replace(
        '<div class="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-7xl mx-auto">',
        '<div class="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 py-16 max-w-7xl mx-auto md:px-12 md:py-20">',
    )
    tail = tail.replace(
        '<div class="max-w-7xl mx-auto px-12 py-8 border-t border-primary/5 text-center">',
        '<div class="max-w-7xl mx-auto border-t border-primary/5 px-6 py-8 text-center md:px-12">',
    )
    marker = "<!-- 13) Footer -->"
    assert marker in tail, "expected desktop footer marker in new-index.html"
    before, after = tail.split(marker, 1)
    tail = before + LEAD_FORM + "\n" + marker + after

    out = (
        HEAD
        + '<body class="bg-surface text-on-surface antialiased overflow-x-hidden">\n'
        + '<div class="mx-auto w-full max-w-lg min-h-[max(884px,100dvh)] shadow-2xl lg:mx-0 lg:max-w-none lg:min-h-0 lg:shadow-none">\n'
        + HEADER
        + "<main>\n"
        + HERO
        + tail
        + "\n</main>\n</div>\n"
        + FOOT_SCRIPTS
    )

    (ROOT / "new-index-unificado.html").write_text(out, encoding="utf-8")
    print("Wrote new-index-unificado.html")


if __name__ == "__main__":
    main()
