/* ==========================================================================
   nav.js
   Controls: mobile hamburger menu open/close behaviour and highlighting the
   active page link in both the desktop nav and the mobile slide-down panel.
   ========================================================================== */

(function () {
  function highlightActiveLink() {
    var page = document.body.getAttribute("data-page") || "home";
    document.querySelectorAll(".nav-links a, .nav-mobile-panel a").forEach(function (link) {
      if (link.dataset.page === page) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function setupHamburger() {
    var toggle = document.querySelector(".nav-toggle");
    var panel = document.querySelector(".nav-mobile-panel");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", function () {
      var isOpen = panel.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        panel.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setupRevealObserver() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach(function (el) { observer.observe(el); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    highlightActiveLink();
    setupHamburger();
    setupRevealObserver();
  });
})();
