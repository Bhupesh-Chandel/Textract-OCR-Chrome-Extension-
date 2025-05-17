
async function addEventToenableButton(enableBtn,status,tabId){
enableBtn.addEventListener("click",async (e)=>{
    let state = enableBtn.innerHTML === 'enable Extension' ? true : false;
    enableBtn.innerHTML = state ? `enabling...` : `disabling`;
    await chrome.storage.local.set({ [tabId] : state});

    chrome.tabs.sendMessage(tabId , {enabled : state},(response) => {
      if (chrome.runtime.lastError) {
        console.error("Message sending failed:", chrome.runtime.lastError.message);
        // Optional: update UI or notify user content script is not injected
        status.innerHTML = "Extension is not active on this tab.";
      } else {
        console.log("Message sent successfully:", response);
        status.innerHTML = state ? "Extension enabled" : "Extension disabled";
      }
    }

    );

    setTimeout(()=>{
      enableBtn.innerHTML= state ? `disable Extension` : `enable Extension`;
    },2000)
})
}


document.addEventListener("DOMContentLoaded", async ()=>{
const enableBtn = document.querySelector("#enableBtn");
const status   = document.getElementById('status');


const tabs = await chrome.tabs.query({active : true , currentWindow :  true});
const activetab = tabs[0];
const tabId = activetab.id;


const url = activetab.url ? activetab.url : '';


if(url.includes("youtube.com")){
    let result = await chrome.storage.local.get(tabId.toString());
    let isEnabled = result[tabId] === true ? true : false;
    status.innerHTML = `This page Support this extension`;
    
    enableBtn.innerHTML = isEnabled ? `disable Extension` : `enable Extension`;

    enableBtn.style.display = "block";



    addEventToenableButton(enableBtn,status,tabId);

}
else{
    status.innerHTML = `This page does not support this extension`;
}


})




