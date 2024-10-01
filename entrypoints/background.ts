export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {});
});
