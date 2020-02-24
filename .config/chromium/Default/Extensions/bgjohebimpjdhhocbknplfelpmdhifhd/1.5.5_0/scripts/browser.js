'use strict';

window.onresize = doLayout;
var isLoading = false;

chrome.storage.sync.get("location", function(data) {

    if (data.location) {
        navigateTo(data.location);
    }
    else {
        navigateTo('https://chrome.todoist.com/?mini=1');
    }
});

window.onload = function () {
    var webview = document.querySelector('webview');

    doLayout();

    document.querySelector('#terminate').onclick = function () {
        webview.terminate();
    };

    webview.addEventListener('exit', handleExit);
    webview.addEventListener('loadstart', handleLoadStart);
    webview.addEventListener('loadstop', handleLoadStop);

    webview.addEventListener('loadabort', handleLoadAbort);
    webview.addEventListener('loadredirect', handleLoadRedirect);
    webview.addEventListener('loadcommit', handleLoadCommit);

    webview.addEventListener('newwindow', function(e) {
        e.preventDefault();
        window.open(e.targetUrl);
    });
};

function navigateTo(url) {
    resetExitedState();

    setTimeout(function() {
        document.querySelector('webview').src = url;
    }, 500);
}

function doLayout() {
    var webview = document.querySelector('webview');
    var controls = document.querySelector('#controls');
    var controlsHeight = controls.offsetHeight;
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;
    var webviewWidth = windowWidth;
    var webviewHeight = windowHeight - controlsHeight;

    webview.style.width = webviewWidth + 'px';
    webview.style.height = webviewHeight + 'px';
}

function handleExit(event) {
    document.body.classList.add('exited');
    if (event.type == 'abnormal') {
        document.body.classList.add('crashed');
    } else if (event.type == 'killed') {
        document.body.classList.add('killed');
    }
}

function resetExitedState() {
    document.body.classList.remove('exited');
    document.body.classList.remove('crashed');
    document.body.classList.remove('killed');
    document.body.classList.remove('loading');
}

function handleLoadCommit(event) {
    resetExitedState();
    if (!event.isTopLevel) {
        return;
    }

    document.querySelector('#location').value = event.url;
    saveLocation(event.url);

}

function handleLoadStart(event) {
    document.body.classList.add('loading');
    isLoading = true;

    resetExitedState();
    if (!event.isTopLevel) {
        return;
    }

    document.querySelector('#location').value = event.url;
    saveLocation(event.url);
}

function saveLocation(location) {
    if(location && location.indexOf('/app') != -1 && location.indexOf('todoist.com') != -1) {
        chrome.storage.sync.set({'location': location}, function () {});
    }
}

function handleLoadStop(event) {
    // We don't remove the loading class immediately, instead we let the animation
    // finish, so that the spinner doesn't jerkily reset back to the 0 position.
    isLoading = false;
    saveLocation(document.querySelector('#location').value);
}

function handleLoadAbort(event) {
    if (event.reason == "ERR_INTERNET_DISCONNECTED") {
        document.body.classList.add('offline');
        var webview = document.querySelector('webview');
        webview.style.visibility = 'hidden';
    }
    document.body.classList.add('killed');
    document.body.classList.remove('loading');
}

function handleLoadRedirect(event) {
    resetExitedState();
    if (!event.isTopLevel) {
        return;
    }

    document.querySelector('#location').value = event.newUrl;
    saveLocation(event.newUrl);
}


