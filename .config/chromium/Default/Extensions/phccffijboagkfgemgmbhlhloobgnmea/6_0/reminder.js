document.addEventListener('DOMContentLoaded', function () {
    var $time = $('#time');
    var $info = $("#info");

    $("#active").bootstrapSwitch();
    $('#active').on('switchChange', function (e, data) {
        if (data.value) {
            $time.prop('disabled', false);
            $time.trigger('input');
        } else {
            chrome.alarms.clearAll();
            $info.hide();
            $time.prop('disabled', true);
            $info.text("No notifications set");
            $info.show('fast');
        }
    });

    $time.bind('input', function () {
        var min = parseFloat($(this).val());
        if (!isNaN(min) && min >= 0.01) {
            schedule(min);
            chrome.storage.sync.set({minutes: min}, function () {
                chrome.storage.sync.get("minutes", function (items) {
                    console.log(items.minutes);
                });
            });
        } else {
            $info.hide();
            $info.text("Try another integer value.");
            $info.show('fast');
            chrome.alarms.clearAll();
            chrome.storage.sync.clear(function () {
            });
        }
    });

    chrome.storage.sync.get("minutes", function (items) {
        if(items.minutes) {
            $time.val(items.minutes);
        } else {
            $time.val("60");
        }
        $time.trigger('input');
    });


});

function schedule(minutes) {
    chrome.alarms.clearAll();
    chrome.alarms.create("notification", {periodInMinutes: minutes});
    updateText();
}

function updateText() {
    var $info = $("#info");
    chrome.alarms.get("notification", function (nextAlarm) {
        $info.hide();
        var date = new Date(nextAlarm.scheduledTime);
        var time = ("0" + date.getHours()).slice(-2) + ':' + ("0" + (date.getMinutes())).slice(-2);
        $info.text("Next notification at ~" + time);
        $info.show('fast');
        console.log("Scheduled next alarm at:" + new Date(nextAlarm.scheduledTime));
    });
}

chrome.alarms.onAlarm.addListener(function (alarm) {
    updateText();
});