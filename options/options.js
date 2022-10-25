import {default_keywords} from "../data/negative-words.js";

const saveKeywordsButton = document.getElementById('save-keywords-button')
const keywordsInput = document.querySelector("#keywords-input");
const checkedToggle = document.getElementById("checked-toggle")
let infoIcon = document.getElementById('infoIcon')
let useDefaultKeywords = true;

saveKeywordsButton.addEventListener("click", () => {
    let keywords_custom = keywordsInput.value.split("\n").map(s => s.trim()).filter(s => s);
    chrome.storage.local.set({
        keywords_custom
    }, () => {
        saveKeywordsButton.textContent = "Saved";
        setTimeout(() => {
            saveKeywordsButton.textContent = "Save";
        }, 1000);
    });
});

chrome.storage.local.get(["keywords_custom"], local => {
    if (local.keywords_custom && local.keywords_custom.length) {
        keywordsInput.value = local.keywords_custom.join("\n") + "\n";
    }
});

let setStatusUI = () => {
    if (useDefaultKeywords) {
        checkedToggle.setAttribute("checked", true);
        chrome.storage.local.set({default_keywords});
    } else {
        checkedToggle.removeAttribute("checked");
        chrome.storage.local.remove(["default_keywords"]);
    }
};

chrome.storage.local.get(["useDefaultKeywords"], local => {
    useDefaultKeywords = !!local.useDefaultKeywords;
    setStatusUI();
});

checkedToggle.addEventListener("click", () => {
    setStatusUI();
    useDefaultKeywords = !useDefaultKeywords;
    chrome.storage.local.set({useDefaultKeywords});
});

infoIcon.addEventListener("click", (activeTab) => {
    var newURL = "options/default_keywords.html";
    chrome.tabs.create({ url: newURL });
});