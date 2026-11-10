/* ==========================================================================
   theme.js
   Controls: theme switching (default / football / cricket), persistence via
   localStorage, the floating theme-switcher pill, the custom mouse cursor,
   and the ambient background element injected on every page.
   ========================================================================== */

(function () {
  var STORAGE_KEY = "aadidev-theme";
  var html = document.documentElement;

  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function setTheme(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updatePillState(theme);
  }

  function updatePillState(theme) {
    var buttons = document.querySelectorAll(".theme-pill button");
    buttons.forEach(function (btn) {
      btn.classList.toggle("is-active", btn.dataset.theme === theme);
    });
  }

  function initTheme() {
    var pageForced = document.body.getAttribute("data-force-theme");
    var stored = getStoredTheme();

    if (pageForced) {
      // cricket.html / football.html auto-switch on load, but only the
      // first time the page is opened in this stored preference chain —
      // they still respect manual switching afterwards via the pill.
      setTheme(pageForced);
    } else if (stored) {
      setTheme(stored);
    } else {
      setTheme("default");
    }
  }

  function buildPill() {
    var existing = document.querySelector(".theme-pill");
    if (existing) return existing;

    var pill = document.createElement("div");
    pill.className = "theme-pill";
    pill.setAttribute("role", "group");
    pill.setAttribute("aria-label", "Theme switcher");

    var options = [
      { theme: "default", emoji: "🏠", label: "Home theme" },
      { theme: "football", emoji: "⚽", label: "Football theme" },
      { theme: "cricket", emoji: "🏏", label: "Cricket theme" }
    ];

    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.dataset.theme = opt.theme;
      btn.setAttribute("aria-label", opt.label);
      btn.title = opt.label;
      btn.textContent = opt.emoji;
      btn.addEventListener("click", function () {
        setTheme(opt.theme);
      });
      pill.appendChild(btn);
    });

    document.body.appendChild(pill);
    return pill;
  }

  function buildCursor() {
    if (document.getElementById("cursor-dot")) return;
    var dot = document.createElement("div");
    dot.id = "cursor-dot";
    dot.innerHTML =
      '<svg class="cursor-football" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="12" cy="12" r="10" fill="#fff" stroke="#14213d" stroke-width="1"/>' +
      '<path d="M12 5l3 4-1 5-2 2-2-2-1-5z" fill="#14213d"/></svg>' +
      '<svg class="cursor-ball" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="12" cy="12" r="10" fill="#cc0000" stroke="#7a0000" stroke-width="1"/>' +
      '<path d="M2 12 Q12 8 22 12" fill="none" stroke="#f6efe2" stroke-width="1"/>' +
      '<path d="M2 12 Q12 16 22 12" fill="none" stroke="#f6efe2" stroke-width="1"/></svg>';
    document.body.appendChild(dot);

    var spinAngle = 0;
    window.addEventListener("mousemove", function (e) {
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
      if (html.getAttribute("data-theme") === "football") {
        spinAngle += 6;
        dot.querySelector(".cursor-football").style.transform = "rotate(" + spinAngle + "deg)";
      }
      if (html.getAttribute("data-theme") === "cricket") {
        spinAngle += 4;
        dot.querySelector(".cursor-ball").style.transform = "rotate(" + spinAngle + "deg)";
      }
    });

    window.addEventListener("mousedown", function () { document.body.setAttribute("data-cursor-down", ""); });
    window.addEventListener("mouseup", function () { document.body.removeAttribute("data-cursor-down"); });
  }

  function buildAmbient() {
    if (document.querySelector(".ambient")) return;
    var amb = document.createElement("div");
    amb.className = "ambient";
    amb.innerHTML =
      '<span class="shape"></span><span class="shape"></span>' +
      '<span class="shape"></span><span class="shape"></span>';
    document.body.appendChild(amb);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    buildPill();
    buildCursor();
    buildAmbient();
  });
})();
