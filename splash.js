/* ==========================================================================
   splash.js
   Controls: the cinematic intro splash sequence on index.html only. Plays
   once per browser session (sessionStorage flag "splashPlayed"), then
   instantly hides on subsequent page loads within the same session.
   Sequence: dust fades in -> content lockup fades in (no card/box) -> small
   avatar brand mark springs in -> "Aadidev" writes itself on with a
   travelling pen tip (signature script wipe) -> "ARUN" drops in bold,
   letter by letter, with a green gradient fill -> "DevNation" signs on ->
   hold -> dissolve out. No glow/halo effects anywhere in the sequence.
   ========================================================================== */

(function () {
  var SESSION_KEY = "splashPlayed";

  function buildSplashDOM(splash) {
    var dustSpans = "";
    for (var i = 0; i < 20; i++) {
      var top = Math.round(Math.random() * 100);
      var left = Math.round(Math.random() * 100);
      var delay = (Math.random() * 4).toFixed(2);
      dustSpans += '<span style="top:' + top + '%; left:' + left + '%; animation-delay:' + delay + 's;"></span>';
    }

    splash.innerHTML =
      '<div class="splash-dust" id="splash-dust">' + dustSpans + '</div>' +
      '<div class="splash-content" id="splash-content">' +
        '<div class="splash-avatar-wrap" id="splash-avatar-wrap">' +
          '<img id="splash-avatar-img" alt="Aadidev DevNation channel avatar" ' +
          'src="assets/images/favicon.png">' +
        '</div>' +
        '<div class="splash-script-row">' +
          '<span class="splash-script" id="splash-script">Aadidev</span>' +
          '<span class="splash-pen" id="splash-pen"></span>' +
        '</div>' +
        '<div class="splash-lastname" id="splash-lastname"></div>' +
        '<p class="splash-sub" id="splash-sub">DevNation</p>' +
      '</div>';

    var lastNameContainer = splash.querySelector("#splash-lastname");
    "ARUN".split("").forEach(function (ch) {
      var span = document.createElement("span");
      span.className = "l-letter";
      span.textContent = ch;
      lastNameContainer.appendChild(span);
    });
    var dot = document.createElement("span");
    dot.className = "l-dot";
    lastNameContainer.appendChild(dot);

    var img = splash.querySelector("#splash-avatar-img");
    img.addEventListener("error", function () {
      var wrap = splash.querySelector("#splash-avatar-wrap");
      wrap.innerHTML = '<div class="splash-fallback-mark" aria-hidden="true">A</div>';
    });
  }

  function playSplash(splash) {
    document.body.classList.add("splash-active");

    // dust drifts in immediately
    requestAnimationFrame(function () {
      splash.querySelector("#splash-dust").classList.add("show");
    });

    // content lockup fades in, no boxed card (0.2s -> 0.7s)
    setTimeout(function () {
      splash.querySelector("#splash-content").classList.add("show");
    }, 200);

    // small avatar brand mark springs in (0.4s -> 1.0s)
    setTimeout(function () {
      splash.querySelector("#splash-avatar-wrap").classList.add("show");
    }, 400);

    // "Aadidev" writes itself on, pen tip travels alongside (1.0s -> 2.05s)
    setTimeout(function () {
      splash.querySelector("#splash-script").classList.add("draw");
      splash.querySelector("#splash-pen").classList.add("draw");
    }, 1000);

    // "ARUN" drops in bold, staggered 90ms per letter, dot lands last (2.2s -> 3.0s)
    setTimeout(function () {
      var letters = splash.querySelectorAll(".l-letter, .l-dot");
      letters.forEach(function (letter, i) {
        setTimeout(function () {
          letter.classList.add("show");
        }, i * 90);
      });
    }, 2200);

    // "DevNation" signature tag (3.1s -> 3.7s)
    setTimeout(function () {
      splash.querySelector("#splash-sub").classList.add("show");
    }, 3100);

    // hold (3.7s -> 4.1s) — intentional pause to let it breathe

    // exit: content lockup dissolves out (4.1s -> 4.6s)
    setTimeout(function () {
      splash.querySelector("#splash-content").classList.add("fade-out");
    }, 4100);

    setTimeout(function () {
      splash.classList.add("splash-exit");
      document.body.classList.remove("splash-active");
    }, 4750);

    setTimeout(function () {
      splash.classList.add("splash-hidden");
      sessionStorage.setItem(SESSION_KEY, "true");
    }, 5150);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var splash = document.getElementById("splash-screen");
    if (!splash) return;

    if (sessionStorage.getItem(SESSION_KEY)) {
      splash.classList.add("splash-hidden");
      document.body.classList.remove("splash-active");
      return;
    }

    buildSplashDOM(splash);
    playSplash(splash);
  });
})();
