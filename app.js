function init(){document.siteName=$("title").html(),$("body").addClass(`mdui-theme-primary-${UI.main_color} mdui-theme-accent-${UI.accent_color}`);let t=`\n<header class="mdui-appbar mdui-color-theme">\n  <div id="nav" class="mdui-toolbar mdui-container${UI.fluid_navigation_bar?"-fluid":""} ${UI.dark_mode?"mdui-text-color-white-text":""}">\n  </div>\n</header>\n<div id="folderPath" class="mdui-container"></div>\n<div id="content" class="mdui-container mdui-shadow-16"></div>\n\t`;$("body").html(t)}const Os={isWindows:navigator.platform.toUpperCase().includes("WIN"),isMac:navigator.platform.toUpperCase().includes("MAC"),isMacLike:/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform),isIos:/(iPhone|iPod|iPad)/i.test(navigator.platform),isMobile:/Android|webOS|iPhone|iPad|iPod|iOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)};function getDocumentHeight(){let t=document;return Math.max(t.body.scrollHeight,t.documentElement.scrollHeight,t.body.offsetHeight,t.documentElement.offsetHeight,t.body.clientHeight,t.documentElement.clientHeight)}function render(t){t.indexOf("?")>0&&(t=t.substr(0,t.indexOf("?"))),title(t),nav(t);window.MODEL.is_search_page?(window.scroll_status={event_bound:!1,loading_lock:!1},render_search_result_list()):t.match(/\/\d+:$/g)||"/"==t.substr(-1)?(window.scroll_status={event_bound:!1,loading_lock:!1},list(t)):file(t)}function title(t){t=decodeURI(t);let e=window.current_drive_order||0,i=window.drive_names[e];t=t.replace(`/${e}:`,""),$("title").html(`${document.siteName} - ${t}`);let n=window.MODEL;n.is_search_page?$("title").html(`${document.siteName} - ${i} - 搜尋 ${n.q} 的結果`):$("title").html(`${document.siteName} - ${i} - ${t}`),$("title").html(`${document.siteName}`)}function nav(t){let e=window.MODEL,n="",d=window.current_drive_order||0;n+=`<a href="/${d}:/" class="mdui-typo-headline folder">${document.siteName}</a>`;let l=`當前位置： <a class="folder" href="/${d}:/">主目錄</a>`;if(!e.is_search_page){let e=t.trim("/").split("/"),n="/";if(e.length>1)for(i in e.shift(),e){let t=e[i];if(n+=`${t=decodeURI(t)}/`,""==t||/md|mp4|webm|avi|bmp|jpg|jpeg|png|gif|m4a|mp3|flac|wav|ogg|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv/.test(t))break;l+=`<i class="mdui-icon material-icons mdui-icon-dark folder" style="margin:0;">chevron_right</i><a class="folder" href="/${d}:${n}">${t}</a>`}}$("#folderPath").html(l);let a=e.is_search_page&&e.q||"";let s=`<div class="mdui-toolbar-spacer"></div>\n        <div id="search_bar" class="mdui-textfield mdui-textfield-expandable mdui-float-right mdui-textfield-expanded" style="max-width:${Os.isMobile?300:400}px">\n            <form id="search_bar_form" method="get" action="/${d}:search">\n            \t<input class="mdui-textfield-input" type="text" name="q" autocomplete ="off" placeholder="搜尋資源" value="${a}"/>\n\t\t\t</form>\n\t\t\t<button class="mdui-textfield-icon mdui-btn mdui-btn-icon" onclick="if($('#search_bar').hasClass('mdui-textfield-expanded') && $('#search_bar_form>input').val()) $('#search_bar_form').submit();">\n                <i class="mdui-icon material-icons">search</i>\n            </button>\n        </div>`;e.root_type<2&&(n+=s),$("#nav").html(n),mdui.mutation(),mdui.updateTextFields()}function requestListPath(t,e,i,n){let d={password:e.password||null,page_token:e.page_token||null,page_index:e.page_index||0};$.post(t,d,(e,l)=>{let a=jQuery.parseJSON(e);a&&a.error&&"401"==a.error.code?n&&n(t):a&&a.data&&i&&i(a,t,d)})}function requestSearch(t,e){let i={q:t.q||null,page_token:t.page_token||null,page_index:t.page_index||0};$.post(`/${window.current_drive_order}:search`,i,(t,n)=>{let d=jQuery.parseJSON(t);d&&d.data&&e&&e(d,i)})}function list(t){$("#content").html('\n\t<div id="head_md" class="mdui-typo" style="display:none;padding: 20px 0;"></div>\n\t <div class="mdui-row"> \n\t  <ul class="mdui-list"> \n\t   <li class="mdui-list-item th"> \n\t    <div class="mdui-col-xs-12 mdui-col-sm-10">\n      檔案名稱\n\t<i class="mdui-icon material-icons icon-sort" data-sort="name" data-order="more"></i>\n\t    </div> \n\t    <div class="mdui-col-sm-2 mdui-text-right">\n      檔案大小\n\t<i class="mdui-icon material-icons icon-sort" data-sort="size" data-order="downward"></i>\n\t    </div> \n\t    </li> \n\t  </ul> \n\t </div> \n\t <div class="mdui-row"> \n\t  <ul id="list" class="mdui-list"> \n\t  </ul> \n    <div id="count" class="mdui-hidden mdui-center mdui-text-center mdui-m-b-3 mdui-typo-subheading mdui-text-color-blue-grey-500">共 <span class="number"></span> 項<br>NekoChan Open Data<br><a id="back-to-top" href="#">返回頂部</a></div>\n\t </div>\n\t <div id="readme_md" class="mdui-typo" style="display:none; padding: 20px 0;"></div>\n\t');let e=localStorage.getItem(`password${t}`);$("#list").html('<div class="mdui-progress"><div class="mdui-progress-indeterminate"></div></div>'),$("#readme_md").hide().html(""),$("#head_md").hide().html(""),requestListPath(t,{password:e},function t(e,i,n){$("#list").data("nextPageToken",e.nextPageToken).data("curPageIndex",e.curPageIndex),$("#spinner").remove(),null===e.nextPageToken?($(window).off("scroll"),window.scroll_status.event_bound=!1,window.scroll_status.loading_lock=!1,append_files_to_list(i,e.data.files)):(append_files_to_list(i,e.data.files),!0!==window.scroll_status.event_bound&&($(window).on("scroll",function(){let e=$(this).scrollTop(),d=getDocumentHeight();if(e+$(this).height()>d-(Os.isMobile?130:80)){if(!0===window.scroll_status.loading_lock)return;window.scroll_status.loading_lock=!0,$('<div id="spinner" class="mdui-spinner mdui-spinner-colorful mdui-center"></div>').insertBefore("#readme_md"),mdui.updateSpinners();let e=$("#list");requestListPath(i,{password:n.password,page_token:e.data("nextPageToken"),page_index:e.data("curPageIndex")+1},t,null)}}),window.scroll_status.event_bound=!0)),!0===window.scroll_status.loading_lock&&(window.scroll_status.loading_lock=!1)},t=>{$("#spinner").remove();let e=prompt("目錄加密, 請輸入密碼","");localStorage.setItem(`password${t}`,e),null!=e&&""!=e?list(t):history.go(-1)})}function append_files_to_list(t,e){let n=$("#list"),d=null===n.data("nextPageToken"),l="0"==n.data("curPageIndex"),a=0;html="";let s=[];for(i in e){let n=e[i],l=`${t+n.name}/`;if(null==n.size&&(n.size=""),n.size=formatFileSize(n.size),"application/vnd.google-apps.folder"==n.mimeType)/連載中/.test(n.name)?html+=`<li class="mdui-list-item mdui-ripple mdui-shadow-2"><a href="${l}" class="folder">\n\t\t\t\t\t<div class="mdui-col-xs-12 mdui-col-sm-10 mdui-text-truncate updating" title="${n.name}">\n\t\t\t\t\t<i class="mdui-icon material-icons">folder_open</i>\n\t\t\t\t\t${n.name}\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="mdui-col-sm-2 mdui-text-right updating">${n.size}</div>\n\t\t\t\t\t</a>\n\t\t\t\t</li>`:/完結/.test(n.name)?html+=`<li class="mdui-list-item mdui-ripple mdui-shadow-2"><a href="${l}" class="folder">\n\t\t\t\t\t<div class="mdui-col-xs-12 mdui-col-sm-10 mdui-text-truncate finish" title="${n.name}">\n\t\t\t\t\t<i class="mdui-icon material-icons">folder_open</i>\n\t\t\t\t\t${n.name}\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="mdui-col-sm-2 mdui-text-right finish">${n.size}</div>\n\t\t\t\t\t</a>\n\t\t\t\t</li>`:/R18/.test(n.name)?html+=`<li class="mdui-list-item mdui-ripple mdui-shadow-2"><a href="${l}" class="folder">\n\t\t\t\t\t<div class="mdui-col-xs-12 mdui-col-sm-10 mdui-text-truncate r18" title="${n.name}">\n\t\t\t\t\t<i class="mdui-icon material-icons">folder_open</i>\n\t\t\t\t\t${n.name}\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="mdui-col-sm-2 mdui-text-right r18">${n.size}</div>\n\t\t\t\t\t</a>\n\t\t\t\t</li>`:html+=`<li class="mdui-list-item mdui-ripple mdui-shadow-2"><a href="${l}" class="folder">\n\t\t\t\t\t<div class="mdui-col-xs-12 mdui-col-sm-10 mdui-text-truncate" title="${n.name}">\n\t\t\t\t\t<i class="mdui-icon material-icons">folder_open</i>\n\t\t\t\t\t${n.name}\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="mdui-col-sm-2 mdui-text-right">${n.size}</div>\n\t\t\t\t\t</a>\n\t\t\t\t</li>`;else{let e=t+n.name;const i=t+n.name;let l="file";d&&"!readme.md"==n.name&&get_file(e,n,t=>{markdown("#readme_md",t)}),"!head.md"==n.name&&get_file(e,n,t=>{markdown("#head_md",t)});let o=e.split(".").pop().toLowerCase();"|html|php|css|go|java|js|json|txt|sh|md|mp4|webm|avi|bmp|jpg|jpeg|png|gif|m4a|mp3|flac|wav|ogg|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|pdf|".includes(`|${o}|`)&&(s.push(i),a++,e+="?a=view",l+=" view"),html+=`<li class="mdui-list-item file mdui-ripple mdui-shadow-2" target="_blank"><a gd-type="${n.mimeType}" href="${e}" class="${l}">\n\t\t\t  <div class="mdui-col-xs-12 mdui-col-sm-10 mdui-text-truncate" title="${n.name}">\n\t\t\t  \t${a}.\n\t          <i class="mdui-icon material-icons">insert_drive_file</i>\n\t            ${n.name}\n\t          </div>\n\t          <div class="mdui-col-sm-2 mdui-text-right">${n.size}</div>\n\t          </a>\n\t      </li>`}}if(s.length>0){let e=localStorage.getItem(t),i=s;if(!l&&e){let t;try{t=JSON.parse(e),Array.isArray(t)||(t=[])}catch(e){t=[]}i=t.concat(s)}localStorage.setItem(t,JSON.stringify(i))}n.html(("0"==n.data("curPageIndex")?"":n.html())+html),d&&$("#count").removeClass("mdui-hidden").find(".number").text(n.find("li.mdui-list-item").length)}function render_search_result_list(){$("#content").html('\n\t<div id="head_md" class="mdui-typo" style="display:none;padding: 20px 0;"></div>\n\t <div class="mdui-row"> \n\t  <ul class="mdui-list"> \n\t   <li class="mdui-list-item th"> \n\t    <div class="mdui-col-xs-12 mdui-col-sm-10">\n\t     文件\n\t<i class="mdui-icon material-icons icon-sort" data-sort="name" data-order="more">expand_more</i>\n\t    </div> \n\t    <div class="mdui-col-sm-2 mdui-text-right">\n\t     大小\n\t<i class="mdui-icon material-icons icon-sort" data-sort="size" data-order="downward">expand_more</i>\n\t    </div> \n\t    </li> \n\t  </ul> \n\t </div> \n\t <div class="mdui-row"> \n\t  <ul id="list" class="mdui-list"> \n\t  </ul> \n\t  <div id="count" class="mdui-hidden mdui-center mdui-text-center mdui-m-b-3 mdui-typo-subheading mdui-text-color-blue-grey-500">共 <span class="number"></span> 項</div>\n\t </div>\n\t <div id="readme_md" class="mdui-typo" style="display:none; padding: 20px 0;"></div>\n\t'),$("#list").html('<div class="mdui-progress"><div class="mdui-progress-indeterminate"></div></div>'),$("#readme_md").hide().html(""),$("#head_md").hide().html(""),requestSearch({q:window.MODEL.q},function t(e,i){$("#list").data("nextPageToken",e.nextPageToken).data("curPageIndex",e.curPageIndex),$("#spinner").remove(),null===e.nextPageToken?($(window).off("scroll"),window.scroll_status.event_bound=!1,window.scroll_status.loading_lock=!1,append_search_result_to_list(e.data.files)):(append_search_result_to_list(e.data.files),!0!==window.scroll_status.event_bound&&($(window).on("scroll",function(){let e=$(this).scrollTop(),i=getDocumentHeight();if(e+$(this).height()>i-(Os.isMobile?130:80)){if(!0===window.scroll_status.loading_lock)return;window.scroll_status.loading_lock=!0,$('<div id="spinner" class="mdui-spinner mdui-spinner-colorful mdui-center"></div>').insertBefore("#readme_md"),mdui.updateSpinners();let e=$("#list");requestSearch({q:window.MODEL.q,page_token:e.data("nextPageToken"),page_index:e.data("curPageIndex")+1},t)}}),window.scroll_status.event_bound=!0)),!0===window.scroll_status.loading_lock&&(window.scroll_status.loading_lock=!1)})}function append_search_result_to_list(t){let e=$("#list"),n=null===e.data("nextPageToken");for(i in html="",t){let e=t[i];if(null==e.size&&(e.size=""),e.size=formatFileSize(e.size),"application/vnd.google-apps.folder"==e.mimeType)html+=`<li class="mdui-list-item mdui-ripple mdui-shadow-2"><a id="${e.id}" onclick="onSearchResultItemClick(this)" class="folder">\n\t            <div class="mdui-col-xs-12 mdui-col-sm-10 mdui-text-truncate" title="${e.name}">\n\t            <i class="mdui-icon material-icons">folder_open</i>\n\t              ${e.name}\n\t            </div>\n\t            <div class="mdui-col-sm-2 mdui-text-right">${e.size}</div>\n\t            </a>\n\t        </li>`;else{let t="file",i=e.name.split(".").pop().toLowerCase();"|html|php|css|go|java|js|json|txt|sh|md|mp4|webm|avi|bmp|jpg|jpeg|png|gif|m4a|mp3|flac|wav|ogg|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|".includes(`|${i}|`)&&(t+=" view"),html+=`<li class="mdui-list-item file mdui-ripple mdui-shadow-2" target="_blank"><a id="${e.id}" gd-type="${e.mimeType}" onclick="onSearchResultItemClick(this)" class="${t}">\n\t          <div class="mdui-col-xs-12 mdui-col-sm-10 mdui-text-truncate" title="${e.name}">\n\t          <i class="mdui-icon material-icons">insert_drive_file</i>\n\t            ${e.name}\n\t          </div>\n\t          <div class="mdui-col-sm-2 mdui-text-right">${e.size}</div>\n\t          </a>\n\t      </li>`}}e.html(("0"==e.data("curPageIndex")?"":e.html())+html),n&&$("#count").removeClass("mdui-hidden").find(".number").text(e.find("li.mdui-list-item").length)}function onSearchResultItemClick(t){let e=$(t).hasClass("view"),i=window.current_drive_order,n=mdui.dialog({title:"",content:'<div class="mdui-text-center mdui-typo-title mdui-m-b-1">正在獲取路徑...</div><div class="mdui-spinner mdui-spinner-colorful mdui-center"></div>',history:!1,modal:!0,closeOnEsc:!0});mdui.updateSpinners(),$.post(`/${i}:id2path`,{id:t.id},t=>{if(t)return n.close(),void(window.location.href=`/${i}:${t}${e?"?a=view":""}`);n.close(),n=mdui.dialog({title:"獲取目標路徑失敗",content:"該資源可能已經移除，或已移動，請通知 NekoChan#2851 解決。",history:!1,modal:!0,closeOnEsc:!0,buttons:[{text:"確認"}]})})}function get_file(t,e,i){let n=`file_path_${t}`,d=localStorage.getItem(n);if(null!=d)return i(d);$.get(t,t=>{localStorage.setItem(n,t),i(t)})}function file(t){let e=t.split("/").pop().split(".").pop().toLowerCase().replace("?a=view","");return"|mp4|webm|avi|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|".includes(`|${e}|`)?file_video(t):"|bmp|jpg|jpeg|png|gif|".includes(`|${e}|`)?file_image(t):void 0}function file_video(t){let e=decodeURI(window.location.origin+t),i=e;const n=decodeURI(t.slice(t.lastIndexOf("/")+1,t.length)),d=window.location.pathname,l=d.lastIndexOf("/"),a=d.slice(0,l+1);let s=localStorage.getItem(a),o="";if(s){try{s=JSON.parse(s),Array.isArray(s)||(s=[])}catch(t){console.error(t),s=[]}if(s.length>0&&s.includes(t)){let e=s.length,i=s.indexOf(t),n=i-1>-1?s[i-1]:null,d=i+1<e?s[i+1]:null;o=`\n            <div class="mdui-container">\n                <div class="mdui-row-xs-2 mdui-m-b-1">\n                    <div class="mdui-col">\n                        ${n?`<button id="leftBtn" data-filepath="${n}" class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple">上一集</button>`:'<button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple" disabled>上一集</button>'}\n                    </div>\n                    <div class="mdui-col">\n                        ${d?`<button id="rightBtn"  data-filepath="${d}" class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple">下一集</button>`:'<button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple" disabled>下一集</button>'}\n                    </div>\n                </div>\n            </div>\n            `}}let r=`<a href="potplayer://${i}" class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent windows-btn">PotPlayer 串流</a>`;if(/(Mac)/i.test(navigator.userAgent)&&(r=`<button class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mac-btn" data-href="iina://open?url=${i}">IINA 串流</button>`),/(Android)/i.test(navigator.userAgent)&&(r=`<button class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent android-btn" data-href="intent:${i}#Intent;package=com.mxtech.videoplayer.pro;S.title=${t};end">MXPlayer Pro 串流</button>`,r+=`<button style="left: 15px" class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent android-btn" data-href="intent:${i}#Intent;package=com.mxtech.videoplayer.ad;S.title=${t};end">MXPlayer Free 串流</button>`),/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){r=`<a class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent" href="infuse://${e.replace(/(^\w+:|^)\/\//,"")}">Infuse 串流</a>`}let m=`\n\t<div class="mdui-container-fluid">\n    <div class="mdui-textfield">\n    <label class="mdui-textfield-label mdui-text-color-white">當前檔案：</label>\n    <input class="mdui-textfield-input mdui-text-color-white" type="text" value="${n}" readonly/>\n    </div>\n\t<div class="mdui-center" id="player"></div>\n\t<div id="screenshotPlayer"></div>\n    <br>\n    <div id="imgWrap">\n    ${o}\n    </div>\n    <br>\n    ${r+=`<a style="left: 15px" href="${i}" class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent download-btn">直連下載檔案</a>`}\n    <div class="mdui-textfield">\n      <label class="mdui-textfield-label mdui-text-color-white">注意：若影片沒有畫面，請嘗試播放器。或通知我本人。</label>\n    </div>\n    <hr>\n</div>\n    `;$("#content").html(m),$(document).ready(()=>{window.DPlayer||window.location.reload();const t=()=>{let e=0,n=null;(n=new DPlayer({container:$("#player")[0],theme:"#0080ff",autoplay:!0,lang:"zh-tw",mutex:!1,video:{url:i,thumbnails:"//cdn.jsdelivr.net/gh/NekoChanTaiwan/NekoChan-Open-Data@1.8.6.beta2/images/fake-thumbnails.webp"},contextmenu:[{text:"NekoChan Open Data",link:"//nekochan.ml/"}]})).seek(e),n.on("seeked",()=>{e=n.video.currentTime}),n.on("seeking",()=>{e=n.video.currentTime}),n.on("error",()=>{0!=n.video.currentTime&&(e=n.video.currentTime),t()}),n.on("ended",()=>{n.fullScreen.cancel("browser")}),$(window).keydown(t=>{console.log(t.code),t.code})};t();const e=()=>{let t=0,n=0,d=null,l=$("#player canvas");const a=$("#screenshotPlayer")[0],s=$("#player .dplayer-bar-wrap"),o=$("#player .dplayer-bar-preview");a.style.display="none";let r=null;(r=new DPlayer({container:a,autoplay:!0,screenshot:!0,mutex:!1,video:{url:i}})).volume(0,!0,!0),r.speed(16);let m=()=>{(t>n+2||t<n-2)&&r.seek(t),(t>n+5||t<n-5)&&((l=$("#player canvas"))&&o.remove(l),$("#screenshotPlayer .dplayer-camera-icon").click(),n=t)};s.mousemove(()=>{(e=>{d=e.split(":"),2===e.length?t=Number(d):5===e.length?t=60*Number(d[0])+Number(d[1]):8===e.length&&(t=3600*Number(d[0])+60*Number(d[1])+Number(d[2])),m()})($(".dplayer-bar-time").html())}),r.on("error",()=>{e()})};/(WIN|MAC)/i.test(navigator.userAgent)&&e()}),$("#leftBtn, #rightBtn").click(t=>{let e=$(t.target);["I","SPAN"].includes(t.target.nodeName)&&(e=$(t.target).parent());const i=e.attr("data-filepath");e.attr("data-direction");file(i)})}function file_image(t){let e=`\n<div class="mdui-container-fluid">\n    <br>\n    <img class="mdui-img-fluid" src="${decodeURI(window.location.origin+t)}"/>\n  <br>\n  <hr>\n</div>`;$("#content").html(e)}function formatFileSize(t){return t=t>=1073741824?`${(t/1073741824).toFixed(2)} GB`:t>=1048576?`${(t/1048576).toFixed(2)} MB`:t>=1024?`${(t/1024).toFixed(2)} KB`:t>1?`${t} Bytes`:1==t?`${t} Byte`:" 資料夾"}function markdown(t,e){if(window.markdownit||window.location.reload(),null==window.md)window.md=window.markdownit(),markdown(t,e);else{let i=md.render(e);$(t).show().html(i)}}String.prototype.trim=function(t){return t?this.replace(new RegExp(`^\\${t}+|\\${t}+$`,"g"),""):this.replace(/^\s+|\s+$/g,"")},window.onpopstate=(()=>{render(window.location.pathname)}),$(()=>{init(),render(window.location.pathname)});
