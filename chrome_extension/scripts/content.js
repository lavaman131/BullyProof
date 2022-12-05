import axios from 'axios'
const Selectors = {
    "tweet": `article[role="article"][data-testid="tweet"]`,
    "tweet_text": `[data-testid="tweetText"]`
};
const blockedSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;width: 30px;height: 30px;fill: #0389ff;" xml:space="preserve">
<g>
	<g>
		<path d="M356.174,311.652c-7.804,0-195.238,0-200.348,0c-9.22,0-16.696,7.475-16.696,16.696v100.174    c0,9.22,7.475,16.696,16.696,16.696c5.173,0,192.739,0,200.348,0c9.22,0,16.696-7.475,16.696-16.696V328.348    C372.87,319.127,365.394,311.652,356.174,311.652z M205.913,411.826h-33.391v-66.783h33.391V411.826z M272.696,411.826h-33.391    v-66.783h33.391V411.826z M339.478,411.826h-33.391v-66.783h33.391V411.826z"/>
	</g>
</g>
<g>
	<g>
		<path d="M406.261,247.741v-97.48C406.261,67.407,338.854,0,256,0S105.739,67.407,105.739,150.261v97.48    c-19.432,6.892-33.391,25.45-33.391,47.215v166.956c0,27.618,22.469,50.087,50.087,50.087h267.13    c27.618,0,50.087-22.469,50.087-50.087V294.957C439.652,273.191,425.692,254.633,406.261,247.741z M139.13,150.261    c0-64.442,52.428-116.87,116.87-116.87s116.87,52.428,116.87,116.87v94.609h-33.391v-94.609c0-46.03-37.448-83.478-83.478-83.478    s-83.478,37.448-83.478,83.478v94.609H139.13V150.261z M306.087,150.261v94.609H205.913v-94.609    c0-27.618,22.469-50.087,50.087-50.087C283.618,100.174,306.087,122.643,306.087,150.261z M406.261,461.913    c0,9.206-7.49,16.696-16.696,16.696h-267.13c-9.206,0-16.696-7.49-16.696-16.696V294.957c0-9.206,7.49-16.696,16.696-16.696    c6.786,0,249.266,0,267.13,0c9.206,0,16.696,7.49,16.696,16.696V461.913z"/>
	</g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>`
//const for explanation of folded tweet
const HiddenHint = "One tweet has been hidden by BullyProof.";
let blockedOnThisPage = 0

class TweetManager {
    ele;
    isNegative = false;
    constructor(ele) {
        this.ele = ele;
    }
    async start() {
        await this.query();
        this.make();
    }
    query() {

        let text = this.ele.querySelector(Selectors.tweet_text)?.innerText || "";
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({
                type: "npi-negative-check",
                text
            /*get result from the function */
            }, result => {
                this.isNegative = result;
                resolve(result);
            });
        });
    }
    make() {
        this.ele.parentNode.classList.add("bullyproof-handled");
        /*if the result is negative:*/
        if (this.isNegative) {
            blockedOnThisPage += 1;
            this.ele.parentNode.classList.add("bullyproof-negative");
            const twitterHandleElem = this.ele.querySelector('a > [dir=ltr] > span.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0')
            const twitterHandle = twitterHandleElem.innerHTML
            console.log(twitterHandle)
            let block = document.createElement('div')
            block.className = 'block-user'
            block.style.width = '30px'
            block.style.height = '30px'
            block.innerHTML = `
                ${blockedSvg}
            `
            let bar = document.createElement("div");
            bar.className = "bullyproof-tweet-status-bar";
            bar.innerHTML = html`
                <span class="bullyproof-bar-status"></span>
                <span style="flex-grow:1"></span>
                <span class="bullyproof-slide-button">
                    <svg style="fill: currentColor;" t="1665645131069" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="2556" xmlns:xlink="http://www.w3.org/1999/xlink" width="14"
                        height="20">
                        <path
                            d="M76.4 290.3c-17.5 17.5-17.5 45.8 0 63.3l370.2 370.2c35 35 91.7 35 126.6 0l372.9-372.9c17.3-17.3 17.5-45.3 0.5-62.8-17.4-17.9-46.1-18.1-63.8-0.5L541.6 628.9c-17.5 17.5-45.8 17.5-63.3 0L139.8 290.3c-17.5-17.4-45.9-17.4-63.4 0z"
                            p-id="2557"></path>
                    </svg>
                </span>
            `;
            bar.appendChild(block)
            bar.querySelector('.block-user').addEventListener('click', (e)=>{
                console.log('clicked')
            })
            this.ele.parentNode.insertBefore(bar, this.ele.nextSibling);
            /* displaying the hidden message */
            bar.querySelector(".bullyproof-bar-status").innerText = HiddenHint;
            this.hide();

            bar.querySelector(".bullyproof-slide-button").addEventListener("click", (e) => {
                if (this.isShow) {
                    bar.querySelector(".bullyproof-bar-status").style.opacity = 1;
                    e.currentTarget.classList.remove("bullyproof-slide-button-up");
                    this.hide();
                } else {
                    bar.querySelector(".bullyproof-bar-status").style.opacity = 0;
                    e.currentTarget.classList.add("bullyproof-slide-button-up");
                    this.show();
                }
            });

        } else {
            this.ele.parentNode.classList.add("bullyproof-positive");
        }
    }
    isShow = true;
    eleHeight;
    hide(animation = true) {
        if (!this.isShow) return;
        let startHeight = this.eleHeight = this.ele.clientHeight;
        this.ele.style.opacity = 0;
        if (animation) {
            this.ele.style.height = startHeight + "px";
            this.isShow = false;
            requestAnimationFrame(() => {
                if (this.isShow) return;
                this.ele.style.height = "0px";
                this.ele.addEventListener("transitionend", () => {
                    if (this.isShow) return;
                    this.ele.style.display = "none";
                });
            });
        } else {
            this.ele.style.display = "none";
        }
    }
    show() {
        if (this.isShow) return;
        this.isShow = true;
        this.ele.style.opacity = 1;
        this.ele.style.height = "0px";
        this.ele.style.display = "";
        requestAnimationFrame(() => {
            if (!this.isShow) return;
            this.ele.style.height = this.eleHeight + "px";
            this.ele.addEventListener("transitionend", () => {
                if (!this.isShow) return;
                this.ele.style.height = "";
            });
        });
    }
}
let handlingTweetEles = new Set();
watchBodyChange(() => {
    // console.log("change");
    for (let ele of document.querySelectorAll(Selectors.tweet)) {
        if (handlingTweetEles.has(ele)) continue;
        handlingTweetEles.add(ele);
        new TweetManager(ele).start();
    }
    chrome.storage.local.set({blockedOnThisPage});
});

function watchBodyChange(onchange) {

    let timeout; //for time limitation 10ms

    let observer = new MutationObserver(() => {
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                onchange();
            }, 0);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

}
function html(n, ...args) {
    let re = [];
    for (let i = 0; i < n.length; i++) {
        re.push(n[i]);
        args[i] && re.push(args[i]);
    }
    return re.join("");
}