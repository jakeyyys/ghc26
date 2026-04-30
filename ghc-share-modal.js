// ─────────────────────────────────────────────────────────────────────────────
// GHC 2026 — Share modal / fallback links v1
// ─────────────────────────────────────────────────────────────────────────────
  (function() {
    var donateShareModalInited = false;
    var copiedTimer = null;
    var shareTitle = "Grateful Hearts Campaign 2026 — Humanity in Action";
    var shareText = "Help make a difference for Singaporeans in need. Support the Singapore Red Cross Grateful Hearts Campaign 2026.";
    var MODAL_DATA = (typeof GHC_MODAL_DATA !== 'undefined') ? GHC_MODAL_DATA : {};
    function getSharePageBtn() { return document.getElementById("sharePageBtn"); }
    function getShareFallbackRow() { return document.getElementById("shareFallbackRow"); }
    function getShareWhatsapp() { return document.getElementById("shareWhatsapp"); }
    function getShareTelegram() { return document.getElementById("shareTelegram"); }
    function getCopyShareLinkBtn() { return document.getElementById("copyShareLinkBtn"); }
    function getCopyShareConfirm() { return document.getElementById("copyShareConfirm"); }
    function getModalOverlay() { return document.getElementById("modal-overlay"); }
    function getModalContent() { return document.getElementById("modal-content"); }
    function getModalCloseBtn() {
      var modalOverlay = getModalOverlay();
      return modalOverlay ? modalOverlay.querySelector(".modal-close") : null;
    }
    function getHeroShareCta() { return document.getElementById("heroShareCta"); }

    function copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      return new Promise(function(resolve, reject) {
        var input = document.createElement("textarea");
        input.value = text;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        try {
          var copied = document.execCommand("copy");
          document.body.removeChild(input);
          if (copied) resolve();
          else reject(new Error("Copy failed"));
        } catch (err) {
          document.body.removeChild(input);
          reject(err);
        }
      });
    }

    function closeModal() {
      var modalOverlay = getModalOverlay();
      if (!modalOverlay) return;
      modalOverlay.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    function openModal(modalId) {
      var modal = MODAL_DATA[modalId];
      var modalOverlay = getModalOverlay();
      var modalContent = getModalContent();
      if (!modal || !modalOverlay || !modalContent) return;
      modalContent.innerHTML = '<img class="modal-img" src="' + modal.img + '" alt="' + modal.name + '" onerror="this.style.display=\'none\'"><h3 style="color:' + modal.colour + ';">' + modal.name + '</h3><p>' + modal.body + "</p>";
      modalOverlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function initDonateShareModal() {
      if (donateShareModalInited) return;
      donateShareModalInited = true;
      try {
        Array.prototype.forEach.call(document.querySelectorAll(".donate-tier-btn"), function(btn) {
          btn.addEventListener("click", function() {
            Array.prototype.forEach.call(document.querySelectorAll(".donate-tier-btn"), function(node) {
              node.classList.remove("is-selected");
            });
            btn.classList.add("is-selected");
          });
        });

        var sharePageBtn = getSharePageBtn();
        var heroShareCta = getHeroShareCta();
        if (heroShareCta && sharePageBtn) {
          heroShareCta.addEventListener("click", function() { sharePageBtn.click(); });
        }

        if (sharePageBtn) {
          sharePageBtn.addEventListener("click", function() {
            var shareUrl = window.location.href;
            if (navigator.share) {
              navigator.share({
                title: shareTitle,
                text: shareText,
                url: shareUrl
              }).catch(function() {});
              return;
            }
            var shareFallbackRow = getShareFallbackRow();
            if (shareFallbackRow) {
              var encodedUrl = encodeURIComponent(shareUrl);
              var shareWhatsapp = getShareWhatsapp();
              var shareTelegram = getShareTelegram();
              if (shareWhatsapp) {
                shareWhatsapp.href = "https://api.whatsapp.com/send?text=" + encodedUrl;
              }
              if (shareTelegram) {
                shareTelegram.href = "https://t.me/share/url?url=" + encodedUrl;
              }
              shareFallbackRow.style.display = "flex";
            }
          });
        }

        var copyShareLinkBtn = getCopyShareLinkBtn();
        if (copyShareLinkBtn) {
          copyShareLinkBtn.addEventListener("click", function() {
            var copyShareConfirm = getCopyShareConfirm();
            if (!copyShareConfirm) return;
            copyToClipboard(window.location.href).then(function() {
              copyShareConfirm.classList.add("is-visible");
              if (copiedTimer) {
                clearTimeout(copiedTimer);
              }
              copiedTimer = setTimeout(function() {
                copyShareConfirm.classList.remove("is-visible");
              }, 1400);
            }).catch(function() {});
          });
        }

        Array.prototype.forEach.call(document.querySelectorAll(".service-pill"), function(btn) {
          btn.addEventListener("click", function() {
            openModal(btn.getAttribute("data-modal"));
          });
        });

        var modalCloseBtn = getModalCloseBtn();
        if (modalCloseBtn) {
          modalCloseBtn.addEventListener("click", closeModal);
        }

        var modalOverlay = getModalOverlay();
        if (modalOverlay) {
          modalOverlay.addEventListener("click", function(e) {
            if (e.target === modalOverlay) closeModal();
          });
        }

        document.addEventListener("keydown", function(e) {
          var modalOverlay = getModalOverlay();
          if (e.key === "Escape" && modalOverlay && modalOverlay.classList.contains("is-open")) {
            closeModal();
          }
        });
      } catch (err) {
        console.error("Donate/share/modal init failed:", err);
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initDonateShareModal, { once: true });
      window.addEventListener("load", initDonateShareModal, { once: true });
    } else {
      initDonateShareModal();
    }
  })();
