// chrome.action.onClicked.addListener((tab) => {
//   console.log("Extension clicked! Tab ID:", tab.id);


//   if (tab.id) {
//     chrome.scripting.executeScript(
//       {
//         target: { tabId: tab.id },
//         func: () => {
//           console.log("Injected script running...");
//           const wallOverlay = document.querySelector('.wall-overlay');
//           const paywallMain = document.querySelector('#paywall-main');

//           if (wallOverlay) {
//             wallOverlay.style.background = 'none';
//             console.log('Removed background of .wall-overlay');
//           } else {
//             console.log('.wall-overlay not found');
//           }

//           if (paywallMain) {
//             paywallMain.style.display = 'none';
//             console.log('Hid #paywall-main');
//           } else {
//             console.log('#paywall-main not found');
//           }
//         }
//       },
//       () => {
//         if (chrome.runtime.lastError) {
//           console.error("Error injecting JavaScript:", chrome.runtime.lastError.message);
//         } else {
//           console.log("JavaScript injected successfully!");
//         }
//       }
//     );
//   }
// });

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
