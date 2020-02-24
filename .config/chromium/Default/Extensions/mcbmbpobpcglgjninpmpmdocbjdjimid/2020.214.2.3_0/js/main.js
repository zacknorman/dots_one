const DEFAULT_FONT_SIZE = 20;
const MAX_FONT_SIZE = 100;
const MAX_LIMIT_VALUE = 9999;
const VERSION_MESSAGE_TIMEOUT = 5000;

var wordChar = "words";
var stopInput = false;
var limitValue = 0;
var fontSize = DEFAULT_FONT_SIZE;
var trim = true;
var optionsVisible = true;
var rememberText = false;
var enableMarkdown = true;


var words = 0;
var chars = 0;
var currText = "";
var prevText = "";
var currLength = 0;
var prevLength = 0;
var wordMatches;
var WARNING_LIMIT = 0.8; //80% - TODO: can be changed through options later
var isHelpVisible = false;
var showMarkdownPreview = false;

const localAppID = "gaonomojledhdkciglmndieikclpnggo";
var mediaQueryList;

var markdownConverter;
const ls = chrome.storage.local;

$(document).ready(function(){
    
    $("#closeDeprecationNotice").on("click", e => {
        $("#deprecationOverlay").hide();
        ls.set({ "deprecationNoticeShown": true });
        e.preventDefault();
    });
    
    ls.get({ "deprecationNoticeShown": false }, st => {
        st.deprecationNoticeShown && $("#deprecationOverlay").hide();
    });
    
  // Add ext version number in bottombar
  $("#statusSpan").text("v. "+chrome.runtime.getManifest().version);
  setTimeout(showHelpFooter, VERSION_MESSAGE_TIMEOUT);
  
  $("input:radio[name=wordsChars]").change(wordCharEventHandler);
  
  $("#settingsCol input").on("focus", function(){
    $(this).parents("fieldset")[0].scrollIntoView();
  });
  
  window.onkeydown = window.onkeyup = function(e) { if (e.keyCode == 27 /* ESC */) { e.preventDefault(); } };
  
  $(document).keydown(function (e) {
    
    switch(e.which){
      case 27: // Esc -> Close help div / Lose text area focus / close full screen mode
        if(isHelpVisible === true){
          switchHelpView();
          e.preventDefault();
        } else if(document.activeElement.id === "textarea"){
          $("#textarea").blur();
          e.preventDefault();
        } else if(chrome.app.window.current().isFullscreen() === true){
          toggleFullScreen();
          e.preventDefault();
        } else if(/input/i.test(document.activeElement.nodeName) === true){
          toggleSettingsView();
          e.preventDefault();
        }
        break;
      
      case 80: // Ctrl/Cmd + P -> Print text
        if((e.ctrlKey || e.metaKey) && isHelpVisible !== true){
          e.preventDefault();
          printThis();
        }
        break;
        
      case 83: // Ctrl/Cmd + S -> Save to file
        if((e.ctrlKey || e.metaKey) && isHelpVisible !== true){
          e.preventDefault();
          saveThis();
        }
        break;
        
      case 69: // Ctrl/Cmd + E -> Switch to edit mode / Focus on text area
        if((e.ctrlKey || e.metaKey) && isHelpVisible !== true){
          e.preventDefault();
          switchEditorViewer("mdEdit");
        }
        break;
        
      case 82: // Ctrl/Cmd + R -> Switch to preview markdown mode
        if((e.ctrlKey || e.metaKey) && isHelpVisible !== true){
          e.preventDefault();
          switchEditorViewer("mdPreview");
        }
        break;
        
      case 188: // Ctrl/Cmd + , -> Open settings, focus on first option
        if((e.ctrlKey || e.metaKey) && isHelpVisible !== true){
          e.preventDefault();
          toggleSettingsView();
        }
        break;
        
      case 191: // ? & / -> Toggle help div
        if(document.activeElement.id === "textarea") break; // don't act if typing in textarea
      case 112: // F1    -> Toggle help div
        e.preventDefault();
        switchHelpView();
        break;
        
      case 122: // F11 -> Toggle full screen mode
        e.preventDefault();
        toggleFullScreen();
        break;
      
      case 38: // Ctrl + Up key -> Scroll up
        if(document.activeElement.id === "textarea" && (e.ctrlKey || e.metaKey) && isHelpVisible !== true){
          e.preventDefault();
          scrollTextArea("up");
        }
        break;
      
      case 40: // Ctrl + Down key -> Scroll down
        if(document.activeElement.id === "textarea" && (e.ctrlKey || e.metaKey) && isHelpVisible !== true){
          e.preventDefault();
          scrollTextArea("down");
        }
        break;
      
      default: // Prevent key input while in help mode
        if(isHelpVisible === true){
          e.preventDefault();
        }
    }
  });
  
  $("input:checkbox").change(function(){
    var thisElement = this;
    var id = this.id;
    var value = this.checked;
    var settingObj = {};
    settingObj[id] = value;
    ls.set(settingObj, function(){
      switch(id){
        case "trim":
          trim = value;
          recalculate();
          thisElement.focus();
          break;
        case "stopInput":
          stopInput = value;
          // Do Something
          break;
        case "rememberText":
          rememberText = value;
          // Do Something
          if(value === true)
            ls.set({
              "currText" : currText
            });
          break;
        case "enableMarkdown":
          enableMarkdown = value;
          if(enableMarkdown === true){
            $(".mdButtonSet").show();
          } else {
            $(".mdButtonSet").hide();
            // If in preview mode, change to edit mode
            switchEditorViewer("mdEdit", true);
          }
          recalculate();
          thisElement.focus();
          break;
        default:
          //Do Something
          console.log("unknown checkbox error: " + id);
      }
    });
  });

  $(".mdButtonSet").on("click", function(){
    var id = this.id;
    switchEditorViewer(id);
  });
  
  $("#textarea").on("input propertychange", function(){
    currText = $(this).val();
    recalculate();
  });
  
  $("#wordLimit").on("input propertychange", wordLimitEventHandler);
  
  $("#fontSize").on("change", fontSizeHandler);
  
  $(window).resize(function(){
    var colHeight = $(window).height() - $("#textarea")[0].getBoundingClientRect().top - 16 - 23;
    $("#textarea, #mdViewer").css({height: colHeight + "px"});
    $("#settingsCol").css({height: (colHeight + 16) + "px"});
    
    if(chrome.app.window.current().isFullscreen() === true){
      $("#fullscreen").addClass("selected");
    } else {
      $("#fullscreen").removeClass("selected");
    }
    
    var statusWidth = $("#bottomBar").width() - 23 - 8;
    $("#bottomBar>:visible[id]:not([id='statusSpan'])").each(function(){
      statusWidth -= ($(this).width() + 16);
    });
    $("#statusSpan").css({"maxWidth": statusWidth});
  });
  
  $("#settingsTitle").click(toggleSettingsView);
  
  $("#fullscreen").on("click", toggleFullScreen);
  
  ls.get({
    "limitValue"      : 0,        //default 0
    "wordChar"        : "words",  //default words
    "trim"            : true,     //default true
    "stopInput"       : false,    //default false
    "fontSize"        : DEFAULT_FONT_SIZE,        //default 14
    "optionsVisible"  : true,     //default true
    "rememberText"    : false,     //default ""
    "enableMarkdown"  : true,     //default ""
    "currText"        : "",     //default ""
  }, function(st){
    wordChar = st.wordChar;
    stopInput = st.stopInput;
    limitValue = st.limitValue;
    fontSize = st.fontSize;
    trim = st.trim;
    optionsVisible = st.optionsVisible;
    rememberText = st.rememberText;
    enableMarkdown = st.enableMarkdown;
    
    if(rememberText === true){
      currText = st.currText || currText;
      prevText = currText;
    }
    
    ls.set({
      "trim"            : trim,
      "wordChar"        : wordChar,
      "stopInput"       : stopInput,
      "limitValue"      : limitValue,
      "fontSize"      : fontSize,
      "optionsVisible"  : optionsVisible,
      "rememberText"    : rememberText,
      "currText"        : currText,
      "enableMarkdown"  : enableMarkdown
    });
    
    initialise();
  });
});


function recalculate(){
  // Add text change to history (to enable undo)
  if($("#textarea").is(":focus")){
    if(stopInput === true) $("#textarea").blur().focus();
    if(rememberText === true)
      ls.set({
        "currText" : currText
      });
  }

  // count number of words/characters
  if(wordChar != "words"){
    var trimmedText = trim ? currText.trim() : currText;
    currLength = enableMarkdown === true ? markdownConverter.makeHtml(trimmedText).replace(/<.*?>/gi,"").replace(/&.*?;/gi,"Q").length : trimmedText.length;
  } else
    currLength = enableMarkdown === true ? ($("#textarea").val().match(/\b\S+\b/ig) || []).length : (currText.match(/\S+/ig) || []).length;
  
  // Update word/char count in label
  $("#wordcount").text(currLength + " " + (currLength == 1 ? wordChar.substr(0,wordChar.length-1) : wordChar));
  
  // Only do limit checks if limit > 0
  if(limitValue > 0){
    if(currLength > limitValue){
    // Case: above limit
      $("#textarea").removeClass("limitWarning").addClass("limitError");
      $("#wordcount").removeClass("countWarning").addClass("countError");
      if(stopInput && $("#textarea").is(":focus") && currLength > prevLength){
        document.execCommand("undo");
        currText = prevText;
        currLength = prevLength;
        return;
      }
    } else if(currLength >= WARNING_LIMIT*limitValue){
    // Case: above warning limit
      $("#textarea").removeClass("limitError").addClass("limitWarning");
      $("#wordcount").removeClass("countError").addClass("countWarning");
    } else {
    // Case: below even warning limit
      $("#textarea").removeClass("limitError").removeClass("limitWarning");
      $("#wordcount").removeClass("countError").removeClass("countWarning");
    }
  }

  // store current text in prevText for next text change call
  prevText = currText;
  prevLength = currLength;
}

function initialise(){
  $("#fontSize").val(fontSize);
  
  if(chrome.app.window.current().isFullscreen() === true){
    $("#fullscreen").addClass("selected");
  } else {
    $("#fullscreen").removeClass("selected");
  }
  
  // Initialise wordcount label
  $("#wordcount").text(currLength + " " + (currLength == 1 ? wordChar.substr(0,wordChar.length-1) : wordChar));
  
  // Set word/char radio to selected
  $("#"+wordChar).prop("checked", true);
  // If wordchar == 'characters', show trim option
  if(wordChar === "words")
    $("label").has("#trim").slideUp(0);
  else
    $("label").has("#trim").slideDown(0);
  
  // Set trim option on/off
  $("#trim").prop("checked", trim);
  // Set label for wordLimit to word/charachter
  $("label[for=wordLimit]").text(fupper(wordChar).substr(0,wordChar.length-1) + " limit: ");
  // Set rememberText option on/off
  $("#rememberText").prop("checked", rememberText);
  
  // if limitValue > 0, set value in input, show stopInput option
  if(limitValue > 0){
    $("#wordLimit").val(limitValue);
    $("label").has("#stopInput").slideDown(0);
    $("#limitCount").text("  (Max " + limitValue + ")");
  } else {
    $("#wordLimit").val("");
    $("label").has("#stopInput").slideUp(0);
    $("#limitCount").text("");
  }
  // set stopInput checked/unchecked
  $("#stopInput").prop("checked",stopInput);
  
  // set enableMarkdown checked/unchecked
  $("#enableMarkdown").prop("checked",enableMarkdown);
  if(enableMarkdown === true)
    $(".mdButtonSet").show();
  else
    $(".mdButtonSet").hide();
  
  
  if(optionsVisible === true){
    // Show settings column
    $("#settingsCol").css({
      'display': "inherit",
    });
    // Reduce width of textarea
    $("#textCol").css({
      'width': '75%'
    });
    $("#settingsTitle").addClass("selected");
  } else {
    // Hide settings column
    $("#settingsCol").css({
      'display': "none",
    });
    // Maximise width of textarea
    $("#textCol").css({
      'width': '100%'
    });
    $("#settingsTitle").removeClass("selected");
  }
  
  // Set textarea placeholder
  var textareaPlaceholder = chrome.i18n.getMessage("textareaPlaceholder") || "It was the best of times,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                it was the worst of times,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                it was the age of wisdom,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                it was the age of foolishness,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                it was the epoch of belief,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                it was the epoch of incredulity,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                it was the season of light,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                it was the season of darkness,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                it was the spring of hope,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                it was the winter of despair,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                we had everything before us,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                we had nothing before us,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                we were all going direct to Heaven,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                we were all going direct the other way...";
  $("#textarea").attr("placeholder", textareaPlaceholder);
  $("#textarea").val(currText);
  moveCursorToEnd($("#textarea")[0]);
  
  // Set textArea to full height, set fontSize
  var colHeight = $(window).height() - $("#textarea")[0].getBoundingClientRect().top - 16 - 23;
  $("#textarea, #mdViewer").css({
    "height": colHeight+"px",
    "font-size": fontSize,
  });
  $("#mdViewer").css("visibility", "hidden");
  $("#settingsCol").height(colHeight + 16);
  
  
  $("#textarea").focus();
  
  // initialise markdown converter
  markdownConverter = Markdown.getSanitizingConverter();
  Markdown.Extra.init(markdownConverter, {
    extensions: "all",
    table_class: "table table-striped"
  });

  // Start!
  recalculate();
}

function finalise(){
  ls.set({
    "currText" : currText
  });
}


/*********************************************************/
/*                                                       */
/*                 HANDLER FUNCTIONS                     */
/*                                                       */
/*********************************************************/

function fontSizeHandler(){
  var thisElement = this;
  var val = thisElement.value.trim();
  
  if(val && val.length > 0 && val.match(/^\d+$/) && parseInt(val) > 0){
    if(parseInt(val) <= MAX_FONT_SIZE)
      fontSize = parseInt(val);
    else
      $(thisElement).val(fontSize);
  } else {
    fontSize = DEFAULT_FONT_SIZE;
    $(thisElement).val(fontSize);
  }
  
  ls.set({
    'fontSize' : fontSize
  }, function(){
    if(!chrome.runtime.lastError){
      $("#textarea, #mdViewer").css("font-size", fontSize+"px");
    }
  });
}

function wordCharEventHandler(){
  wordChar = $(this).val();
  ls.set({
    'wordChar' : wordChar
  });
  if(wordChar == "characters"){
    $("label").has("#trim").slideToggle(100);
  } else {
    $("label").has("#trim").slideToggle(100);
  }
  $("label[for=wordLimit]").text(fupper(wordChar).substr(0,wordChar.length-1) + " limit: ");
  if(limitValue > 0) $("#limitCount").text("  (Max " + limitValue + ")");
  recalculate();
  this.focus();
}

function wordLimitEventHandler(){
  var thisElement = this;
  var val = thisElement.value.trim();
  if(val && val.length > 0 && val.match(/^\d+$/) && parseInt(val) > 0){
    limitValue = Math.min(parseInt(val), MAX_LIMIT_VALUE);
    ls.set({
      'limitValue' : limitValue
    }, function(){
      thisElement.value = limitValue;
      $("label").has("#stopInput").slideDown(100);
      $("#limitCount").text("  (Max " + limitValue + ")");
      recalculate();
      thisElement.focus();
    });
  } else {
    limitValue = 0;
    ls.set({
      'limitValue' : 0
    });
    thisElement.value = "";
    $("#limitCount").text("");
    $("label").has("#stopInput").slideUp(100);
    
    // Case: below even warning limit
    $("#textarea").removeClass("limitError").removeClass("limitWarning");
    $("#wordcount").removeClass("countError").removeClass("countWarning");
  }
}

function toggleSettingsView(){
  var settingsTop = $("#settingsCol").position().top;
  
  if(optionsVisible === true){
    // if settings pane is visible, hide it and increase textarea to 100%
    $("#settingsCol").slideToggle({
      duration:0,
      queue: false,
      done: function(){
        $("#textCol").animate({
          'width': '100%'
        },{
          queue: false,
          duration:100,
          done: function(){
            if(enableMarkdown === false || showMarkdownPreview === false) $("#textarea").focus();
            else $("mdViewer").focus();
          }
        });
      }
    });
    ls.set({
      optionsVisible : false
    }, function(){
      optionsVisible = false;
      $("#settingsTitle").removeClass("selected");
    });
  } else {
    // if settings pane is hidden, reduce textarea to 75% and show settings pane    
    $("#textCol").animate({
      "width": "75%"
    },{
      queue: false,
      duration:100,
      done: function(){
        $("#settingsCol").slideToggle({
          duration:0,
          queue: false,
          done: function(){
            $("#settingsCol input:checked:first").focus()
          }
        });
      }
    });
    ls.set({
      optionsVisible : true
    }, function(){
      optionsVisible = true;
      $("#settingsTitle").addClass("selected");
    });
  }
}

function switchEditorViewer(view, optFromEnableMarkdown){
  if(view === "mdEdit" || enableMarkdown === false){
    $("#mdViewer").css("visibility", "hidden");
    $("#textarea").css("visibility", "visible");
    $("#mdEdit").addClass("selected");
    $("#mdPreview").removeClass("selected");
    showMarkdownPreview = false;
    if(optFromEnableMarkdown !== true) $("#textarea").focus();
  } else {
    if($("#mdViewer").html() !== markdownConverter.makeHtml(currText) || $("#mdViewer").text().length === 0) $("#mdViewer").html(markdownConverter.makeHtml(currText));
    $("#mdViewer").css("visibility", "visible").focus();
    $("#textarea").css("visibility", "hidden");
    $("#mdEdit").removeClass("selected");
    $("#mdPreview").addClass("selected");
    showMarkdownPreview = true;
  }
}

function toggleFullScreen(){
  if(chrome.app.window.current().isFullscreen() === true){
    chrome.app.window.current().restore();
    $("#fullscreen").removeClass("selected");
  } else {
    chrome.app.window.current().fullscreen();
    $("#fullscreen").addClass("selected");
  }
}

function switchHelpView(){
  if(isHelpVisible === true){
    $("#helpDiv, #helpModal").hide();
    isHelpVisible = false;
  } else {
    $("#helpDiv, #helpModal").show();
    isHelpVisible = true;
  }
}

function printThis(){
  if($(".mdButtonSet.selected").attr("id") === "mdEdit")
    $("#printable").html(currText.replace(/\t/g, '    ')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/  /g, '&nbsp; ')
      .replace(/  /g, '&nbsp; ') // handles "W&nbsp;  W"
      .replace(/\r\n|\n|\r/g, '<br />')
    );
  else
    $("#printable").html(markdownConverter.makeHtml(currText));
  
  window.print();
  $("#printable").text("");
}

function saveThis(){
  chrome.fileSystem.chooseEntry({
    type: "saveFile",
    suggestedName: "wordCounter." + (enableMarkdown === true ? "md" : "txt"),
    accepts: [{
      description: "text",
      mimeTypes: ["text/plain", "text/markdown", "text/html"],
      extensions:["txt", "md"]
    }],
    acceptsAllTypes: true
  }, function(writeableFileEntry){
    writeableFileEntry.createWriter(function(writer) {
      writer.onerror = errorHandler;
      writer.onwriteend = function(e) {
        console.log('file write complete.');
      };
      writer.write(new Blob([currText], {type: "text/" + (enableMarkdown === true ? "markdown" : "plain")}));
    }, errorHandler);
  });
}

function showHelpFooter(){
  $("#statusSpan").fadeOut(function(){
    var helpMessage = chrome.i18n.getMessage("helpPrompt");
    var width = $("#bottomBar").width() - 23 - 8;
    $("#bottomBar>:visible[id]:not([id='statusSpan'])").each(function(){
      width -= ($(this).width() + 16);
    });
    $(this).css({"maxWidth": width}).text(helpMessage).attr("title", helpMessage).fadeIn("slow");
  });
}

function scrollTextArea(direction){
  // 
  $("#textarea").scrollTop($("#textarea").scrollTop() + (direction === "up" ? -fontSize : fontSize )*1.42857);
}

/*********************************************************/
/*                                                       */
/*                  HELP FUNCTIONS                       */
/*                                                       */
/*********************************************************/

function fupper(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// http://stackoverflow.com/a/2593661/1078008
RegExp.escape= function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};

// From: http://stackoverflow.com/questions/3356770/need-cursor-at-beginning-of-text-in-textarea/3357143#3357143
// el is javascript dom element
// When using with jquery, use $("...")[0]
function moveCursorToEnd(el) {
  if (el.selectionStart == "number") {
    el.selectionStart = el.selectionEnd = el.value.length;
  } else if (typeof el.createTextRange != "undefined") {
    el.focus();
    var range = el.createTextRange();
    range.collapse(false);
    range.select();
  }
}

function errorHandler(e) {
  console.log('error:');
  console.log(e);
}

