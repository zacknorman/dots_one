chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch ( request.action) {
            case 'newTab' : {
               chrome.tabs.getCurrent(function(tab){
                    chrome.tabs.remove(tab.id)
               })

                chrome.tabs.create({url: chrome.extension.getURL('index.html' + request.hash)})
            } break
        }
        return true
    }
)

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({'url': chrome.extension.getURL('index.html')}, function (tab) {
  });
});

chrome.runtime.onInstalled.addListener(function(details){

    var thisVersion = chrome.runtime.getManifest().version;

    if (details.reason == 'update')
        chrome.tabs.create({url: chrome.extension.getURL('index.html?update=1&prev=' + details.previousVersion + '&now=' + thisVersion)})

});

if(chrome.runtime.setUninstallURL) {
    // note: hardcoded to match the uninstall one in upgrade-msg.js (not webpack'ified so can't use config)
    chrome.runtime.setUninstallURL('https://www.predicthq.com/blog/focus-uninstall-feedback/');

} else {
  // Not yet enabled
}

