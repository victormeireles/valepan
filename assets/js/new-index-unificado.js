/**
 * Comportamentos da landing new-index-unificado.html (navbar + lead → WhatsApp).
 */
(function () {
  /** Tema claro/escuro (Tailwind darkMode: class) + persistência */
  var THEME_KEY = "valepan-theme";
  (function applyStoredOrPreferredTheme() {
    try {
      var stored = localStorage.getItem(THEME_KEY);
      if (stored === "dark") document.documentElement.classList.add("dark");
      else if (stored === "light") document.documentElement.classList.remove("dark");
      else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
        document.documentElement.classList.add("dark");
    } catch (e) {
      /* localStorage indisponível */
    }
  })();
  function syncFooterThemeAria() {
    var root = document.documentElement;
    var lightBtn = document.getElementById("footerThemeLight");
    var darkBtn = document.getElementById("footerThemeDark");
    var isDark = root.classList.contains("dark");
    if (lightBtn) lightBtn.setAttribute("aria-pressed", isDark ? "false" : "true");
    if (darkBtn) darkBtn.setAttribute("aria-pressed", isDark ? "true" : "false");
  }
  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
    syncFooterThemeAria();
  }
  function initThemeControls() {
    var lightBtn = document.getElementById("footerThemeLight");
    var darkBtn = document.getElementById("footerThemeDark");
    if (lightBtn)
      lightBtn.addEventListener("click", function () {
        applyTheme("light");
      });
    if (darkBtn)
      darkBtn.addEventListener("click", function () {
        applyTheme("dark");
      });
    syncFooterThemeAria();
  }

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

  var backToTopBtn = document.getElementById("backToTop");
  function updateBackToTop() {
    if (!backToTopBtn) return;
    if (window.pageYOffset > 500) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  }
  var backToTopRaf = null;
  function onScrollBackToTop() {
    if (backToTopRaf) window.cancelAnimationFrame(backToTopRaf);
    backToTopRaf = window.requestAnimationFrame(updateBackToTop);
  }
  window.addEventListener("scroll", onScrollBackToTop, { passive: true });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateBackToTop);
  } else {
    updateBackToTop();
  }
  function scrollToTopSmooth() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  document.querySelectorAll("[data-back-to-top]").forEach(function (el) {
    el.addEventListener("click", function () {
      scrollToTopSmooth();
    });
  });

  initThemeControls();

  var footerYearEl = document.getElementById("footerYear");
  if (footerYearEl) footerYearEl.textContent = String(new Date().getFullYear());

  /**
   * Thumbnail → modal com iframe (YouTube embed), sem nova aba.
   * Marcação: [data-video-root] com data-video-embed, [data-video-open], [data-video-dialog], [data-video-iframe].
   */
  function initVideoModals() {
    var roots = document.querySelectorAll("[data-video-root]");
    if (!roots.length) return;

    var scrollLockCount = 0;
    var previousOverflow = "";

    function lockScroll() {
      if (scrollLockCount === 0) previousOverflow = document.body.style.overflow;
      scrollLockCount += 1;
      document.body.style.overflow = "hidden";
    }

    function unlockScroll() {
      scrollLockCount = Math.max(0, scrollLockCount - 1);
      if (scrollLockCount === 0) document.body.style.overflow = previousOverflow || "";
    }

    var closeFns = [];

    roots.forEach(function (root) {
      var embedUrl = root.getAttribute("data-video-embed");
      var openBtn = root.querySelector("[data-video-open]");
      var dialog = root.querySelector("[data-video-dialog]");
      var iframe = root.querySelector("[data-video-iframe]");
      var closeBtn = root.querySelector("[data-video-close]");
      var backdrop = root.querySelector("[data-video-backdrop]");
      if (!embedUrl || !openBtn || !dialog || !iframe) return;

      function isOpen() {
        return !dialog.hasAttribute("hidden");
      }

      function buildEmbedSrc() {
        try {
          var u = new URL(embedUrl);
          if (u.hostname === "www.youtube.com" || u.hostname === "youtube.com") {
            u.hostname = "www.youtube-nocookie.com";
          }
          u.searchParams.set("playsinline", "1");
          u.searchParams.set("rel", "0");
          u.searchParams.set("enablejsapi", "1");
          u.searchParams.set("autoplay", "1");
          u.searchParams.set("mute", "1");
          var loc = window.location;
          if (loc.protocol === "http:" || loc.protocol === "https:") {
            u.searchParams.set("origin", loc.origin);
          }
          return u.toString();
        } catch (e) {
          return embedUrl;
        }
      }

      function openModal() {
        if (isOpen()) return;
        iframe.setAttribute("src", buildEmbedSrc());
        dialog.classList.remove("hidden");
        dialog.classList.add("flex");
        dialog.removeAttribute("hidden");
        openBtn.setAttribute("aria-expanded", "true");
        lockScroll();
        window.setTimeout(function () {
          if (closeBtn) closeBtn.focus();
        }, 0);
      }

      function closeModal() {
        if (!isOpen()) return;
        iframe.removeAttribute("src");
        dialog.classList.add("hidden");
        dialog.classList.remove("flex");
        dialog.setAttribute("hidden", "");
        openBtn.setAttribute("aria-expanded", "false");
        unlockScroll();
        openBtn.focus();
      }

      closeFns.push(closeModal);

      openBtn.addEventListener("click", openModal);

      openBtn.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal();
        }
      });

      if (closeBtn) {
        closeBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          closeModal();
        });
      }
      if (backdrop) {
        backdrop.addEventListener("click", closeModal);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      closeFns.forEach(function (fn) {
        fn();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVideoModals);
  } else {
    initVideoModals();
  }

  /**
   * Depoimentos: animação ao entrar na viewport (substitui framer-motion whileInView).
   */
  function initTestimonialsReveal() {
    var grid = document.querySelector("[data-testimonials-grid]");
    if (!grid || !window.IntersectionObserver) {
      if (grid) grid.classList.add("is-in-view");
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          grid.classList.add("is-in-view");
          io.disconnect();
        });
      },
      { root: null, rootMargin: "0px 0px -12% 0px", threshold: 0.2 }
    );

    io.observe(grid);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTestimonialsReveal);
  } else {
    initTestimonialsReveal();
  }

  var WA_BASE = "https://wa.me/5524999784591?text=";

  function waUrlForProduct(productName) {
    var msg =
      "Olá! Vim pelo site da Valepan e gostaria de um orçamento para: " + productName + ".";
    return WA_BASE + encodeURIComponent(msg);
  }

  function diametroParaGramatura(g) {
    var m = {
      50: "8,5–9,5 cm",
      60: "9,5–10,5 cm",
      65: "10,5–11,5 cm",
      75: "11–12 cm",
    };
    return m[g] || "—";
  }

  function embalagemCompacta(g, idPrefix) {
    if (idPrefix === "hot") return "48 un.";
    if (idPrefix === "mini") return "144 un.";
    if (g === 50) return "60 un.";
    if (g === 60 || g === 65 || g === 75) return "48 un.";
    return "Consulte";
  }

  var PRODUTOS_HAMBURGUER = [
    {
      name: "Hambúrguer Brioche",
      grams: [50, 60, 65, 75],
      img: "assets/img/produtos/brioche.webp",
      desc:
        "Brioche macio, levemente adocicado, com boa estrutura para montagens gourmet e alto padrão visual.",
    },
    {
      name: "Hambúrguer Tradicional com Gergelim",
      grams: [50, 60, 65, 75],
      img: "assets/img/produtos/gergelim.webp",
      desc:
        "Linha tradicional com gergelim no topo — aparência clássica e textura crocante que valoriza o sanduíche.",
    },
    {
      name: "Hambúrguer Tradicional",
      grams: [50, 60, 65, 75],
      img: "assets/img/produtos/tradicional.webp",
      desc:
        "O clássico da casa: formato estável, miolo uniforme e performance na chapa para alto volume.",
    },
    {
      name: "Hambúrguer Brioche com Gergelim",
      grams: [60, 65],
      img: "assets/img/produtos/brioche-com-gergelim.webp",
      desc:
        "Brioche com acabamento de gergelim — combina sabor amanteigado com o contraste visual e crocante do topo.",
    },
    {
      name: "Hambúrguer Tradicional Pincelado",
      grams: [50, 60, 65, 75],
      img: "assets/img/produtos/tradicional-pincelado.webp",
      desc:
        "Tradicional com acabamento pincelado, realçando cor e brilho na vitrine e na entrega.",
    },
    {
      name: "Hambúrguer Pretzel",
      grams: [60],
      img: "assets/img/produtos/pretzel.webp",
      desc:
        "Estilo pretzel com sabor marcante e casca característica — ideal para cardápios diferenciados.",
    },
    {
      name: "Hambúrguer Brioche Premium",
      grams: [60, 65],
      img: "assets/img/produtos/premium.webp",
      desc:
        "Brioche de perfil premium para operações que buscam presença forte no prato e excelente maciez.",
    },
    {
      name: "Hambúrguer Australiano",
      grams: [50, 60, 65],
      img: "assets/img/produtos/australiano.webp",
      desc:
        "Australian bun com formato redondo e topo levemente polvilhado — ótimo para smash e burgers médios.",
    },
    {
      name: "Hambúrguer Brioche Gergelim Duo",
      grams: [60, 65],
      img: "assets/img/produtos/brioche-gergelim-duo.webp",
      desc:
        "Brioche com gergelim em duas faces, para um visual simétrico e crocância em cima e embaixo.",
    },
    {
      name: "Hambúrguer Brioche Royal",
      grams: [60],
      img: "assets/img/produtos/royal.webp",
      desc:
        "Brioche Royal com perfil elevado — destaque em cardápios signature e sanduíches mais altos.",
    },
    {
      name: "Hambúrguer Brioche Royal Ouro",
      grams: [60],
      img: "assets/img/produtos/royal-ouro.webp",
      desc:
        "Linha Royal Ouro: acabamento dourado e presença premium para conceitos de alto padrão.",
    },
  ];

  var PRODUTOS_HOTDOG = [
    {
      name: "Hot Dog",
      grams: [70],
      img: "assets/img/produtos/hot-dog.webp",
      desc:
        "Pão para hot dog em 70 g — formato clássico para dogueiras, quiosques e operações de alto giro.",
    },
    {
      name: "Hot Dog Brioche",
      grams: [70],
      img: "assets/img/produtos/hot-dog-brioche.webp",
      desc:
        "Linha brioche para hot dog, 70 g: maciez, leve adocicado e ótimo contraste com molhos e linguiça.",
    },
    {
      name: "Hot Dog Big",
      grams: [90],
      img: "assets/img/produtos/hot-dog-big.webp",
      desc:
        "Hot dog em formato maior, 90 g, pensado para recheios generosos e sanduíche com presença no prato.",
    },
  ];

  var PRODUTOS_MINI = [
    {
      name: "Mini Brioche",
      grams: [20],
      img: "assets/img/produtos/mini.webp",
      desc:
        "Mini brioche de 20 g para sliders, eventos e degustações — mesmo padrão Valepan em tamanho compacto.",
    },
    {
      name: "Mini Cortado",
      grams: [20],
      img: "assets/img/produtos/mini-cortado.webp",
      desc:
        "Mini brioche de 20 g já cortado — mesmo padrão Valepan, pronto para montagem rápida em sliders, eventos e degustações.",
    },
  ];

  var CATALOG_TABS = [
    { id: "hamb", label: "Hambúrguer", products: PRODUTOS_HAMBURGUER },
    { id: "hot", label: "Hot dog", products: PRODUTOS_HOTDOG },
    { id: "mini", label: "Mini brioche", products: PRODUTOS_MINI },
  ];

  function escHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildSpecRows(grams, idPrefix) {
    return grams
      .map(function (g) {
        return (
          "<tr><td>" +
          escHtml(String(g)) +
          " g</td><td>" +
          escHtml(diametroParaGramatura(g)) +
          "</td><td>" +
          escHtml(embalagemCompacta(g, idPrefix)) +
          "</td></tr>"
        );
      })
      .join("");
  }

  function buildProductCard(p, index, idPrefix) {
    var panelId = "painel-produto-" + idPrefix + "-" + index;
    var gramsChips = p.grams
      .map(function (g) {
        return '<span class="product-reveal-card__gram">' + escHtml(String(g)) + " g</span>";
      })
      .join("");
    var imgBlock = p.img
      ? '<img src="' +
        escHtml(p.img) +
        '" alt="' +
        escHtml("Foto do produto: " + p.name) +
        '" width="800" height="600" loading="' +
        (index < 3 ? "eager" : "lazy") +
        '" decoding="async">'
      : '<div class="product-reveal-card__placeholder" role="img" aria-label="Imagem do produto em breve">Foto em breve</div>';
    var wa = escHtml(waUrlForProduct(p.name));
    var cutBadgeHtml =
      idPrefix === "hamb"
        ? '<span class="product-reveal-card__cut-badge" title="Entregamos o pão já cortado, pronto para montar o sanduíche.">Já vem cortado</span>'
        : "";
    return (
      '<article class="product-reveal-card h-full w-full max-w-sm justify-self-center" role="listitem" data-product-card>' +
      '<div class="product-reveal-card__shell flex h-full min-h-[28rem] flex-col">' +
      '<div class="product-reveal-card__media shrink-0">' +
      imgBlock +
      '<div class="product-reveal-card__gradient" aria-hidden="true"></div>' +
      cutBadgeHtml +
      "</div>" +
      '<div class="product-reveal-card__body flex flex-1 flex-col">' +
      '<h3 class="product-reveal-card__title">' +
      escHtml(p.name) +
      "</h3>" +
      '<div class="product-reveal-card__grams" aria-label="Gramaturas disponíveis">' +
      gramsChips +
      "</div>" +
      '<button type="button" class="product-reveal-card__toggle mt-auto" data-product-toggle aria-expanded="false" aria-controls="' +
      escHtml(panelId) +
      '">' +
      '<span class="material-symbols-outlined text-lg" aria-hidden="true">expand_more</span>' +
      "Ver detalhes" +
      "</button>" +
      "</div>" +
      '<div class="product-reveal-card__overlay" id="' +
      escHtml(panelId) +
      '" role="region" aria-label="Detalhes de ' +
      escHtml(p.name) +
      '">' +
      '<button type="button" class="product-reveal-card__close" data-product-close aria-label="Fechar detalhes">' +
      '<span class="material-symbols-outlined" aria-hidden="true">close</span>' +
      "</button>" +
      '<div class="product-reveal-card__overlay-inner">' +
      "<h4>Detalhes do produto</h4>" +
      '<p class="product-reveal-card__overlay-desc">' +
      escHtml(p.desc) +
      "</p>" +
      '<div class="product-reveal-card__spec-wrap">' +
      '<table class="product-reveal-card__spec">' +
      "<caption class=\"sr-only\">Gramatura, diâmetro de referência e total de unidades por caixa</caption>" +
      "<thead><tr>" +
      '<th scope="col"><span class="material-symbols-outlined product-reveal-card__spec-ico" aria-hidden="true">scale</span><span class="sr-only"> Gramatura</span></th>' +
      '<th scope="col"><span class="material-symbols-outlined product-reveal-card__spec-ico" aria-hidden="true">radio_button_unchecked</span><span class="sr-only"> Diâmetro (referência)</span></th>' +
      '<th scope="col"><span class="material-symbols-outlined product-reveal-card__spec-ico" aria-hidden="true">inventory_2</span><span class="sr-only"> Unidades por caixa</span></th>' +
      "</tr></thead>" +
      "<tbody>" +
      buildSpecRows(p.grams, idPrefix) +
      "</tbody></table></div>" +
      '<div class="product-reveal-card__actions">' +
      '<a class="product-reveal-card__btn product-reveal-card__btn--primary" href="' +
      wa +
      '" target="_blank" rel="noopener">' +
      '<span class="material-symbols-outlined text-lg" aria-hidden="true">shopping_cart</span>' +
      "Solicitar orçamento" +
      "</a>" +
      "</div></div></div></div></article>"
    );
  }

  function bindProductCardHandlers(root) {
    root.querySelectorAll("[data-product-card]").forEach(function (card) {
      var toggle = card.querySelector("[data-product-toggle]");
      var closeBtn = card.querySelector("[data-product-close]");

      if (toggle) {
        toggle.addEventListener("click", function (e) {
          e.stopPropagation();
          var open = !card.classList.contains("is-open");
          card.classList.toggle("is-open", open);
          toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          card.classList.remove("is-open");
          if (toggle) toggle.setAttribute("aria-expanded", "false");
          if (toggle) toggle.focus();
        });
      }
    });
  }

  function renderProductGrid(root, products, idPrefix) {
    if (!root || !products.length) return;
    var html = products
      .map(function (p, i) {
        return buildProductCard(p, i, idPrefix);
      })
      .join("");
    root.innerHTML = html;
    bindProductCardHandlers(root);
  }

  function initProductCatalog() {
    var root = document.querySelector("[data-product-catalog]");
    var tabRoot = document.querySelector("[data-catalog-tab-root]");
    var tablist = document.querySelector("[data-catalog-tablist]");
    var panel = document.querySelector("[data-catalog-panel]");
    if (!root || !tabRoot || !tablist || !CATALOG_TABS.length) return;

    var activeIndex = 0;
    var tabButtons = [];

    function closeAllOpenCards() {
      document.querySelectorAll(".product-reveal-card.is-open").forEach(function (card) {
        card.classList.remove("is-open");
        var t = card.querySelector("[data-product-toggle]");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    }

    function setActiveTab(index, focusTab) {
      if (index < 0 || index >= CATALOG_TABS.length) return;
      closeAllOpenCards();
      activeIndex = index;
      var tab = CATALOG_TABS[index];
      tabRoot.setAttribute("data-active-tab", String(index));

      tabButtons.forEach(function (btn, j) {
        var sel = j === index;
        btn.setAttribute("aria-selected", sel ? "true" : "false");
        btn.setAttribute("tabindex", sel ? "0" : "-1");
      });

      if (panel) {
        panel.setAttribute("aria-labelledby", "tab-catalog-" + tab.id);
      }

      renderProductGrid(root, tab.products, tab.id);

      if (focusTab && tabButtons[index]) {
        tabButtons[index].focus();
      }
    }

    tablist.innerHTML = CATALOG_TABS.map(function (t, i) {
      return (
        '<button type="button" role="tab" class="valepan-catalog-tabs__tab" id="tab-catalog-' +
        escHtml(t.id) +
        '" data-tab-index="' +
        i +
        '" aria-selected="' +
        (i === 0 ? "true" : "false") +
        '" aria-controls="produtos-catalogo-panel" tabindex="' +
        (i === 0 ? "0" : "-1") +
        '">' +
        escHtml(t.label) +
        "</button>"
      );
    }).join("");

    tabButtons = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));

    tabButtons.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        setActiveTab(i, false);
      });
    });

    tablist.addEventListener("keydown", function (e) {
      var key = e.key;
      var next = activeIndex;
      if (key === "ArrowRight" || key === "ArrowDown") {
        e.preventDefault();
        next = (activeIndex + 1) % CATALOG_TABS.length;
      } else if (key === "ArrowLeft" || key === "ArrowUp") {
        e.preventDefault();
        next = (activeIndex - 1 + CATALOG_TABS.length) % CATALOG_TABS.length;
      } else if (key === "Home") {
        e.preventDefault();
        next = 0;
      } else if (key === "End") {
        e.preventDefault();
        next = CATALOG_TABS.length - 1;
      } else {
        return;
      }
      setActiveTab(next, true);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      document.querySelectorAll(".product-reveal-card.is-open").forEach(function (card) {
        card.classList.remove("is-open");
        var t = card.querySelector("[data-product-toggle]");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    });

    function applyGooStrength() {
      var goo = document.getElementById("valepan-gooey");
      if (!goo) return;
      var blur = window.matchMedia("(min-width: 768px)").matches ? 14 : 9;
      var blurEl = goo.querySelector("feGaussianBlur");
      if (blurEl) blurEl.setAttribute("stdDeviation", String(blur));
    }

    applyGooStrength();
    window.addEventListener("resize", applyGooStrength, { passive: true });

    setActiveTab(0, false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProductCatalog);
  } else {
    initProductCatalog();
  }

  /** Splash bordô → crossfade quando o vídeo do hero puder reproduzir */
  function initHeroEntrySplash() {
    var splash = document.getElementById("hero-entry-splash");
    if (!splash) return;

    var reduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var video = document.getElementById("hero-bg-video");

    document.body.classList.add("hero-entry-splash-active");

    var finished = false;
    function dismiss() {
      if (finished) return;
      finished = true;
      splash.setAttribute("aria-busy", "false");
      splash.classList.add("hero-entry-splash--exiting");
      document.body.classList.remove("hero-entry-splash-active");

      function removeSplash() {
        if (splash.parentNode) splash.parentNode.removeChild(splash);
      }

      splash.addEventListener(
        "transitionend",
        function (ev) {
          if (ev.propertyName === "opacity") removeSplash();
        },
        { once: true }
      );

      window.setTimeout(removeSplash, reduced ? 120 : 450);
    }

    var maxMs = reduced ? 1800 : 3200;
    var maxTimer = window.setTimeout(dismiss, maxMs);

    function onReady() {
      window.clearTimeout(maxTimer);
      window.requestAnimationFrame(dismiss);
    }

    if (video) {
      if (video.readyState >= 3) {
        onReady();
      } else {
        video.addEventListener("canplay", onReady, { once: true });
        video.addEventListener(
          "error",
          function () {
            onReady();
          },
          { once: true }
        );
      }
    } else {
      onReady();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroEntrySplash);
  } else {
    initHeroEntrySplash();
  }
})();
