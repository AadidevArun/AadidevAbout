(function () {
  function setupLightbox() {
    var tiles = Array.prototype.slice.call(document.querySelectorAll(".masonry .tile"));
    var lightbox = document.getElementById("lightbox");
    if (!tiles.length || !lightbox) return;

    var lbImage = lightbox.querySelector(".lb-image");
    var lbCaption = lightbox.querySelector(".lb-caption");
    var lbClose = lightbox.querySelector(".lb-close");
    var currentIndex = 0;

    function render(index) {
      currentIndex = (index + tiles.length) % tiles.length;
      var tile = tiles[currentIndex];
      var img = tile.querySelector("img");
      lbImage.innerHTML = "";
      var cap = tile.querySelector("span"); if (lbCaption && cap) lbCaption.textContent = cap.textContent;

      if (img) {
        var fullImg = document.createElement("img");
        fullImg.src = img.src;
        fullImg.alt = img.alt;
        fullImg.style.cssText = "max-width:100%;max-height:80vh;border-radius:12px;display:block;";
        lbImage.appendChild(fullImg);
      } else {
        lbImage.style.background = window.getComputedStyle(tile).background;
        lbImage.style.cssText = "width:500px;height:500px;border-radius:12px;";
      }
    }

    function open(index) {
      render(index);
      lightbox.classList.add("open");
      new Audio("click.mp3").play();
      lbClose.focus();
    }

    function close() {
      lightbox.classList.remove("open");
    }

    function next() { render(currentIndex + 1); }
    function prev() { render(currentIndex - 1); }

    tiles.forEach(function (tile, i) {
      tile.addEventListener("click", function () { open(i); });
      tile.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(i);
        }
      });
    });

    lbClose.addEventListener("click", close);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    // arrow buttons
    var lbPrev = lightbox.querySelector(".lb-prev");
    var lbNext = lightbox.querySelector(".lb-next");
    if (lbPrev) lbPrev.addEventListener("click", function (e) { e.stopPropagation(); prev(); });
    if (lbNext) lbNext.addEventListener("click", function (e) { e.stopPropagation(); next(); });

    // touch swipe
    var touchStartX = 0;
    lightbox.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener("touchend", function (e) {
      var touchEndX = e.changedTouches[0].clientX;
      var diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) next(); else prev();
      }
    }, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", setupLightbox);
})();