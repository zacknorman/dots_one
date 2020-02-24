chrome.extension.sendMessage({action: "newTab", hash: window.location.hash})

if (window.location.href.indexOf('access_token') > 0)
       window.location.href = 'https://www.predicthq.com'

