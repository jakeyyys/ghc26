var IDEAS = (typeof GHC_IDEAS !== 'undefined' && Array.isArray(GHC_IDEAS)) ? GHC_IDEAS : [];


  var lastIndex = -1;

  function getRandomIndex() {
    var idx;
    do { idx = Math.floor(Math.random() * IDEAS.length); } while (idx === lastIndex && IDEAS.length > 1);
    return idx;
  }

  function renderIdea(idx) {
    var idea = IDEAS[idx];
    if (!idea) return;
    var starCount = Math.max(1, Math.min(5, Number(idea.difficulty) || 1));
    var starsHtml = '<span style="color:#F5C842;font-size:1em">★</span>'.repeat(starCount) + '<span style="color:#ddd;font-size:1em">☆</span>'.repeat(5 - starCount);
    var cleanLevelUp = (idea.levelUp || "").replace(/^level up:\s*/i, "");
    var card = document.getElementById("ideaCard");
    var typeEl = document.getElementById("ideaType");
    var titleEl = document.getElementById("ideaTitle");
    var sparkEl = document.getElementById("ideaSpark");
    if (!card || !typeEl || !titleEl || !sparkEl) return;
    var levelUp = card.querySelector(".idea-gen-levelup");
    lastIndex = idx;
    typeEl.innerHTML = '<span class="inspo-badge ' + idea.badge + '">' + idea.type + '</span><span class="idea-gen-stars">' + starsHtml + '</span>';
    titleEl.textContent = idea.title;
    sparkEl.textContent = idea.spark;
    if (!levelUp) {
      levelUp = document.createElement("div");
      levelUp.className = "idea-gen-levelup";
      card.appendChild(levelUp);
    }
    levelUp.innerHTML = '<span class="idea-gen-levelup-label">⭐️ Social Challenge</span>' + cleanLevelUp;
  }

  function shuffleIdea() {
    var card = document.getElementById("ideaCard");
    if (!card) {
      renderIdea(getRandomIndex());
      return;
    }
    card.classList.add("fading");
    setTimeout(function() {
      renderIdea(getRandomIndex());
      card.classList.remove("fading");
    }, 220);
  }
  window.shuffleIdea = shuffleIdea;

  (function() {
    var donateShareModalInited = false;
    var copiedTimer = null;
    var shareTitle = "Grateful Hearts Campaign 2026 — Humanity in Action";
    var shareText = "Help make a difference for Singaporeans in need. Support the Singapore Red Cross Grateful Hearts Campaign 2026.";
    var MODAL_DATA = {
      "modal-young-hearts": {
        name: "Young Hearts",
        colour: "#87CEEB",
        img: "modal-young-hearts.png",
        body: "Young Hearts gives children from low-income families a steady place to learn, be guided, and grow. Tutoring, mentorship, and community support — so every child has adults who keep showing up for them."
      },
      "modal-mct": {
        name: "Medical Chaperone & Transport (MCT)",
        colour: "#5CB85C",
        img: "modal-mct.png",
        body: "A medical appointment can be out of reach when getting there is the hardest part. Low-income seniors and people with mobility challenges rely on MCT to travel safely to check-ups and treatment, with help from start to finish. Without it, they may miss appointments, struggle with long waits for transport, or risk travelling alone despite pain, frailty, or unsteady footing."
      },
      "modal-home": {
        name: "HoME+ (Home Monitoring & Eldercare)",
        colour: "#F5C842",
        img: "modal-home.png",
        body: "HoME+ is a non-invasive, 24/7 home monitoring system installed in seniors's homes, with motion sensors and a panic button that connects directly to SCDF for emergencies. When a Mdm Chan pressed hers at 1am during a heart attack, SCDF arrived in 30 minutes. That button saves lives."
      },
      "modal-elderaid": {
        name: "ElderAid",
        colour: "#F4A5A5",
        img: "modal-elderaid.png",
        body: "ElderAid provides befriending and social support for seniors at risk of isolation — regular visits, phone check-ins, and linkage to community services. Because loneliness is a health risk too."
      },
      "modal-rchd": {
        name: "Red Cross Home for the Disabled (RCHD)",
        colour: "#F4A5A5",
        img: "modal-rchd.png",
        body: "RCHD provides round-the-clock residential care for individuals with profound physical and intellectual disabilities — trained nursing staff, therapeutic programmes, and a real home for those who need lifelong support."
      },
      "modal-dac": {
        name: "Day Activity Centre (DAC)",
        colour: "#87CEEB",
        img: "modal-dac.png",
        body: "The Day Activity Centre offers daily structured programmes for adults with disabilities — therapy, skills training, and social engagement in a safe and caring environment, giving caregivers the support they need too."
      },
      "modal-meals": {
        name: "Meals with Love",
        colour: "#87CEEB",
        img: "modal-meals.png",
        body: "Meals with Love works with community partners to deliver food support for families going through a hard season — giving them breathing room to recover and get back on their feet. In 2025, over 600 families were supported."
      },
      "modal-steady": {
        name: "Steady Steps",
        colour: "#5CB85C",
        img: "modal-steady.png",
        body: "Steady Steps supports families facing financial stress with practical assistance and stability coaching — helping them build a firmer foundation so the next hard season doesn't knock them over."
      },
      "modal-chow": {
        name: "Community Health outreach for Wellness (CHoW)",
        colour: "#F5C842",
        img: "modal-chow.png",
        body: "CHoW supports migrant workers and domestic helpers in Singapore with a focus on holistic health — particularly mental wellbeing and self-care. Through wellness talks, sports activities, and community outings, SRC creates a space for connection and belonging. <br/><br/> Over 14,000 migrant workers and domestic helpers have been reached, with SRC aiming to be a home away from home for every one of them."
      }
    };
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

  // Idea generator init — standalone, not coupled to share/modal setup
  (function() {
    var ideasInited = false;
    function _initIdeas() {
      if (ideasInited) return;
      if (!IDEAS || !IDEAS.length) return;
      ideasInited = true;
      renderIdea(getRandomIndex());
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", _initIdeas, { once: true });
      window.addEventListener("load", _initIdeas, { once: true });
    } else {
      _initIdeas();
    }
    setTimeout(function() {
      var titleEl = document.getElementById("ideaTitle");
      if (titleEl && titleEl.textContent.trim() === "Loading...") {
        titleEl.innerHTML = 'Loading... &nbsp;<a href="javascript:location.reload()" style="font-size:0.78rem;font-weight:600;color:#C8102E;text-decoration:underline;text-underline-offset:2px;">Refresh page</a>';
      }
    }, 3000);
  })();
