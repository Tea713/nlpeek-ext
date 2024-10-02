export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggle-summarization") {
      const isEnabled = message.isOn;

      chrome.storage.sync.set({ summarizationEnabled: isEnabled }, () => {
        console.log(`Summarization enabled: ${isEnabled}`);
      });

      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id!, {
            action: "summarization-state",
            isOn: isEnabled,
          });
        });
      });

      sendResponse({ status: "success" });
    }
  });
});
