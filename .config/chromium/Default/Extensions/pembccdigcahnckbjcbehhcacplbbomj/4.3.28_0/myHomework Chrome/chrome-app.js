chrome.app.runtime.onLaunched.addListener(function(launchData) {
	
  chrome.storage.local.set({'launchData': launchData}, function() {
    chrome.app.window.create('../source/chrome-app.html', {
        'singleton': true,
        'id': 'myhw-window',
        'bounds': {
          'width': 1100,
          'height': 700
        },
        'minWidth': 340,
        'minHeight': 500
      });
  });	
	
  
  chrome.commands.onCommand.addListener(function(command) {
	  switch(command) {
	    case 'exit-app':
	      exitApp();
	      break;	    
	  }
	});

  function exitApp() {
    chrome.app.window.getAll().forEach(function(win) {
      win.close();
    });
  }    
    
  chrome.alarms.onAlarm.addListener(function(alarm) {
    var idToMessageIdx = alarm.name.indexOf(':');
    var hwid = alarm.name.substring(0, idToMessageIdx);
    var msg = alarm.name.substring(idToMessageIdx + 1);

    chrome.notifications.create(Date.now() + ":" + hwid, {
      type: "basic",
      title: "myHomework",
      message: msg,
      iconUrl: "source/imgs/app-icon.png",
      eventTime: alarm.scheduledTime
    }, function() { 
    });
  });

  chrome.notifications.onClicked.addListener(function(notificationId) {
    var idToHomeworkIdx = notificationId.indexOf(':');
    if (idToHomeworkIdx > 0) {
      var hwid = notificationId.substring(idToHomeworkIdx + 1);
      chrome.runtime.sendMessage('hw://' + hwid , function(response) {
        if (!response) {
          //no response open new window and try again...
          chrome.app.window.create('../source/chrome-app.html', {
            'singleton': true,
            'id': 'myhw-window',
            'bounds': {
              'width': 1100,
              'height': 700
            },
            'minWidth': 340,
            'minHeight': 500
          });

          setTimeout(function() {
            chrome.runtime.sendMessage('hw://' + hwid , function(response) {});
          }, 1000);
        }
      });
    }
  });
});