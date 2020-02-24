chrome.app.runtime.onLaunched.addListener(function () {
    var screenWidth = screen.availWidth;
    var screenHeight = screen.availHeight;
    var width = 300;
    var height = 160;

    chrome.app.window.create('index.html', {
        id: "main",
        minWidth: width,
        minHeight: height,
        width: width,
        height: height,
        bounds: {
            width: width,
            height: height,
            left: Math.round((screenWidth - width) / 2),
            top: Math.round((screenHeight - height) / 2)
        }
    });
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    chrome.notifications.create("reminder" + Date.now(), opt, function() {});
});

var opt = {
    type: "basic",
    title: "You are notified",
    message: "It's now time for a break. Or whatever.",
    iconUrl: "/assets/noti-icon.png"
};