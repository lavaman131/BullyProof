import {keywords} from "../data/negative-words.js";

let toggleButton = document.querySelector("#toggle-button");
// let keywordsInput = document.querySelector("#keywords-input");
// let saveKeywordsButton = document.querySelector("#save-keywords-button");

let active = false;

let setStatusUI = () => {
    if (active) {
        document.querySelector('#toggle-button img').src = "/images/ON_lock.svg";
    } else {
        document.querySelector('#toggle-button img').src = "/images/OFF_lock.svg";
    }
};

chrome.storage.local.get(["active", "keywords"], local => {
    active = !!local.active;
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

