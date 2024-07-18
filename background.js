console.log("Background script loaded");

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveSession") {
    chrome.storage.local.set({ [message.sessionName]: message.session }, () => {
      console.log(`Session ${message.sessionName} saved.`);
      chrome.runtime.sendMessage({ action: "refreshSessions" });
      if (sendResponse) sendResponse();
    });
  } else if (message.action === "openSession") {
    chrome.storage.local.get([message.sessionName], (result) => {
      let session = result[message.sessionName];
      if (session) {
        session.forEach((tab) => {
          chrome.tabs.create({ url: tab.url });
        });
      }
    });
  } else if (message.action === "deleteSession") {
    chrome.storage.local.remove(message.sessionName, () => {
      console.log(`Session ${message.sessionName} deleted.`);
      chrome.runtime.sendMessage({ action: "refreshSessions" });
      if (sendResponse) sendResponse();
    });
  }
});
