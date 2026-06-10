(function () {
  const alerts = [
    {
      title: "API key withdrawal permission requested",
      severity: "High",
      source: "Website Analysis",
      time: "2 min ago",
      detail: "The page asks for exchange API access that could move funds. Revoke this key and avoid connecting the account."
    },
    {
      title: "Broker license could not be matched",
      severity: "Medium",
      source: "Broker Verification",
      time: "18 min ago",
      detail: "The regulator number appears real, but the broker name and website ownership do not align."
    },
    {
      title: "New investment domain detected",
      severity: "Low",
      source: "Domain Intelligence",
      time: "1 hr ago",
      detail: "The domain age is low and the page contains aggressive investment language."
    }
  ];

  const brokers = [
    { name: "BlueHarbor Capital", jurisdiction: "United Kingdom", license: "FCA 784219", status: "Verified", trustScore: 92 },
    { name: "ApexYield Markets", jurisdiction: "Unknown", license: "Unverified", status: "Flagged", trustScore: 18 },
    { name: "OrbitTrade Pro", jurisdiction: "Seychelles", license: "Pending review", status: "Unknown", trustScore: 54 },
    { name: "NorthBridge FX", jurisdiction: "Australia", license: "ASIC 431882", status: "Verified", trustScore: 86 },
    { name: "CoinMirage Copy Hub", jurisdiction: "Unknown", license: "None", status: "Flagged", trustScore: 11 }
  ];

  const severityClass = (severity) => {
    if (severity === "High" || severity === "Flagged") return "risk-high";
    if (severity === "Medium" || severity === "Unknown") return "risk-medium";
    return "risk-low";
  };

  const initHome = () => {
    document.querySelectorAll("[data-home-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.homeAction;
        if (action === "report") {
          window.TradeShieldUI?.openModal("Report scam", `<p class="ts-muted">A secure report flow would capture the domain, broker name, screenshots, and wallet or bank instructions. Demo reference: <strong>TS-${Date.now().toString().slice(-5)}</strong>.</p><button class="ts-btn ts-btn-primary mt-5 w-full" data-close-modal type="button">Done</button>`);
        }
      });
    });
  };

  const renderAlerts = (filter = "All") => {
    const list = document.querySelector("[data-alert-list]");
    if (!list) return;
    const visible = filter === "All" ? alerts : alerts.filter((alert) => alert.severity === filter);
    list.innerHTML = visible.length ? visible.map((alert, index) => `
      <article class="ts-card alert-row alert-${alert.severity.toLowerCase()} p-5" data-alert-card="${index}" tabindex="0">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span class="risk-badge ${severityClass(alert.severity)}">${alert.severity} risk</span>
            <h3 class="mt-3 text-lg font-black">${alert.title}</h3>
            <p class="mt-2 text-sm ts-muted">${alert.source} · ${alert.time}</p>
          </div>
          <button class="ts-btn ts-btn-secondary" type="button" data-alert-detail="${index}">View Detail</button>
        </div>
      </article>`).join("") : `
      <section class="ts-panel p-8 text-center">
        <h3 class="text-xl font-black">No alerts in this filter</h3>
        <p class="mt-2 ts-muted">TradeShield will surface new threats here as they appear.</p>
      </section>`;
  };

  const initAlerts = () => {
    if (!document.querySelector("[data-alert-list]")) return;
    renderAlerts();
    document.querySelectorAll("[data-alert-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll("[data-alert-filter]").forEach((item) => item.setAttribute("aria-pressed", "false"));
        button.setAttribute("aria-pressed", "true");
        renderAlerts(button.dataset.alertFilter);
        window.TradeShieldUI?.showToast("Alerts filtered", `${button.dataset.alertFilter} risk view loaded.`, "success");
      });
    });
    document.addEventListener("click", (event) => {
      const detail = event.target.closest("[data-alert-detail]");
      if (!detail) return;
      const alert = alerts[Number(detail.dataset.alertDetail)];
      window.TradeShieldUI?.openModal(alert.title, `<span class="risk-badge ${severityClass(alert.severity)}">${alert.severity} risk</span><p class="mt-4 leading-7 ts-muted">${alert.detail}</p><div class="mt-5 rounded-lg border p-4 ts-border"><strong>Recommended action</strong><p class="mt-1 ts-muted">Pause deposits, verify the regulator record directly, and disconnect risky API permissions.</p></div>`);
    });
  };

  const renderBrokers = (query = "") => {
    const table = document.querySelector("[data-broker-results]");
    const profile = document.querySelector("[data-broker-profile]");
    if (!table) return;
    const normalized = query.trim().toLowerCase();
    const results = brokers.filter((broker) => broker.name.toLowerCase().includes(normalized) || broker.status.toLowerCase().includes(normalized) || broker.jurisdiction.toLowerCase().includes(normalized));
    table.innerHTML = results.map((broker) => `
      <tr>
        <td><strong>${broker.name}</strong><p class="text-sm ts-muted">${broker.jurisdiction}</p></td>
        <td>${broker.license}</td>
        <td><span class="risk-badge ${severityClass(broker.status)}">${broker.status}</span></td>
        <td><strong>${broker.trustScore}/100</strong></td>
        <td><button class="ts-btn ts-btn-secondary" type="button" data-broker-select="${broker.name}">Open</button></td>
      </tr>`).join("");
    if (profile && results[0]) {
      const broker = results[0];
      const meterClass = broker.trustScore > 75 ? "meter-low meter-92" : broker.trustScore > 45 ? "meter-medium meter-54" : "meter-high meter-24";
      profile.innerHTML = `<span class="risk-badge ${severityClass(broker.status)}">${broker.status}</span><h2 class="mt-4 text-2xl font-black">${broker.name}</h2><p class="mt-2 ts-muted">${broker.jurisdiction} · ${broker.license}</p><div class="mt-6 risk-meter ${meterClass}"><span>${broker.trustScore}</span></div>`;
    }
  };

  const initBrokers = () => {
    const input = document.querySelector("[data-broker-search]");
    const button = document.querySelector("[data-broker-button]");
    if (!input) return;
    renderBrokers();
    const run = () => {
      window.TradeShieldUI?.setButtonLoading(button, true, "Searching");
      window.setTimeout(() => {
        renderBrokers(input.value);
        window.TradeShieldUI?.setButtonLoading(button, false);
        window.TradeShieldUI?.showToast("Broker lookup complete", "Verification signals have been refreshed.", "success");
      }, 620);
    };
    button?.addEventListener("click", run);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") run();
    });
    document.addEventListener("click", (event) => {
      const select = event.target.closest("[data-broker-select]");
      if (select) {
        input.value = select.dataset.brokerSelect;
        renderBrokers(input.value);
      }
    });
  };

  const initSettings = () => {
    document.querySelectorAll("[data-setting-toggle]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const next = toggle.getAttribute("aria-checked") !== "true";
        toggle.setAttribute("aria-checked", String(next));
        window.TradeShieldUI?.showToast("Preference changed", `${toggle.dataset.settingToggle} ${next ? "enabled" : "disabled"}.`, "success");
      });
    });
    document.querySelector("[data-save-settings]")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      window.TradeShieldUI?.setButtonLoading(button, true, "Saving");
      window.setTimeout(() => {
        window.TradeShieldUI?.setButtonLoading(button, false);
        window.TradeShieldUI?.showToast("Settings saved", "Your TradeShield preferences are active.", "success");
      }, 700);
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    initHome();
    initAlerts();
    initBrokers();
    initSettings();
  });
})();
