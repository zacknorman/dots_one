var fileSystemObj = {
    fs:null,
    openfilereqs:{},
    arraybuffers:{},
    readarraybuffers:{},
    createRoot:function(rname,callback){
        var that = this;
        var fpath = "/"+rname;
        var callback2 = function(dirEntry){
            chrome.fileSystemProvider.mount({
                fileSystemId: dirEntry.filesystem.name+"::::::::::::::chrome_extension:::::::::::::::"+dirEntry.name,
                displayName: dirEntry.name,
                writable: true
            }, function() {
                callback();
            });
        };
        if(that.fs){
            that.createFolder(null,fpath,callback2)
        }else{
        	var windowrequestfilesystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        	windowrequestfilesystem(window.PERSISTENT, 1024*1024*1024*1024, function(fs) {
        	    that.fs = fs;
                that.createFolder(null,fpath,callback2)
        	});
        }
    },
    createFolder:function(options,fpath,callback,errcallback){
        if(options){
            var paths = options.fileSystemId.split("::::::::::::::chrome_extension:::::::::::::::");
            var path = paths[1]
            fpath = "/"+path+fpath;
        }
        var fs = this.fs;
	    fs.root.getDirectory(fpath, {create:true,excurusive:true}, function(dirEntry){
            if(callback)callback(dirEntry);
	    },function(){
    	    fs.root.getDirectory(fpath, {create:false}, function(dirEntry){
                if(callback)callback(dirEntry);
    	    },function(){
                if(errcallback)errcallback();
    	    });                
        });
    },
    moveFolder:function(options,sourcePath,targetPath,successCallback,errcallback){
        var paths = options.fileSystemId.split("::::::::::::::chrome_extension:::::::::::::::");
        var path = paths[1]
        sourcePath = "/"+path+sourcePath;
        targetPath = "/"+path+targetPath;
        var fs = this.fs;
	    var cb = function(entry){
            var paths = targetPath.split("/");
            var dirname = paths.pop();
            var prntp = paths.join("/")
    	    fs.root.getDirectory(prntp, {create:false}, function(pdirEntry){
    	        entry.moveTo(pdirEntry,dirname,function(){
        	        if(successCallback)successCallback()
    	        },function(){
        	        if(errcallback)errcallback("FAILED")
    	        })
    	    },function(){
    	        if(errcallback)errcallback("NOT_FOUND")
            });
	    };
	    fs.root.getDirectory(sourcePath, {create:false}, function(dirEntry){
	        cb(dirEntry)
	    },function(){
	        fs.root.getFile(sourcePath, {create: false}, function(fileEntry) {
    	        cb(fileEntry)
	        },function(){
    	        if(errcallback)errcallback("NOT_FOUND")
	        });
        });
    },
    checkMetadata:function(options,entryPath,successCallback,errorCallback){
        var paths = options.fileSystemId.split("::::::::::::::chrome_extension:::::::::::::::");
        var path = paths[1]
        entryPath = "/"+path+entryPath;
        paths = entryPath.split("/");
        var name = paths[paths.length-1];
        var fs = this.fs;
        if(!name){
    	    fs.root.getDirectory(entryPath, {create:false}, function(dirEntry){
                dirEntry.getMetadata(function(metadata) { 
                    successCallback({
                        isDirectory:true,
                        name:"",
                        size:metadata.size,
                        modificationTime:metadata.modificationTime
                    });
                });
    	    },function(){
                errorCallback("NOT_FOUND")
    	    });
        }else{
            fs.root.getFile(entryPath, {create: false}, function(fileEntry) {
                fileEntry.getMetadata(function(metadata) { 
                    successCallback({
                        isDirectory:false,
                        name:name,
                        size:metadata.size,
                        modificationTime:metadata.modificationTime
                    });
                });
            },function(){
        	    fs.root.getDirectory(entryPath, {create:false}, function(dirEntry){
                    dirEntry.getMetadata(function(metadata) { 
                        successCallback({
                            isDirectory:true,
                            name:name,
                            size:metadata.size,
                            modificationTime:metadata.modificationTime
                        });
                    });
        	    },function(){
                    errorCallback("NOT_FOUND")
        	    });
            });
        }
    },
    getDirectoryItems:function(options,successCallback,errorCallback){
        var paths = options.fileSystemId.split("::::::::::::::chrome_extension:::::::::::::::");
        var path = paths[1];
        var fs = this.fs;
	    fs.root.getDirectory("/"+path+options.directoryPath, {create:false}, function(dirEntry){
            var entries = [];
		    var dirReader = dirEntry.createReader();
		    var cmp = function(a, b) {return a.name.localeCompare(b.name)};
		    var toArray = function(list) {return Array.prototype.slice.call(list || [], 0)};
		    var readEntries = function() {
		        dirReader.readEntries (function(results) {
		            if (!results.length) {
		                if(entries.length < 1){
		                    errorCallback("NOT_FOUND");
		                }else{
                            var filelist = [],folderlist = [];
                            var date = new Date();
                            for (var i = 0; i < entries.length; i++) {
                                var item = entries[i];
                                var obj = {};
                                obj.name = item.name;
                                if(item.isDirectory){
                                    obj.isDirectory = true;
                                    obj.name = item.name;
                                    obj.size = 0;
                                    obj.modificationTime = date;
                                    folderlist.push(obj)
                                }else{
                                    obj.isDirectory = false;
                                    obj.name = item.name;
                                    obj.size = 0;
                                    obj.modificationTime = date;
                                    filelist.push(obj)
                                }
                            }
                            var nfilelist = filelist.sort(cmp);
                            var nfolderlist = folderlist.sort(cmp);
                            var itemlist = nfolderlist.concat(nfilelist);
                            successCallback(itemlist,false);
		                }
		            } else {
		                entries = entries.concat(toArray(results));
		                readEntries();
		            }
		        });
		    };
		    readEntries();
	    },function(){
            errorCallback("NOT_FOUND")
	    });
    },
    readFile:function(options,entryPath,successCallback,errorCallback){
        var that = this;
        var paths = options.fileSystemId.split("::::::::::::::chrome_extension:::::::::::::::");
        var path = paths[1]
        entryPath = "/"+path+entryPath;
        if(this.readarraybuffers[entryPath]){
            var arybf = this.readarraybuffers[entryPath];
            var chunk = arybf.slice(options.offset,(options.offset+options.length))
            successCallback(chunk,false)
        }else{
            var fs = this.fs;
            fs.root.getFile(entryPath, {create: false}, function(fileEntry) {
    			fileEntry.file(function(file) {
    				var reader = new FileReader();
    				reader.onload = function(e) {
    				    var arybf = this.result;
    				    that.readarraybuffers[entryPath] = arybf;
                        var chunk = arybf.slice(options.offset,(options.offset+options.length))
                        successCallback(chunk,false)
    				};
    			    reader.readAsArrayBuffer(file);
    			});
    	    },function(){
    	        if(errorCallback)errorCallback("NOT_FOUND")
            });
        }
    },
    deleteEntry:function(options,successCallback,errorCallback){
        var paths = options.fileSystemId.split("::::::::::::::chrome_extension:::::::::::::::");
        var path = paths[1]
        var entryPath = "/"+path+options.entryPath;
        var fs = this.fs;
        if(options.recursive){
    	    fs.root.getDirectory(entryPath, {create:false}, function(item){
				item.removeRecursively(function() {
                    successCallback();
				},function(){
        	        if(errorCallback)errorCallback("FAILED")
			    });
	        },function(){
    	        if(errorCallback)errorCallback("NOT_FOUND")
	        });
        }else{
	        fs.root.getFile(entryPath, {create: false}, function(item) {
				item.remove(function() {
                    successCallback();
				},function(){
        	        if(errorCallback)errorCallback("FAILED")
			    });
	        },function(){
    	        if(errorCallback)errorCallback("NOT_FOUND")
	        });
        }
    },
    createFile:function(options,entryPath,successCallback,errorCallback){
        var paths = options.fileSystemId.split("::::::::::::::chrome_extension:::::::::::::::");
        var path = paths[1]
        entryPath = "/"+path+entryPath;
        var fs = this.fs;
        fs.root.getFile(entryPath, {create: true,excurusive:true}, function(item) {
            successCallback();
		},function(){
	        if(errorCallback)errorCallback("EXISTS")
        });
    },
    writeFile:function(options,openopt,successCallback,errorCallback){
        if(options.offset < 1){
            var obj = {};
            obj.ary = [];
            obj.mode = "write";
            this.arraybuffers[options.openRequestId] = obj;
        }
        this.arraybuffers[options.openRequestId].ary.push(options.data);
        successCallback();
    },
    writeFileEntry:function(options,opneopt,arybf,successCallback){
        var blob = new Blob(arybf);        
        var paths = options.fileSystemId.split("::::::::::::::chrome_extension:::::::::::::::");
        var entryPath = "/"+paths[1]+opneopt.filePath;
        var fs = this.fs;
        fs.root.getFile(entryPath, {create: true}, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
                fileWriter.onwriteend = function () {
                    successCallback();
         	    };
                fileWriter.onerror = function () {
                    successCallback();
         	    };
                fileWriter.write(blob);
            });
		},function(){
            successCallback();
        });
    },
    copyEntry:function(options,successCallback,errorCallback){
        var paths = options.fileSystemId.split("::::::::::::::chrome_extension:::::::::::::::");
        var path = paths[1]
        sourcePath = "/"+path+options.sourcePath;
        targetPath = "/"+path+options.targetPath;
        var paths = targetPath.split("/");
        paths.pop();
        targetPath = paths.join("/")
        var fs = this.fs;
        fs.root.getFile(sourcePath, {create: false}, function(fileEntry) {
    	    fs.root.getDirectory(targetPath, {create:false}, function(dirEntry){
    	        fileEntry.copyTo(dirEntry);
    	        successCallback();
    	    },function(){
    	        if(errorCallback)errorCallback("NOT_FOUND")
	        });
	    },function(){
	        if(errorCallback)errorCallback("NOT_FOUND")
        });
    },
    truncateFile:function(options,entryPath,successCallback,errorCallback){
        var paths = options.fileSystemId.split("::::::::::::::chrome_extension:::::::::::::::");
        var path = paths[1]
        entryPath = "/"+path+entryPath;
        var fs = this.fs;
        fs.root.getFile(entryPath, {create: false}, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
                fileWriter.onwriteend = function () {
                    successCallback();
                };
                fileWriter.truncate(options.length);
            },function(){
    	        if(errorCallback)errorCallback("FAILED")
            });
        },function(){
	        if(errorCallback)errorCallback("NOT_FOUND")
        });
    }
};
chrome.fileSystemProvider.onUnmountRequested.addListener(function(options,successCallback, errorCallback){
    chrome.fileSystemProvider.unmount({fileSystemId:options.fileSystemId},function(){});
});
chrome.fileSystemProvider.onGetMetadataRequested.addListener(function(options, successCallback, errorCallback){
    if(fileSystemObj.fs){
        fileSystemObj.checkMetadata(options,options.entryPath,successCallback,errorCallback)
    }else{
    	var windowrequestfilesystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    	windowrequestfilesystem(window.PERSISTENT, 1024*1024*1024*1024, function(fs) {
    	    fileSystemObj.fs = fs;
            fileSystemObj.checkMetadata(options,options.entryPath,successCallback,errorCallback)
    	});
    }
});
chrome.fileSystemProvider.onReadDirectoryRequested.addListener(function(options, successCallback, errorCallback){
    if(fileSystemObj.fs){
        fileSystemObj.getDirectoryItems(options,successCallback,errorCallback)
    }else{
    	var windowrequestfilesystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    	windowrequestfilesystem(window.PERSISTENT, 1024*1024*1024*1024, function(fs) {
    	    fileSystemObj.fs = fs;
            fileSystemObj.getDirectoryItems(options,successCallback,errorCallback)
    	});
    }
});
chrome.fileSystemProvider.onOpenFileRequested.addListener(function(options, successCallback, errorCallback){
    fileSystemObj.openfilereqs[options.requestId] = options;
    if(fileSystemObj.fs){
        fileSystemObj.checkMetadata(options,options.filePath,successCallback,errorCallback)
    }else{
    	var windowrequestfilesystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    	windowrequestfilesystem(window.PERSISTENT, 1024*1024*1024*1024, function(fs) {
    	    fileSystemObj.fs = fs;
            fileSystemObj.checkMetadata(options,options.filePath,successCallback,errorCallback)
    	});
    }
});
chrome.fileSystemProvider.onCreateDirectoryRequested.addListener(function(options, successCallback, errorCallback){
    if(fileSystemObj.fs){
        fileSystemObj.createFolder(options,options.directoryPath,successCallback,errorCallback)
    }else{
    	var windowrequestfilesystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    	windowrequestfilesystem(window.PERSISTENT, 1024*1024*1024*1024, function(fs) {
    	    fileSystemObj.fs = fs;
            fileSystemObj.createFolder(options,options.directoryPath,successCallback,errorCallback)
    	});
    }
});
chrome.fileSystemProvider.onCreateFileRequested.addListener(function(options, successCallback, errorCallback){
    if(fileSystemObj.fs){
        fileSystemObj.createFile(options,options.filePath,successCallback, errorCallback)
    }else{
    	var windowrequestfilesystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    	windowrequestfilesystem(window.PERSISTENT, 1024*1024*1024*1024, function(fs) {
    	    fileSystemObj.fs = fs;
            fileSystemObj.createFile(options,options.filePath,successCallback, errorCallback)
    	});
    }
});
chrome.fileSystemProvider.onDeleteEntryRequested.addListener(function(options, successCallback, errorCallback){
    if(fileSystemObj.fs){
        fileSystemObj.deleteEntry(options,successCallback, errorCallback)
    }else{
    	var windowrequestfilesystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    	windowrequestfilesystem(window.PERSISTENT, 1024*1024*1024*1024, function(fs) {
    	    fileSystemObj.fs = fs;
            fileSystemObj.deleteEntry(options,successCallback, errorCallback)
    	});
    }
});
chrome.fileSystemProvider.onWriteFileRequested.addListener(function(options, successCallback, errorCallback){
    var openopt = fileSystemObj.openfilereqs[options.openRequestId];
    if(openopt){
        if(fileSystemObj.fs){
            fileSystemObj.writeFile(options,openopt,successCallback, errorCallback)
        }else{
        	var windowrequestfilesystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        	windowrequestfilesystem(window.PERSISTENT, 1024*1024*1024*1024, function(fs) {
        	    fileSystemObj.fs = fs;
                fileSystemObj.writeFile(options,openopt,successCallback, errorCallback)
        	});
        }
    }else{
        errorCallback("FAILED")
    }
});
chrome.fileSystemProvider.onCloseFileRequested.addListener(function(options, successCallback, errorCallback){
    var callback = function(){
        successCallback();
        if(fileSystemObj.openfilereqs[options.openRequestId]){
            fileSystemObj.openfilereqs[options.openRequestId] = null;
            delete fileSystemObj.openfilereqs[options.openRequestId];
        }
        if(fileSystemObj.arraybuffers[options.openRequestId]){
            fileSystemObj.arraybuffers[options.openRequestId] = null;
            delete fileSystemObj.arraybuffers[options.openRequestId];
        }
    };
    var fpath = fileSystemObj.openfilereqs[options.openRequestId];
    if(fpath){
        (function(filePath){
            var paths = options.fileSystemId.split("::::::::::::::chrome_extension:::::::::::::::");
            var path = paths[1]
            var entryPath = "/"+path+filePath;   
            if(entryPath&&fileSystemObj.readarraybuffers[entryPath]){
                fileSystemObj.readarraybuffers[fpath] = null;
                delete fileSystemObj.readarraybuffers[fpath]
            }    
        })(fpath.filePath)
    }
    var arybfobj = fileSystemObj.arraybuffers[options.openRequestId];
    if(arybfobj&&arybfobj.mode === "write"){
        var opneopt = fileSystemObj.openfilereqs[options.openRequestId];
        fileSystemObj.writeFileEntry(options,opneopt,arybfobj.ary,callback);
    }else{
        callback();
    }
});
chrome.fileSystemProvider.onCopyEntryRequested.addListener(function(options, successCallback, errorCallback){
    if(fileSystemObj.fs){
        fileSystemObj.copyEntry(options,successCallback,errorCallback)
    }else{
    	var windowrequestfilesystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    	windowrequestfilesystem(window.PERSISTENT, 1024*1024*1024*1024, function(fs) {
    	    fileSystemObj.fs = fs;
            fileSystemObj.copyEntry(options,successCallback,errorCallback)
    	});
    }
});
chrome.fileSystemProvider.onMoveEntryRequested.addListener(function(options, successCallback, errorCallback){
    if(fileSystemObj.fs){
        fileSystemObj.moveFolder(options,options.sourcePath,options.targetPath,successCallback,errorCallback)
    }else{
    	var windowrequestfilesystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    	windowrequestfilesystem(window.PERSISTENT, 1024*1024*1024*1024, function(fs) {
    	    fileSystemObj.fs = fs;
            fileSystemObj.moveFolder(options,options.sourcePath,options.targetPath,successCallback,errorCallback)
    	});
    }
});
chrome.fileSystemProvider.onReadFileRequested.addListener(function(options, successCallback, errorCallback){
    var openopt = fileSystemObj.openfilereqs[options.openRequestId];
    if(openopt){
        if(fileSystemObj.fs){
            fileSystemObj.readFile(options,openopt.filePath,successCallback, errorCallback)
        }else{
        	var windowrequestfilesystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        	windowrequestfilesystem(window.PERSISTENT, 1024*1024*1024*1024, function(fs) {
        	    fileSystemObj.fs = fs;
                fileSystemObj.readFile(options,openopt.filePath,successCallback, errorCallback)
        	});
        }
    }else{
        errorCallback("FAILED")
    }
});
chrome.fileSystemProvider.onTruncateRequested.addListener(function(options, successCallback, errorCallback){
    if(fileSystemObj.fs){
        fileSystemObj.truncateFile(options,options.filePath,successCallback, errorCallback)
    }else{
    	var windowrequestfilesystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    	windowrequestfilesystem(window.PERSISTENT, 1024*1024*1024*1024, function(fs) {
    	    fileSystemObj.fs = fs;
            fileSystemObj.truncateFile(options,options.filePath,successCallback, errorCallback)
    	});
    }
});
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason === "install"){
        var callback = function(){};
        fileSystemObj.createRoot("My Documents",callback);
    }
});
chrome.app.runtime.onLaunched.addListener(function(launchData) {
    launchAPP({
        width:400,
        height:300,
        minWidth:400,
        minHeight:300, 
    });
});
function launchAPP(windopt){
    var opts = {
        id:'main',
        frame:"none",
        outerBounds:windopt
    };
    chrome.app.window.create('index.html',opts,function(mainWindow) {
        mainWindow.onClosed.addListener(function(e) {

        })
    });
}
