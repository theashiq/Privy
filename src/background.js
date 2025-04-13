/** Start of - Action Button */
chrome.action.onClicked.addListener(async (tab) => {
    if(tab.url != 'chrome://extensions/'){
        var privateTab = await findOrCreatePrivateTab()

        if(privateTab != undefined){
            privateTab.url = tab.url
            chrome.tabs.update( privateTab.id, {"url": tab.url});
        }
    }
});

chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
    if (tab.incognito) {
        chrome.action.disable(tab.id);
    }
});
/** End of - Action Button */

/** Start of - Context Menu Items */
chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: "privysearch",
        title: "Search Privately",
        type: 'normal',
        contexts: ['selection']
    });
});

chrome.contextMenus.onClicked.addListener(async (item, tab) => {
    var searchTab = await findOrCreatePrivateTab()

    if(searchTab != undefined){
        performSearch(searchTab.id, item.selectionText);
    }
});

function performSearch(tabId, text){
    chrome.search.query({ tabId, text });
}

/** End of - Context Menu Items */

async function findOrCreatePrivateTab(){
    var privateTab = undefined;

    var currentWindow = await chrome.windows.getCurrent();
    if (currentWindow.incognito) {
        privateTab = await createTabInWindow(currentWindow);
    }
    else{
        var allExistingWindows = await chrome.windows.getAll();
        var existingPrivateWindow = allExistingWindows.find((window) => { return window.incognito; });
        if (existingPrivateWindow != undefined) {
            await chrome.windows.update( existingPrivateWindow.id, {"focused": true});
            privateTab = await createTabInWindow(existingPrivateWindow);
        }
    }

    if (privateTab == undefined) {
        let newWindow = await chrome.windows.create({ "incognito": true, "focused": true });
        privateTab = newWindow.tabs[0];
    }

    return privateTab
}

function createTabInWindow(window) {
    return chrome.tabs.create({ "active": true, "windowId": window.id });
}