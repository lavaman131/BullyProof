const saveKeywordsButton = document.getElementById("save-keywords-button");
const keywordsInput = document.querySelector("#keywords-input");
const checkedToggle = document.getElementById("checked-toggle");
let clip = document.querySelector(".vid");

/* Applying mouseover event on video clip
and then we call play() function to play
the video when the mouse is over the video */
clip.addEventListener("mouseover", (e) => {
  clip.play();
});
/* Applying mouseout event on video clip
and then we call pause() function to stop
the video when the mouse is out the video */
clip.addEventListener("mouseout", (e) => {
  clip.pause();
});

chrome.storage.local.get(["keywords_custom"], (local) => {
  update(local.keywords_custom);
});

let update = (array) =>
  saveKeywordsButton.addEventListener("click", () => {
    let val = keywordsInput.value.trim().toLowerCase();
    if (!array.includes(val)) {
      array.push(val);
      chrome.storage.local.set(
        {
          keywords_custom: array,
        },
        () => {
          saveKeywordsButton.textContent = "Saved";
          setTimeout(() => {
            saveKeywordsButton.textContent = "Save";
          }, 1000);
        }
      );
    }
  });

let setStatusUI = (useSmartFilter) => {
  if (useSmartFilter) {
    checkedToggle.setAttribute("checked", true);
  } else {
    checkedToggle.removeAttribute("checked");
  }
};

chrome.storage.local.get(["useSmartFilter"], (local) => {
  let useSmartFilter = !!local.useSmartFilter;
  checkedToggle.addEventListener("click", () => {
    chrome.storage.local.set({
      useSmartFilter: !useSmartFilter,
    });
  });
  setStatusUI(useSmartFilter);
});
