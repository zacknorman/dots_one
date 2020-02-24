const minWidth = 640;
const maxWidth = 1280;
const minHeight = 400;
const maxHeight = 800;
const UN_INSTALL_URL = "http://c306.net/whygo.html?src=wC&utm_source=wordcounter%20for%20chrome&utm_medium=chrome_projects&utm_content=uninstall&utm_campaign=chrome_projects";
const localAppID = "gaonomojledhdkciglmndieikclpnggo";
var showUpgradeNotification = false;

const upgradeNotice = {
    title: chrome.i18n.getMessage("upgradeNotice_title"),
    text: chrome.i18n.getMessage("upgradeNotice_text"),
    url: "https://updatenotes.blog/category/wordcounter/?utm_source=wordcounter%20for%20chrome&utm_medium=chrome_projects&utm_content=upgradenotification_changelog&utm_campaign=wc_app",
};
const installNotice = {
    title: chrome.i18n.getMessage("installNotice_title"),
    text: chrome.i18n.getMessage("installNotice_text"),
    url: "https://updatenotes.blog/category/wordcounter/?utm_source=wordcounter%20for%20chrome&utm_medium=chrome_projects&utm_content=installnotification_changelog&utm_campaign=wc_app",
};

var notification;

const ls = chrome.storage.local;

// Listens for the app launching then creates the window
chrome.app.runtime.onLaunched.addListener(function () {
    const width = Math.min(Math.max(minWidth, Math.round(screen.availWidth * 2 / 3)), maxWidth);
    const height = Math.min(Math.max(minHeight, Math.round(screen.availHeight * 2 / 3)), maxHeight);
    
    chrome.app.window.create('index.html', {
        id: 'main',
        innerBounds: { //innerBounds is new way to specify bounds but is live only starting ver 36
            width: width,
            height: height,
            left: Math.round((screen.availWidth - width) / 2),
            top: Math.round((screen.availHeight - height) / 2),
            minHeight: minHeight,
            minWidth: minWidth
        },
        // frame: 'none'
    });
});


chrome.runtime.onInstalled.addListener(function (details) {
    const ver = chrome.runtime.getManifest().version;
    
    ls.set({ version: ver });
    
    if (details.reason == "chrome_update") {
        return;
    }
    
    // Show update/install notification
    if (details.reason == "update") {
        
        //   if(showUpgradeNotification && details.previousVersion != ver){
        // if (showUpgradeNotification) {
            
        //     //Show Upgrade Notification
        //     upgradeNotice.url += "&v=" + details.previousVersion;
        //     showNotification({
        //         title: upgradeNotice.title,
        //         message: upgradeNotice.text,
        //         contextMessage: `Upgraded from v.${details.previousVersion} to v.${ver}`
        //     }, {
        //         id: "appUpdate",
        //         url: `${upgradeNotice.url}&v=${details.previousVersion}`
        //     });
        // }
        
        ls.set({ prevVersion: details.previousVersion });
        
    } else if (details.reason == "install") {
        
        chrome.runtime.setUninstallURL(UN_INSTALL_URL);
        
        // showNotification({
        //     title: installNotice.title,
        //     message: installNotice.text,
        //     contextMessage: `Version ${ver} installed.`
        // }, {
        //     id: "appUpdate",
        //     url: installNotice.url
        // });
        
        ls.set({ prevVersion: ver });
        
    }
    
    displayDeprecationNotification()
});


function displayDeprecationNotification() {
    ls.get({"deprecationNoticeShown": false}, st => {
        if (st.deprecationNoticeShown) return;
        
        showNotification({
            "title": "WordCounter app is going away...",
            "contextMessage": "Update to WordCounter Chrome extension.",
            "message": "Click to read more and how to update."
        }, {
            id: "deprecationNotice",
            url: "http://updatenotes.blog/2020/02/14/wordcounter-for-chrome-app-migration?utm_source=wordcounter%20for%20chrome&utm_medium=chrome_projects&utm_content=extension_notification&utm_campaign=wc_app"
        });
    })
}


/**
 * @param {{title: String, message: String?, contextMessage: String?}} msg notification details
 * @param {{url: String, id: String}} action notification action
 */
function showNotification(msg, action) {
    msg.type = "basic";
    msg.iconUrl = chrome.runtime.getURL("/img/wc128.png");
    notification = action;
    
    chrome.notifications.create(action.id, msg);
    
    chrome.notifications.onClicked.addListener(notificationClick);
}


function notificationClick(id) {
    if (!!notification.url && id == notification.id) {
        window.open(notification.url, '_blank');
        chrome.notifications.clear(id);
        
        if (id == "deprecationNotice") {
            ls.set({ "deprecationNoticeShown": true });
        }
    }
}
