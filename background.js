/** Start of - Action Button */
chrome.action.onClicked.addListener((tab) => {
    chrome.windows.create(
        {
            "url": tab.url,
            "incognito": true
        }
    );
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

    var selectedTab = undefined;

    var currentWindow = await chrome.windows.getCurrent();
    if (currentWindow.incognito) {
        selectedTab = await createTabInWindow(currentWindow);
    }
    else{
        var allExistingWindows = await chrome.windows.getAll();
        var existingPrivateWindow = allExistingWindows.find((window) => { return window.incognito; });
        if (existingPrivateWindow != undefined) {
            selectedTab = await createTabInWindow(existingPrivateWindow);
        }
    }

    if (selectedTab == undefined) {
        let newWindow = await chrome.windows.create({ "incognito": true });
        selectedTab = newWindow.tabs[0];
    }

    performSearch(selectedTab.id, item.selectionText);
});

function performSearch(tabId, text){
    chrome.search.query({ tabId, text });
}

function createTabInWindow(window) {
    return chrome.tabs.create({ "active": true, "windowId": window.id });
}
/** End of - Context Menu Items */