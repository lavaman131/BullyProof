import {default_keywords} from "../data/negative-words.js";
import { axios } from './../node_modules/axios'

const backend = "http://127.0.0.1:8000"

const saveKeywordsButton = document.getElementById('save-keywords-button')
const keywordsInput = document.querySelector("#keywords-input");
const checkedToggle = document.getElementById("checked-toggle")
const loginTwitter = document.getElementById('login-twitter')
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
    useDefaultKeywords = !useDefaultKeywords;
    setStatusUI();
    chrome.storage.local.set({useDefaultKeywords});
});

infoIcon.addEventListener("click", (activeTab) => {
    var newURL = "options/default_keywords.html";
    chrome.tabs.create({ url: newURL });
});
loginTwitter.addEventListener('click',(ev) => {
    const getUrl = backend + '/api/twitter-url'
    axios.get(getUrl)
    .then(res => res.json())
    .then(data => {
        console.log(data['data']['twitter_url'])
        const url = data['data']['twitter_url']
        chrome.tabs.create({url})
    })
})
setStatusUI();
/*
const raceKeywords = {
    'asian':asianKw,
    'white':whiteKw,
    'black':blackKw,
    'latinx':latinxKw,
    'jewish':jewishKw,
    'lgbtq':lgbtqKw,
    'muslim':muslimKw,
}

const appendNegativeKeywords = (choice) => {
    let set = {default_keywords:{...raceKeywords[choice]}};
    if(useDefaultKeywords){

        set = {default_keywords:{...default_keywords,...raceKeywords[choice]}}
    }
    chrome.storage.local.set(set);
    console.log(set)
}

const options = document.querySelectorAll("#race > option")
options.forEach(option => {
    console.log(option.id)
    if(raceKeywords.hasOwnProperty(option.id)){
        option.addEventListener('click',()=>{
            appendNegativeKeywords(option.id)
        })        
    }
})

*/