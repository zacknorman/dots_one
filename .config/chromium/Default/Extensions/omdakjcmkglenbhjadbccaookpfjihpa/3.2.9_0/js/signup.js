if (window.location.pathname.endsWith('/signed-up') || window.location.pathname.endsWith('/logged-in') ) {
    setTimeout(function () {
        var message = { toggled: true, country: 0 };
        if (navigator.userAgent.indexOf("Chrome") != -1) {
            chrome.runtime.sendMessage(message);
        } else {
            browser.runtime.sendMessage(message);
        }
    }, 4500);
}
