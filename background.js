/*For future API usage */
const NegativeScoreLevel = 0.6;
/* Filter function: */
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log(msg);
    if (msg && msg.type == "npi-negative-check") {

        chrome.storage.local.get(null, function (local) {
            if (local.active) {

                /*detect if the keywords is in the tweet before the sentiment Analysis*/
                for (let keyword of local.keywords || []) {
                    if (msg.text.toLowerCase().includes(keyword.toLowerCase())) {
                        /*RETURN TRUE if contain keywords*/
                        sendResponse(true);
                        return;
                    }
                }                   
            } else {
                sendResponse(false);
            } 
           
        });
        return true;
    }
});

// Keep track of the history query so save the efficiency when tweets got reloaded
let queryHistoryMap = new Map();

//for future usage of query API (retrive history map + new sentient score)

async function query(text) {

    if (queryHistoryMap.has(text)) return queryHistoryMap.get(text);

    /*random score, need API score embedded */
    return {
        score: 0.8,// Math.random(),
        error: false
    }; 
}