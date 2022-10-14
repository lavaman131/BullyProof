console.log("popup.js");

let toggleButton = document.querySelector("#toggle-button");
let keywordsInput = document.querySelector("#keywords-input");
let saveKeywordsButton = document.querySelector("#save-keywords-button");

let active = false;

let setStatusUI = () => {
    if (active) {
        toggleButton.classList.add("active");
        toggleButton.setAttribute("data-status", "ON");
    } else {
        toggleButton.classList.remove("active");
        toggleButton.setAttribute("data-status", "OFF");
    }
};

chrome.storage.local.get(["active", "keywords"], local => {
    active = !!local.active;
    setStatusUI();
    if (local.keywords && local.keywords.length) {
        keywordsInput.value = local.keywords.join("\n") + "\n";
    }
});

toggleButton.addEventListener("click", () => {
    active = !active;
    chrome.storage.local.set({
        active
    });
    setStatusUI();
});

saveKeywordsButton.addEventListener("click", () => {
    let keywords = keywordsInput.value.split("\n").map(s => s.trim()).filter(s => s);
    chrome.storage.local.set({
        keywords
    }, () => {
        saveKeywordsButton.textContent = "Saved";
        setTimeout(() => {
            saveKeywordsButton.textContent = "Save";
        }, 1000);
    });
});

