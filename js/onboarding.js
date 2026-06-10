(function () {
  const slides = [
    {
      title: "Trading Scam Detection",
      badge: "Website scan",
      text: "TradeShield watches for fake broker pages, cloned platforms, pressure tactics, and suspicious investment language before you deposit.",
      score: "92%"
    },
    {
      title: "Broker Verification",
      badge: "License check",
      text: "Compare broker claims against regulator signals, license details, jurisdiction risk, and domain identity clues.",
      score: "86%"
    },
    {
      title: "API Key Protection",
      badge: "Permission guard",
      text: "Detect pages that ask for dangerous exchange API permissions, withdrawal access, or secret keys in unsafe forms.",
      score: "97%"
    },
    {
      title: "Domain Intelligence",
      badge: "Age and trust",
      text: "Spot newly registered domains, impersonation attempts, and fake certificates that often appear in copy-trading scams.",
      score: "78%"
    }
  ];

  let index = 0;

  const renderCarousel = () => {
    const card = document.querySelector("[data-onboarding-card]");
    const dots = document.querySelector("[data-onboarding-dots]");
    const progress = document.querySelector("[data-onboarding-progress]");
    const current = slides[index];
    if (!card || !dots || !progress) return;
    card.classList.remove("animate-slide-up");
    void card.offsetWidth;
    card.classList.add("animate-slide-up");
    card.innerHTML = `
      <div class="flex items-center justify-between gap-3">
        <span class="ts-pill pill-success">${current.badge}</span>
        <strong class="text-3xl font-black text-blue-600">${current.score}</strong>
      </div>
      <h2 class="mt-8 text-2xl font-black sm:text-3xl">${current.title}</h2>
      <p class="mt-4 text-base leading-7 ts-muted">${current.text}</p>
      <div class="mt-8 progress-track" aria-hidden="true">
        <div class="progress-bar progress-${parseInt(current.score, 10)}"></div>
      </div>`;
    dots.innerHTML = slides.map((_, itemIndex) => `<button type="button" class="h-3 w-3 rounded-full ${itemIndex === index ? "bg-blue-600" : "bg-slate-300"}" aria-label="Go to onboarding card ${itemIndex + 1}" data-slide-index="${itemIndex}"></button>`).join("");
    progress.className = `progress-bar progress-${(index + 1) * 25}`;
  };

  const initWelcome = () => {
    if (!document.querySelector("[data-onboarding-card]")) return;
    renderCarousel();
    document.addEventListener("click", (event) => {
      const next = event.target.closest("[data-onboarding-next]");
      const prev = event.target.closest("[data-onboarding-prev]");
      const dot = event.target.closest("[data-slide-index]");
      if (next) {
        if (index < slides.length - 1) {
          index += 1;
          renderCarousel();
          window.TradeShieldUI?.showToast("Progress saved", `Step ${index + 1} of ${slides.length}`, "success");
        } else {
          window.location.href = "guide.html";
        }
      }
      if (prev) {
        index = Math.max(0, index - 1);
        renderCarousel();
      }
      if (dot) {
        index = Number(dot.dataset.slideIndex);
        renderCarousel();
      }
    });
  };

  const initGuide = () => {
    document.querySelectorAll("[data-timeline-step]").forEach((step, stepIndex) => {
      step.addEventListener("click", () => {
        document.querySelectorAll("[data-timeline-step]").forEach((item) => item.classList.remove("ring-4", "ring-blue-100"));
        step.classList.add("ring-4", "ring-blue-100");
        const score = [34, 62, 81, 94][stepIndex];
        const meter = document.querySelector("[data-guide-meter]");
        if (meter) {
          meter.className = `risk-meter meter-${score} ${score > 80 ? "meter-high" : "meter-medium"}`;
          meter.querySelector("span").textContent = score;
        }
        window.TradeShieldUI?.showToast("Detection preview updated", step.dataset.timelineStep, "info");
      });
    });
  };

  const initPermissions = () => {
    const checks = document.querySelectorAll("[data-permission-check]");
    const enable = document.querySelector("[data-enable-protection]");
    const update = () => {
      const complete = Array.from(checks).every((item) => item.checked);
      if (enable) enable.disabled = !complete;
    };
    checks.forEach((item) => item.addEventListener("change", update));
    update();
    enable?.addEventListener("click", () => {
      window.TradeShieldUI?.setButtonLoading(enable, true, "Enabling");
      window.TradeShieldUI?.showToast("Permissions confirmed", "Protection is being enabled.", "success");
      window.setTimeout(() => {
        window.location.href = "../dashboard/home.html";
      }, 900);
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    initWelcome();
    initGuide();
    initPermissions();
  });
})();
