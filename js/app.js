(function () {
  const storedTheme = localStorage.getItem("tradeshield-theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
    document.documentElement.classList.add("dark");
  }

  const getUI = () => window.TradeShieldUI || {};

  const setTheme = (theme) => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("tradeshield-theme", theme);
    document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
      const isDark = theme === "dark";
      toggle.setAttribute("aria-checked", String(isDark));
      toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      toggle.dataset.label = isDark ? "Light" : "Dark";
    });
  };

  const currentPath = () => {
    const path = window.location.pathname.replaceAll("\\", "/");
    return path.split("/").pop() || "index.html";
  };

  const initLoaders = () => {
    document.querySelectorAll("[data-card-loading]").forEach((card, index) => {
      card.classList.add("is-loading");
      window.setTimeout(() => card.classList.remove("is-loading"), 450 + index * 80);
    });
    window.setTimeout(() => {
      document.querySelectorAll(".page-loader").forEach((loader) => loader.classList.add("is-hidden"));
    }, 520);
  };

  const initCounters = () => {
    document.querySelectorAll("[data-count-to]").forEach((node) => {
      const target = Number(node.dataset.countTo || "0");
      const suffix = node.dataset.suffix || "";
      const duration = 900;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.round(target * progress);
        node.textContent = `${value.toLocaleString()}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  const initButtons = () => {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("button, a");
      if (!button) return;
      button.classList.add("is-pressed");
      window.setTimeout(() => button.classList.remove("is-pressed"), 160);

      const scrollTarget = button.dataset.scroll;
      if (scrollTarget) {
        event.preventDefault();
        document.querySelector(scrollTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      const feedback = button.dataset.feedback;
      if (feedback) getUI().showToast?.("Action complete", feedback, "success");

      const nav = button.dataset.navigate;
      if (nav) {
        event.preventDefault();
        const ui = getUI();
        ui.setButtonLoading?.(button, true, "Opening");
        window.setTimeout(() => {
          window.location.href = nav;
        }, 520);
      }
    });
  };

  const initThemeToggles = () => {
    const activeTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setTheme(activeTheme);
    document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
        setTheme(next);
        getUI().showToast?.("Appearance updated", `${next === "dark" ? "Dark" : "Light"} mode enabled.`, "success");
      });
    });
  };

  const initNavigationState = () => {
    const page = currentPath();
    document.querySelectorAll("[data-nav-page]").forEach((item) => {
      if (item.dataset.navPage === page) item.setAttribute("aria-current", "page");
    });
  };

  const initExternalActions = () => {
    document.querySelectorAll("[data-copy]").forEach((button) => {
      button.addEventListener("click", async () => {
        await navigator.clipboard?.writeText(button.dataset.copy);
        getUI().showToast?.("Copied", "The report reference was copied.", "success");
      });
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    initLoaders();
    initCounters();
    initButtons();
    initThemeToggles();
    initNavigationState();
    initExternalActions();
  });
})();
