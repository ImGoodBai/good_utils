(function(){var s=0,l=function(a,b){a?(chrome.browserAction.setIcon({path:"icons/icon19_down.png",tabId:b}),chrome.browserAction.setTitle({title:"CSS Viewer(running)",tabId:b})):(chrome.browserAction.setIcon({path:"icons/icon19.png",tabId:b}),chrome.browserAction.setTitle({title:"CSS Viewer",tabId:b}))},n=/\b(screen|all)\b/,t=/\bimportant\!/gi,u=/\binherit\b\s*}/gi,v=new CSSParser,o=function(a){for(var b=0,c;c=a[b];b++)if(c.imports&&!o(c.imports)||!(-1===c.status||3===c.status))return!1;return!0},
p=function(a,b,c,f){for(var c=c||[],g=0,d,h;d=a.cssRules[g];g++)if(1===d.type){h={};for(var i=0,e;d.declarations[i];i++)e=d.declarations[i],1E3===e.type?h[e.property]=e.valueText:console.log("undo style type: ",e.type);c.push({selector:d.mSelectorText,styleList:h})}else if(4===d.type&&n.test(d.media+""))p(d,b,c,f);else if(3===d.type&&n.test(d.media+"")){var j;d=d.href;h=f;i=b;e=void 0;try{d=d.replace(/"|'/g,"").replace(/url\((.*?)\)/,"$1");if(!/^https?:\/\//.test(d.trim())){h.url?(e=h.url.lastIndexOf("/"),
e=-1===e?h.url:h.url.substr(0,e+1)):(e=i.referUrl.lastIndexOf("/"),e=i.referUrl.substr(0,e+1));var m=d;if(0===m.indexOf("//")){var k=e.split("//");e=k[0]}else 0===m.indexOf("/")&&(k=e.split("//"),e=k[1].indexOf("/"),e=k[1].substr(0,e),e=k[0]+"//"+e);d=m=e+m}j=d}catch(l){console.log("getUrl Error",d,h.href,i.referUrl),j=""}if(j&&1!==b.download[j])d={type:"import",url:j},f.imports=f.imports||[],f.imports.push(d),q(d,b)}else console.log("undo rule type: ",d.type);return c},r=function(a,b){var c=a.text.replace(t,
"!impartant").replace(u,"inherit;}");if(c.trim())c=v.parse(c,!1,!1),a.sheet=p(c,b,null,a);a.status=3;o(b)&&chrome.tabs.sendRequest(b.tabId,{type:"data",param:{type:"StyleSheets",data:b,uid:b.uid},tabId:b.tabId})},q=function(a,b){a.status=1;b.download[a.url]=1;var c=new XMLHttpRequest;c.open("GET",a.url,!0);c.onreadystatechange=function(){if(4==c.readyState)200!=c.status?(a.text="",console.log(a.url,c.status)):a.text=c.responseText||"",a.status=2,r(a,b)};c.send(null)},w=function(a,b){switch(a.type){case "ViewerStart":chrome.tabs.getSelected(null,
function(a){b===a.id&&(l(!0,b),_gaq.push(["_trackEvent","browserAction","run","run viewer"]))});break;case "ViewerStop":chrome.tabs.getSelected(null,function(a){b===a.id&&(l(!1,b),_gaq.push(["_trackEvent","browserAction","stop","stop viewer"]))});break;case "ViewerShow":chrome.tabs.sendRequest(b,{type:"event",param:{type:"ViewerShow",uid:a.uid},tabId:b})}},x=function(a,b){switch(a.method){case "translateSheets":var c=a.data;c.referUrl=a.referUrl;c.uid=a.uid;c.tabId=b;c.download={};for(var f=0,g;g=
c[f];f++)"style"==g.type?r(g,c):/^https?:\/\//.test(g.url.trim())?q(g,c):g.status=-1;break;case "getOption":return localStorage[a.key];case "contentReady":return++s}};chrome.browserAction.onClicked.addListener(function(a){0===a.url.indexOf("https://chrome.google.com")||0===a.url.indexOf("chrome://")?(_gaq.push(["_trackEvent","browserAction","clicknotvalid","click below chrome store"]),alert("Sorry, it can't work at chrome store and extension pages.")):chrome.tabs.sendRequest(a.id,{type:"method",param:{method:"toggleRun"},
tabId:a.id})});chrome.tabs.onSelectionChanged.addListener(function(a){chrome.tabs.sendRequest(a,{type:"method",param:{method:"queryStatus"},tabId:a},function(b){a===b.tabId&&l(2===b.status,a)})});chrome.extension.onRequest.addListener(function(a,b,c){if("event"===a.type)w(a.param,a.tabId);else if("method"===a.type)if("queryRunStatus"===a.param.method){var f=a.tabId||b.tab.id;chrome.tabs.sendRequest(f,{type:"method",param:{method:"queryStatus"},tabId:f},function(a){a&&f===a.tabId&&c(a.status)})}else a.param.referUrl=
b.tab.url,a=x(a.param,a.tabId),c&&c(a)})})();