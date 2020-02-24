"use strict";infinity.open=function(t,e,n,i){var o,a=void 0;if(infinity.sendMessage("ga-open-site",{url:e}),o=(a="_blank"==t||"_self"==t?t:SETTING[t])?"_blank":"_self",0<=e.indexOf("chrome://"))a?chrome.tabs.create({url:e}):chrome.tabs.update(null,{url:e});else if(!(0<=e.indexOf("infinity://")))return i||infinity.isMac&&n&&n.metaKey||n&&n.ctrlKey?void window.open(e,"_blank"):void window.open(e,o)},infinity.isUrl=function(t){0==t.indexOf("http://")||0==t.indexOf("https://")||0==t.indexOf("ftp://")||0==t.indexOf("chrome://")||0==t.indexOf("chrome-extension://")||0==t.indexOf("file://")||0==t.indexOf("mailto:")||0==t.indexOf("tel:")||0==t.indexOf("chrome-app://")||0==t.indexOf("infinity://")||(t="http://"+t);return{isValid:/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(t),str:t}},infinity.fadeIn=function(t,e,n,i){var o=document.querySelector(t);o.style.opacity=0,o.style.display=e,o.style.WebkitTransitionDuration=n,o.style.transitionDuration=n,o.offsetHeight,$(o).one("transitionend",function(t){i&&i()}),o.style.opacity=1},infinity.fadeOut=function(t,e,n,i){var o=document.querySelector(t);o.style.WebkitTransitionDuration=n,o.style.transitionDuration=n,$(o).one("transitionend",function(t){o.style.display="none",i&&i()}),o.style.opacity=0},infinity.chooseFile=function(e,o){return e=e||"image/jpg,image/jpeg,image/png,image/gif,image/bmp,image/webp,image/svg",o=o||"readAsDataURL",new Promise(function(i,t){window.$file=$('<input type="file">').attr("accept",e).val("").one("change",function(t){var n=this;setTimeout(function(){var t=n.files[0],e=new FileReader;e[o](t),e.onload=function(t){var e=t.target.result;i(e)}},1)}).click()})},infinity.randomId=function(t){return n=new Uint8Array((e||40)/2),window.crypto.getRandomValues(n),t+(new Date).getTime().toString(32)+function(t){for(var e="",n="abcdefghijklmnopqrstuvwxyz0123456789",i=0;i<t;i++)e+=n.charAt(Math.floor(Math.random()*n.length));return e}(18);var e,n},infinity.alertHide=function(t){var e=document.querySelector(".alert-box");"block"==e.style.display&&(t?e.style.display="none":infinity.fadeOut(".alert-box","none","0.3s",function(){}))},window.alertTimeOut=null,infinity.alert=function(e){function n(){$(".alert-ok,.alert-add-to-bookmark,.alert-cancel,.alert-close-btn").off("click"),infinity.fadeOut(".alert-box","none","0.3s",function(){}),$(".alert-box-out").removeClass("alert-box-out-show")}clearTimeout(window.alertTimeOut),infinity.alertHide(!0),$(".alert-box-out").removeClass("alert-box-out-show"),e.html=e.html||"",e.autoCloseTime=e.autoCloseTime||0,e.isShowOkBtn=e.isShowOkBtn||!1,e.okBtn=e.okBtn||infinity.i18n("i_ok"),e.isShowCloseBtn=e.isShowCloseBtn||!1,e.isShowAddToHomeBtn=e.isShowAddToHomeBtn||!1,e.addHomeBtn=e.addHomeBtn||"添加到主屏幕",e.isShowAddToBookmarkBtn=e.isShowAddToBookmarkBtn||!1,e.addToBookmarkBtn=e.addToBookmarkBtn||"添加到书签",e.isShowCancelBtn=e.isShowCancelBtn||!1,e.cancelBtn=e.cancelBtn||infinity.i18n("cancel"),e.img=e.img||!1,e.icon=e.icon||{},e.isShowOkBtn?$(".alert-ok").show():$(".alert-ok").hide(),e.isShowBackCover=e.isShowBackCover||!1,e.isShowAddToBookmarkBtn?$(".alert-add-to-bookmark").show():$(".alert-add-to-bookmark").hide(),e.isShowCancelBtn?$(".alert-cancel").show():$(".alert-cancel").hide(),e.img?($(".alert-image").css("display","flex"),$(".alert-image").html(e.img)):$(".alert-image").hide(),e.isShowCloseBtn?$(".alert-close-btn").show():$(".alert-close-btn").hide(),$(".alert-text").html(e.html),$(".alert-add-to-home").text(e.addHomeBtn),$(".alert-add-to-bookmark").text(e.addToBookmarkBtn),$(".alert-ok").text(e.okBtn),$(".alert-cancel").text(e.cancelBtn),$(".alert-add-to-bookmark").one("click",function(t){}),$(".alert-ok").one("click",function(t){e.okCallback&&e.okCallback(),n()}),$(".alert-cancel").one("click",function(t){e.cancelCallback&&e.cancelCallback(),n()}),$(".alert-close-btn").one("click",function(t){n()}),e.autoCloseTime&&(window.alertTimeOut=setTimeout(function(){n()},1e3*e.autoCloseTime)),$(".alert-box-out").css({display:"flex",opacity:"1"}),e.isShowBackCover&&$(".alert-box-out").addClass("alert-box-out-show"),infinity.fadeIn(".alert-box","block","0.3s",function(){})},infinity.deepCopy=function(t){return JSON.parse(JSON.stringify(t))};