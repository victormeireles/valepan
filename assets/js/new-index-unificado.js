/**
 * Comportamentos da landing new-index-unificado.html (navbar + lead → WhatsApp).
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
