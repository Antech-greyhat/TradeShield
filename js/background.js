chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    protectionEnabled: true,
    installedAt: new Date().toISOString()
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "TRADESHIELD_PAGE_SIGNAL") {
    chrome.storage.local.set({
      lastSignal: {
        url: sender.tab?.url || "",
        score: message.score,
        signals: message.signals,
        checkedAt: new Date().toISOString()
      }
    });
    sendResponse({ ok: true });
  }
  return true;
});
