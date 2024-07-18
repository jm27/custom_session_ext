document.addEventListener("DOMContentLoaded", () => {
  const saveSessionButton = document.getElementById("saveSession");
  const sessionNameInput = document.getElementById("sessionName");
  const sessionsUL = document.getElementById("sessionsUL");

  const loadSessions = () => {
    while (sessionsUL.firstChild) {
      sessionsUL.removeChild(sessionsUL.firstChild);
    }
    chrome.storage.local.get(null, (sessions) => {
      for (let sessionName in sessions) {
        let sessionLI = document.createElement("li");
        sessionLI.className = "session";
        let sessionTitle = document.createElement("span");
        sessionTitle.textContent = sessionName;

        let openButton = document.createElement("button");
        openButton.textContent = "OPEN";
        openButton.addEventListener("click", () => {
          chrome.runtime.sendMessage({ action: "openSession", sessionName });
        });

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "DELETE";
        deleteButton.addEventListener("click", () => {
          chrome.runtime.sendMessage({ action: "deleteSession", sessionName });
        });

        sessionLI.appendChild(sessionTitle);
        sessionLI.appendChild(openButton);
        sessionLI.appendChild(deleteButton);
        sessionLI.appendChild(document.createElement("br"));
        sessionsUL.appendChild(sessionLI);
      }
    });
  };

  saveSessionButton.addEventListener("click", () => {
    let sessionName = sessionNameInput.value;
    if (sessionName) {
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        let session = tabs.map((tab) => ({ url: tab.url, title: tab.title }));
        chrome.runtime.sendMessage(
          { action: "saveSession", sessionName, session },
          loadSessions
        );
      });
    }
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "refreshSessions") {
      loadSessions();
    }
  });

  loadSessions();
});
