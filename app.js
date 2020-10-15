// Goindex Open Data
// MDUI
document.write('<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/mdui/0.4.3/css/mdui.min.css">');

// Markdown
document.write('<script src="//cdnjs.cloudflare.com/ajax/libs/markdown-it/11.0.0/markdown-it.min.js"></script>');

// Google Fonts - Noto Sans TC -Medium 500
// font-family: 'Noto Sans TC', sans-serif;
document.write ('<link rel="stylesheet" href="//fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@500&display=swap">');
// 套用字體
document.write(`<style>* body{font-family: 'Noto Sans TC', sans-serif;} .mdui-select-selected{font-family: 'Noto Sans TC', sans-serif;} .mdui-select-menu{font-family: 'Noto Sans TC', sans-serif;}</style>`);
// 導航背景 #232427
document.write(`<style>* .mdui-theme-primary-blue .mdui-color-theme{background-color:rgba(35,36,39,1)!important}</style>`);
// 導航樣式
document.write(`<style>* .mdui-appbar{padding-right: 8px; padding-left: 8px; margin-right: auto; margin-left: auto; max-width: 980px;}</style>`);
// 網頁背景
document.write(`<style>* {box-sizing: border-box} body{margin:0px; padding:0px; background: url("//i.imgur.com/1cwii31.jpg"); background-attachment: fixed; background-repeat: no-repeat; background-position: center center; background-size: cover;}</style>`);
// 列表背景 #333232
document.write(`<style>* .mdui-container{color:rgba(255,255,255,.87);background-color:rgba(35,36,39,0.95);border-width:1px;border-color:#333333;border-bottom-style:solid;}</style>`);
// 項目邊框
document.write(`<style>* .mdui-list li{border-width:1px;border-color:#333333;border-bottom-style:solid;} </style>`);
// Other
document.write('<style>.mdui-appbar .mdui-toolbar{height:56px;font-size:1pc}.mdui-toolbar>*{padding:0 6px;margin:0 2px}.mdui-toolbar>i{opacity:.5}.mdui-toolbar>.mdui-typo-headline{padding:0 1pc 0 0}.mdui-toolbar>i{padding:0}.mdui-toolbar>a:hover,a.active,a.mdui-typo-headline{opacity:1}.mdui-container{max-width:980px}.mdui-list-item{transition:none}.mdui-list>.th{background-color:initial}.mdui-list-item>a{width:100%;line-height:3pc}.mdui-list-item{margin:2px 0;padding:0}.mdui-toolbar>a:last-child{opacity:1}@media screen and (max-width:980px){.mdui-list-item .mdui-text-right{display:none}.mdui-container{width:100%!important;margin:0}.mdui-toolbar>.mdui-typo-headline,.mdui-toolbar>a:last-child,.mdui-toolbar>i:first-child{display:block}}</style>');

// DPlayer
document.write('<script src="//cdnjs.cloudflare.com/ajax/libs/dplayer/1.25.1/DPlayer.min.js" integrity="sha512-bjMqZ0Ai1izYtoe+f9ehqyT9qaFYOcWgGUOj2mTx9aUBA+lEtKyIruqNhbR2toBtFg2n9LeN0FocK57P8X/jMg==" crossorigin="anonymous"></script>');

// 初始化页面，并载入必要资源
function init() {
  document.siteName = $('title').html();
  $('body').addClass(`mdui-theme-primary-${UI.main_color} mdui-theme-accent-${UI.accent_color}`);
  var html = `
<header class="mdui-appbar mdui-color-theme"> 
   <div id="nav" class="mdui-toolbar mdui-container${UI.fluid_navigation_bar ? '-fluid' : ''} ${UI.dark_mode ? 'mdui-text-color-white-text' : ''}">
   </div> 
</header>
<div id="content" class="mdui-container"> 
</div>
	`;
  $('body').html(html);
}

const Os = {
  isWindows: navigator.platform.toUpperCase().indexOf('WIN') > -1, // .includes
  isMac: navigator.platform.toUpperCase().indexOf('MAC') > -1,
  isMacLike: /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform),
  isIos: /(iPhone|iPod|iPad)/i.test(navigator.platform),
  isMobile: /Android|webOS|iPhone|iPad|iPod|iOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
};

function getDocumentHeight() {
  var D = document;
  return Math.max(
    D.body.scrollHeight, D.documentElement.scrollHeight,
    D.body.offsetHeight, D.documentElement.offsetHeight,
    D.body.clientHeight, D.documentElement.clientHeight
  );
}

function render(path) {
  if (path.indexOf("?") > 0) {
    path = path.substr(0, path.indexOf("?"));
  }
  title(path);
  nav(path);
  // .../0: 这种
  var reg = /\/\d+:$/g;
  if (window.MODEL.is_search_page) {
    // 用来存储一些滚动事件的状态
    window.scroll_status = {
      // 滚动事件是否已经绑定
      event_bound: false,
      // "滚动到底部，正在加载更多数据" 事件的锁
      loading_lock: false
    };
    render_search_result_list()
  } else if (path.match(reg) || path.substr(-1) == '/') {
    // 用来存储一些滚动事件的状态
    window.scroll_status = {
      // 滚动事件是否已经绑定
      event_bound: false,
      // "滚动到底部，正在加载更多数据" 事件的锁
      loading_lock: false
    };
    list(path);
  } else {
    file(path);
  }
}


// 渲染 title
function title(path) {
  path = decodeURI(path);
  // var cur = window.current_drive_order || 0;
  // var drive_name = window.drive_names[cur];
  // path = path.replace(`/${cur}:`, '');
  // $('title').html(document.siteName + ' - ' + path);
  // var model = window.MODEL;
  // if (model.is_search_page)
    // $('title').html(`${document.siteName} - ${drive_name} - 搜索 ${model.q} 的结果`);
 //  else
    // $('title').html(`${document.siteName} - ${drive_name} - ${path}`);
    $('title').html(`${document.siteName}`);
}

// 渲染导航栏
function nav(path) {
  var model = window.MODEL;
  var html = "";
  var cur = window.current_drive_order || 0;
  html += `<a href="/${cur}:/" class="mdui-typo-headline folder">${document.siteName}</a>`;
  var names = window.drive_names;
  /*html += `<button class="mdui-btn mdui-btn-raised" mdui-menu="{target: '#drive-names'}"><i class="mdui-icon mdui-icon-left material-icons">share</i> ${names[cur]}</button>`;
  html += `<ul class="mdui-menu" id="drive-names" style="transform-origin: 0px 0px; position: fixed;">`;
  names.forEach((name, idx) => {
      html += `<li class="mdui-menu-item ${(idx === cur) ? 'mdui-list-item-active' : ''} "><a href="/${idx}:/" class="mdui-ripple">${name}</a></li>`;
  });
  html += `</ul>`;*/

  // 修改为 select
  html += `<select class="mdui-select" onchange="window.location.href=this.value" mdui-select style="overflow:visible;padding-left:8px;padding-right:8px">`;
  names.forEach((name, idx) => {
    html += `<option value="/${idx}:/"  ${idx === cur ? 'selected="selected"' : ''} >${name}</option>`;
  });
  html += `</select>`;

  if (!model.is_search_page) {
    var arr = path.trim('/').split('/');
    var p = '/';
    if (arr.length > 1) {
      arr.shift();
      for (i in arr) {
        var n = arr[i];
        n = decodeURI(n);
        p += n + '/';
        if (n == '') {
          break;
        }
        html += `<i class="mdui-icon material-icons mdui-icon-dark folder" style="margin:0;">chevron_right</i><a class="folder" href="/${cur}:${p}">${n}</a>`;
      }
    }
  }
  var search_text = model.is_search_page ? (model.q || '') : '';
  const isMobile = Os.isMobile;
  var search_bar = `<div class="mdui-toolbar-spacer"></div>
        <div id="search_bar" class="mdui-textfield mdui-textfield-expandable mdui-float-right ${model.is_search_page ? 'mdui-textfield-expanded' : ''}" style="max-width:${isMobile ? 300 : 400}px">
            <button class="mdui-textfield-icon mdui-btn mdui-btn-icon" onclick="if($('#search_bar').hasClass('mdui-textfield-expanded') && $('#search_bar_form>input').val()) $('#search_bar_form').submit();">
                <i class="mdui-icon material-icons">search</i>
            </button>
            <form id="search_bar_form" method="get" action="/${cur}:search">
            <input class="mdui-textfield-input" type="text" name="q" placeholder="Search in current drive" value="${search_text}"/>
            </form>
            <button class="mdui-textfield-close mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">close</i></button>
        </div>`;
  
  html += `<div class="mdui-toolbar-spacer"></div>
  <a href="//twitter.com/TW_NEKO_CHAN" target="_blank" class="mdui-btn mdui-btn-icon mdui-ripple mdui-ripple-white" mdui-tooltip="{content: 'Twitter'}" alt="Twitter">
    <img src="//image.flaticon.com/icons/svg/1384/1384075.svg" width="30" height="45" />
  </a>
  <a href="//ko-fi.com/tw_neko_chan" target="_blank" class="mdui-btn mdui-btn-icon mdui-ripple mdui-ripple-white" mdui-tooltip="{content: 'Donate'}" alt="Donate">
    <img src="//image.flaticon.com/icons/svg/2917/2917845.svg" width="30" height="45" />
  </a>`;

  // 个人盘 或 团队盘
  if (model.root_type < 2) {
    // 显示搜索框
    html += search_bar;
  }

  $('#nav').html(html);
  mdui.mutation();
  mdui.updateTextFields();
}

/**
 * 发起列目录的 POST 请求
 * @param path Path
 * @param params Form params
 * @param resultCallback Success Result Callback
 * @param authErrorCallback Pass Error Callback
 */
function requestListPath(path, params, resultCallback, authErrorCallback) {
  var p = {
    password: params['password'] || null,
    page_token: params['page_token'] || null,
    page_index: params['page_index'] || 0
  };
  $.post(path, p, function (data, status) {
    var res = jQuery.parseJSON(data);
    if (res && res.error && res.error.code == '401') {
      // 密码验证失败
      if (authErrorCallback) authErrorCallback(path)
    } else if (res && res.data) {
      if (resultCallback) resultCallback(res, path, p)
    }
  })
}

/**
 * 搜索 POST 请求
 * @param params Form params
 * @param resultCallback Success callback
 */
function requestSearch(params, resultCallback) {
  var p = {
    q: params['q'] || null,
    page_token: params['page_token'] || null,
    page_index: params['page_index'] || 0
  };
  $.post(`/${window.current_drive_order}:search`, p, function (data, status) {
    var res = jQuery.parseJSON(data);
    if (res && res.data) {
      if (resultCallback) resultCallback(res, p)
    }
  })
}


// 渲染文件列表
function list(path) {
  var content = `
	<div id="head_md" class="mdui-typo" style="display:none;padding: 20px 0;"></div>
	 <div class="mdui-row"> 
	  <ul class="mdui-list"> 
	   <li class="mdui-list-item th"> 
	    <div class="mdui-col-xs-12 mdui-col-sm-7">
      檔案名稱
	<i class="mdui-icon material-icons icon-sort" data-sort="name" data-order="more">expand_more</i>
	    </div> 
	    <div class="mdui-col-sm-3 mdui-text-right">
      修改時間
	<i class="mdui-icon material-icons icon-sort" data-sort="date" data-order="downward">expand_more</i>
	    </div> 
	    <div class="mdui-col-sm-2 mdui-text-right">
      檔案大小
	<i class="mdui-icon material-icons icon-sort" data-sort="size" data-order="downward">expand_more</i>
	    </div> 
	    </li> 
	  </ul> 
	 </div> 
	 <div class="mdui-row"> 
	  <ul id="list" class="mdui-list"> 
	  </ul> 
    <div id="count" class="mdui-hidden mdui-center mdui-text-center mdui-m-b-3 mdui-typo-subheading mdui-text-color-blue-grey-500">共 <span class="number"></span> 項<br>NekoChan Open Data</div>
	 </div>
	 <div id="readme_md" class="mdui-typo" style="display:none; padding: 20px 0;"></div>
	`;
  $('#content').html(content);

  var password = localStorage.getItem('password' + path);
  $('#list').html(`<div class="mdui-progress"><div class="mdui-progress-indeterminate"></div></div>`);
  $('#readme_md').hide().html('');
  $('#head_md').hide().html('');

  /**
   * 列目录请求成功返回数据后的回调
   * @param res 返回的结果(object)
   * @param path 请求的路径
   * @param prevReqParams 请求时所用的参数
   */
  function successResultCallback(res, path, prevReqParams) {

    // 把 nextPageToken 和 currentPageIndex 暂存在 list元素 中
    $('#list')
      .data('nextPageToken', res['nextPageToken'])
      .data('curPageIndex', res['curPageIndex']);

    // 移除 loading spinner
    $('#spinner').remove();

    if (res['nextPageToken'] === null) {
      // 如果是最后一页，取消绑定 scroll 事件，重置 scroll_status ，并 append 数据
      $(window).off('scroll');
      window.scroll_status.event_bound = false;
      window.scroll_status.loading_lock = false;
      append_files_to_list(path, res['data']['files']);
    } else {
      // 如果不是最后一页，append数据 ，并绑定 scroll 事件（如果还未绑定），更新 scroll_status
      append_files_to_list(path, res['data']['files']);
      if (window.scroll_status.event_bound !== true) {
        // 绑定事件，如果还未绑定
        $(window).on('scroll', function () {
          var scrollTop = $(this).scrollTop();
          var scrollHeight = getDocumentHeight();
          var windowHeight = $(this).height();
          // 滚到底部
          if (scrollTop + windowHeight > scrollHeight - (Os.isMobile ? 130 : 80)) {
            /*
                滚到底部事件触发时，如果此时已经正在 loading 中，则忽略此次事件；
                否则，去 loading，并占据 loading锁，表明 正在 loading 中
             */
            if (window.scroll_status.loading_lock === true) {
              return;
            }
            window.scroll_status.loading_lock = true;

            // 展示一个 loading spinner
            $(`<div id="spinner" class="mdui-spinner mdui-spinner-colorful mdui-center"></div>`)
              .insertBefore('#readme_md');
            mdui.updateSpinners();
            // mdui.mutation();

            let $list = $('#list');
            requestListPath(path, {
                password: prevReqParams['password'],
                page_token: $list.data('nextPageToken'),
                // 请求下一页
                page_index: $list.data('curPageIndex') + 1
              },
              successResultCallback,
              // 密码和之前相同。不会出现 authError
              null
            )
          }
        });
        window.scroll_status.event_bound = true
      }
    }

    // loading 成功，并成功渲染了新数据之后，释放 loading 锁，以便能继续处理 "滚动到底部" 事件
    if (window.scroll_status.loading_lock === true) {
      window.scroll_status.loading_lock = false
    }
  }

  // 开始从第1页请求数据
  requestListPath(path, {password: password},
    successResultCallback,
    function (path) {
      $('#spinner').remove();
      var pass = prompt("目录加密, 请输入密码", "");
      localStorage.setItem('password' + path, pass);
      if (pass != null && pass != "") {
        list(path);
      } else {
        history.go(-1);
      }
    });
}

/**
 * 把请求得来的新一页的数据追加到 list 中
 * @param path 路径
 * @param files 请求得来的结果
 */
function append_files_to_list(path, files) {
  var $list = $('#list');
  // 是最后一页数据了吗？
  var is_lastpage_loaded = null === $list.data('nextPageToken');
  var is_firstpage = '0' == $list.data('curPageIndex');

  html = "";
  let targetFiles = [];
  for (i in files) {
    var item = files[i];
    var p = path + item.name + '/';
    if (item['size'] == undefined) {
      item['size'] = "";
    }

    item['modifiedTime'] = utc2beijing(item['modifiedTime']);
    item['size'] = formatFileSize(item['size']);
    if (item['mimeType'] == 'application/vnd.google-apps.folder') {
      html += `<li class="mdui-list-item mdui-ripple"><a href="${p}" class="folder">
	            <div class="mdui-col-xs-12 mdui-col-sm-7 mdui-text-truncate" title="${item.name}">
	            <i class="mdui-icon material-icons">folder_open</i>
	              ${item.name}
	            </div>
	            <div class="mdui-col-sm-3 mdui-text-right">${item['modifiedTime']}</div>
	            <div class="mdui-col-sm-2 mdui-text-right">${item['size']}</div>
	            </a>
	        </li>`;
    } else {
      var p = path + item.name;
      const filepath = path + item.name;
      var c = "file";
      // 当加载完最后一页后，才显示 README ，否则会影响滚动事件
      if (is_lastpage_loaded && item.name == "!readme.md") {
        get_file(p, item, function (data) {
          markdown("#readme_md", data);
        });
      }
      if (item.name == "!head.md") {
        get_file(p, item, function (data) {
          markdown("#head_md", data);
        });
      }
      var ext = p.split('.').pop().toLowerCase();
      if ("|html|php|css|go|java|js|json|txt|sh|md|mp4|webm|avi|bmp|jpg|jpeg|png|gif|m4a|mp3|flac|wav|ogg|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|pdf|".indexOf(`|${ext}|`) >= 0) {
        targetFiles.push(filepath);
        p += "?a=view";
        c += " view";
      }
      html += `<li class="mdui-list-item file mdui-ripple" target="_blank"><a gd-type="${item.mimeType}" href="${p}" class="${c}">
	          <div class="mdui-col-xs-12 mdui-col-sm-7 mdui-text-truncate" title="${item.name}">
	          <i class="mdui-icon material-icons">insert_drive_file</i>
	            ${item.name}
	          </div>
	          <div class="mdui-col-sm-3 mdui-text-right">${item['modifiedTime']}</div>
	          <div class="mdui-col-sm-2 mdui-text-right">${item['size']}</div>
	          </a>
	      </li>`;
    }
  }

  /*let targetObj = {};
  targetFiles.forEach((myFilepath, myIndex) => {
      if (!targetObj[myFilepath]) {
          targetObj[myFilepath] = {
              filepath: myFilepath,
              prev: myIndex === 0 ? null : targetFiles[myIndex - 1],
              next: myIndex === targetFiles.length - 1 ? null : targetFiles[myIndex + 1],
          }
      }
  })
  // console.log(targetObj)
  if (Object.keys(targetObj).length) {
      localStorage.setItem(path, JSON.stringify(targetObj));
      // console.log(path)
  }*/

  if (targetFiles.length > 0) {
    let old = localStorage.getItem(path);
    let new_children = targetFiles;
    // 第1页重设；否则追加
    if (!is_firstpage && old) {
      let old_children;
      try {
        old_children = JSON.parse(old);
        if (!Array.isArray(old_children)) {
          old_children = []
        }
      } catch (e) {
        old_children = [];
      }
      new_children = old_children.concat(targetFiles)
    }

    localStorage.setItem(path, JSON.stringify(new_children))
  }

  // 是第1页时，去除横向loading条
  $list.html(($list.data('curPageIndex') == '0' ? '' : $list.html()) + html);
  // 是最后一页时，统计并显示出总项目数
  if (is_lastpage_loaded) {
    $('#count').removeClass('mdui-hidden').find('.number').text($list.find('li.mdui-list-item').length);
  }
}

/**
 * 渲染搜索结果列表。有大量重复代码，但是里面有不一样的逻辑，暂时先这样分开弄吧
 */
function render_search_result_list() {
  var content = `
	<div id="head_md" class="mdui-typo" style="display:none;padding: 20px 0;"></div>
	 <div class="mdui-row"> 
	  <ul class="mdui-list"> 
	   <li class="mdui-list-item th"> 
	    <div class="mdui-col-xs-12 mdui-col-sm-7">
      檔案名稱
	<i class="mdui-icon material-icons icon-sort" data-sort="name" data-order="more">expand_more</i>
	    </div> 
	    <div class="mdui-col-sm-3 mdui-text-right">
      修改時間
	<i class="mdui-icon material-icons icon-sort" data-sort="date" data-order="downward">expand_more</i>
	    </div> 
	    <div class="mdui-col-sm-2 mdui-text-right">
      檔案大小
	<i class="mdui-icon material-icons icon-sort" data-sort="size" data-order="downward">expand_more</i>
	    </div> 
	    </li> 
	  </ul> 
	 </div> 
	 <div class="mdui-row"> 
	  <ul id="list" class="mdui-list"> 
	  </ul> 
    <div id="count" class="mdui-hidden mdui-center mdui-text-center mdui-m-b-3 mdui-typo-subheading mdui-text-color-blue-grey-500">共 <span class="number"></span> 項<br>NekoChan Open Data</div>
	 </div>
	 <div id="readme_md" class="mdui-typo" style="display:none; padding: 20px 0;"></div>
	`;
  $('#content').html(content);

  $('#list').html(`<div class="mdui-progress"><div class="mdui-progress-indeterminate"></div></div>`);
  $('#readme_md').hide().html('');
  $('#head_md').hide().html('');

  /**
   * 搜索请求成功返回数据后的回调
   * @param res 返回的结果(object)
   * @param path 请求的路径
   * @param prevReqParams 请求时所用的参数
   */
  function searchSuccessCallback(res, prevReqParams) {

    // 把 nextPageToken 和 currentPageIndex 暂存在 list元素 中
    $('#list')
      .data('nextPageToken', res['nextPageToken'])
      .data('curPageIndex', res['curPageIndex']);

    // 移除 loading spinner
    $('#spinner').remove();

    if (res['nextPageToken'] === null) {
      // 如果是最后一页，取消绑定 scroll 事件，重置 scroll_status ，并 append 数据
      $(window).off('scroll');
      window.scroll_status.event_bound = false;
      window.scroll_status.loading_lock = false;
      append_search_result_to_list(res['data']['files']);
    } else {
      // 如果不是最后一页，append数据 ，并绑定 scroll 事件（如果还未绑定），更新 scroll_status
      append_search_result_to_list(res['data']['files']);
      if (window.scroll_status.event_bound !== true) {
        // 绑定事件，如果还未绑定
        $(window).on('scroll', function () {
          var scrollTop = $(this).scrollTop();
          var scrollHeight = getDocumentHeight();
          var windowHeight = $(this).height();
          // 滚到底部
          if (scrollTop + windowHeight > scrollHeight - (Os.isMobile ? 130 : 80)) {
            /*
                滚到底部事件触发时，如果此时已经正在 loading 中，则忽略此次事件；
                否则，去 loading，并占据 loading锁，表明 正在 loading 中
             */
            if (window.scroll_status.loading_lock === true) {
              return;
            }
            window.scroll_status.loading_lock = true;

            // 展示一个 loading spinner
            $(`<div id="spinner" class="mdui-spinner mdui-spinner-colorful mdui-center"></div>`)
              .insertBefore('#readme_md');
            mdui.updateSpinners();
            // mdui.mutation();

            let $list = $('#list');
            requestSearch({
                q: window.MODEL.q,
                page_token: $list.data('nextPageToken'),
                // 请求下一页
                page_index: $list.data('curPageIndex') + 1
              },
              searchSuccessCallback
            )
          }
        });
        window.scroll_status.event_bound = true
      }
    }

    // loading 成功，并成功渲染了新数据之后，释放 loading 锁，以便能继续处理 "滚动到底部" 事件
    if (window.scroll_status.loading_lock === true) {
      window.scroll_status.loading_lock = false
    }
  }

  // 开始从第1页请求数据
  requestSearch({q: window.MODEL.q}, searchSuccessCallback);
}

/**
 * 追加新一页的搜索结果
 * @param files
 */
function append_search_result_to_list(files) {
  var $list = $('#list');
  // 是最后一页数据了吗？
  var is_lastpage_loaded = null === $list.data('nextPageToken');
  // var is_firstpage = '0' == $list.data('curPageIndex');

  html = "";

  for (i in files) {
    var item = files[i];
    if (item['size'] == undefined) {
      item['size'] = "";
    }

    item['modifiedTime'] = utc2beijing(item['modifiedTime']);
    item['size'] = formatFileSize(item['size']);
    if (item['mimeType'] == 'application/vnd.google-apps.folder') {
      html += `<li class="mdui-list-item mdui-ripple"><a id="${item['id']}" onclick="onSearchResultItemClick(this)" class="folder">
	            <div class="mdui-col-xs-12 mdui-col-sm-7 mdui-text-truncate" title="${item.name}">
	            <i class="mdui-icon material-icons">folder_open</i>
	              ${item.name}
	            </div>
	            <div class="mdui-col-sm-3 mdui-text-right">${item['modifiedTime']}</div>
	            <div class="mdui-col-sm-2 mdui-text-right">${item['size']}</div>
	            </a>
	        </li>`;
    } else {
      var c = "file";
      var ext = item.name.split('.').pop().toLowerCase();
      if ("|html|php|css|go|java|js|json|txt|sh|md|mp4|webm|avi|bmp|jpg|jpeg|png|gif|m4a|mp3|flac|wav|ogg|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|".indexOf(`|${ext}|`) >= 0) {
        c += " view";
      }
      html += `<li class="mdui-list-item file mdui-ripple" target="_blank"><a id="${item['id']}" gd-type="${item.mimeType}" onclick="onSearchResultItemClick(this)" class="${c}">
	          <div class="mdui-col-xs-12 mdui-col-sm-7 mdui-text-truncate" title="${item.name}">
	          <i class="mdui-icon material-icons">insert_drive_file</i>
	            ${item.name}
	          </div>
	          <div class="mdui-col-sm-3 mdui-text-right">${item['modifiedTime']}</div>
	          <div class="mdui-col-sm-2 mdui-text-right">${item['size']}</div>
	          </a>
	      </li>`;
    }
  }

  // 是第1页时，去除横向loading条
  $list.html(($list.data('curPageIndex') == '0' ? '' : $list.html()) + html);
  // 是最后一页时，统计并显示出总项目数
  if (is_lastpage_loaded) {
    $('#count').removeClass('mdui-hidden').find('.number').text($list.find('li.mdui-list-item').length);
  }
}

/**
 * 搜索结果项目点击事件
 * @param a_ele 点击的元素
 */
function onSearchResultItemClick(a_ele) {
  var me = $(a_ele);
  var can_preview = me.hasClass('view');
  var cur = window.current_drive_order;
  var dialog = mdui.dialog({
    title: '',
    content: '<div class="mdui-text-center mdui-typo-title mdui-m-b-1">正在获取目标路径...</div><div class="mdui-spinner mdui-spinner-colorful mdui-center"></div>',
    // content: '<div class="mdui-spinner mdui-spinner-colorful mdui-center"></div>',
    history: false,
    modal: true,
    closeOnEsc: true
  });
  mdui.updateSpinners();

  // 请求获取路径
  $.post(`/${cur}:id2path`, {id: a_ele.id}, function (data) {
    if (data) {
      dialog.close();
      var href = `/${cur}:${data}${can_preview ? '?a=view' : ''}`;
      dialog = mdui.dialog({
        title: '<i class="mdui-icon material-icons">&#xe815;</i>目标路径',
        content: `<a href="${href}">${data}</a>`,
        history: false,
        modal: true,
        closeOnEsc: true,
        buttons: [
          {
            text: '打开', onClick: function () {
              window.location.href = href
            }
          }, {
            text: '新标签中打开', onClick: function () {
              window.open(href)
            }
          }
          , {text: '取消'}
        ]
      });
      return;
    }
    dialog.close();
    dialog = mdui.dialog({
      title: '<i class="mdui-icon material-icons">&#xe811;</i>获取目标路径失败',
      content: 'o(╯□╰)o 可能是因为该盘中并不存在此项！也可能因为没有把【与我共享】的文件添加到个人云端硬盘中！',
      history: false,
      modal: true,
      closeOnEsc: true,
      buttons: [
        {text: 'WTF ???'}
      ]
    });
  })
}

function get_file(path, file, callback) {
  var key = "file_path_" + path + file['modifiedTime'];
  var data = localStorage.getItem(key);
  if (data != undefined) {
    return callback(data);
  } else {
    $.get(path, function (d) {
      localStorage.setItem(key, d);
      callback(d);
    });
  }
}


function file(path){
	var name = path.split('/').pop();
	var ext = name.split('.').pop().toLowerCase().replace(`?a=view`,"");
	if("|mp4|webm|avi|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|".indexOf(`|${ext}|`) >= 0){
		return file_video(path);
	}
	if("|bmp|jpg|jpeg|png|gif|".indexOf(`|${ext}|`) >= 0){
		return file_image(path);
  }
}

// Preview Video
function file_video(path){
  var url = decodeURI(window.location.origin + path);
  var encoded_url = (url);
  const file_name = decodeURI(path.slice(path.lastIndexOf('/') + 1, path.length))
  const currentPathname = window.location.pathname
  const lastIndex = currentPathname.lastIndexOf('/');
  const fatherPathname = currentPathname.slice(0, lastIndex + 1);
  let target_children = localStorage.getItem(fatherPathname);
  let targetText = '';
  if (target_children) {
    try {
      target_children = JSON.parse(target_children);
      if (!Array.isArray(target_children)) {
        target_children = []
      }
    } catch (e) {
      console.error(e);
      target_children = [];
    }
    if (target_children.length > 0 && target_children.includes(path)) {
      let len = target_children.length;
      let cur = target_children.indexOf(path);
      let prev_child = (cur - 1 > -1) ? target_children[cur - 1] : null;
      let next_child = (cur + 1 < len) ? target_children[cur + 1] : null;
      targetText = `
            <div class="mdui-container">
                <div class="mdui-row-xs-2 mdui-m-b-1">
                    <div class="mdui-col">
                        ${prev_child ? `<button id="leftBtn" data-filepath="${prev_child}" class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple">上一集</button>` : `<button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple" disabled>上一集</button>`}
                    </div>
                    <div class="mdui-col">
                        ${next_child ? `<button id="rightBtn"  data-filepath="${next_child}" class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple">下一集</button>` : `<button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple" disabled>下一集</button>`}
                    </div> 
                </div>
            </div>
            `;
    }
  }

  var playBtn = `<a href="potplayer://${encoded_url}" class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent windows-btn">PotPlayer 串流</a>`;
  if(/(Mac)/i.test(navigator.userAgent)) {
      playBtn = `<button class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mac-btn" data-href="iina://open?url=${encoded_url}">IINA 串流</button>`;
  }
  if (/(Android)/i.test(navigator.userAgent)) {
    playBtn = `<button class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent android-btn" data-href="intent:${encoded_url}#Intent;package=com.mxtech.videoplayer.pro;S.title=${path};end">MXPlayer Pro 串流</button>`;
      playBtn += `<br><button style="margin-top: 15px" class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent android-btn" data-href="intent:${encoded_url}#Intent;package=com.mxtech.videoplayer.ad;S.title=${path};end">MXPlayer Free 串流</button>`;
  }
  if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      var applelink = url.replace(/(^\w+:|^)\/\//, '');
      playBtn = `<a class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent" href="infuse://${applelink}">Infuse 串流</a>`;
  }
  playBtn += `<br><a style="margin-top: 15px" href="${encoded_url}" class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent download-btn">直連下載檔案</a>`;

  var content = `
<div class="mdui-container-fluid">
    <br>
    <div class="mdui-textfield">
    <label class="mdui-textfield-label mdui-text-color-white">目前檔案：</label>
    <input class="mdui-textfield-input mdui-text-color-white" type="text" value="${file_name}" readonly/>
    </div>
    <div class="mdui-center" id="dplayer">
    <link rel="preload" href="${encoded_url}" as="video" type="video/mp4">
      </div>
    <br>
    <div id="imgWrap">
    ${targetText}
    </div>
    <br>
    ${playBtn}
    <div class="mdui-textfield">
      <label class="mdui-textfield-label mdui-text-color-white">注意：若影片沒有畫面，請嘗試播放器。或通知我本人。</label>
    </div>
    <hr>
</div>
    `;
  $('#content').html(content);
  const dp = new DPlayer({
    container: document.getElementById('dplayer'),
    theme: '#0080ff',
    autoplay: true,
    lang: 'zh-tw',
    screenshot: true,
    video: {
        url: encoded_url,
    },
    contextmenu: [
      {
        text: 'NekoChan Open Data',
        link: '//nekochan.ml/',
      },
    ],
  });

  // 影片讀取並播放後 進入全螢幕
dp.on('loadstart', function () {
  console.log('Video loadstart');
  // dp.fullScreen.request('browser');
});

// 影片結束後 切換下一集 並 退出全螢幕
dp.on('ended', function () {
  console.log('Video ended');
  // dp.fullScreen.cancel('browser');
  next_child;
});

  $('#leftBtn, #rightBtn').click((e) => {
    let target = $(e.target);
    if (['I', 'SPAN'].includes(e.target.nodeName)) {
      target = $(e.target).parent();
    }
    const filepath = target.attr('data-filepath');
    const direction = target.attr('data-direction');
    file(filepath)
  });
}

function file_image(path){
  var url = decodeURI(window.location.origin + path);
    var content = `
<div class="mdui-container-fluid">
    <br>
    <img class="mdui-img-fluid" src="${url}"/>
  <br>
  <hr>
</div>`;
    $('#content').html(content);
}

function utc2beijing(utc_datetime) {
  var T_pos = utc_datetime.indexOf('T');
  var Z_pos = utc_datetime.indexOf('Z');
  var year_month_day = utc_datetime.substr(0,T_pos);
  var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
  var new_datetime = year_month_day+" "+hour_minute_second;

  timestamp = new Date(Date.parse(new_datetime));
  timestamp = timestamp.getTime();
  timestamp = timestamp/1000;

  // 增加8個小時
  var unixtimestamp = timestamp+8*60*60;

  var unixtimestamp = new Date(unixtimestamp*1000);
  var year = 1900 + unixtimestamp.getYear();
  var month = "0" + (unixtimestamp.getMonth() + 1);
  var date = "0" + unixtimestamp.getDate();
  var hour = "0" + unixtimestamp.getHours();
  var minute = "0" + unixtimestamp.getMinutes();
  var second = "0" + unixtimestamp.getSeconds();
  return year 
      + "/" + month.substring(month.length-2, month.length)  
      + "/" + date.substring(date.length-2, date.length)
      + " " + hour.substring(hour.length-2, hour.length)
      + ":" + minute.substring(minute.length-2, minute.length)
      + ":" + second.substring(second.length-2, second.length);
}

function formatFileSize(bytes) {
  if (bytes >= 1073741824) {bytes = (bytes / 1073741824).toFixed(2) + ' GB';}
  else if (bytes >= 1048576) {bytes = (bytes / 1048576).toFixed(2) + ' MB';}
  else if (bytes >= 1024) {bytes = (bytes / 1024).toFixed(2) + ' KB';}
  else if (bytes > 1) {bytes = bytes + ' Bytes';}
  else if (bytes == 1) {bytes = bytes + ' Byte';}
  else {bytes = ' 資料夾';}
  return bytes;
}

String.prototype.trim = function (char) {
  if (char) {
      return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');z
  }
  return this.replace(/^\s+|\s+$/g, '');
};

function markdown(el, data){
  if(window.md == undefined){
      window.md = window.markdownit();
      markdown(el, data);;
  }else{
      var html = md.render(data);
      $(el).show().html(html);
  }
}

window.onpopstate = function(){
  var path = window.location.pathname;
  render(path);
}


$(function () {
  init();
  var path = window.location.pathname;
  render(path);
});
