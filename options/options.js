const saveKeywordsButton = document.getElementById('save-keywords-button')
let keywordsInput = document.querySelector("#keywords-input");
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