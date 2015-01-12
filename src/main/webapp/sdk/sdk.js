/*
    .projectile-filer
        | [data-filer-type]
            | 0 : not defined
            | 1 : used for iframe (default)
            | 2 : used for custom html, which supports {{}} tags
        | [data-filer-theme]
            | 0 : list view (default)
            | 1 : tablew view
            | 2 : all in {drag&drop, thumbnails, filters...}
        | [data-filer-set-]
            | custom parameters for jquery.filer
*/
(function(){
    var f = {
        version: "1.2.3",
        u: "/forum/",
        restUrl: "/forum/",
        folder: null,
        s: [],
        captions: {
            Flyer: "Flyer|Flyer",
            file: "Flyer|File",
            files: "Flyer|Files",
            lock: "Tooltip|Lock",
            unlock: "Tooltip|Unlock",
            sortBy: "Tooltip|Sort",
            listView: "Flyer|ListView",
            gridView: "Flyer|GridView",
            filesSelected: "Flyer|Files selected",
            remove: "Tooltip|Delete",
            tName: "Document|Title",
            tSize: "Document|Size",
            tDate: "Document|Date",
            tUser: "Document|Employee",
            tComment: "Document|Comment",
            tActions: "Document.Plural|Action",
            commentLeave: "Flyer|Please enter a comment",
            filter: "Default|Filter",
            errorTitle: "System|Error",
            errorText: "Access|Access denied",
            removeConfirmation: "${Phrases:Really delete $0 ?}:::${Flyer:File}",
            noFiles: "Flyer|No files available",
            noFilesSelected: "Flyer|No file selected",
            dragDropFiles: "Flyer|Drag and Drop Files Here",
            or: "Application|or",
            browseFiles: "Flyer|Browse Files",
            tPrompt: "System|Hint",
            lockText: "Flyer|Please enter a reason for locking",
            tInfo: "System|Hint",
            lockCommentEmpty: "Flyer|Please enter a comment",
            lockDenied: "${Flyer:File '$0' is locked by $1 at $2. Comment was '$3'}",
            tConfirm: "System|Hint",
            download: "Defaulft|Download",
            success: "Document|Success",
            versions: "Document|History",
            infoShow: "Default|Info",
            back: "System|Back",
            unlockMessage: "Flyer|File was unlocked",
            lockMessage: "Flyer|File was locked",
            ok: "Document|OK",
            yes: "Document|Yes",
            no: "Tooltip|No",
            cancel: "Document|Cancel",
            openFile: "Document|Open"
        },
        
        init: function(){
            var element = document.querySelectorAll("[class^='projectile-filer']");
            if(!element || element.length <= 0){
                return false;
            }else{
                f.s.push( {t: "filer", el: element[0]} );  
            }
            
            f.load();
            
            f.getCaptions(function(){
                f.customize();
            });
        },
        
        customize: function() {
            var el = f.s[0].el,
                attr = function(name) {
                    var a = el.getAttribute(name);
                    if(!a || typeof a == "undefined") { return false; } else { return a.toString(); } 
                };
            
            f.folder = (f.s[0].el.getAttribute('data-filer-folderid') ? f.s[0].el.getAttribute('data-filer-folderid') : f._location.getParameter('list'));
            
            if(attr("data-filer-type")){
                switch(attr("data-filer-type")){
                    case "1":
                        f.load("1");
                    break;
                    case "2":
                        f.load("2");
                    break;
                }
            }
            if(attr("data-filer-theme")){
                switch(attr("data-filer-theme")){
                    case "0":
                        f.load("list");
                    break;
                    case "1":
                        f.load("table");
                    break;
                    case "2":
                        f.load("thumbs");
                    break;
                }
            }
        },
        
        check: function() {
            
        },

        getStyles: function(href) {
            var link = document.createElement("link"),
                src = f.u + href;
            link.href = src;
            link.rel = "stylesheet";
            link.type = "text/css";
            document.head.appendChild(link);
        },

        getScript: function(href) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = f.u + href + "?v=" + f.version;
            script.async = false;
            document.getElementsByTagName('head')[0].appendChild(script);
        },
        
        _location: {
            addParameter: function(key, value, sourceURL){
                var sourceURL = (sourceURL ? sourceURL : location.href),
                    separator = (sourceURL.indexOf('?') > -1 ? "&" : "?");
                if(f._location.getParameter(key)){
                    sourceURL = f._location.removeParameter(key)
                }
                return sourceURL + separator + key + "=" + value;
            },
            removeParameter: function(key, sourceURL){
                var sourceURL = (sourceURL ? sourceURL : location.href),
                    rtn = sourceURL.split("?")[0],
                    param,
                    params_arr = [],
                    queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
                if (queryString !== "") {
                    params_arr = queryString.split("&");
                    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                        param = params_arr[i].split("=")[0];
                        if (param === key) {
                            params_arr.splice(i, 1);
                        }
                    }
                    rtn = rtn + "?" + params_arr.join("&");
                }
                return rtn;
            },
            getParameter: function(name, hash){
                if(!name){ return; }
                name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
                var regexS = "[\\?&\/]"+name+"[=\/]([^&#]*)",
                    regex = new RegExp( regexS ),
                    results = regex.exec( (!hash ? location.href : location.hash) );
                if( results == null )
                    return false;
                else
                    return decodeURIComponent(results[1].replace(/\+/g, " "));
            },
            redirect_to: function(url){
                location.href = url;
            }
        },
        
        preloader: function(event) {
            event = (!event ? "show" : "hide");
            var preloader = document.body.getElementsByClassName('preloader');
            
            if (preloader && preloader.length > 0) {
                function fadeOut(el) {
                    el.style.opacity = 1;
                    var last = +new Date();
                    var tick = function() {
                        el.style.opacity = +el.style.opacity - (new Date() - last) / 400;
                        last = +new Date();
                        if (+el.style.opacity > 0) {
                            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
                        } else {
                            preloader[0].parentNode.removeChild(preloader[0]);
                        }
                    };
                    tick();
                }
                fadeOut(preloader[0]);
            }
            
            if(event == "hide") { return; }
            document.body.innerHTML = document.body.innerHTML + '<div class="preloader"><span><img src="images/icons/loading.gif"></span></div>';
        },

        load: function(type) {
            if(!type){
                if (typeof jQuery == "undefined") { f.getScript("bower_components/jquery/jquery.min.js"); }
                f.getScript("js/jquery.filer.js");
                if(typeof modal == "undefined") { f.getStyles("css/plugins/jquery.modal.css"); f.getScript("js/jquery.modal.min.js"); }
                if(typeof notify == "undefined") { f.getStyles("css/plugins/jquery.notify.css"); f.getScript("js/jquery.notify.min.js"); }
                f.getStyles("css/plugins/jquery.dropdown.css"); f.getScript("js/jquery.dropdown.min.js");
            }
            if(type == "1") {
                f.getStyles("css/plugins/jquery.filer.css");
            }
            if(type == "2") {
                f.getStyles("css/plugins/jquery.filer.css");
            }
            if(type == "list") {
                f.getStyles("templates/list/css/jquery.filer-table.css");
                f._ajax(f.u + "templates/list/index.html", 'GET', {}, function(r){
                    f.s[0].el.innerHTML = r;
                    f.getScript("templates/list/js/scripts.js");
                    f.getScript("templates/list/js/custom.js");
                });    
            }
            if(type == "table") {
                f.getStyles("templates/table/css/jquery.filer-table.css");
                f._ajax(f.u + "templates/table/index.html", 'GET', {}, function(r){
                    f.s[0].el.innerHTML = r;
                    f.getScript("templates/table/js/scripts.js");
                    f.getScript("templates/table/js/custom.js");
                });
            }
            if(type == "thumbs") {
                f.getStyles("templates/thumbnails/css/jquery.filer-thumbnails.css");
                f._ajax(f.u + "templates/thumbnails/index.html", 'GET', {}, function(r){
                    f.s[0].el.innerHTML = r;
                    f.getScript("templates/thumbnails/js/scripts.js");
                    if(f.storage("ViewMode") && f.storage("ViewMode") == "grid"){
                        f.getScript("templates/thumbnails/js/custom.js");
                        $projectile.viewMode = "grid";
                    }else{
                        f.getScript("templates/thumbnails/js/custom-list-view.js");
                        $projectile.viewMode = "list";
                    }
                });
            }
        },
        
        file: {
            lock: function(data, callback){
                if(!data.locked){
                    var params = {
                        locked: true,
                        lockComment: data._lockComment
                    }
                    f._ajax(f.restUrl + "rest/api/json/0/filehistories/" + data.fId, 'PUT', params, function(r){
                        if(r && r.StatusCode && r.StatusCode.CodeNumber.toString()=="0"){
                            data.locked = true
                            r._transfered = true;
                        }else{
                            if(typeof(r) != "object"){r = new Object()} 
                            r._transfered = false;
                        }
                        callback(r);
                        
                    }, "json");
                }else{
                    var params = {
                        locked: false,
                    }
                    f._ajax(f.restUrl + "rest/api/json/0/filehistories/" + data.fId, 'PUT', params, function(r){
                        if(r && r.StatusCode && r.StatusCode.CodeNumber.toString()=="0"){
                            data.locked = false
                            r._transfered = true;
                        }else{
                            if(typeof(r) != "object"){r = new Object()} 
                            r._transfered = false;
                        }
                        callback(r);
                        
                    }, "json");   
                }
            },
            remove: function(data, callback){
                var url = "rest/api/json/0/filerevisions/" + data.rId;
                if(data.fId && (!data.isVersion || data.revisions)){ url = "rest/api/json/0/filehistories/" + data.fId; }
                f._ajax(f.restUrl + url, 'DELETE', null, function(r){
                    if(r && r.StatusCode && r.StatusCode.CodeNumber.toString()=="0"){
                        data.locked = true
                        r._transfered = true;
                    }else{
                        if(typeof(r) != "object"){r = new Object()} 
                        r._transfered = false;
                    }
                    callback(r);
                    
                }, "json");
            },
            archive: function(){
                
            },
        },
        
        getFiles: function(folder, callback) {
            var files = [],
                id = (folder && typeof folder == "string" ? folder : f.folder);
            f.files = [];
            f._ajax(f.restUrl + "rest/api/json/0/filehistories?folder=" + id, 'GET', {}, function(r){
                if(r.Entries && r.Entries.length > 0 && r.Entries[0]){
                    var total = r.Entries.length,
                        s = 0;
                    for(key in r.Entries){
                        if(!r.Entries[key]){break;}
                        var val = r.Entries[key];
                        val.orderKey = key;
                        f._ajax(f.restUrl + "rest/api/json/0/filerevisions?fileHistory=" + val.id, 'GET', {a: val}, function(r2, b){
                            if(r2 && r2.Entries && r2.Entries[0]){
                                r2.Entries[0].fId = b.id;
                                r2.Entries[0].locked = b.locked;
                                r2.Entries[0].lockComment = b.lockComment || null;
                                r2.Entries[0].lockedBy = b.lockedBy || null;
                                r2.Entries[0].lockedByName = b.lockedByName || null;
                                r2.Entries[0].lockTime = b.lockTime || null;
                                r2.Entries[0].revisions = b.revisions;
                                r2.Entries[0].orderKey = b.orderKey;
                                r2.Entries[0].revisions = [];

                                if(r2.Entries.length > 1){
                                    for(var i = 0; i<r2.Entries.length; i++){
                                        r2.Entries[0].revisions.push(r2.Entries[i]);
                                    }
                                }

                                files.push(r2.Entries[0]);
                            }
                            s++;
                            if(s>=total){
                                files = files.sort(function(a,b){
                                    return +b.orderKey - +a.orderKey;
                                });
                                f.files = files;
                                (folder && typeof folder == "function" ? folder(files) : (callback && typeof callback == "function" ? callback(files) : null));
                            }
                        }, "json");  
                    }    
                }else{
                    (folder && typeof folder == "function" ? folder(files) : (callback && typeof callback == "function" ? callback(files) : null));
                }
            }, "json");
        },
        
        getCaptions: function(callback) {
            var captions = f.captions,
                data = "",
                first = true;
            for(key in captions){
                var value = captions[key],
                    param = (first ? '?' : '&');
                data += param + 'id=' + value;
                first = false;
            }
            
            f._ajax(f.restUrl + "rest/api/json/0/captions" + data, 'GET', {}, function(r){
                var i = 0;
                for(key in captions){
                    captions[key] = r.Entries[i].translation.replace(/:\s*$/, ""); //removes last :
                    i++;
                }
                f.captions = captions;
                callback(captions);
            }, "json");
        },
        
        changeCaptions: function() {
            f.s[0].el.innerHTML = f.s[0].el.innerHTML.replace(/\%captions-(.*?)\%/g, function(match, a){return f.captions[a]});
        },
        
        _ajax: function(url, type, data, callback, dataType) {
            var request = new XMLHttpRequest(),
                data = (!data || f.isEmptyObj(data) ? false : data),
                serialize = function(obj) {
                  var str = [];
                  for(var p in obj)
                    if (obj.hasOwnProperty(p)) {
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                  return str.join("&");
                };
            
            request.open(type, url, true);

            request.onload = function() {
                if (request.status >= 200 && request.status < 400){
                    resp = request.responseText;
                    if(dataType && dataType == "json"){
                        resp = JSON.parse(resp);   
                    }
                    if(callback && typeof callback == "function"){
                        callback(resp, data.a);   
                    }
                }
            };

            request.onerror = function() {
                location.href = f.u + "404.html";
            };
            
            if(data){
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            }
            
            request.send((data ? serialize(data) : ""));   
        },
        
        ready: function(callback) {
            var isFinished = [];
            //f.getCaptions(function(){isFinished.push("getCaptions"); allDone()});
            f.getFiles(function(){isFinished.push("getFiles"); allDone()});
            
            function allDone() {
                if(isFinished.length < 1) return;
                f.preloader("hide");
                f.changeCaptions();
                callback(f);
            }
        },
        
        storage: function(name, value){
            if(typeof(Storage) == "undefined") { return false }

            if(name && !value){
                return localStorage.getItem("jFiler-" + name);
            }else if(name && value){
                localStorage.setItem("jFiler-" + name, value);
                return true;
            }else{
                return true;
            }
        },
        
        dateFormat: function(date) {
            date = !date ? new Date() : new Date(date);
            var d = {
                day: date.getDate(),
                month: date.getMonth()+1,
                year: date.getFullYear(),
                hours: date.getHours(),
                minutes: date.getMinutes(),
                seconds: date.getSeconds()
            };
            for(key in d){
                if(parseInt(d[key]) <= 9){
                    d[key] = "0" + d[key].toString();    
                }
            }
            return d.hours+":"+d.minutes+":"+d.seconds+" "+d.day+"."+d.month+"."+d.year;
        },
        
        sizeFormat: function(bytes){
            if(bytes == 0) return '0 Byte';
            var k = 1000;
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            var i = Math.floor(Math.log(bytes) / Math.log(k));
            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        },
        
        isEmptyObj: function (obj) {
            for(var prop in obj) {
                if(obj.hasOwnProperty(prop))
                    return false;
            }

            return true;
        },

        errorReport: function(msg) {
            console.log(msg);
        }
    };

    f.init();
    window.$projectile = f;
})();