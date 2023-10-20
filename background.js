chrome.action.onClicked.addListener((tab) => {
    openUrlInAPrivateWindow(tab.url)
});

function openUrlInAPrivateWindow(url){
    chrome.windows.create({"url": url, "incognito": true});
}