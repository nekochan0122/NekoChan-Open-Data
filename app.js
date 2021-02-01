const Os={isWindows:navigator.platform.toUpperCase().includes("WIN"),isMac:navigator.platform.toUpperCase().includes("MAC"),isMacLike:/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform),isIos:/(iPhone|iPod|iPad)/i.test(navigator.platform),isMobile:/Android|webOS|iPhone|iPad|iPod|iOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)};function init(){document.siteName=$("title").html(),$("body").addClass(`mdui-theme-primary-${UI.main_color} mdui-theme-accent-${UI.accent_color}`);let t=`\n\t<header class="mdui-appbar mdui-color-theme">\n\t<div id="nav" class="mdui-toolbar mdui-container${UI.fluid_navigation_bar?"-fluid":""} ${UI.dark_mode?"mdui-text-color-white-text":""}">\n\t</div>\n\t</header>\n\t<div id="folderIMG" class="mdui-card" style="position: absolute;max-width: 500px;left: 0px; top: 0px; z-index: 999;">\n\t\t<div class="mdui-card-media">\n\t\t\t<img src="//cdn.jsdelivr.net/gh/NekoChanTaiwan/NekoChan-Open-Data@1.9.0.min6/images/image_1.webp">\n\t\t\t<div class="mdui-card-media-covered">\n\t\t\t\t<div class="mdui-card-primary">\n\t\t\t\t\t<div class="mdui-card-primary-title">Title</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div id="folderPath" class="mdui-container"></div>\n\t<div id="content" class="mdui-container mdui-shadow-16"></div>`;$("body").html(t);const e=$("#folderIMG");$(document).mousemove(t=>e.css({left:`${t.pageX}px`,top:`${t.pageY}px`}))}function getDocumentHeight(){let t=document;return Math.max(t.body.scrollHeight,t.documentElement.scrollHeight,t.body.offsetHeight,t.documentElement.offsetHeight,t.body.clientHeight,t.documentElement.clientHeight)}function render(t){t.indexOf("?")>0&&(t=t.substr(0,t.indexOf("?"))),title(t),nav(t);window.MODEL.is_search_page?(window.scroll_status={event_bound:!1,loading_lock:!1},render_search_result_list()):t.match(/\/\d+:$/g)||"/"==t.substr(-1)?(window.scroll_status={event_bound:!1,loading_lock:!1},list(t)):file(t)}function title(t){t=decodeURI(t);let e=window.current_drive_order||0,i=window.drive_names[e];t=t.replace(`/${e}:`,""),$("title").html(`${document.siteName} - ${t}`);let n=window.MODEL;n.is_search_page?$("title").html(`${document.siteName} - ${i} - 搜尋 ${n.q} 的結果`):$("title").html(`${document.siteName} - ${i} - ${t}`),$("title").html(`${document.siteName}`)}function nav(t){let e=window.MODEL,n="",a=window.current_drive_order||0;n+=`<a href="/${a}:/" class="mdui-typo-headline folder">${document.siteName}</a>`;let l=`　當前位置： <a class="folder" href="/${a}:/">主目錄</a>`;if(!e.is_search_page){let e=t.trim("/").split("/"),n="/";if(e.length>1)for(i in e.shift(),e){let t=e[i];if(n+=`${t=decodeURI(t)}/`,""==t||/md|mp4|webm|avi|bmp|jpg|jpeg|png|gif|m4a|mp3|flac|wav|ogg|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv/.test(t))break;l+=`<i class="mdui-icon material-icons mdui-icon-dark folder" style="margin:0;">chevron_right</i><a class="folder" href="/${a}:${n}">${t}</a>`}}$("#folderPath").html(l);let d=e.is_search_page&&e.q||"";let s=`<div class="mdui-toolbar-spacer"></div>\n\t\t<div id="search_bar" class="mdui-textfield mdui-textfield-expandable mdui-float-right mdui-textfield-expanded" style="max-width:${Os.isMobile?300:400}px">\n\t\t\t<form id="search_bar_form" method="get" action="/${a}:search">\n\t\t\t\t<input class="mdui-textfield-input" type="text" name="q" autocomplete ="off" placeholder="搜尋" value="${d}"/>\n\t\t\t</form>\n\t\t\t<button class="mdui-textfield-icon mdui-btn mdui-btn-icon" onclick="if($('#search_bar').hasClass('mdui-textfield-expanded') && $('#search_bar_form>input').val()) $('#search_bar_form').submit();">\n\t\t\t\t<i class="mdui-icon material-icons">search</i>\n\t\t\t</button>\n\t\t</div>`;e.root_type<2&&(n+=s),$("#nav").html(n),mdui.mutation(),mdui.updateTextFields()}function requestListPath(t,e,i,n){let a={password:e.password||null,page_token:e.page_token||null,page_index:e.page_index||0};$.post(t,a,(e,l)=>{let d=jQuery.parseJSON(e);d&&d.error&&"401"==d.error.code?n&&n(t):d&&d.data&&i&&i(d,t,a)})}function requestSearch(t,e){let i={q:t.q||null,page_token:t.page_token||null,page_index:t.page_index||0};$.post(`/${window.current_drive_order}:search`,i,(t,n)=>{let a=jQuery.parseJSON(t);a&&a.data&&e&&e(a,i)})}function list(t){$("#content").html('\n\t<div id="head_md" class="mdui-typo" style="display:none;padding: 20px 0;"></div>\n\t\t<div class="mdui-row">\n\t\t\t<ul class="mdui-list">\n\t\t\t<li class="mdui-list-item th">\n\t\t\t\t<div class="mdui-col-xs-12 mdui-col-sm-10">\n\t\t\t\t\t檔案名稱\n\t\t\t\t\t<i class="mdui-icon material-icons icon-sort" data-sort="name" data-order="more">expand_more</i>\n\t\t\t\t</div>\n\t\t\t\t<div class="mdui-col-sm-2 mdui-text-right">\n\t\t\t\t\t檔案大小\n\t\t\t\t\t<i class="mdui-icon material-icons icon-sort" data-sort="size" data-order="downward">expand_more</i>\n\t\t\t\t</div>\n\t\t\t</li>\n\t\t</ul>\n\t</div>\n\t<div class="mdui-row">\n\t\t<ul id="list" class="mdui-list">\n\t\t</ul>\n\t\t<div id="count" class="mdui-hidden mdui-center mdui-text-center mdui-m-b-3 mdui-typo-subheading mdui-text-color-blue-grey-500">共 <span class="number"></span> 項<br>NekoChan Open Data｜Discord：NekoChan#2851<br><a id="back-to-top" href="#">返回頂部</a></div>\n\t</div>\n\t<div id="readme_md" class="mdui-typo" style="display:none; padding: 20px 0;"></div>');let e=localStorage.getItem(`password${t}`);$("#list").html('<div class="mdui-progress"><div class="mdui-progress-indeterminate"></div></div>'),$("#readme_md").hide().html(""),$("#head_md").hide().html(""),requestListPath(t,{password:e},function t(e,i,n){$("#list").data("nextPageToken",e.nextPageToken).data("curPageIndex",e.curPageIndex),$("#spinner").remove(),null===e.nextPageToken?($(window).off("scroll"),window.scroll_status.event_bound=!1,window.scroll_status.loading_lock=!1,append_files_to_list(i,e.data.files)):(append_files_to_list(i,e.data.files),!0!==window.scroll_status.event_bound&&($(window).on("scroll",function(){let e=$(this).scrollTop(),a=getDocumentHeight();if(e+$(this).height()>a-(Os.isMobile?130:80)){if(!0===window.scroll_status.loading_lock)return;window.scroll_status.loading_lock=!0,$('<div id="spinner" class="mdui-spinner mdui-spinner-colorful mdui-center"></div>').insertBefore("#readme_md"),mdui.updateSpinners();let e=$("#list");requestListPath(i,{password:n.password,page_token:e.data("nextPageToken"),page_index:e.data("curPageIndex")+1},t,null)}}),window.scroll_status.event_bound=!0)),!0===window.scroll_status.loading_lock&&(window.scroll_status.loading_lock=!1)},t=>{$("#spinner").remove();let e=prompt("目錄加密, 請輸入密碼","");localStorage.setItem(`password${t}`,e),null!=e&&""!=e?list(t):history.go(-1)})}function append_files_to_list(t,e){let n=$("#list"),a=null===n.data("nextPageToken"),l="0"==n.data("curPageIndex"),d=0;html="";let s=[],o="";for(i in e){let n=e[i],l=`${t+n.name}/`;if(null==n.size&&(n.size=""),n.size=formatFileSize(n.size),"application/vnd.google-apps.folder"==n.mimeType)o=/連載中/.test(n.name)?"updating":/完結/.test(n.name)?"finish":/R18/.test(n.name)?"r18":"",html+=`<li class="mdui-list-item mdui-ripple mdui-shadow-2"><a href="${l}" class="folder">\n\t\t\t\t<div class="mdui-col-xs-12 mdui-col-sm-10 mdui-text-truncate ${o}" title="${n.name}">\n\t\t\t\t\t<i class="mdui-icon material-icons">folder_open</i>\n\t\t\t\t\t${n.name}\n\t\t\t\t\t</div>\n\t\t\t\t<div class="mdui-col-sm-2 mdui-text-right ${o}">${n.size}</div>\n\t\t\t\t</a>\n\t\t\t</li>`;else{let e=t+n.name;const i=t+n.name;let l="file";if(a&&"!readme.md"==n.name){get_file(e,n,t=>{markdown("#readme_md",t)});continue}if("!head.md"==n.name){get_file(e,n,t=>{markdown("#head_md",t)});continue}let o=e.split(".").pop().toLowerCase();"|html|php|css|go|java|js|json|txt|sh|md|mp4|webm|avi|bmp|jpg|jpeg|png|gif|m4a|mp3|flac|wav|ogg|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|pdf|".includes(`|${o}|`)&&(s.push(i),d++,e+="?a=view",l+=" view"),html+=`<li class="mdui-list-item file mdui-ripple mdui-shadow-2" target="_blank"><a gd-type="${n.mimeType}" href="${e}" class="${l}">\n\t\t\t\t<div class="mdui-col-xs-12 mdui-col-sm-10 mdui-text-truncate" title="${n.name}">\n\t\t\t\t\t${d}.\n\t\t\t\t\t<i class="mdui-icon material-icons">insert_drive_file</i>\n\t\t\t\t\t${n.name}\n\t\t\t\t</div>\n\t\t\t\t<div class="mdui-col-sm-2 mdui-text-right">${n.size}</div>\n\t\t\t\t</a>\n\t\t\t</li>`}}if(s.length>0){let e=localStorage.getItem(t),i=s;if(!l&&e){let t;try{t=JSON.parse(e),Array.isArray(t)||(t=[])}catch(e){t=[]}i=t.concat(s)}localStorage.setItem(t,JSON.stringify(i))}n.html(("0"==n.data("curPageIndex")?"":n.html())+html),a&&$("#count").removeClass("mdui-hidden").find(".number").text(n.find("li.mdui-list-item").length)}function render_search_result_list(){$("#content").html('\n\t<div id="head_md" class="mdui-typo" style="display:none;padding: 20px 0;"></div>\n\t\t<div class="mdui-row">\n\t\t\t<ul class="mdui-list">\n\t\t\t\t<li class="mdui-list-item th">\n\t\t\t\t\t<div class="mdui-col-xs-12 mdui-col-sm-10">\n\t\t\t\t\t\t檔案名稱\n\t\t\t\t\t\t<i class="mdui-icon material-icons icon-sort" data-sort="name" data-order="more">expand_more</i>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="mdui-col-sm-2 mdui-text-right">\n\t\t\t\t\t\t檔案大小\n\t\t\t\t\t\t<i class="mdui-icon material-icons icon-sort" data-sort="size" data-order="downward">expand_more</i>\n\t\t\t\t\t</div>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</div>\n\t<div class="mdui-row">\n\t<ul id="list" class="mdui-list">\n\t</ul>\n\t<div id="count" class="mdui-hidden mdui-center mdui-text-center mdui-m-b-3 mdui-typo-subheading mdui-text-color-blue-grey-500">共 <span class="number"></span> 項<br>NekoChan Open Data｜Discord：NekoChan#2851<br><a id="back-to-top" href="#">返回頂部</a></div>\n\t</div>\n\t<div id="readme_md" class="mdui-typo" style="display:none; padding: 20px 0;"></div>'),$("#list").html('<div class="mdui-progress"><div class="mdui-progress-indeterminate"></div></div>'),$("#readme_md").hide().html(""),$("#head_md").hide().html(""),requestSearch({q:window.MODEL.q},function t(e,i){$("#list").data("nextPageToken",e.nextPageToken).data("curPageIndex",e.curPageIndex),$("#spinner").remove(),null===e.nextPageToken?($(window).off("scroll"),window.scroll_status.event_bound=!1,window.scroll_status.loading_lock=!1,append_search_result_to_list(e.data.files)):(append_search_result_to_list(e.data.files),!0!==window.scroll_status.event_bound&&($(window).on("scroll",function(){let e=$(this).scrollTop(),i=getDocumentHeight();if(e+$(this).height()>i-(Os.isMobile?130:80)){if(!0===window.scroll_status.loading_lock)return;window.scroll_status.loading_lock=!0,$('<div id="spinner" class="mdui-spinner mdui-spinner-colorful mdui-center"></div>').insertBefore("#readme_md"),mdui.updateSpinners();let e=$("#list");requestSearch({q:window.MODEL.q,page_token:e.data("nextPageToken"),page_index:e.data("curPageIndex")+1},t)}}),window.scroll_status.event_bound=!0)),!0===window.scroll_status.loading_lock&&(window.scroll_status.loading_lock=!1)})}function append_search_result_to_list(t){let e=$("#list"),n=null===e.data("nextPageToken");for(i in html="",t){let e=t[i];if(null==e.size&&(e.size=""),e.size=formatFileSize(e.size),"application/vnd.google-apps.folder"==e.mimeType)/連載中/.test(e.name)?className="updating":/完結/.test(e.name)?className="finish":/R18/.test(e.name)?className="r18":className="",html+=`<li class="mdui-list-item mdui-ripple mdui-shadow-2"><a id="${e.id}" onclick="onSearchResultItemClick(this)" class="folder">\n\t\t\t\t\t<div class="mdui-col-xs-12 mdui-col-sm-10 mdui-text-truncate ${className}" title="${e.name}">\n\t\t\t\t\t\t<i class="mdui-icon material-icons">folder_open</i>\n\t\t\t\t\t\t${e.name}\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="mdui-col-sm-2 mdui-text-right" ${className}>${e.size}</div>\n\t\t\t\t</a>\n\t\t\t</li>`;else{let t="file",i=e.name.split(".").pop().toLowerCase();"|html|php|css|go|java|js|json|txt|sh|md|mp4|webm|avi|bmp|jpg|jpeg|png|gif|m4a|mp3|flac|wav|ogg|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|".includes(`|${i}|`)&&(t+=" view"),html+=`<li class="mdui-list-item file mdui-ripple mdui-shadow-2" target="_blank"><a id="${e.id}" gd-type="${e.mimeType}" onclick="onSearchResultItemClick(this)" class="${t}">\n\t\t\t\t\t<div class="mdui-col-xs-12 mdui-col-sm-10 mdui-text-truncate" title="${e.name}">\n\t\t\t\t\t\t<i class="mdui-icon material-icons">insert_drive_file</i>\n\t\t\t\t\t\t${e.name}\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="mdui-col-sm-2 mdui-text-right">${e.size}</div>\n\t\t\t\t</a>\n\t\t</li>`}}e.html(("0"==e.data("curPageIndex")?"":e.html())+html),n&&$("#count").removeClass("mdui-hidden").find(".number").text(e.find("li.mdui-list-item").length)}function onSearchResultItemClick(t){let e=$(t).hasClass("view"),i=window.current_drive_order,n=mdui.dialog({title:"",content:'<div class="mdui-text-center mdui-typo-title mdui-m-b-1">正在獲取路徑...</div><div class="mdui-spinner mdui-spinner-colorful mdui-center"></div>',history:!1,modal:!0,closeOnEsc:!0});mdui.updateSpinners(),$.post(`/${i}:id2path`,{id:t.id},t=>{if(t)return n.close(),void(window.location.href=`/${i}:${t}${e?"?a=view":""}`);n.close(),n=mdui.dialog({title:"獲取目標路徑失敗",content:"該資源可能已經移除，或已移動，請通知 NekoChan#2851 解決。",history:!1,modal:!0,closeOnEsc:!0,buttons:[{text:"確認"}]})})}function get_file(t,e,i){let n=`file_path_${t}`,a=localStorage.getItem(n);if(null!=a)return i(a);$.get(t,t=>{localStorage.setItem(n,t),i(t)})}function file(t){let e=t.split("/").pop().split(".").pop().toLowerCase().replace("?a=view","");return"|mp4|webm|avi|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|".includes(`|${e}|`)?file_video(t):"|bmp|jpg|jpeg|png|gif|".includes(`|${e}|`)?file_image(t):void 0}function file_video(t){let e=decodeURI(window.location.origin+t),i=e;const n=decodeURI(t.slice(t.lastIndexOf("/")+1,t.length)),a=window.location.pathname,l=a.lastIndexOf("/"),d=a.slice(0,l+1);let s=localStorage.getItem(d),o="";if(s){try{s=JSON.parse(s),Array.isArray(s)||(s=[])}catch(t){console.error(t),s=[]}if(s.length>0&&s.includes(t)){let e=s.length,i=s.indexOf(t),n=i-1>-1?s[i-1]:null,a=i+1<e?s[i+1]:null;const l="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple";o=`\n\t\t\t<div class="mdui-container">\n\t\t\t\t<div class="mdui-row-xs-2 mdui-m-b-1">\n\t\t\t\t\t<div class="mdui-col">\n\t\t\t\t\t\t${n?`<button id="leftBtn" data-filepath="${n}" class="${l}">上一集</button>`:`<button class="${l}" disabled>上一集</button>`}\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="mdui-col">\n\t\t\t\t\t\t${a?`<button id="rightBtn"  data-filepath="${a}" class="${l}">下一集</button>`:`<button class="${l}" disabled>下一集</button>`}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t`}}const r="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent";let c=`<a href="potplayer://${i}" class="${r} windows-btn">PotPlayer 串流</a>`,m="";if(Os.isMobile){if(/(Android)/i.test(navigator.userAgent))c=`<button class="${r} android-btn" data-href="intent:${i}#Intent;package=com.mxtech.videoplayer.pro;S.title=${t};end">MXPlayer Pro 串流</button>`,c+=`<button style="left: 15px" class="${r} android-btn" data-href="intent:${i}#Intent;package=com.mxtech.videoplayer.ad;S.title=${t};end">MXPlayer Free 串流</button>`;else if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){c=`<a class="${r}" href="infuse://${e.replace(/(^\w+:|^)\/\//,"")}">Infuse 串流</a>`}}else/(Mac)/i.test(navigator.userAgent)&&(c=`<button class="${r} mac-btn" data-href="iina://open?url=${i}">IINA 串流</button>`),null==localStorage.getItem("previewSwitch")&&localStorage.setItem("previewSwitch","false"),"false"==localStorage.getItem("previewSwitch")?m='<input id="previewSwitch" type="checkbox"/>':"true"==localStorage.getItem("previewSwitch")&&(m='<input id="previewSwitch" type="checkbox" checked/>');let u=`\n\t<div class="mdui-container-fluid">\n\t\t<div class="mdui-textfield">\n\t\t\t<label class="mdui-textfield-label mdui-text-color-white">當前檔案：</label>\n\t\t\t<input class="mdui-textfield-input mdui-text-color-white" type="text" value="${n}" readonly/>\n\t\t</div>\n\t\t<div class="mdui-center" id="player"></div>\n\t\t<div id="screenshotPlayer"></div>\n\t\t<br>\n\t\t${o}\n\t</div>\n\t<br>\n\t${c+=`<a style="left: 15px" href="${i}" class="${r} download-btn">直連下載檔案</a>`}\n\t<span id="switchElement" style="float: right">\n\t\t<i class="mdui-icon material-icons">ondemand_video</i>\n\t\t<span class="mdui-list-item-content">進度條預覽圖</span>\n\t\t<label class="mdui-switch">\n\t\t\t${m}\n\t\t\t<i class="mdui-switch-icon"></i>\n\t\t</label>\n\t</span>\n\t<div class="mdui-textfield">\n\t\t<label class="mdui-textfield-label mdui-text-color-white">注意：若影片沒有畫面，請嘗試播放器串流。或通知 Discord：NekoChan#2851。</label>\n\t</div>\n\t<hr>\n\t</div>\n\t`;$("#content").html(u),Os.isMobile&&$("#switchElement").remove(),$(document).ready(()=>{window.DPlayer||window.location.reload(),$("#previewSwitch").click(()=>{"true"==localStorage.getItem("previewSwitch")?(localStorage.setItem("previewSwitch","false"),window.location.reload()):"false"==localStorage.getItem("previewSwitch")&&(localStorage.setItem("previewSwitch","true"),window.location.reload())});const t=()=>{let e=0,n=.5,a=!1,l=null;l=new DPlayer({container:$("#player")[0],theme:"#0080ff",autoplay:!0,lang:"zh-tw",mutex:!1,volume:.5,video:{url:i,thumbnails:"//cdn.jsdelivr.net/gh/NekoChanTaiwan/NekoChan-Open-Data@1.8.6.beta2/images/fake-thumbnails.webp"},contextmenu:[{text:"NekoChan Open Data",link:"//nekochan.ml/"}]}),0!=e&&l.seek(e),l.on("seeked",()=>{e=l.video.currentTime}),l.on("seeking",()=>{e=l.video.currentTime}),l.on("error",()=>{0!=l.video.currentTime&&(e=l.video.currentTime),t()}),l.on("ended",()=>{l.fullScreen.cancel("browser")}),l.on("loadedmetadata",()=>{const t=l.video.duration/10;$(window).keyup(e=>{if(/Numpad/.test(e.code)){let i=Number(e.code[6]);l.seek(t*i)}else if(/Digit/.test(e.code)){let i=Number(e.code[5]);l.seek(t*i)}else if(/Key/.test(e.code))switch(e.code[3]){case"M":if(0==a){d(),l.volume(0,!0,!1),a=!0;break}if(1==a){l.volume(n,!0,!1),a=!1;break}case"X":$("#rightBtn").click();break;case"Z":$("#leftBtn").click();break;case"F":$(".dplayer-icon.dplayer-full-icon").click()}})});const d=()=>{let t=`${String($(".dplayer-volume-bar-wrap").attr("data-balloon"))}`;"%"==t[3]?n=1:"%"==t[2]?n=Number(`0.${t[0]}`):"%"==t[1]&&(n=.1)}};t();const e=()=>{let t=0,n=0,a=null,l=$("#player canvas");const d=$("#screenshotPlayer")[0],s=$("#player .dplayer-bar-wrap"),o=$("#player .dplayer-bar-preview");d.style.display="none";let r=null;(r=new DPlayer({container:d,autoplay:!0,screenshot:!0,mutex:!1,video:{url:i}})).volume(0,!0,!0),r.speed(16);let c=()=>{(t>n+2||t<n-2)&&r.seek(t),(t>n+5||t<n-5)&&((l=$("#player canvas"))&&o.remove(l),$("#screenshotPlayer .dplayer-camera-icon").click(),n=t)};s.mousemove(()=>{(e=>{a=e.split(":"),2===e.length?t=Number(a):5===e.length?t=60*Number(a[0])+Number(a[1]):8===e.length&&(t=3600*Number(a[0])+60*Number(a[1])+Number(a[2])),c()})($(".dplayer-bar-time").html())}),r.on("error",()=>{e()})};/(WIN|Mac)/i.test(navigator.userAgent)&&"true"==localStorage.getItem("previewSwitch")&&e()}),$("#leftBtn, #rightBtn").click(t=>{let e=$(t.target);["I","SPAN"].includes(t.target.nodeName)&&(e=$(t.target).parent());const i=e.attr("data-filepath");e.attr("data-direction");file(i)})}function file_image(t){let e=`\n<div class="mdui-container-fluid">\n\t<br>\n\t<img class="mdui-img-fluid" src="${decodeURI(window.location.origin+t)}"/>\n<br>\n<hr>\n</div>`;$("#content").html(e)}function formatFileSize(t){return t=t>=1073741824?`${(t/1073741824).toFixed(2)} GB`:t>=1048576?`${(t/1048576).toFixed(2)} MB`:t>=1024?`${(t/1024).toFixed(2)} KB`:t>1?`${t} Bytes`:1==t?`${t} Byte`:" 資料夾"}function markdown(t,e){if(window.markdownit||window.location.reload(),null==window.md)window.md=window.markdownit(),markdown(t,e);else{let i=md.render(e);$(t).show().html(i)}}String.prototype.trim=function(t){return t?this.replace(new RegExp(`^\\${t}+|\\${t}+$`,"g"),""):this.replace(/^\s+|\s+$/g,"")},window.onpopstate=(()=>{render(window.location.pathname)}),$(()=>{init(),render(window.location.pathname)});