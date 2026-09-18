(function () {
  const ensureToastRegion = () => {
    let region = document.querySelector(".toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    return region;
  };

  const showToast = (title, message = "", type = "info") => {
    const region = ensureToastRegion();
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.dataset.type = type;
    const heading = document.createElement("strong");
    heading.className = "block text-sm";
    heading.textContent = title;
    const detail = document.createElement("span");
    detail.className = "block mt-1 text-sm ts-muted";
    detail.textContent = message;
    toast.append(heading, detail);
    region.appendChild(toast);
    window.setTimeout(() => toast.remove(), 4200);
  };

  const openModal = (title, body) => {
    let modal = document.querySelector("#ts-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "ts-modal";
      modal.className = "modal-backdrop";
      modal.innerHTML = `
        <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div class="flex items-start justify-between gap-4 border-b p-5 ts-border">
            <div>
              <p class="text-xs font-black uppercase tracking-wide ts-muted">TradeShield detail</p>
              <h2 id="modal-title" class="mt-1 text-xl font-black"></h2>
            </div>
            <button class="ts-btn ts-icon-btn" type="button" data-close-modal aria-label="Close modal">x</button>
          </div>
          <div class="modal-body p-5"></div>
        </section>`;
      document.body.appendChild(modal);
    }
    modal.querySelector("#modal-title").textContent = title;
    modal.querySelector(".modal-body").innerHTML = body;
    modal.classList.add("is-open");
    modal.querySelector("[data-close-modal]").focus();
  };

  const closeModal = () => {
    const modal = document.querySelector("#ts-modal");
    if (modal) modal.classList.remove("is-open");
  };

  const setButtonLoading = (button, loading, label = "Working") => {
    if (!button) return;
    if (loading) {
      button.dataset.originalLabel = button.innerHTML;
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
      button.innerHTML = `<span class="ts-loader" aria-hidden="true"></span><span>${label}</span>`;
      return;
    }
    button.disabled = false;
    button.removeAttribute("aria-busy");
    if (button.dataset.originalLabel) button.innerHTML = button.dataset.originalLabel;
  };

  const pulseCard = (element) => {
    if (!element) return;
    element.classList.add("animate-pulse-soft");
    window.setTimeout(() => element.classList.remove("animate-pulse-soft"), 900);
  };

  document.addEventListener("click", (event) => {
    const close = event.target.closest("[data-close-modal]");
    if (close || event.target.classList.contains("modal-backdrop")) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });

  window.TradeShieldUI = {
    showToast,
    openModal,
    closeModal,
    setButtonLoading,
    pulseCard
  };
})();
