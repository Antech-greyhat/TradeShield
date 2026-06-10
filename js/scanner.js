(function () {
  const keywords = ["guaranteed returns", "copy trading", "send API key", "withdrawal permission", "tax clearance fee", "limited deposit bonus"];

  const classifyRisk = (domain) => {
    const value = domain.toLowerCase();
    let score = 22;
    if (value.includes("yield") || value.includes("profit")) score += 18;
    if (value.includes("copy") || value.includes("vip")) score += 18;
    if (value.includes("crypto") || value.includes("fx")) score += 12;
    if (value.endsWith(".xyz") || value.endsWith(".top")) score += 16;
    score += Math.min(value.length, 22);
    return Math.min(score, 96);
  };

  const riskLabel = (score) => {
    if (score >= 76) return "High";
    if (score >= 46) return "Medium";
    return "Low";
  };

  const renderResults = (domain, score) => {
    const label = riskLabel(score);
    const meterClass = label === "High" ? "meter-high meter-88" : label === "Medium" ? "meter-medium meter-62" : "meter-low meter-34";
    const results = document.querySelector("[data-scan-results]");
    if (!results) return;
    results.innerHTML = `
      <div class="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div class="grid place-items-center">
          <div class="risk-meter ${meterClass}" aria-label="${label} risk score ${score}">
            <span>${score}</span>
          </div>
          <span class="risk-badge ${label === "High" ? "risk-high" : label === "Medium" ? "risk-medium" : "risk-low"} mt-4">${label} risk</span>
        </div>
        <div>
          <h2 class="text-2xl font-black">${domain}</h2>
          <p class="mt-2 ts-muted">TradeShield analyzed the domain structure, investment language, broker signals, and API permission prompts.</p>
          <div class="mt-6 grid gap-3 sm:grid-cols-2">
            ${[
              ["Keyword Matches", score > 55 ? "6 suspicious phrases" : "1 low-risk phrase", score > 55 ? "risk-high" : "risk-low"],
              ["API Key Requests", score > 70 ? "Withdrawal access prompt" : "No dangerous prompt", score > 70 ? "risk-high" : "risk-low"],
              ["Domain Age", score > 48 ? "Recently observed" : "Established signals", score > 48 ? "risk-medium" : "risk-low"],
              ["Broker Verification", score > 65 ? "License mismatch" : "No immediate mismatch", score > 65 ? "risk-high" : "risk-low"]
            ].map(([title, detail, badge]) => `
              <article class="ts-card p-4">
                <span class="risk-badge ${badge}">${detail}</span>
                <h3 class="mt-3 font-black">${title}</h3>
              </article>`).join("")}
          </div>
          <div class="mt-6 rounded-lg border p-4 ts-border">
            <strong>Recommended next step</strong>
            <p class="mt-1 ts-muted">${label === "High" ? "Do not deposit funds. Verify the broker from the regulator website and revoke any connected API key." : "Continue only after checking the broker license and domain ownership."}</p>
          </div>
        </div>
      </div>`;
  };

  const initScanner = () => {
    const form = document.querySelector("[data-scan-form]");
    const input = document.querySelector("[data-scan-input]");
    const results = document.querySelector("[data-scan-results]");
    if (!form || !input || !results) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const domain = input.value.trim() || "apexyield-markets.com";
      const button = form.querySelector("button[type='submit']");
      window.TradeShieldUI?.setButtonLoading(button, true, "Analyzing");
      results.innerHTML = `
        <div class="grid gap-4">
          <div class="skeleton h-8 w-56"></div>
          <div class="skeleton h-32 w-full"></div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="skeleton h-24"></div>
            <div class="skeleton h-24"></div>
          </div>
        </div>`;
      window.setTimeout(() => {
        const score = classifyRisk(domain);
        renderResults(domain, score);
        window.TradeShieldUI?.setButtonLoading(button, false);
        window.TradeShieldUI?.showToast("Scan complete", `${domain} returned ${riskLabel(score).toLowerCase()} risk.`, "success");
      }, 1000);
    });
    document.querySelectorAll("[data-sample-domain]").forEach((sample) => {
      sample.addEventListener("click", () => {
        input.value = sample.dataset.sampleDomain;
        form.requestSubmit();
      });
    });
  };

  document.addEventListener("DOMContentLoaded", initScanner);
})();
