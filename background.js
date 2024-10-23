chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get(["selectors"], (result) => {
    if (chrome.runtime.lastError) {
      console.error("Error accessing chrome.storage.local:", chrome.runtime.lastError.message);
      return;
    }
    const selectors = result.selectors || [];
  console.log("Retrieved selectors from storage:", selectors);

    if (tab.id) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: (selectors) => {
            selectors.forEach((selector) => {
              const element = document.querySelector(selector);
              if (element) {
                element.style.display = "none";
                console.log(`Hid element with selector: ${selector}`);
              } else {
                console.log(`Selector not found: ${selector}`);
              }
            });
          },
          args: [selectors],
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error("Error injecting JavaScript:", chrome.runtime.lastError.message);
          } else {
            console.log("JavaScript injected successfully!");
          }
        }
      );
    }
  });
});
