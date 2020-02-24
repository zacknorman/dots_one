/*global calendarApp: false */

"use strict";

function timeString(absTime) {
  if (absTime < 60 * 60) { // less than 1 hour
    return Math.round(absTime / 60) + ' mins';
  }
  if (absTime < 24 * 60 * 60) { // more than 1 hours and less than 24 hours
    return Math.round(absTime / 60 / 60) + ' hours';
  }
  if (absTime < 7 * 24 * 60 * 60) { // more than 24 hours and less than one week
    return Math.round(absTime / 24 / 60 / 60) + ' days';
  }
  if (absTime < 4 * 7 * 24 * 60 * 60) { // more than one week and less than one month
    return Math.round(absTime / 7 / 24 / 60 / 60) + ' weeks';
  }
  if (absTime < 12 * 4 * 7 * 24 * 60 * 60) { // more than one month and less than one year
    return Math.round(absTime / 4 / 7 / 24 / 60 / 60) + ' months';
  }
  // more than one year
  return Math.round(absTime / 12 / 4 / 7 / 24 / 60 / 60) + ' years';
}

calendarApp.filter('timeString', function () {
  return timeString;
});

calendarApp.filter('syncString', function () {
  return function (input) {
    if (input === null) {
      return 'Please sign-in';
    }
    var currentDate = new Date();
    var diffTime = (new Date(input).getTime() - currentDate.getTime()) / 1000;
    var absTime = Math.abs(diffTime);
    if (diffTime < 0) {
      return 'Synced ' + timeString(absTime) + ' ago';
    }
  };
});

calendarApp.filter('locationURL', function () {
  return function (location) {
    return "http://maps.google.com/maps?q=" + location;
  };
});

calendarApp.filter('emailFilter', function () {
  return function (input) {
    var suffix = 'gmail.com';
    if (input && input.indexOf(suffix, input.length - suffix.length) !== -1) {
      return input;
    }
    return null;
  };
});

calendarApp.filter('timeColor', function () {
  return function (input) {
    var obj = {};
    // overdue color is red
    if (new Date(input) < new Date()) {
      obj.color = '#E74C3C';
    } else {
      obj.color = '#000';
    }
    return obj;
  };
});

calendarApp.filter('timeFromNow', function () {
  return function (input) {
    var currentDate = new Date();
    var diffTime = (new Date(input).getTime() - currentDate.getTime()) / 1000;
    var absTime = Math.abs(diffTime);
    var result = diffTime > 0 ? 'In ' + timeString(absTime) : timeString(absTime) + ' overdue';
    return result;
  };
});
