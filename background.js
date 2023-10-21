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

chrome.contextMenus.onClicked.addListener((item, tab) => {
    chrome.windows.create({
        "incognito": true
    },
    async (window) => {
        chrome.search.query(
            {
                tabId: window.tabs[0].id,
                text: item.selectionText
            }
        )
    });
});
/** End of - Extension context menu functionalities */