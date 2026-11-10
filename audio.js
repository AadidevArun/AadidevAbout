(function () {
  var audio = document.getElementById("bgAudio");
  var btn = document.getElementById("audioToggle");
  if (!audio || !btn) return;

  var isPlaying = sessionStorage.getItem("audioPlaying") === "true";
  var savedTime = parseFloat(sessionStorage.getItem("audioTime") || "0");

  audio.currentTime = savedTime;
  if (isPlaying) {
    audio.play().catch(function () {});
    btn.classList.add("playing");
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
  }

  btn.addEventListener("click", function () {
    if (audio.paused) {
      audio.play();
      btn.classList.add("playing");
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
      sessionStorage.setItem("audioPlaying", "true");
    } else {
      audio.pause();
      btn.classList.remove("playing");
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
      sessionStorage.setItem("audioPlaying", "false");
    }
  });

  // Save timestamp before leaving page
  window.addEventListener("beforeunload", function () {
    sessionStorage.setItem("audioTime", audio.currentTime);
    sessionStorage.setItem("audioPlaying", !audio.paused);
  });
})();