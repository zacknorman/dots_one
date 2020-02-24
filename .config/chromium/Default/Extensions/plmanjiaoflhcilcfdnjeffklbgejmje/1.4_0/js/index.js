var mountitems = [
    {
        displayName:"My Documents"
    }
];
document.addEventListener("DOMContentLoaded", function(e) {
    document.getElementById('create-button').addEventListener("click",clickCreateButton,true);
    addCustomFrameEvent();
    chrome.storage.local.get("__mountimtes__",function(obj){
        var items = obj["__mountimtes__"];
        if(items){
            mountitems = items;
        }
        createFolderList();
    });	
},false);

function addCustomFrameEvent(){
    document.getElementsByClassName("modal-awesome-minus")[0].addEventListener("click",clickCustomFrameItem,true);
    document.getElementsByClassName("modal-awesome-max")[0].addEventListener("click",clickCustomFrameItem,true);
    document.getElementsByClassName("modal-awesome-close")[0].addEventListener("click",clickCustomFrameItem,true);
    document.getElementsByClassName("modal-awesome-pin")[0].addEventListener("click",clickCustomFrameItem,true);
    document.getElementsByClassName("modal-awesome-full")[0].addEventListener("click",clickCustomFrameItem,true);
    document.getElementsByClassName("modal-awesome-file")[0].addEventListener("click",clickCustomFrameItem,true);
    document.getElementsByClassName("modal-awesome-folder")[0].addEventListener("click",clickCustomFrameItem,true);
    document.getElementsByClassName("modal-awesome-about")[0].addEventListener("mousedown",clickCustomFrameItem,false);
    document.getElementById('aboutModal').addEventListener("click",function(){
        document.getElementById('aboutModal').style.display = "none";
    });
}
function clickCustomFrameItem(e){
    if(this.classList.contains("modal-awesome-close")){
        chrome.app.window.current().close();
    }else if(this.classList.contains("modal-awesome-about")){
        document.getElementById('aboutModal').style.display = "block";
    }else if(this.classList.contains("modal-awesome-minus")){
        chrome.app.window.current().minimize();
    }else if(this.classList.contains("modal-awesome-pin")){
        var crntw = chrome.app.window.current();
        if(crntw.isAlwaysOnTop()){
            this.classList.remove("alwaysontop")
            crntw.setAlwaysOnTop(false);
        }else{
            this.classList.add("alwaysontop")
            crntw.setAlwaysOnTop(true);
        }    
    }else if(this.classList.contains("modal-awesome-max")){
        var crntw = chrome.app.window.current();
        if(crntw.isMaximized() || crntw.isFullscreen()){
            crntw.restore();
        }else{
            crntw.maximize();
        }
    }else if(this.classList.contains("modal-awesome-full")){
        var crntw = chrome.app.window.current();
        if(crntw.isMaximized() || crntw.isFullscreen()){
            crntw.restore();
        }else{
            crntw.fullscreen();
        }
    }else if(this.classList.contains("modal-awesome-file")){
        chrome.fileSystem.chooseEntry({
            type:"openFile",
            accepts:[{
                mimeTypes: [],
                extensions: []
            }],
            acceptsMultiple: true
        },function(fileEntries){
            if(fileEntries&&fileEntries.length > 0){ 

            }
        });
    }else if(this.classList.contains("modal-awesome-folder")){
        chrome.fileSystem.chooseEntry({
            type:"openDirectory"
        },function(fileEntrie){
            if(fileEntrie){

            }
        });
    }
}
function clickCreateButton(){
    var inpt = document.getElementById("folder-name-input")
    var val = inpt.value.replace(/^\s+|\s+$/g, "");
	if(val){
	    for (var i = 0; i < mountitems.length; i++) {
	        if(mountitems[i].displayName === val)return;
	    }
        var obj = {};
        obj.displayName = val;
	    mountitems.push(obj)
	    var sobj = {};
	    sobj["__mountimtes__"] = mountitems;
        chrome.storage.local.set(sobj)
	    createFolderList();
    }
}
function createFolderList(){
    createNode(mountitems)
    function createNode(items){
        var cont = document.getElementById("mount-folder-container");
        cont.innerHTML = "";
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var div = document.createElement("div");
            cont.appendChild(div);
            div.setAttribute("class","folder-item")
         
            var mbtn = document.createElement("button")
            div.appendChild(mbtn);
            mbtn.appendChild(document.createTextNode("Mount"));
            mbtn.setAttribute("class","mount-button")
            mbtn.setAttribute("data-name",item.displayName)
            mbtn.addEventListener("click",function(){
                clickMount(this.getAttribute("data-name"))
            })
            checkButton(mbtn)

            var ubtn = document.createElement("button")
            div.appendChild(ubtn);
            ubtn.appendChild(document.createTextNode("Unmount"));
            ubtn.setAttribute("class","mount-button")
            ubtn.setAttribute("data-name",item.displayName)
            ubtn.addEventListener("click",function(){
                clickUnmount(this.getAttribute("data-name"))
            })

            var dbtn = document.createElement("button")
            div.appendChild(dbtn);
            dbtn.appendChild(document.createTextNode("Delete"));
            dbtn.setAttribute("class","mount-button")
            dbtn.setAttribute("data-name",item.displayName)
            dbtn.addEventListener("click",function(){
                clickDelete(this.getAttribute("data-name"))
            })

            var label = document.createElement("label")
            div.appendChild(label);
            label.appendChild(document.createTextNode(item.displayName));
        }
    }
    function checkButton(btn){
        var name = btn.getAttribute("data-name")
        var callback = function(){
            btn.style.background = "cyan"
            btn.style.color = "#000"
        };
        checkMount(name,callback)
    }
    function checkMount(name,callback,callback2){
        chrome.fileSystemProvider.getAll(function(mountitems){
    	    for (var i = 0; i < mountitems.length; i++) {
    	        if(mountitems[i]&&mountitems[i].displayName === name){
    	            if(callback)callback(mountitems[i]);
    	            return;
    	        }
    	    }
    	    if(callback2)callback2();
        });
    }
    function clickMount(name){
        var cb = function(){
            chrome.runtime.getBackgroundPage(function(bg){
                var callback = function(){
                    createFolderList();
                };
                bg.fileSystemObj.createRoot(name,callback);
            });
        };
        checkMount(name,null,cb)
    }
    function clickUnmount(name){
        var cb = function(mountitem){
            chrome.fileSystemProvider.unmount({fileSystemId:mountitem.fileSystemId},function(){
                createFolderList();
            });
        };
        checkMount(name,cb)
    }
    function clickDelete(name){
    	var windowrequestfilesystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    	windowrequestfilesystem(window.PERSISTENT, 1024*1024*1024*1024, function(fs) {
            var rmcb = function(){
        	    for (var i = 0; i < mountitems.length; i++) {
        	        if(mountitems[i]&&mountitems[i].displayName === name){
        	            mountitems.splice(i,1);
        	            break;
        	        };
        	    }
        	    var sobj = {};
        	    sobj["__mountimtes__"] = mountitems;
                chrome.storage.local.set(sobj)
        	    createFolderList();
            };
	        var scb = function(mountitem){
                chrome.fileSystemProvider.unmount({fileSystemId:mountitem.fileSystemId},function(){
                    rmcb();
                });
	        }
            var cb = function(mountitem){
                var paths = mountitem.fileSystemId.split("::::::::::::::chrome_extension:::::::::::::::");
                var path = paths[1]
                var entryPath = "/"+path;
        	    fs.root.getDirectory(entryPath, {create:false}, function(item){
    				item.removeRecursively(function() {
    				    scb(mountitem);
    				},function(){
    				    scb(mountitem);
    			    });
    	        },function(){
				    scb(mountitem);
    	        });
            };
            var ecb = function(){
                var entryPath = "/"+name;
        	    fs.root.getDirectory(entryPath, {create:true,excurusive:true}, function(dirEntry){
                    chrome.fileSystemProvider.mount({
                        fileSystemId: dirEntry.filesystem.name+"::::::::::::::chrome_extension:::::::::::::::"+dirEntry.name,
                        displayName: dirEntry.name,
                        writable: true
                    }, function() {
                        var obj = {};
                        obj.fileSystemId = dirEntry.filesystem.name+"::::::::::::::chrome_extension:::::::::::::::"+dirEntry.name;
                        cb(obj)
                    });
        	    },function(){
            	    fs.root.getDirectory(entryPath, {create:false}, function(dirEntry){
                        var obj = {};
                        obj.fileSystemId = dirEntry.filesystem.name+"::::::::::::::chrome_extension:::::::::::::::"+dirEntry.name;
                        cb(obj)
            	    });
        	    });
            };
            checkMount(name,cb,ecb)
    	});
    }
}
