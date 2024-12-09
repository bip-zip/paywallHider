chrome.action.onClicked.addListener((tab) => {
  console.log("Extension clicked! Tab ID:", tab.id);


  if (tab.id) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => {
          console.log("Injected script running...");
          const wallOverlay = document.querySelector('.wall-overlay');
          const paywallMain = document.querySelector('#paywall-main');

          if (wallOverlay) {
            wallOverlay.style.background = 'none';
            console.log('Removed background of .wall-overlay');
          } else {
            console.log('.wall-overlay not found');
          }

          if (paywallMain) {
            paywallMain.style.display = 'none';
            console.log('Hid #paywall-main');
          } else {
            console.log('#paywall-main not found');
          }
        }
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
