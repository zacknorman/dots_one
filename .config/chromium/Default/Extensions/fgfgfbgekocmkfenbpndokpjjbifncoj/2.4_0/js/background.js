/*global chrome: false */
/*global window: false */

"use strict";

var log = function (parm) {
  console.log(new Date() + ' ' + parm);
};

function launchWindows(isHidden) {
  var width = 500;
  var height = 310;

  var currentWindow = chrome.app.window.get('main');

  if (currentWindow) {
    if (isHidden) {
      log('current window exist, return');
      return;
    }
    currentWindow.show(false);
    log('current window exist, show window');
    return;
  }

  log('launchWindows isHidden ' + isHidden);

  chrome.app.window.create('index.html', {
    id: 'main',
    minWidth: width,
    minHeight: height,
    maxWidth: width * 1.5,
    maxHeight: height * 1.6,
    hidden: isHidden,
    bounds: {
      width: width,
      height: height
    }
  }, function (createdWindow) {
    // after current window is close, launch hidden one after delay
    createdWindow.onClosed.addListener(function () {
      log('current window is close, launch hidden one after delay');
      createHidden(5000);
    });
  });
}

function createHidden(time) {
  window.setTimeout(function () {
    launchWindows(true);
  }, time);
}

chrome.runtime.onInstalled.addListener(function () {
  log('onInstalled' + new Date());
  createHidden(2000);
});

chrome.runtime.onStartup.addListener(function () {
  log('onStartup' + new Date());
  createHidden(5000);
});

chrome.app.runtime.onLaunched.addListener(function () {
  log('onLaunched' + new Date());
  launchWindows(false);
});

log('In background script ' + new Date());

createHidden(8000);
