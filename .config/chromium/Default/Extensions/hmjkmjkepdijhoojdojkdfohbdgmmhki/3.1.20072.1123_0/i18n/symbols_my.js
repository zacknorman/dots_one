/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var a=this||self,b=function(f,k){f=f.split(".");var e=a;f[0]in e||"undefined"==typeof e.execScript||e.execScript("var "+f[0]);for(var g;f.length&&(g=f.shift());)f.length||void 0===k?e=e[g]&&e[g]!==Object.prototype[g]?e[g]:e[g]={}:e[g]=k};var c={c:{1E3:{other:"0K"},1E4:{other:"00K"},1E5:{other:"000K"},1E6:{other:"0M"},1E7:{other:"00M"},1E8:{other:"000M"},1E9:{other:"0B"},1E10:{other:"00B"},1E11:{other:"000B"},1E12:{other:"0T"},1E13:{other:"00T"},1E14:{other:"000T"}},b:{1E3:{other:"0 thousand"},1E4:{other:"00 thousand"},1E5:{other:"000 thousand"},1E6:{other:"0 million"},1E7:{other:"00 million"},1E8:{other:"000 million"},1E9:{other:"0 billion"},1E10:{other:"00 billion"},1E11:{other:"000 billion"},1E12:{other:"0 trillion"},1E13:{other:"00 trillion"},
1E14:{other:"000 trillion"}}};
c={c:{1E3:{other:"0\u1011\u1031\u102c\u1004\u103a"},1E4:{other:"0\u101e\u1031\u102c\u1004\u103a\u1038"},1E5:{other:"0\u101e\u102d\u1014\u103a\u1038"},1E6:{other:"0\u101e\u1014\u103a\u1038"},1E7:{other:"0\u1000\u102f\u100b\u1031"},1E8:{other:"00\u1000\u102f\u100b\u1031"},1E9:{other:"\u1000\u102f\u100b\u1031000"},1E10:{other:"\u1000\u102f\u100b\u10310\u1011"},1E11:{other:"\u1000\u102f\u100b\u10310\u101e"},1E12:{other:"\u100b\u10310\u101e\u102d\u1014\u103a\u1038"},1E13:{other:"\u100b\u10310\u101e\u1014\u103a\u1038"},1E14:{other:"0\u1000\u1031\u102c\u100b\u102d"}},
b:{1E3:{other:"0\u1011\u1031\u102c\u1004\u103a"},1E4:{other:"0\u101e\u1031\u102c\u1004\u103a\u1038"},1E5:{other:"0\u101e\u102d\u1014\u103a\u1038"},1E6:{other:"0\u101e\u1014\u103a\u1038"},1E7:{other:"0\u1000\u102f\u100b\u1031"},1E8:{other:"00\u1000\u102f\u100b\u1031"},1E9:{other:"\u1000\u102f\u100b\u1031000"},1E10:{other:"\u1000\u102f\u100b\u10310000"},1E11:{other:"\u1000\u102f\u100b\u10310\u101e\u1031\u102c\u1004\u103a\u1038"},1E12:{other:"\u1000\u102f\u100b\u10310\u101e\u102d\u1014\u103a\u1038"},
1E13:{other:"\u1000\u102f\u100b\u10310\u101e\u1014\u103a\u1038"},1E14:{other:"0\u1000\u1031\u102c\u100b\u102d"}}};var d={fa:"y",na:"y G",ga:"MMM y",ha:"MMMM y",oa:"MM/y",F:"MMM d",G:"MMMM dd",I:"M/d",H:"MMMM d",la:"MMM d, y",da:"EEE, MMM d",ma:"EEE, MMM d, y",i:"d",ka:"MMM d, h:mm a zzzz"};d={fa:"y",na:"G y",ga:"MMM y",ha:"y MMMM",oa:"MM/y",F:"d MMM",G:"MMMM dd",I:"d/M",H:"MMMM d",la:"y\u104a MMM d",da:"MMM d\u104a EEE",ma:"y\u104a MMM d\u104a EEE",i:"d",ka:"d MMM zzzz HH:mm"};var h={s:["BC","AD"],o:["Before Christ","Anno Domini"],K:"JFMAMJJASOND".split(""),X:"JFMAMJJASOND".split(""),D:"January February March April May June July August September October November December".split(" "),W:"January February March April May June July August September October November December".split(" "),T:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),Z:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),ca:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
aa:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),V:"Sun Mon Tue Wed Thu Fri Sat".split(" "),$:"Sun Mon Tue Wed Thu Fri Sat".split(" "),L:"SMTWTFS".split(""),Y:"SMTWTFS".split(""),U:["Q1","Q2","Q3","Q4"],R:["1st quarter","2nd quarter","3rd quarter","4th quarter"],a:["AM","PM"],g:["EEEE, MMMM d, y","MMMM d, y","MMM d, y","M/d/yy"],ba:["h:mm:ss a zzzz","h:mm:ss a z","h:mm:ss a","h:mm a"],h:["{1} 'at' {0}","{1} 'at' {0}","{1}, {0}","{1}, {0}"],v:6,ea:[5,6],w:5};
h={ia:4160,s:["\u1018\u102e\u1005\u102e","\u1021\u1012\u1031\u102e"],o:["\u1001\u101b\u1005\u103a\u1010\u1031\u102c\u103a \u1019\u1015\u1031\u102b\u103a\u1019\u102e\u1014\u103e\u1005\u103a","\u1001\u101b\u1005\u103a\u1014\u103e\u1005\u103a"],K:"\u1007\u1016\u1019\u1027\u1019\u1007\u1007\u1029\u1005\u1021\u1014\u1012".split(""),X:"\u1007\u1016\u1019\u1027\u1019\u1007\u1007\u1029\u1005\u1021\u1014\u1012".split(""),D:"\u1007\u1014\u103a\u1014\u101d\u102b\u101b\u102e \u1016\u1031\u1016\u1031\u102c\u103a\u101d\u102b\u101b\u102e \u1019\u1010\u103a \u1027\u1015\u103c\u102e \u1019\u1031 \u1007\u103d\u1014\u103a \u1007\u1030\u101c\u102d\u102f\u1004\u103a \u1029\u1002\u102f\u1010\u103a \u1005\u1000\u103a\u1010\u1004\u103a\u1018\u102c \u1021\u1031\u102c\u1000\u103a\u1010\u102d\u102f\u1018\u102c \u1014\u102d\u102f\u101d\u1004\u103a\u1018\u102c \u1012\u102e\u1007\u1004\u103a\u1018\u102c".split(" "),
W:"\u1007\u1014\u103a\u1014\u101d\u102b\u101b\u102e \u1016\u1031\u1016\u1031\u102c\u103a\u101d\u102b\u101b\u102e \u1019\u1010\u103a \u1027\u1015\u103c\u102e \u1019\u1031 \u1007\u103d\u1014\u103a \u1007\u1030\u101c\u102d\u102f\u1004\u103a \u1029\u1002\u102f\u1010\u103a \u1005\u1000\u103a\u1010\u1004\u103a\u1018\u102c \u1021\u1031\u102c\u1000\u103a\u1010\u102d\u102f\u1018\u102c \u1014\u102d\u102f\u101d\u1004\u103a\u1018\u102c \u1012\u102e\u1007\u1004\u103a\u1018\u102c".split(" "),T:"\u1007\u1014\u103a \u1016\u1031 \u1019\u1010\u103a \u1027 \u1019\u1031 \u1007\u103d\u1014\u103a \u1007\u1030 \u1029 \u1005\u1000\u103a \u1021\u1031\u102c\u1000\u103a \u1014\u102d\u102f \u1012\u102e".split(" "),
Z:"\u1007\u1014\u103a \u1016\u1031 \u1019\u1010\u103a \u1027 \u1019\u1031 \u1007\u103d\u1014\u103a \u1007\u1030 \u1029 \u1005\u1000\u103a \u1021\u1031\u102c\u1000\u103a \u1014\u102d\u102f \u1012\u102e".split(" "),ca:"\u1010\u1014\u1004\u103a\u1039\u1002\u1014\u103d\u1031 \u1010\u1014\u1004\u103a\u1039\u101c\u102c \u1021\u1004\u103a\u1039\u1002\u102b \u1017\u102f\u1012\u1039\u1013\u101f\u1030\u1038 \u1000\u103c\u102c\u101e\u1015\u1010\u1031\u1038 \u101e\u1031\u102c\u1000\u103c\u102c \u1005\u1014\u1031".split(" "),
aa:"\u1010\u1014\u1004\u103a\u1039\u1002\u1014\u103d\u1031 \u1010\u1014\u1004\u103a\u1039\u101c\u102c \u1021\u1004\u103a\u1039\u1002\u102b \u1017\u102f\u1012\u1039\u1013\u101f\u1030\u1038 \u1000\u103c\u102c\u101e\u1015\u1010\u1031\u1038 \u101e\u1031\u102c\u1000\u103c\u102c \u1005\u1014\u1031".split(" "),V:"\u1010\u1014\u1004\u103a\u1039\u1002\u1014\u103d\u1031 \u1010\u1014\u1004\u103a\u1039\u101c\u102c \u1021\u1004\u103a\u1039\u1002\u102b \u1017\u102f\u1012\u1039\u1013\u101f\u1030\u1038 \u1000\u103c\u102c\u101e\u1015\u1010\u1031\u1038 \u101e\u1031\u102c\u1000\u103c\u102c \u1005\u1014\u1031".split(" "),
$:"\u1010\u1014\u1004\u103a\u1039\u1002\u1014\u103d\u1031 \u1010\u1014\u1004\u103a\u1039\u101c\u102c \u1021\u1004\u103a\u1039\u1002\u102b \u1017\u102f\u1012\u1039\u1013\u101f\u1030\u1038 \u1000\u103c\u102c\u101e\u1015\u1010\u1031\u1038 \u101e\u1031\u102c\u1000\u103c\u102c \u1005\u1014\u1031".split(" "),L:"\u1010\u1010\u1021\u1017\u1000\u101e\u1005".split(""),Y:"\u1010\u1010\u1021\u1017\u1000\u101e\u1005".split(""),U:["\u1015\u1011\u1019 \u101e\u102f\u1036\u1038\u101c\u1015\u1010\u103a","\u1012\u102f\u1010\u102d\u101a \u101e\u102f\u1036\u1038\u101c\u1015\u1010\u103a",
"\u1010\u1010\u102d\u101a \u101e\u102f\u1036\u1038\u101c\u1015\u1010\u103a","\u1005\u1010\u102f\u1010\u1039\u1011 \u101e\u102f\u1036\u1038\u101c\u1015\u1010\u103a"],R:["\u1015\u1011\u1019 \u101e\u102f\u1036\u1038\u101c\u1015\u1010\u103a","\u1012\u102f\u1010\u102d\u101a \u101e\u102f\u1036\u1038\u101c\u1015\u1010\u103a","\u1010\u1010\u102d\u101a \u101e\u102f\u1036\u1038\u101c\u1015\u1010\u103a","\u1005\u1010\u102f\u1010\u1039\u1011 \u101e\u102f\u1036\u1038\u101c\u1015\u1010\u103a"],a:["\u1014\u1036\u1014\u1000\u103a",
"\u100a\u1014\u1031"],g:["y\u104a MMMM d\u104a EEEE","y\u104a d MMMM","y\u104a MMM d","dd-MM-yy"],ba:["zzzz HH:mm:ss","z HH:mm:ss","B HH:mm:ss","B H:mm"],h:["{1} {0}","{1} {0}","{1} {0}","{1} {0}"],v:6,ea:[5,6],w:5};var l={l:".",A:",",M:"%",ja:"0",P:"+",C:"-",u:"E",O:"\u2030",B:"\u221e",J:"NaN",j:"#,##0.###",S:"#E0",N:"#,##0%",f:"\u00a4#,##0.00",m:"USD"};l={l:".",A:",",M:"%",ja:"\u1040",P:"+",C:"-",u:"E",O:"\u2030",B:"\u221e",J:"\u1002\u100f\u1014\u103a\u1038\u1019\u101f\u102f\u1010\u103a\u101e\u1031\u102c",j:"#,##0.###",S:"#E0",N:"#,##0%",f:"#,##0.00\u00a0\u00a4",m:"MMK"};b("I18N_DATETIMESYMBOLS_ERAS",h.s);b("I18N_DATETIMESYMBOLS_ERANAMES",h.o);b("I18N_DATETIMESYMBOLS_NARROWMONTHS",h.K);b("I18N_DATETIMESYMBOLS_STANDALONENARROWMONTHS",h.X);b("I18N_DATETIMESYMBOLS_MONTHS",h.D);b("I18N_DATETIMESYMBOLS_STANDALONEMONTHS",h.W);b("I18N_DATETIMESYMBOLS_SHORTMONTHS",h.T);b("I18N_DATETIMESYMBOLS_STANDALONESHORTMONTHS",h.Z);b("I18N_DATETIMESYMBOLS_WEEKDAYS",h.ca);b("I18N_DATETIMESYMBOLS_STANDALONEWEEKDAYS",h.aa);b("I18N_DATETIMESYMBOLS_SHORTWEEKDAYS",h.V);
b("I18N_DATETIMESYMBOLS_STANDALONESHORTWEEKDAYS",h.$);b("I18N_DATETIMESYMBOLS_NARROWWEEKDAYS",h.L);b("I18N_DATETIMESYMBOLS_STANDALONENARROWWEEKDAYS",h.Y);b("I18N_DATETIMESYMBOLS_SHORTQUARTERS",h.U);b("I18N_DATETIMESYMBOLS_QUARTERS",h.R);b("I18N_DATETIMESYMBOLS_AMPMS",h.a);b("I18N_DATETIMESYMBOLS_DATEFORMATS",h.g);b("I18N_DATETIMESYMBOLS_TIMEFORMATS",h.ba);b("I18N_DATETIMESYMBOLS_DATETIMEFORMATS",h.h);b("I18N_DATETIMESYMBOLS_FIRSTDAYOFWEEK",h.v);b("I18N_DATETIMESYMBOLS_WEEKENDRANGE",h.ea);
b("I18N_DATETIMESYMBOLS_FIRSTWEEKCUTOFFDAY",h.w);b("I18N_DATETIMEPATTERNS_YEAR_FULL",d.fa);b("I18N_DATETIMEPATTERNS_YEAR_MONTH_ABBR",d.ga);b("I18N_DATETIMEPATTERNS_YEAR_MONTH_FULL",d.ha);b("I18N_DATETIMEPATTERNS_MONTH_DAY_ABBR",d.F);b("I18N_DATETIMEPATTERNS_MONTH_DAY_FULL",d.G);b("I18N_DATETIMEPATTERNS_MONTH_DAY_SHORT",d.I);b("I18N_DATETIMEPATTERNS_MONTH_DAY_MEDIUM",d.H);b("I18N_DATETIMEPATTERNS_WEEKDAY_MONTH_DAY_MEDIUM",d.da);b("I18N_DATETIMEPATTERNS_DAY_ABBR",d.i);
void 0!==h.ia&&b("I18N_DATETIMESYMBOLS_ZERODIGIT",h.ia);b("I18N_NUMBERFORMATSYMBOLS_DECIMAL_SEP",l.l);b("I18N_NUMBERFORMATSYMBOLS_GROUP_SEP",l.A);b("I18N_NUMBERFORMATSYMBOLS_PERCENT",l.M);b("I18N_NUMBERFORMATSYMBOLS_ZERO_DIGIT",l.ja);b("I18N_NUMBERFORMATSYMBOLS_PLUS_SIGN",l.P);b("I18N_NUMBERFORMATSYMBOLS_MINUS_SIGN",l.C);b("I18N_NUMBERFORMATSYMBOLS_EXP_SYMBOL",l.u);b("I18N_NUMBERFORMATSYMBOLS_PERMILL",l.O);b("I18N_NUMBERFORMATSYMBOLS_INFINITY",l.B);b("I18N_NUMBERFORMATSYMBOLS_NAN",l.J);
b("I18N_NUMBERFORMATSYMBOLS_DECIMAL_PATTERN",l.j);b("I18N_NUMBERFORMATSYMBOLS_SCIENTIFIC_PATTERN",l.S);b("I18N_NUMBERFORMATSYMBOLS_PERCENT_PATTERN",l.N);b("I18N_NUMBERFORMATSYMBOLS_CURRENCY_PATTERN",l.f);b("I18N_NUMBERFORMATSYMBOLS_DEF_CURRENCY_CODE",l.m);b("I18N_COMPACT_DECIMAL_SHORT_PATTERN",c.c);b("I18N_COMPACT_DECIMAL_LONG_PATTERN",c.b);
