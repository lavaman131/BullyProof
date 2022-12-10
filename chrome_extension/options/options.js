import axios from "axios";

const backend = "https://twitter-api-v7hjlveoxa-ue.a.run.app";

const saveKeywordsButton = document.getElementById("save-keywords-button");
const keywordsInput = document.querySelector("#keywords-input");
const checkedToggle = document.getElementById("checked-toggle");
const loginTwitter = document.querySelector("#login-twitter");

let blockedUsersDiv = document.getElementById("blocked-users");

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

loginTwitter.addEventListener("click", (ev) => {
  const getUrl = backend + "/api/twitter-url";
  axios.get(getUrl).then(({ data }) => {
    console.log(data["data"]["twitter_url"]);
    const url = data["data"]["twitter_url"];
    chrome.tabs.create({ url });
  });
});

const createProfileNode = (username, profAt, profPic, url) => {
  const html = ` 
                <a
                href='https://twitter.com/${profAt}'
                >
                    <div
                    class="w-[200px] mb-3 flex flex-row px-3 rounded-md border-3 bg-slate-500 items-center">
                        <img src="${profPic}">
                        <div
                        class='ml-[10px] overflow-hidden'>
                            <p class="text-xl font-bold text-white">${username}</p>
                            <p class="text-lg text-slate-500">@${profAt}</p>
                        </div>
                    </div>
                </a>
                `;
  return html;
};

chrome.storage.local.get(["user_id"], (local) => {
  const getBlockedUsersUrl = `${backend}/userInfo/blocked?user_id=${local.user_id}`;
  const getMutedUsersUrl = `${backend}/userInfo/muted?user_id=${local.user_id}`;
  /*
    const { data:t } = {"data":[[{"username":"Prathkum","name":"Pratham","profile_image_url":"https://pbs.twimg.com/profile_images/1595527852849475584/wmWSJ1UY_normal.jpg","id":856155592578158592},{"username":"youyuxi","name":"Evan You","profile_image_url":"https://pbs.twimg.com/profile_images/1206997998900850688/cTXTQiHm_normal.jpg","id":182821975},{"username":"TwitterDev","name":"Twitter Dev","profile_image_url":"https://pbs.twimg.com/profile_images/1445764922474827784/W2zEPN7U_normal.jpg","id":2244994945},{"username":"victorhwn","name":"Vic","profile_image_url":"https://pbs.twimg.com/profile_images/1524938445776633856/-aQ-l1SI_normal.jpg","id":2398639614},{"username":"trashh_dev","name":"trash","profile_image_url":"https://pbs.twimg.com/profile_images/1519915519922507776/vptxGS9I_normal.jpg","id":721561293040324608},{"username":"ThePrimeagen","name":"ThePrimeagen","profile_image_url":"https://pbs.twimg.com/profile_images/1510770649559547908/zd9t45gH_normal.jpg","id":291797158},{"username":"catalinmpit","name":"Catalin Pit","profile_image_url":"https://pbs.twimg.com/profile_images/1594274868387889154/BGjP25UN_normal.jpg","id":173057927},{"username":"DevSimplified","name":"Web Dev Simplified","profile_image_url":"https://pbs.twimg.com/profile_images/1086003406488113153/XBSj69e5_normal.jpg","id":1004145357369069570},{"username":"traversymedia","name":"Brad Traversy","profile_image_url":"https://pbs.twimg.com/profile_images/856983737426423809/6jebtwP-_normal.jpg","id":870038005},{"username":"codeSTACKr","name":"Jesse Hall #vsCodeHero 🦸‍♂️","profile_image_url":"https://pbs.twimg.com/profile_images/1379478790015967241/lnVy5ef1_normal.jpg","id":1141856600904388608},{"username":"MMeldrumDotCom","name":"MarkMeldrum.com","profile_image_url":"https://pbs.twimg.com/profile_images/1001508592325971968/f4j7LtoC_normal.jpg","id":2377180999},{"username":"reactjs","name":"React","profile_image_url":"https://pbs.twimg.com/profile_images/446356636710363136/OYIaJ1KK_normal.png","id":1566463268},{"username":"vercel","name":"Vercel","profile_image_url":"https://pbs.twimg.com/profile_images/1252531684353998848/6R0-p1Vf_normal.jpg","id":4686835494},{"username":"fireship_dev","name":"Fireship","profile_image_url":"https://pbs.twimg.com/profile_images/1436819851566219267/HEffZjvP_normal.jpg","id":850333483339730945}],{},[],{"result_count":14}],"status":200,"message":"successful info look up"}
    console.error(t)
    let data = t[0]
    data.forEach(({username : profAt, name : username, profile_image_url : profPic}) => {
        blockedUsersDiv.insertAdjacentHTML('beforeend',createProfileNode(username, profAt, profPic))
    })
    */
  axios.get(getBlockedUsersUrl).then(({ data: res }) => {
    console.error(res);
    const { data: t } = res;
    console.error(t);
    let g = t[0];
    console.error(g);
    g.forEach(
      ({
        username: profAt,
        name: username,
        profile_image_url: profPic,
        url,
      }) => {
        blockedUsersDiv.insertAdjacentHTML(
          "beforeend",
          createProfileNode(username, profAt, profPic, url)
        );
      }
    );
  });
  axios.get(getMutedUsersUrl).then(({ data: res }) => {
    console.error(res);
    const { data: t } = res;
    console.error(t);
    let g = t[0];
    console.error(g);
    g.forEach(
      ({
        username: profAt,
        name: username,
        profile_image_url: profPic,
        url,
      }) => {
        blockedUsersDiv.insertAdjacentHTML(
          "beforeend",
          createProfileNode(username, profAt, profPic, url)
        );
      }
    );
  });
});
