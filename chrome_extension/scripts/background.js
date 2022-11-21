/*For future API usage */
const NegativeScoreLevel = 0.6;
/* Filter function: */
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log(msg);
  if (msg && msg.type == "npi-negative-check") {
    chrome.storage.local.get(null, function (local) {
      if (local.active) {
        console.error("active and running");
        const keywords = [...local.keywords_custom, ...local.default_keywords];
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
  }
});

// write logic that uses nlp api to filter negative tweets

//             var myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/json");

// var raw = JSON.stringify([
//   {
//     "id": "abcde",
//     "text": "This is great!"
//   },
//   {
//     "id": "abcdef",
//     "text": "You are stupid!"
//   }
// ]);

// var requestOptions = {
//   method: 'POST',
//   headers: myHeaders,
//   body: raw,
//   redirect: 'follow'
// };

// fetch("http://127.0.0.1:8000/predict/", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));

//         });
//         return true;
//     }
// });

// Keep track of the history query so save the efficiency when tweets got reloaded
let queryHistoryMap = new Map();

//for future usage of query API (retrive history map + new sentient score)

async function query(text) {
  if (queryHistoryMap.has(text)) return queryHistoryMap.get(text);

  /*random score, need API score embedded */
  return {
    score: 0.8, // Math.random(),
    error: false,
  };
}

chrome.runtime.onInstalled.addListener(async () => {
  chrome.action.setBadgeText({
    text: "ON",
  });
  chrome.action.setBadgeBackgroundColor({ color: [0, 255, 0, 0] }, () => {});
});
