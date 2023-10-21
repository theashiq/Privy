/** Start of - Extension action button functionalities */
chrome.action.onClicked.addListener((tab) => {
    chrome.windows.create(
        { 
            "url": tab.url, 
            "incognito": true 
        }
    );
});

chrome.tabs.onUpdated.addListener(function (tabId , info, tab) {
    if(tab.incognito){
        chrome.action.disable(tab.id);
    }
});
/** End of - Extension action button functionalities */

/** Start of - Extension context menu functionalities */
chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: "privysearch",
        title: "Search Privately",
        type: 'normal',
        contexts: ['selection']
    });
});

chrome.contextMenus.onClicked.addListener(async (item, tab) => {
    performActionOnAPrivateTab((tab)=>{
        chrome.search.query(
            {
                tabId: tab.id,
                text: item.selectionText
            }
        )
    })
});

async function performActionOnAPrivateTab(action){
    await chrome.windows.getAll(undefined, (windows) => {
        var existingPrivateWindow = windows.find((window) => {return window.incognito;})

        if(existingPrivateWindow != undefined){
            chrome.tabs.create({"active": true, "windowId": existingPrivateWindow.id}, (tab) =>{
                action(tab)
                chrome.windows.update( window.id, { "focused" : true } );
            });
        }
        else{
            chrome.windows.create({
                "incognito": true
            },
            (newWindow) => {
                action(newWindow.tabs[0]);
            });
        }
    });
}
/** End of - Extension context menu functionalities */