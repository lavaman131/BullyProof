/*For future API usage */
const NegativeScoreLevel = 0.6;
/* Filter function: */
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log(msg);
    if (msg && msg.type == "npi-negative-check") {

        chrome.storage.local.get(null, function (local) {
            if (local.active) {
                console.error('active and running')
                const keywords = [...local.keywords_custom,...local.default_keywords]
                /*detect if the keywords is in the tweet before the sentiment Analysis*/
                for (let keyword of keywords || []) {
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

chrome.runtime.onInstalled.addListener(async () => {
    chrome.action.setBadgeText({
        text: "ON",
    });
    chrome.action.setBadgeBackgroundColor({ color: [0, 255, 0, 0] }, () => { console.error('changed bg color') })
});


// /*For future API usage */
// const NegativeScoreLevel = 0.6;
// /* Filter function: */
// chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
//   console.log(msg);
//   if (msg && msg.type == "npi-negative-check") {
//     chrome.storage.local.get(null, function (local) {
//       if (local.active) {
//         /*detect if the keywords is in the tweet before the sentiment Analysis*/
//         for (let keyword of local.keywords || []) {
//           if (msg.text.toLowerCase().includes(keyword.toLowerCase())) {
//             /*RETURN TRUE if contain keywords*/
//             sendResponse(true);
//             return;
//           }
//         }
//         query(msg.text)
//           .then((result) => {
//             if (result.error || result.score < NegativeScoreLevel) {
//               sendResponse(false);
//             } else {
//               sendResponse(true);
//             }
//           })
//           .catch((err) => {
//             console.log(err);
//             sendResponse(false);
//           });
//       } else {
//         sendResponse(false);
//       }
//     });
//     return true;
//   }
// });

// // Keep track of the history query so save the efficiency when tweets got reloaded
// let queryHistoryMap = new Map();

// //for future usage of query API (retrive history map + new sentient score)

// async function query(text) {
//   if (queryHistoryMap.has(text)) return queryHistoryMap.get(text);

//   /*random score, need API score embedded */
//   //return {
//   //score: 0.8, // Math.random(),
//   // error: false
//   //};
//   //To enable the use of api, just comment out the four lines above

//   let fd = new URLSearchParams();
//   fd.append("text", text);
//   let re = await (
//     await fetch(`https://twinword-sentiment-analysis.p.rapidapi.com/analyze/`, {
//       method: "POST",
//       headers: {
//         "content-type": "application/x-www-form-urlencoded",
//         "X-RapidAPI-Key": "6166ecfcd7mshc7a2765d866847dp1f6cbejsna022d2b243eb",
//         "X-RapidAPI-Host": "twinword-sentiment-analysis.p.rapidapi.com",
//       },
//       body: fd,
//     })
//   ).json();

//   if (re.result_code == "200") {
//     let re = {
//       error: false,
//       score: re.score,
//     };
//     queryHistoryMap.set(text, re);
//     return re;
//   } else {
//     return {
//       error: true,
//     };
//   }
// }