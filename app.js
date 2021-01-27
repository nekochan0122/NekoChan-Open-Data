// NekoChan Open Data

document.write(
	// MDUI 1.0.1
	'<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/mdui/1.0.1/css/mdui.min.css" integrity="sha512-x4mi26uahzsFv2+ZklhOELAiuLt2e+hSxQ/SWbW/FuZWZJSc4Ffb33Al7SmPqXXyZieN2rNxBiDsRqAtGKsxUA==" crossorigin="anonymous" />',
	// Google Fonts - Noto Sans TC, JP Medium 500
	// font-family: 'Noto Sans TC', 'Noto Sans JP', sans-serif;
	'<link rel="preconnect" href="//fonts.gstatic.com">',
	'<link href="//fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500&family=Noto+Sans+TC:wght@500&display=swap" rel="stylesheet">',

	// CSS
	`<style>*{font-family:'Noto Sans TC','Noto Sans JP','Noto Sans SC',serif}*{box-sizing:border-box}body{margin:0;padding:0;background:url(//cdn.jsdelivr.net/gh/NekoChanTaiwan/NekoChan-Open-Data@1.8.2.beta16/images/background_3.webp);background-attachment:fixed;background-repeat:no-repeat;background-position:center center;background-size:cover}* .mdui-theme-primary-blue .mdui-color-theme{background-color:#232427!important}* .mdui-appbar{padding-right:8px;padding-left:8px;margin-right:auto;margin-left:auto;max-width:980px}* .mdui-container,.mdui-textfield-input{color:rgba(255,255,255,.87);background-color:rgba(35,36,39,.95);border-width:1px;border-color:#333;border-bottom-style:solid}.updating{color:rgb(251 191 72 / 87%)!important}.finish{color:rgb(255 106 106 / 87%)!important}.r18{color:rgb(249 67 177 / 87%)!important}* .mdui-list li{border-width:1px;border-color:#333;border-bottom-style:solid}.mdui-appbar .mdui-toolbar{height:56px;font-size:1px}.mdui-toolbar>*{padding:0 6px;margin:0 2px}.mdui-toolbar>i{opacity:.5}.mdui-toolbar>.mdui-typo-headline{padding:0 1pc 0 0}.mdui-toolbar>i{padding:0}.mdui-toolbar>a:hover,a.active,a.mdui-typo-headline{opacity:1}.mdui-container{max-width:980px}.mdui-list-item{transition:none}.mdui-list>.th{background-color:initial}.mdui-list-item>a{width:100%;line-height:3pc}.mdui-list-item{margin:2px 0;padding:0}.mdui-toolbar>a:last-child{opacity:1}@media screen and (max-width:980px){.mdui-list-item .mdui-text-right{display:none}.mdui-container{width:100%!important;margin:0}.mdui-toolbar>.mdui-typo-headline,.mdui-toolbar>a:last-child,.mdui-toolbar>i:first-child{display:block}}</style>`,

	// Markdown-it 12.0.4
	'<script src="//cdnjs.cloudflare.com/ajax/libs/markdown-it/12.0.4/markdown-it.min.js" integrity="sha512-0DkA2RqFvfXBVeti0R1l0E8oMkmY0X+bAA2i02Ld8xhpjpvqORUcE/UBe+0KOPzi5iNah0aBpW6uaNNrqCk73Q==" crossorigin="anonymous" async></script>',
	// DPlayer 1.26.0
	'<script src="//cdn.jsdelivr.net/gh/NekoChanTaiwan/NekoChan-Open-Data@1.8.1.beta16/js/DPlayer1.26.0.min.js" async></script>'
)

// if (UI.dark_mode) {
// 	document.write(
// 		`<style>* {box-sizing: border-box}body{color:rgba(255,255,255,.87);background-color:#333232}.mdui-theme-primary-${UI.main_color} .mdui-color-theme{background-color:#232427!important}</style>`
// 	)
// }

// 初始化頁面，並載入必要資源
function init() {
	document.siteName = $('title').html()
	$('body').addClass(
		`mdui-theme-primary-${UI.main_color} mdui-theme-accent-${UI.accent_color}`
	)
	let html = `
<header class="mdui-appbar mdui-color-theme">
  <div id="nav" class="mdui-toolbar mdui-container${
		UI.fluid_navigation_bar ? '-fluid' : ''
	} ${UI.dark_mode ? 'mdui-text-color-white-text' : ''}">
  </div>
</header>
<div id="content" class="mdui-container">
</div>
	`
	$('body').html(html)
}

const Os = {
	isWindows: navigator.platform.toUpperCase().includes('WIN'), // .includes
	isMac: navigator.platform.toUpperCase().includes('MAC'),
	isMacLike: /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform),
	isIos: /(iPhone|iPod|iPad)/i.test(navigator.platform),
	isMobile: /Android|webOS|iPhone|iPad|iPod|iOS|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	),
}

function getDocumentHeight() {
	let D = document
	return Math.max(
		D.body.scrollHeight,
		D.documentElement.scrollHeight,
		D.body.offsetHeight,
		D.documentElement.offsetHeight,
		D.body.clientHeight,
		D.documentElement.clientHeight
	)
}

function render(path) {
	if (path.indexOf('?') > 0) {
		path = path.substr(0, path.indexOf('?'))
	}
	title(path)
	nav(path)
	// .../0: 這種
	let reg = /\/\d+:$/g
	if (window.MODEL.is_search_page) {
		// 用來存儲一些滾動事件的狀態
		window.scroll_status = {
			// 滾動事件是否已經綁定
			event_bound: false,
			// "滾動到底部，正在載入更多數據" 事件的鎖
			loading_lock: false,
		}
		render_search_result_list()
	} else if (path.match(reg) || path.substr(-1) == '/') {
		// 用來存儲一些滾動事件的狀態
		window.scroll_status = {
			// 滾動事件是否已經綁定
			event_bound: false,
			// "滾動到底部，正在載入更多數據" 事件的鎖
			loading_lock: false,
		}
		list(path)
	} else {
		file(path)
	}
}

// 渲染 title
function title(path) {
	path = decodeURI(path)
	let cur = window.current_drive_order || 0
	let drive_name = window.drive_names[cur]
	path = path.replace(`/${cur}:`, '')
	$('title').html(`${document.siteName} - ${path}`)
	let model = window.MODEL
	if (model.is_search_page)
		$('title').html(
			`${document.siteName} - ${drive_name} - 搜尋 ${model.q} 的結果`
		)
	else $('title').html(`${document.siteName} - ${drive_name} - ${path}`)
	$('title').html(`${document.siteName}`)
}

// 渲染導航欄
function nav(path) {
	let model = window.MODEL
	let html = ''
	let cur = window.current_drive_order || 0
	html += `<a href="//nekochan.ml/0:/" class="mdui-typo-headline folder">${document.siteName}</a>`
	let names = window.drive_names
	/*html += `<button class="mdui-btn mdui-btn-raised" mdui-menu="{target: '#drive-names'}"><i class="mdui-icon mdui-icon-left material-icons">share</i> ${names[cur]}</button>`;
  html += `<ul class="mdui-menu" id="drive-names" style="transform-origin: 0px 0px; position: fixed;">`;
  names.forEach((name, idx) => {
      html += `<li class="mdui-menu-item ${(idx === cur) ? 'mdui-list-item-active' : ''} "><a href="/${idx}:/" class="mdui-ripple">${name}</a></li>`;
  });
  html += `</ul>`;*/

	// 修改為 select
	html += `<select class="mdui-select" onchange="window.location.href=this.value" mdui-select style="overflow:visible;padding-left:8px;padding-right:8px">`
	names.forEach((name, idx) => {
		html += `<option value="/${idx}:/"  ${
			idx === cur ? 'selected="selected"' : ''
		} >${name}</option>`
	})
	html += `</select>`

	if (!model.is_search_page) {
		let arr = path.trim('/').split('/')
		let p = '/'
		if (arr.length > 1) {
			arr.shift()
			for (i in arr) {
				let n = arr[i]
				n = decodeURI(n)
				p += `${n}/`
				if (n == '') {
					break
				}
				html += `<i class="mdui-icon material-icons mdui-icon-dark folder" style="margin:0;">chevron_right</i><a class="folder" href="/${cur}:${p}">${n}</a>`
			}
		}
	}
	let search_text = model.is_search_page ? model.q || '' : ''
	const isMobile = Os.isMobile
	let search_bar = `<div class="mdui-toolbar-spacer"></div>
        <div id="search_bar" class="mdui-textfield mdui-textfield-expandable mdui-float-right ${
					model.is_search_page ? 'mdui-textfield-expanded' : ''
				}" style="max-width:${isMobile ? 300 : 400}px">
            <button class="mdui-textfield-icon mdui-btn mdui-btn-icon" onclick="if($('#search_bar').hasClass('mdui-textfield-expanded') && $('#search_bar_form>input').val()) $('#search_bar_form').submit();">
                <i class="mdui-icon material-icons">search</i>
            </button>
            <form id="search_bar_form" method="get" action="/${cur}:search">
            <input class="mdui-textfield-input" type="text" name="q" autocomplete ="off" placeholder="輸入你想搜尋的內容" value="${search_text}"/>
            </form>
            <button class="mdui-textfield-close mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">close</i></button>
        </div>`

	// html += `<div class="mdui-toolbar-spacer"></div>
	// <a href="//twitter.com/TW_NEKO_CHAN" target="_blank" class="mdui-btn mdui-btn-icon mdui-ripple mdui-ripple-white" mdui-tooltip="{content: 'Twitter'}" alt="Twitter">
	//   <img src="//cdn.jsdelivr.net/gh/NekoChanTaiwan/NekoChan-Open-Data/images/twitter.svg" width="30" height="45" />
	// </a>
	// <a href="${
	// 	window.location
	// }}" class="mdui-btn mdui-btn-icon mdui-ripple mdui-ripple-white" mdui-tooltip="{content: '重新整理'}" alt="重新整理">
	//   <img src="//cdn.jsdelivr.net/gh/NekoChanTaiwan/NekoChan-Open-Data/images/circular-arrow.svg" width="30" height="45" />
	// </a>`

	// 個人盤 或 團隊盤
	if (model.root_type < 2) {
		// 顯示搜索框
		html += search_bar
	}

	$('#nav').html(html)
	mdui.mutation()
	mdui.updateTextFields()
}

/**
 * 發起列目錄的 POST 請求
 * @param path Path
 * @param params Form params
 * @param resultCallback Success Result Callback
 * @param authErrorCallback Pass Error Callback
 */
function requestListPath(path, params, resultCallback, authErrorCallback) {
	let p = {
		password: params['password'] || null,
		page_token: params['page_token'] || null,
		page_index: params['page_index'] || 0,
	}
	$.post(path, p, (data, status) => {
		let res = jQuery.parseJSON(data)
		if (res && res.error && res.error.code == '401') {
			// 密碼驗證失敗
			if (authErrorCallback) authErrorCallback(path)
		} else if (res && res.data) {
			if (resultCallback) resultCallback(res, path, p)
		}
	})
}

/**
 * 搜索 POST 請求
 * @param params Form params
 * @param resultCallback Success callback
 */
function requestSearch(params, resultCallback) {
	let p = {
		q: params['q'] || null,
		page_token: params['page_token'] || null,
		page_index: params['page_index'] || 0,
	}
	$.post(`/${window.current_drive_order}:search`, p, (data, status) => {
		let res = jQuery.parseJSON(data)
		if (res && res.data) {
			if (resultCallback) resultCallback(res, p)
		}
	})
}

// 渲染文件列表
function list(path) {
	let content = `
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
    <div id="count" class="mdui-hidden mdui-center mdui-text-center mdui-m-b-3 mdui-typo-subheading mdui-text-color-blue-grey-500">共 <span class="number"></span> 項<br>NekoChan Open Data<br><a id="back-to-top" href="#">返回頂部</a></div>
	 </div>
	 <div id="readme_md" class="mdui-typo" style="display:none; padding: 20px 0;"></div>
	`
	$('#content').html(content)

	let password = localStorage.getItem(`password${path}`)
	$('#list').html(
		`<div class="mdui-progress"><div class="mdui-progress-indeterminate"></div></div>`
	)
	$('#readme_md').hide().html('')
	$('#head_md').hide().html('')

	/**
	 * 列目錄請求成功返回數據後的回調
	 * @param res 返回的結果(object)
	 * @param path 請求的路徑
	 * @param prevReqParams 請求時所用的參數
	 */
	function successResultCallback(res, path, prevReqParams) {
		// 把 nextPageToken 和 currentPageIndex 暫存在 list元素 中
		$('#list')
			.data('nextPageToken', res['nextPageToken'])
			.data('curPageIndex', res['curPageIndex'])

		// 移除 loading spinner
		$('#spinner').remove()

		if (res['nextPageToken'] === null) {
			// 如果是最後一頁，取消綁定 scroll 事件，重置 scroll_status ，並 append 數據
			$(window).off('scroll')
			window.scroll_status.event_bound = false
			window.scroll_status.loading_lock = false
			append_files_to_list(path, res['data']['files'])
		} else {
			// 如果不是最後一頁，append數據 ，並綁定 scroll 事件（如果還未綁定），更新 scroll_status
			append_files_to_list(path, res['data']['files'])
			if (window.scroll_status.event_bound !== true) {
				// 綁定事件，如果還未綁定
				$(window).on('scroll', function () {
					let scrollTop = $(this).scrollTop()
					let scrollHeight = getDocumentHeight()
					let windowHeight = $(this).height()
					// 滾到底部
					if (
						scrollTop + windowHeight >
						scrollHeight - (Os.isMobile ? 130 : 80)
					) {
						/*
                滾到底部事件觸發時，如果此時已經正在 loading 中，則忽略此次事件；
                否則，去 loading，並占據 loading鎖，表明 正在 loading 中
             */
						if (window.scroll_status.loading_lock === true) {
							return
						}
						window.scroll_status.loading_lock = true

						// 展示一個 loading spinner
						$(
							`<div id="spinner" class="mdui-spinner mdui-spinner-colorful mdui-center"></div>`
						).insertBefore('#readme_md')
						mdui.updateSpinners()
						// mdui.mutation();

						let $list = $('#list')
						requestListPath(
							path,
							{
								password: prevReqParams['password'],
								page_token: $list.data('nextPageToken'),
								// 請求下一頁
								page_index: $list.data('curPageIndex') + 1,
							},
							successResultCallback,
							null
						)
					}
				})
				window.scroll_status.event_bound = true
			}
		}

		// loading 成功，並成功渲染了新數據之後，釋放 loading 鎖，以便能继续處理 "滾動到底部" 事件
		if (window.scroll_status.loading_lock === true) {
			window.scroll_status.loading_lock = false
		}
	}

	// 開始從第1頁請求數據
	requestListPath(path, { password }, successResultCallback, (path) => {
		$('#spinner').remove()
		let pass = prompt('目錄加密, 請輸入密碼', '')
		localStorage.setItem(`password${path}`, pass)
		if (pass != null && pass != '') {
			list(path)
		} else {
			history.go(-1)
		}
	})
}

/**
 * 把請求得來的新一頁的數據追加到 list 中
 * @param path 路徑
 * @param files 請求得來的結果
 */
function append_files_to_list(path, files) {
	let $list = $('#list')
	// 是最後一頁數據了嗎？
	let is_lastpage_loaded = null === $list.data('nextPageToken')
	let is_firstpage = '0' == $list.data('curPageIndex')

	let file_count = 0 // 檔案數量

	html = ''
	let targetFiles = []
	for (i in files) {
		// 資料夾
		let item = files[i]
		let p = `${path + item.name}/`
		if (item['size'] == undefined) {
			item['size'] = ''
		}

		item['modifiedTime'] = utc2beijing(item['modifiedTime'])
		item['size'] = formatFileSize(item['size'])
		if (item['mimeType'] == 'application/vnd.google-apps.folder') {
			if (/連載中/.test(item.name)) {
				// 在 class 添加 updating
				html += `<li class="mdui-list-item mdui-ripple"><a href="${p}" class="folder">
					<div class="mdui-col-xs-12 mdui-col-sm-7 mdui-text-truncate updating" title="${item.name}">
					<i class="mdui-icon material-icons">folder_open</i>
					${item.name}
					</div>
					<div class="mdui-col-sm-3 mdui-text-right updating">${item['modifiedTime']}</div>
					<div class="mdui-col-sm-2 mdui-text-right updating">${item['size']}</div>
					</a>
				</li>`
			} else if (/完結/.test(item.name)) {
				// 在 class 添加 finish
				html += `<li class="mdui-list-item mdui-ripple"><a href="${p}" class="folder">
					<div class="mdui-col-xs-12 mdui-col-sm-7 mdui-text-truncate finish" title="${item.name}">
					<i class="mdui-icon material-icons">folder_open</i>
					${item.name}
					</div>
					<div class="mdui-col-sm-3 mdui-text-right finish">${item['modifiedTime']}</div>
					<div class="mdui-col-sm-2 mdui-text-right finish">${item['size']}</div>
					</a>
				</li>`
			} else if (/R18/.test(item.name)) {
				// 在 class 添加 r18
				html += `<li class="mdui-list-item mdui-ripple"><a href="${p}" class="folder">
					<div class="mdui-col-xs-12 mdui-col-sm-7 mdui-text-truncate r18" title="${item.name}">
					<i class="mdui-icon material-icons">folder_open</i>
					${item.name}
					</div>
					<div class="mdui-col-sm-3 mdui-text-right r18">${item['modifiedTime']}</div>
					<div class="mdui-col-sm-2 mdui-text-right r18">${item['size']}</div>
					</a>
				</li>`
			} else {
				html += `<li class="mdui-list-item mdui-ripple"><a href="${p}" class="folder">
					<div class="mdui-col-xs-12 mdui-col-sm-7 mdui-text-truncate" title="${item.name}">
					<i class="mdui-icon material-icons">folder_open</i>
					${item.name}
					</div>
					<div class="mdui-col-sm-3 mdui-text-right">${item['modifiedTime']}</div>
					<div class="mdui-col-sm-2 mdui-text-right">${item['size']}</div>
					</a>
				</li>`
			}
		} else {
			// 檔案
			let p = path + item.name
			const filepath = path + item.name
			let c = 'file'
			// 當載入完最後一頁後，才顯示 README ，否則會影響滾動事件
			if (is_lastpage_loaded && item.name == '!readme.md') {
				get_file(p, item, (data) => {
					markdown('#readme_md', data)
				})
			}
			if (item.name == '!head.md') {
				get_file(p, item, (data) => {
					markdown('#head_md', data)
				})
			}
			let ext = p.split('.').pop().toLowerCase()
			if (
				'|html|php|css|go|java|js|json|txt|sh|md|mp4|webm|avi|bmp|jpg|jpeg|png|gif|m4a|mp3|flac|wav|ogg|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|pdf|'.includes(
					`|${ext}|`
				)
			) {
				targetFiles.push(filepath)
				file_count++ // 檔案數量自增
				p += `?a=view`
				c += ' view'
			}
			html += `<li class="mdui-list-item file mdui-ripple" target="_blank"><a gd-type="${item.mimeType}" href="${p}" class="${c}">
			  <div class="mdui-col-xs-12 mdui-col-sm-7 mdui-text-truncate" title="${item.name}">
			  	${file_count}.
	          <i class="mdui-icon material-icons">insert_drive_file</i>
	            ${item.name}
	          </div>
	          <div class="mdui-col-sm-3 mdui-text-right">${item['modifiedTime']}</div>
	          <div class="mdui-col-sm-2 mdui-text-right">${item['size']}</div>
	          </a>
	      </li>`
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
		let old = localStorage.getItem(path)
		let new_children = targetFiles
		// 第1頁重設；否則追加
		if (!is_firstpage && old) {
			let old_children
			try {
				old_children = JSON.parse(old)
				if (!Array.isArray(old_children)) {
					old_children = []
				}
			} catch (e) {
				old_children = []
			}
			new_children = old_children.concat(targetFiles)
		}

		localStorage.setItem(path, JSON.stringify(new_children))
	}

	// 是第1頁時，去除橫向loading條
	$list.html(($list.data('curPageIndex') == '0' ? '' : $list.html()) + html)
	// 是最後一頁時，統計並顯示出總項目數
	if (is_lastpage_loaded) {
		$('#count')
			.removeClass('mdui-hidden')
			.find('.number')
			.text($list.find('li.mdui-list-item').length)
	}
}

/**
 * 渲染搜索結果列表。有大量重複代碼，但是裡面有不一樣的邏輯，暫時先這樣分開弄吧
 */
function render_search_result_list() {
	let content = `
	<div id="head_md" class="mdui-typo" style="display:none;padding: 20px 0;"></div>
	 <div class="mdui-row"> 
	  <ul class="mdui-list"> 
	   <li class="mdui-list-item th"> 
	    <div class="mdui-col-xs-12 mdui-col-sm-7">
	     文件
	<i class="mdui-icon material-icons icon-sort" data-sort="name" data-order="more">expand_more</i>
	    </div> 
	    <div class="mdui-col-sm-3 mdui-text-right">
	     修改時間
	<i class="mdui-icon material-icons icon-sort" data-sort="date" data-order="downward">expand_more</i>
	    </div> 
	    <div class="mdui-col-sm-2 mdui-text-right">
	     大小
	<i class="mdui-icon material-icons icon-sort" data-sort="size" data-order="downward">expand_more</i>
	    </div> 
	    </li> 
	  </ul> 
	 </div> 
	 <div class="mdui-row"> 
	  <ul id="list" class="mdui-list"> 
	  </ul> 
	  <div id="count" class="mdui-hidden mdui-center mdui-text-center mdui-m-b-3 mdui-typo-subheading mdui-text-color-blue-grey-500">共 <span class="number"></span> 項</div>
	 </div>
	 <div id="readme_md" class="mdui-typo" style="display:none; padding: 20px 0;"></div>
	`
	$('#content').html(content)

	$('#list').html(
		`<div class="mdui-progress"><div class="mdui-progress-indeterminate"></div></div>`
	)
	$('#readme_md').hide().html('')
	$('#head_md').hide().html('')

	/**
	 * 搜索請求成功返回數據後的回調
	 * @param res 返回的結果(object)
	 * @param path 請求的路徑
	 * @param prevReqParams 請求時所用的參數
	 */
	function searchSuccessCallback(res, prevReqParams) {
		// 把 nextPageToken 和 currentPageIndex 暫存在 list元素 中
		$('#list')
			.data('nextPageToken', res['nextPageToken'])
			.data('curPageIndex', res['curPageIndex'])

		// 移除 loading spinner
		$('#spinner').remove()

		if (res['nextPageToken'] === null) {
			// 如果是最後一頁，取消綁定 scroll 事件，重置 scroll_status ，並 append 數據
			$(window).off('scroll')
			window.scroll_status.event_bound = false
			window.scroll_status.loading_lock = false
			append_search_result_to_list(res['data']['files'])
		} else {
			// 如果不是最後一頁，append數據 ，並綁定 scroll 事件（如果還未綁定），更新 scroll_status
			append_search_result_to_list(res['data']['files'])
			if (window.scroll_status.event_bound !== true) {
				// 綁定事件，如果還未綁定
				$(window).on('scroll', function () {
					let scrollTop = $(this).scrollTop()
					let scrollHeight = getDocumentHeight()
					let windowHeight = $(this).height()
					// 滾到底部
					if (
						scrollTop + windowHeight >
						scrollHeight - (Os.isMobile ? 130 : 80)
					) {
						/*
                滾到底部事件觸發時，如果此時已經正在 loading 中，則忽略此次事件；
                否則，去 loading，並占據 loading鎖，表明 正在 loading 中
             */
						if (window.scroll_status.loading_lock === true) {
							return
						}
						window.scroll_status.loading_lock = true

						// 展示一個 loading spinner
						$(
							`<div id="spinner" class="mdui-spinner mdui-spinner-colorful mdui-center"></div>`
						).insertBefore('#readme_md')
						mdui.updateSpinners()
						// mdui.mutation();

						let $list = $('#list')
						requestSearch(
							{
								q: window.MODEL.q,
								page_token: $list.data('nextPageToken'),
								// 請求下一頁
								page_index: $list.data('curPageIndex') + 1,
							},
							searchSuccessCallback
						)
					}
				})
				window.scroll_status.event_bound = true
			}
		}

		// loading 成功，並成功渲染了新數據之後，釋放 loading 鎖，以便能继续處理 "滾動到底部" 事件
		if (window.scroll_status.loading_lock === true) {
			window.scroll_status.loading_lock = false
		}
	}

	// 開始從第1頁請求數據
	requestSearch({ q: window.MODEL.q }, searchSuccessCallback)
}

/**
 * 追加新一頁的搜索結果
 * @param files
 */
function append_search_result_to_list(files) {
	let $list = $('#list')
	// 是最後一頁數據了嗎？
	let is_lastpage_loaded = null === $list.data('nextPageToken')
	// let is_firstpage = '0' == $list.data('curPageIndex');

	html = ''

	for (i in files) {
		let item = files[i]
		if (item['size'] == undefined) {
			item['size'] = ''
		}

		item['modifiedTime'] = utc2beijing(item['modifiedTime'])
		item['size'] = formatFileSize(item['size'])
		if (item['mimeType'] == 'application/vnd.google-apps.folder') {
			html += `<li class="mdui-list-item mdui-ripple"><a id="${item['id']}" onclick="onSearchResultItemClick(this)" class="folder">
	            <div class="mdui-col-xs-12 mdui-col-sm-7 mdui-text-truncate" title="${item.name}">
	            <i class="mdui-icon material-icons">folder_open</i>
	              ${item.name}
	            </div>
	            <div class="mdui-col-sm-3 mdui-text-right">${item['modifiedTime']}</div>
	            <div class="mdui-col-sm-2 mdui-text-right">${item['size']}</div>
	            </a>
	        </li>`
		} else {
			let c = 'file'
			let ext = item.name.split('.').pop().toLowerCase()
			if (
				'|html|php|css|go|java|js|json|txt|sh|md|mp4|webm|avi|bmp|jpg|jpeg|png|gif|m4a|mp3|flac|wav|ogg|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|'.includes(
					`|${ext}|`
				)
			) {
				c += ' view'
			}
			html += `<li class="mdui-list-item file mdui-ripple" target="_blank"><a id="${item['id']}" gd-type="${item.mimeType}" onclick="onSearchResultItemClick(this)" class="${c}">
	          <div class="mdui-col-xs-12 mdui-col-sm-7 mdui-text-truncate" title="${item.name}">
	          <i class="mdui-icon material-icons">insert_drive_file</i>
	            ${item.name}
	          </div>
	          <div class="mdui-col-sm-3 mdui-text-right">${item['modifiedTime']}</div>
	          <div class="mdui-col-sm-2 mdui-text-right">${item['size']}</div>
	          </a>
	      </li>`
		}
	}

	// 是第1頁時，去除橫向loading條
	$list.html(($list.data('curPageIndex') == '0' ? '' : $list.html()) + html)
	// 是最後一頁時，統計並顯示出總項目數
	if (is_lastpage_loaded) {
		$('#count')
			.removeClass('mdui-hidden')
			.find('.number')
			.text($list.find('li.mdui-list-item').length)
	}
}

/**
 * 搜索結果項目點擊事件
 * @param a_ele 點擊的元素
 */
function onSearchResultItemClick(a_ele) {
	let me = $(a_ele)
	let can_preview = me.hasClass('view')
	let cur = window.current_drive_order
	let dialog = mdui.dialog({
		title: '',
		content:
			'<div class="mdui-text-center mdui-typo-title mdui-m-b-1">正在獲取路徑...</div><div class="mdui-spinner mdui-spinner-colorful mdui-center"></div>',
		// content: '<div class="mdui-spinner mdui-spinner-colorful mdui-center"></div>',
		history: false,
		modal: true,
		closeOnEsc: true,
	})
	mdui.updateSpinners()

	// 請求獲取路徑
	$.post(`/${cur}:id2path`, { id: a_ele.id }, (data) => {
		if (data) {
			dialog.close()
			let href = `/${cur}:${data}${can_preview ? '?a=view' : ''}`
			dialog = mdui.dialog({
				title: '已成功獲取路徑',
				content: `<a href="${href}">${data}</a>`,
				history: false,
				modal: true,
				closeOnEsc: true,
				buttons: [
					{
						text: '開啟',
						onClick() {
							window.location.href = href
						},
					},
					{
						text: '新分頁中開啟',
						onClick() {
							window.open(href)
						},
					},
					{ text: '取消' },
				],
			})
			return
		}
		dialog.close()
		dialog = mdui.dialog({
			title: '獲取目標路徑失敗',
			content: '該資源可能已經移除，或已移動，請通知 NekoChan#2851 解決。',
			history: false,
			modal: true,
			closeOnEsc: true,
			buttons: [{ text: '確認' }],
		})
	})
}

function get_file(path, file, callback) {
	let key = `file_path_${path}${file['modifiedTime']}`
	let data = localStorage.getItem(key)
	if (data != undefined) {
		return callback(data)
	} else {
		$.get(path, (d) => {
			localStorage.setItem(key, d)
			callback(d)
		})
	}
}

function file(path) {
	let name = path.split('/').pop()
	let ext = name.split('.').pop().toLowerCase().replace(`?a=view`, '')
	if (
		'|mp4|webm|avi|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|'.includes(
			`|${ext}|`
		)
	) {
		return file_video(path)
	}
	if ('|bmp|jpg|jpeg|png|gif|'.includes(`|${ext}|`)) {
		return file_image(path)
	}
}

// Preview Video
function file_video(path) {
	// let notyf = new Notyf()
	let url = decodeURI(window.location.origin + path)
	let encoded_url = url
	const file_name = decodeURI(
		path.slice(path.lastIndexOf('/') + 1, path.length)
	)
	const currentPathname = window.location.pathname
	const lastIndex = currentPathname.lastIndexOf('/')
	const fatherPathname = currentPathname.slice(0, lastIndex + 1)
	let target_children = localStorage.getItem(fatherPathname)
	let targetText = ''
	if (target_children) {
		try {
			target_children = JSON.parse(target_children)
			if (!Array.isArray(target_children)) {
				target_children = []
			}
		} catch (e) {
			console.error(e)
			target_children = []
		}
		if (target_children.length > 0 && target_children.includes(path)) {
			let len = target_children.length
			let cur = target_children.indexOf(path)
			let prev_child = cur - 1 > -1 ? target_children[cur - 1] : null
			let next_child = cur + 1 < len ? target_children[cur + 1] : null
			targetText = `
            <div class="mdui-container">
                <div class="mdui-row-xs-2 mdui-m-b-1">
                    <div class="mdui-col">
                        ${
													prev_child
														? `<button id="leftBtn" data-filepath="${prev_child}" class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple">上一集</button>`
														: `<button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple" disabled>上一集</button>`
												}
                    </div>
                    <div class="mdui-col">
                        ${
													next_child
														? `<button id="rightBtn"  data-filepath="${next_child}" class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple">下一集</button>`
														: `<button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple" disabled>下一集</button>`
												}
                    </div>
                </div>
            </div>
            `
		}
	}

	let playBtn = `<a href="potplayer://${encoded_url}" class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent windows-btn">PotPlayer 串流</a>`
	if (/(Mac)/i.test(navigator.userAgent)) {
		playBtn = `<button class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mac-btn" data-href="iina://open?url=${encoded_url}">IINA 串流</button>`
	}
	if (/(Android)/i.test(navigator.userAgent)) {
		playBtn = `<button class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent android-btn" data-href="intent:${encoded_url}#Intent;package=com.mxtech.videoplayer.pro;S.title=${path};end">MXPlayer Pro 串流</button>`
		playBtn += `<br><button style="margin-top: 15px" class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent android-btn" data-href="intent:${encoded_url}#Intent;package=com.mxtech.videoplayer.ad;S.title=${path};end">MXPlayer Free 串流</button>`
	}
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		let applelink = url.replace(/(^\w+:|^)\/\//, '')
		playBtn = `<a class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent" href="infuse://${applelink}">Infuse 串流</a>`
	}
	playBtn += `<br><a style="margin-top: 15px" href="${encoded_url}" class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent download-btn">直連下載檔案</a>`

	let content = `
<div class="mdui-container-fluid">
    <br>
    <div class="mdui-textfield">
    <label class="mdui-textfield-label mdui-text-color-white">目前檔案：</label>
    <input class="mdui-textfield-input mdui-text-color-white" type="text" value="${file_name}" readonly/>
    </div>
    <div class="mdui-center" id="player"></div>
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
    `
	$('#content').html(content)
	$(document).ready(() => {
		// 當前播放時間
		let currentTime = 0

		// 讀取播放器函式
		let loadVideo = () => {
			// console.log('開始讀取影片')

			let dp = null // 重置 dp 變數

			// DPlayer Script 未正常載入則刷新網頁
			if (!window.DPlayer) {
				window.location.reload() // 重新整理當前網頁
			}

			// DPlayer 參數
			dp = new DPlayer({
				container: $('#player')[0],
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
				highlight: [
					{
						time: 60,
						text: '喵',
					},
				],
			})

			// 跳轉至 currentTime
			// console.log(`已跳轉至 ${currentTime}`)
			dp.seek(currentTime)

			// 影片播放完畢
			dp.on('ended', () => {
				// 退出全螢幕
				dp.fullScreen.cancel('web')
			})

			// 如果影片載入失敗則重新讀取
			dp.on('error', () => {
				// console.log(`當前播放時間: ${dp.video.currentTime}`)
				// 紀錄載入失敗時的播放時間(如果播放時間不等於 0)
				if (dp.video.currentTime != 0) {
					currentTime = dp.video.currentTime // 紀錄載入失敗時的播放時間
					// console.log(`以記錄當前播放時間(error): ${dp.video.currentTime}`)
				}
				loadVideo()
				// console.log('影片載入失敗，已重新讀取。')
			})

			// 紀錄已跳轉的時間
			dp.on('seeked', () => {
				currentTime = dp.video.currentTime
				// console.log(`以記錄當前播放時間(seeked): ${dp.video.currentTime}`)
			})

			// 紀錄正在跳轉的時間
			dp.on('seeking', () => {
				currentTime = dp.video.currentTime
				// console.log(`以記錄當前播放時間(seeking): ${dp.video.currentTime}`)
			})
		}

		// 第一次載入
		loadVideo()
	})

	$('#leftBtn, #rightBtn').click((e) => {
		let target = $(e.target)
		if (['I', 'SPAN'].includes(e.target.nodeName)) {
			target = $(e.target).parent()
		}
		const filepath = target.attr('data-filepath')
		const direction = target.attr('data-direction')
		file(filepath)
	})
}

function file_image(path) {
	let url = decodeURI(window.location.origin + path)
	let content = `
<div class="mdui-container-fluid">
    <br>
    <img class="mdui-img-fluid" src="${url}"/>
  <br>
  <hr>
</div>`
	$('#content').html(content)
}

function utc2beijing(utc_datetime) {
	let T_pos = utc_datetime.indexOf('T')
	let Z_pos = utc_datetime.indexOf('Z')
	let year_month_day = utc_datetime.substr(0, T_pos)
	let hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1)
	let new_datetime = `${year_month_day} ${hour_minute_second}`

	timestamp = new Date(Date.parse(new_datetime))
	timestamp = timestamp.getTime()
	timestamp = timestamp / 1000

	// 增加8個小時
	var unixtimestamp = timestamp + 8 * 60 * 60

	var unixtimestamp = new Date(unixtimestamp * 1000)
	let year = 1900 + unixtimestamp.getYear()
	let month = `0${unixtimestamp.getMonth() + 1}`
	let date = `0${unixtimestamp.getDate()}`
	let hour = `0${unixtimestamp.getHours()}`
	let minute = `0${unixtimestamp.getMinutes()}`
	let second = `0${unixtimestamp.getSeconds()}`
	return `${year}/${month.substring(
		month.length - 2,
		month.length
	)}/${date.substring(date.length - 2, date.length)} ${hour.substring(
		hour.length - 2,
		hour.length
	)}:${minute.substring(minute.length - 2, minute.length)}:${second.substring(
		second.length - 2,
		second.length
	)}`
}

function formatFileSize(bytes) {
	if (bytes >= 1073741824) {
		bytes = `${(bytes / 1073741824).toFixed(2)} GB`
	} else if (bytes >= 1048576) {
		bytes = `${(bytes / 1048576).toFixed(2)} MB`
	} else if (bytes >= 1024) {
		bytes = `${(bytes / 1024).toFixed(2)} KB`
	} else if (bytes > 1) {
		bytes = `${bytes} Bytes`
	} else if (bytes == 1) {
		bytes = `${bytes} Byte`
	} else {
		bytes = ' 資料夾'
	}
	return bytes
}

String.prototype.trim = function (char) {
	if (char) {
		return this.replace(new RegExp(`^\\${char}+|\\${char}+$`, 'g'), '')
		z
	}
	return this.replace(/^\s+|\s+$/g, '')
}

function markdown(el, data) {
	if (window.md == undefined) {
		window.md = window.markdownit()
		markdown(el, data)
	} else {
		let html = md.render(data)
		$(el).show().html(html)
	}
}

window.onpopstate = () => {
	let path = window.location.pathname
	render(path)
}

$(() => {
	init()
	let path = window.location.pathname
	render(path)
})
