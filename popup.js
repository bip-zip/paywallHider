const selectorInput = document.getElementById("selector-input");
const addBtn = document.getElementById("add-btn");
const fireBtn = document.getElementById("fire-btn");
const selectorsList = document.getElementById("selectors-list");

// Load stored selectors and update UI
function loadSelectors() {
  chrome.storage.local.get(["selectors"], (result) => {
    const selectors = result.selectors || [];
    selectorsList.innerHTML = ""; // Clear the list
    selectors.forEach((selector, index) => {
      const item = document.createElement("div");
      item.className = "selector-item";
      item.innerHTML = `
        <span>${selector}</span>
        <button class="remove-btn" data-index="${index}">x</button>
      `;
      selectorsList.appendChild(item);
    });
  });
}

// Add new selector
addBtn.addEventListener("click", () => {
  const newSelector = selectorInput.value.trim();
  if (newSelector) {
    chrome.storage.local.get(["selectors"], (result) => {
      const selectors = result.selectors || [];
      selectors.push(newSelector);
      chrome.storage.local.set({ selectors }, () => {
        selectorInput.value = ""; // Clear input
        loadSelectors(); // Update UI
      });
    });
  }
});

// Remove selector
selectorsList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const index = parseInt(e.target.dataset.index, 10);
    chrome.storage.local.get(["selectors"], (result) => {
      const selectors = result.selectors || [];
      selectors.splice(index, 1);
      chrome.storage.local.set({ selectors }, () => {
        loadSelectors(); // Update UI
      });
    });
  }
});


// // Save selectors to storage
// chrome.storage.local.set({ selectors: [".wall-overlay", "#paywall-main"] }, () => {
//   if (chrome.runtime.lastError) {
//     console.error("Error saving selectors:", chrome.runtime.lastError.message);
//   } else {
//     console.log("Selectors saved successfully!");
//   }
// });

// // Retrieve selectors from storage
// chrome.storage.local.get(["selectors"], (result) => {
//   if (chrome.runtime.lastError) {
//     console.error("Error retrieving selectors:", chrome.runtime.lastError.message);
//   } else {
//     console.log("Retrieved selectors:", result.selectors);
//   }
// });

// Inject logic when Fire button is clicked
fireBtn.addEventListener("click", () => {
  chrome.storage.local.get(["selectors"], (result) => {
    const selectors = result.selectors || [];
    if (selectors.length === 0) {
      alert("No selectors to inject. Please add some first.");
      return;
    }

    // Inject script into the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
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
              window.close();
            }
          }
        );
      }
    });
  });
});

// Initialize
loadSelectors();
