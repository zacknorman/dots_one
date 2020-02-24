// Breaking the sandbox
var elt = document.createElement("script");
elt.innerHTML = "window.PS_ScreenShareExtension = true; window.PS_ScreenShareExtensionID = '"+chrome.runtime.id+"';"
document.head.appendChild(elt);
