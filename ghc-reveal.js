// ─────────────────────────────────────────────────────────────────────────────
// GHC 2026 — Scroll reveal / IntersectionObserver v1
// ─────────────────────────────────────────────────────────────────────────────
(function(){
  try {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    function each(nodes, cb) {
      Array.prototype.forEach.call(nodes, cb);
    }

    function isInViewport(el) {
      var rect = el.getBoundingClientRect();
      var viewH = window.innerHeight || document.documentElement.clientHeight;
      var viewW = window.innerWidth || document.documentElement.clientWidth;
      return rect.bottom > 0 && rect.right > 0 && rect.top < viewH && rect.left < viewW;
    }

    function revealNow(el) {
      el.classList.add('is-visible');
    }

    function revealAllNow() {
      each(els, revealNow);
    }

    // Baseline safety: never leave content hidden if observers fail.
    revealAllNow();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', revealAllNow, { once: true });
    }
    window.addEventListener('load', revealAllNow, { once: true });

    if (window.location.hash) {
      var hashTarget = null;
      try {
        hashTarget = document.querySelector(window.location.hash);
      } catch (err) {
        hashTarget = null;
      }
      if (hashTarget) {
        var revealParent = typeof hashTarget.closest === "function" ? hashTarget.closest('[data-reveal]') : null;
        if (revealParent) revealNow(revealParent);
      }
    }

    if (!('IntersectionObserver' in window)) {
      revealAllNow();
      return;
    }

    var io = new IntersectionObserver(function(entries){
      each(entries, function(e){ if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }});
    }, {threshold: 0.01, rootMargin: '0px 0px -8% 0px'});
    each(els, function(el){
      if (!el.classList.contains('is-visible')) io.observe(el);
    });
    setTimeout(function(){var n=document.querySelectorAll('[data-reveal]');for(var i=0;i<n.length;i++){n[i].style.opacity='1';n[i].style.transform='none';n[i].style.transition='none';}},900);
  } catch (err) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), function(el) {
      el.classList.add('is-visible');
    });
    console.error('Reveal init failed:', err);
  }
})();
