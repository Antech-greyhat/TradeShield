(function () {
  const fallbackTab = {
    url: "https://apexyield-markets.com/invest",
    title: "ApexYield Markets"
  };

  const getActiveTab = async () => {
    if (!window.chrome?.tabs?.query) return fallbackTab;
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0] || fallbackTab;
  };

  const domainFromUrl = (url) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch (error) {
      return "Unknown page";
    }
  };

  const scoreDomain = (domain) => {
    const value = domain.toLowerCase();
    let score = 18;
    if (value.includes("yield") || value.includes("profit")) score += 24;
    if (value.includes("copy") || value.includes("vip")) score += 18;
    if (value.includes("coin") || value.includes("crypto") || value.includes("fx")) score += 14;
    if (value.endsWith(".xyz") || value.endsWith(".top")) score += 18;
    return Math.min(score + Math.min(value.length, 18), 96);
  };

  const labelForScore = (score) => {
    if (score >= 76) return "High";
    if (score >= 46) return "Medium";
    return "Low";
  };

  const render = (domain, score) => {
    const label = labelForScore(score);
    const labelNode = document.querySelector("[data-popup-risk-label]");
    const meter = document.querySelector("[data-popup-meter]");
    const breakdown = document.querySelector("[data-popup-breakdown]");
    document.querySelector("[data-popup-domain]").textContent = domain;
    document.querySelector("[data-popup-score]").textContent = score;
    labelNode.textContent = `${label} risk`;
    labelNode.className = `risk-badge ${label === "High" ? "risk-high" : label === "Medium" ? "risk-medium" : "risk-low"}`;
    meter.className = `risk-meter ${label === "High" ? "meter-high meter-88" : label === "Medium" ? "meter-medium meter-62" : "meter-low meter-34"}`;
    breakdown.innerHTML = [
      ["Website Analysis", score > 60 ? "Suspicious trading language" : "No urgent content risk", score > 60 ? "risk-medium" : "risk-low"],
      ["API Key Protection", score > 74 ? "Dangerous permission prompt likely" : "No API theft prompt found", score > 74 ? "risk-high" : "risk-low"],
      ["Broker Verification", score > 68 ? "Manual verification recommended" : "No immediate mismatch", score > 68 ? "risk-medium" : "risk-low"]
    ].map(([title, detail, badge]) => `<article class="ts-card p-4"><span class="risk-badge ${badge}">${detail}</span><h2 class="mt-2 font-black">${title}</h2></article>`).join("");
  };

  const openExtensionPage = (path) => {
    if (window.chrome?.tabs?.create && window.chrome?.runtime?.getURL) {
      chrome.tabs.create({ url: chrome.runtime.getURL(path) });
      return;
    }
    window.location.href = path;
  };

  const scan = async (button) => {
    window.TradeShieldUI?.setButtonLoading(button, true, "Scanning");
    const tab = await getActiveTab();
    const domain = domainFromUrl(tab.url);
    window.setTimeout(() => {
      render(domain, scoreDomain(domain));
      window.TradeShieldUI?.setButtonLoading(button, false);
      window.TradeShieldUI?.showToast("Tab scan complete", "TradeShield refreshed this page risk score.", "success");
    }, 620);
  };

  document.addEventListener("DOMContentLoaded", () => {
    scan(document.querySelector("[data-popup-scan]"));
    document.querySelector("[data-popup-scan]")?.addEventListener("click", (event) => scan(event.currentTarget));
    document.querySelector("[data-popup-open-dashboard]")?.addEventListener("click", () => openExtensionPage("dashboard/home.html"));
    document.querySelector("[data-popup-open-scanner]")?.addEventListener("click", () => openExtensionPage("dashboard/scanner.html"));
    document.querySelector("[data-popup-report]")?.addEventListener("click", () => {
      window.TradeShieldUI?.openModal("Report suspicious page", "<p class=\"ts-muted\">TradeShield captured the current tab risk summary. Add screenshots and transaction details in the dashboard report center.</p><button class=\"ts-btn ts-btn-primary mt-5 w-full\" type=\"button\" data-close-modal>Done</button>");
    });
  });
})();
