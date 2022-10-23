import {keywords} from "../data/negative-words.js";

let toggleButton = document.querySelector("#toggle-button");
let settingsButton = document.querySelector("#settings-button");
let blockedCounter = document.querySelector('#blocked-counter')
// let keywordsInput = document.querySelector("#keywords-input");
// let saveKeywordsButton = document.querySelector("#save-keywords-button");

let active = false;
let blockedOnThisPage = 0;

let setStatusUI = () => {
    if (active) {
        document.querySelector('#toggle-button img').src = "/images/ON_lock.svg";
    } else {
        document.querySelector('#toggle-button img').src = "/images/OFF_lock.svg";
    }
    blockedCounter.innerHTML = blockedOnThisPage

};

chrome.storage.local.get(["active", "keywords","blockedOnThisPage"], local => {
    local.active
    active = !!local.active;
    blockedOnThisPage = local.blockedOnThisPage
    setStatusUI();
    // if (local.keywords && local.keywords.length) {
    //     keywordsInput.value = local.keywords.join("\n") + "\n";
    // }
});

chrome.storage.local.set({keywords});

toggleButton.addEventListener("click", () => {
    active = !active;
    chrome.storage.local.set({
        active
    });
    setStatusUI();
});

settingsButton.addEventListener("click", () => {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL("options/options.html"));
    }
  });
  
// saveKeywordsButton.addEventListener("click", () => {
//     let keywords = keywordsInput.value.split("\n").map(s => s.trim()).filter(s => s);
//     chrome.storage.local.set({
//         keywords
//     }, () => {
//         saveKeywordsButton.textContent = "Saved";
//         setTimeout(() => {
//             saveKeywordsButton.textContent = "Save";
//         }, 1000);
//     });
// });

