(function () {
  const bodyText = document.body?.innerText?.toLowerCase() || "";
  const signals = [];
  const checks = [
    ["guaranteed returns", 18],
    ["risk-free", 14],
    ["copy trading", 12],
    ["api key", 20],
    ["withdrawal permission", 28],
    ["deposit bonus", 12],
    ["tax clearance fee", 18]
  ];

  let score = 10;
  checks.forEach(([phrase, weight]) => {
    if (bodyText.includes(phrase)) {
      score += weight;
      signals.push(phrase);
    }
  });

  score = Math.min(score, 96);
  if (window.chrome?.runtime?.sendMessage) {
    chrome.runtime.sendMessage({
      type: "TRADESHIELD_PAGE_SIGNAL",
      score,
      signals
    });
  }
})();
