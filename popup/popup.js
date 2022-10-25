import {keywords} from "../data/negative-words.js";

let toggleButton = document.querySelector("#toggle-button");
let settingsButton = document.querySelector("#settings-button");
let blockedCounter = document.querySelector('#blocked-counter');

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

