"use strict";var bgSetting={init:function(){infinity.settingInitOrReset("infinity-settings",this.options),infinity.onMessage("setLayout",function(i){var n=i.column*i.row,o=infinity.get("infinity-icons"),t=_.flatten(o,!0),e=_.chunk(t,n);infinity.set("infinity-icons",e),infinity.sendMessage("updateLayout")})},options:{column:2,row:5,isAutoBackUp:!1,isOpenLinkInNewTab:!1,isSearchInNewTab:!0,isOpenBookmarkInNewTab:!1,isOpentGmailNotication:!1,isOpentGmailRingNotication:!0,isShowGmailNum:!1,gmailUnreadNum:0,isShowToDoNumbersInIco:!0,toDoNumber:0,isHideIconName:!1,isShowSearchBox:!0,isShowSearchType:!0,isShowSearchBtn:!1,iconBorderRadius:100,iconOpacity:100,isOpenStartAnimation:!1,tempUnitC:!0,isShowRandomWallpaperBtn:!0,fontColor:"rgba(255,255,255,0.9)",isShowTopBar:!1,topBarType:"bookmarks",wallpaperType:"local",isBlurWallpaper:!1,bingMd5:(new Date).getTime(),isMinimalistMode:!1,viewZoom:1,woeid:2459115,autoWallpaper:!1}};