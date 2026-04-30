// ─────────────────────────────────────────────────────────────────────────────
// GHC 2026 — Stories carousel v1
// ─────────────────────────────────────────────────────────────────────────────
  (function() {
    var carouselInited = false;

    function initCarousel() {
      if (carouselInited) return;

      var track = document.querySelector('.stories-track');
      var dots  = document.querySelectorAll('.carousel-dot');
      var cards = document.querySelectorAll('.story-card');
      var total = cards.length;
      var idx = 0, timer;
      if (!track || !total) return;
      carouselInited = true;

      function go(n) {
        idx = (n + total) % total;
        track.style.transform = 'translateX(-' + (idx * 100) + '%)';
        Array.prototype.forEach.call(dots, function(d, i) { d.classList.toggle('active', i === idx); });
      }

      function start() {
        clearInterval(timer);
        timer = setInterval(function() { go(idx + 1); }, 15000);
      }

      var prevBtn = document.querySelector('.carousel-prev');
      var nextBtn = document.querySelector('.carousel-next');
      if (prevBtn) prevBtn.addEventListener('click', function() { go(idx - 1); start(); });
      if (nextBtn) nextBtn.addEventListener('click', function() { go(idx + 1); start(); });
      Array.prototype.forEach.call(dots, function(d, i) {
        d.addEventListener('click', function() { go(i); start(); });
      });

      start();
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initCarousel, { once: true });
      window.addEventListener("load", initCarousel, { once: true });
    } else {
      initCarousel();
    }
  })();
