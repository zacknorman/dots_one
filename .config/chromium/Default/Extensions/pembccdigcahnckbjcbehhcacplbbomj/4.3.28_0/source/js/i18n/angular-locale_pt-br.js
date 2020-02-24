'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "AM",
      "PM"
    ],
    "DAY": [
      "Domingo",
      "Segunda",
      "Ter\u00e7a",
      "Quarta",
      "Quinta",
      "Sexta",
      "S\u00e1bado"
    ],
    "ERANAMES": [
      "Antes de Cristo",
      "Ano do Senhor"
    ],
    "ERAS": [
      "A.C.",
      "D.C."
    ],
    "FIRSTDAYOFWEEK": 6,
    "MONTH": [
      "Janeiro",
      "Fevereiro",
      "Mar\u00e7o",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro"
    ],
    "SHORTDAY": [
      "Dom",
      "Seg",
      "Ter",
      "Qua",
      "Qui",
      "Sex",
      "S\u00e1b"
    ],
    "SHORTMONTH": [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d 'de' MMMM 'de' y",
    "longDate": "d 'de' MMMM 'de' y",
    "medium": "d 'de' MMM 'de' y HH:mm:ss",
    "mediumDate": "d 'de' MMM 'de' y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yy HH:mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "HH:mm",
    "EEEE, MMM d y - h:mm a" : "EEEE, d 'de' MMM 'de' y - HH:mm",
    "EEEE, MMM d - h:mm a" : "EEEE, d 'de' MMM - HH:mm",
    "EEE, MMM d - h:mm a" : "EEE, d 'de' MMM - HH:mm",
    "EEEE, MMM d y" : "EEEE, d 'de' MMM 'de' y",
    "EEEE, MMM d": "EEEE, d 'de' MMM",
    "EEE, MMM d": "EEE, d 'de' MMM",
    "MMMM d - h:mm a": "d 'de' MMMM - HH:mm",
    "MMMM d": "d 'de' MMMM",
    "EEEE, d": "EEEE, d",
    "EEE, d": "EEE, d"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "R$",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": ".",
    "PATTERNS": [
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "",
        "posPre": "",
        "posSuf": ""
      },
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "pt-br",
  "pluralCat": function(n, opt_precision) {  if (n >= 0 && n <= 2 && n != 2) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
