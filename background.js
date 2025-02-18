chrome.action.onClicked.addListener((tab) => {
    console.log("Extension icon clicked");  // Debugging log
    if (tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("about://")) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
      console.log("Script injected successfully.");  // Debugging log
    } else {
      console.log("Can't inject script into chrome:// or about:// pages.");
    }
  });
  