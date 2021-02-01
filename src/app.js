// NekoChan Open Data

// 系統識別
const Os = {
	isWindows: navigator.platform.toUpperCase().includes('WIN'), // .includes
	isMac: navigator.platform.toUpperCase().includes('MAC'),
	isMacLike: /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform),
	isIos: /(iPhone|iPod|iPad)/i.test(navigator.platform),
	isMobile: /Android|webOS|iPhone|iPad|iPod|iOS|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	),
}

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
	<div id="folderIMGElement" class="mdui-card" style="position: absolute;max-width: 300px;left: 0px; top: 0px; z-index: 999;">
		<div class="mdui-card-media">
			<img src="//cdn.jsdelivr.net/gh/NekoChanTaiwan/NekoChan-Open-Data@1.9.0.min6/images/image_1.webp">
			<div class="mdui-card-media-covered">
				<div class="mdui-card-primary">
					<div class="mdui-card-primary-title">Title</div>
				</div>
			</div>
		</div>
	</div>
	<div id="folderPath" class="mdui-container"></div>
	<div id="content" class="mdui-container mdui-shadow-16"></div>`
	$('body').html(html)
	// 資料夾預覽圖
	const folderIMGElement = $('#folderIMGElement')
	$(document).mousemove((event) => {
		folderIMGElement.css({'left':`${event.pageX}px`, 'top':`${event.pageY - 250}px`})
	})
	$(".folder").hover(
		function () {
			console.log('show')
			folderIMGElement.show()
		},
		function () {
			console.log('hide')
			folderIMGElement.hide()
		}
	);
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
	html += `<a href="/${cur}:/" class="mdui-typo-headline folder">${document.siteName}</a>`
	// let names = window.drive_names
	/*html += `<button class="mdui-btn mdui-btn-raised" mdui-menu="{target: '#drive-names'}"><i class="mdui-icon mdui-icon-left material-icons">share</i> ${names[cur]}</button>`;
html += `<ul class="mdui-menu" id="drive-names" style="transform-origin: 0px 0px; position: fixed;">`;
names.forEach((name, idx) => {
	html += `<li class="mdui-menu-item ${(idx === cur) ? 'mdui-list-item-active' : ''} "><a href="/${idx}:/" class="mdui-ripple">${name}</a></li>`;
});
html += `</ul>`;*/

	// 修改為 select
	// html += `<select class="mdui-select" onchange="window.location.href=this.value" mdui-select style="overflow:visible;padding-left:8px;padding-right:8px">`
	// names.forEach((name, idx) => {
	// 	html += `<option value="/${idx}:/"  ${
	// 		idx === cur ? 'selected="selected"' : ''
	// 	} >${name}</option>`
	// })
	// html += `</select>`

	let folderPath = `　當前位置： <a class="folder" href="/${cur}:/">主目錄</a>`
	if (!model.is_search_page) {
		// 資料夾路徑
		let arr = path.trim('/').split('/')
		let p = '/'
		if (arr.length > 1) {
			arr.shift()
			for (i in arr) {
				let n = arr[i]
				n = decodeURI(n)
				p += `${n}/`
				// 只顯示資料夾
				if (
					n == '' ||
					/md|mp4|webm|avi|bmp|jpg|jpeg|png|gif|m4a|mp3|flac|wav|ogg|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv/.test(n)
				) {
					break
				}
				folderPath += `<i class="mdui-icon material-icons mdui-icon-dark folder" style="margin:0;">chevron_right</i><a class="folder" href="/${cur}:${p}">${n}</a>`
			}
		}
	}
	$('#folderPath').html(folderPath)

	let search_text = model.is_search_page ? model.q || '' : ''
	const isMobile = Os.isMobile
	let search_bar = `<div class="mdui-toolbar-spacer"></div>
		<div id="search_bar" class="mdui-textfield mdui-textfield-expandable mdui-float-right mdui-textfield-expanded" style="max-width:${
					isMobile ? 300 : 400
				}px">
			<form id="search_bar_form" method="get" action="/${cur}:search">
				<input class="mdui-textfield-input" type="text" name="q" autocomplete ="off" placeholder="搜尋" value="${search_text}"/>
			</form>
			<button class="mdui-textfield-icon mdui-btn mdui-btn-icon" onclick="if($('#search_bar').hasClass('mdui-textfield-expanded') && $('#search_bar_form>input').val()) $('#search_bar_form').submit();">
				<i class="mdui-icon material-icons">search</i>
			</button>
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
				<div class="mdui-col-xs-12 mdui-col-sm-10">
					檔案名稱
					<i class="mdui-icon material-icons icon-sort" data-sort="name" data-order="more">expand_more</i>
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
		<div id="count" class="mdui-hidden mdui-center mdui-text-center mdui-m-b-3 mdui-typo-subheading mdui-text-color-blue-grey-500">共 <span class="number"></span> 項<br>NekoChan Open Data｜Discord：NekoChan#2851<br><a id="back-to-top" href="#">返回頂部</a></div>
	</div>
	<div id="readme_md" class="mdui-typo" style="display:none; padding: 20px 0;"></div>`
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

	let className = ''
	for (i in files) {
		let item = files[i]
		let p = `${path + item.name}/`
		if (item['size'] == undefined) {
			item['size'] = ''
		}

		item['size'] = formatFileSize(item['size'])
		if (item['mimeType'] == 'application/vnd.google-apps.folder') {
			// 資料夾顏色處理
			if (/連載中/.test(item.name)) {
				className = 'updating'
			} else if (/完結/.test(item.name)) {
				className = 'finish'
			} else if (/R18/.test(item.name)) {
				className = 'r18'
			} else {
				className = ''
			}
			html += `<li class="mdui-list-item mdui-ripple mdui-shadow-2 folder"><a href="${p}" class="folder">
				<div class="mdui-col-xs-12 mdui-col-sm-10 mdui-text-truncate ${className}" title="${item.name}">
					<i class="mdui-icon material-icons">folder_open</i>
					${item.name}
					</div>
				<div class="mdui-col-sm-2 mdui-text-right ${className}">${item['size']}</div>
				</a>
			</li>`
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
				continue
			}
			if (item.name == '!head.md') {
				get_file(p, item, (data) => {
					markdown('#head_md', data)
				})
				continue
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
			html += `<li class="mdui-list-item file mdui-ripple mdui-shadow-2" target="_blank"><a gd-type="${item.mimeType}" href="${p}" class="${c}">
				<div class="mdui-col-xs-12 mdui-col-sm-10 mdui-text-truncate" title="${item.name}">
					${file_count}.
					<i class="mdui-icon material-icons">insert_drive_file</i>
					${item.name}
				</div>
				<div class="mdui-col-sm-2 mdui-text-right">${item['size']}</div>
				</a>
			</li>`
		}
	}

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
					<div class="mdui-col-xs-12 mdui-col-sm-10">
						檔案名稱
						<i class="mdui-icon material-icons icon-sort" data-sort="name" data-order="more">expand_more</i>
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
	<div id="count" class="mdui-hidden mdui-center mdui-text-center mdui-m-b-3 mdui-typo-subheading mdui-text-color-blue-grey-500">共 <span class="number"></span> 項<br>NekoChan Open Data｜Discord：NekoChan#2851<br><a id="back-to-top" href="#">返回頂部</a></div>
	</div>
	<div id="readme_md" class="mdui-typo" style="display:none; padding: 20px 0;"></div>`
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

		item['size'] = formatFileSize(item['size'])
		if (item['mimeType'] == 'application/vnd.google-apps.folder') {
			// 資料夾顏色處理
		if (/連載中/.test(item.name)) {
				className = 'updating'
			} else if (/完結/.test(item.name)) {
				className = 'finish'
			} else if (/R18/.test(item.name)) {
				className = 'r18'
			} else {
				className = ''
			}
			html += `<li class="mdui-list-item mdui-ripple mdui-shadow-2 folder"><a id="${item['id']}" onclick="onSearchResultItemClick(this)" class="folder">
					<div class="mdui-col-xs-12 mdui-col-sm-10 mdui-text-truncate ${className}" title="${item.name}">
						<i class="mdui-icon material-icons">folder_open</i>
						${item.name}
					</div>
					<div class="mdui-col-sm-2 mdui-text-right" ${className}>${item['size']}</div>
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
			html += `<li class="mdui-list-item file mdui-ripple mdui-shadow-2" target="_blank"><a id="${item['id']}" gd-type="${item.mimeType}" onclick="onSearchResultItemClick(this)" class="${c}">
					<div class="mdui-col-xs-12 mdui-col-sm-10 mdui-text-truncate" title="${item.name}">
						<i class="mdui-icon material-icons">insert_drive_file</i>
						${item.name}
					</div>
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
			window.location.href = `/${cur}:${data}${can_preview ? '?a=view' : ''}`
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
	// let key = `file_path_${path}${file['modifiedTime']}`
	let key = `file_path_${path}`
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
			const btnClass1 = 'mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple'
			targetText = `
			<div class="mdui-container">
				<div class="mdui-row-xs-2 mdui-m-b-1">
					<div class="mdui-col">
						${
													prev_child
														? `<button id="leftBtn" data-filepath="${prev_child}" class="${btnClass1}">上一集</button>`
														: `<button class="${btnClass1}" disabled>上一集</button>`
												}
					</div>
					<div class="mdui-col">
						${
													next_child
														? `<button id="rightBtn"  data-filepath="${next_child}" class="${btnClass1}">下一集</button>`
														: `<button class="${btnClass1}" disabled>下一集</button>`
												}
					</div>
				</div>
			</div>
			`
		}
	}

	// 按鈕樣式
	const btnClass2 = 'mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent'
	// WIN 串流播放器
	let playBtn = `<a href="potplayer://${encoded_url}" class="${btnClass2} windows-btn">PotPlayer 串流</a>`
	// 進度條預覽圖切換元素
	let previewSwitchElement = ''
	// 系統檢測
	if (!Os.isMobile) {
		// MAC 串流播放器
		if (/(Mac)/i.test(navigator.userAgent)) {
			playBtn = `<button class="${btnClass2} mac-btn" data-href="iina://open?url=${encoded_url}">IINA 串流</button>`
		}
		// 進度條預覽圖 初始化參數
		if (localStorage.getItem('previewSwitch') == null) {
			localStorage.setItem('previewSwitch', 'false')
		}
		// 進度條預覽圖 元素判斷
		if (localStorage.getItem('previewSwitch') == 'false') {
			previewSwitchElement = `<input id="previewSwitch" type="checkbox"/>`
		} else if (localStorage.getItem('previewSwitch') == 'true') {
			previewSwitchElement = `<input id="previewSwitch" type="checkbox" checked/>`
		}
	} else {
		// 移動端串流播放器
		if (/(Android)/i.test(navigator.userAgent)) {
			playBtn = `<button class="${btnClass2} android-btn" data-href="intent:${encoded_url}#Intent;package=com.mxtech.videoplayer.pro;S.title=${path};end">MXPlayer Pro 串流</button>`
			playBtn += `<button style="left: 15px" class="${btnClass2} android-btn" data-href="intent:${encoded_url}#Intent;package=com.mxtech.videoplayer.ad;S.title=${path};end">MXPlayer Free 串流</button>`
		} else if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
			let applelink = url.replace(/(^\w+:|^)\/\//, '')
			playBtn = `<a class="${btnClass2}" href="infuse://${applelink}">Infuse 串流</a>`
		}
	}
	// 直連下載
	playBtn += `<a style="left: 15px" href="${encoded_url}" class="${btnClass2} download-btn">直連下載檔案</a>`

	let content = `
	<div class="mdui-container-fluid">
		<div class="mdui-textfield">
			<label class="mdui-textfield-label mdui-text-color-white">當前檔案：</label>
			<input class="mdui-textfield-input mdui-text-color-white" type="text" value="${file_name}" readonly/>
		</div>
		<div class="mdui-center" id="player"></div>
		<div id="screenshotPlayer"></div>
		<br>
		${targetText}
	</div>
	<br>
	${playBtn}
	<span id="switchElement" style="float: right">
		<i class="mdui-icon material-icons">ondemand_video</i>
		<span class="mdui-list-item-content">進度條預覽圖</span>
		<label class="mdui-switch">
			${previewSwitchElement}
			<i class="mdui-switch-icon"></i>
		</label>
	</span>
	<div class="mdui-textfield">
		<label class="mdui-textfield-label mdui-text-color-white">注意：若影片沒有畫面，請嘗試播放器串流。或通知 Discord：NekoChan#2851。</label>
	</div>
	<hr>
	</div>
	`
	$('#content').html(content)

	// 移除移動端的 進度條預覽圖 元素
	if (Os.isMobile) {
		$('#switchElement').remove()
	}

	$(document).ready(() => {
		// DPlayer Script 未正常載入則刷新網頁
		if (!window.DPlayer) {
			window.location.reload() // 重新整理當前網頁
		}

		// 進度條預覽圖 點擊事件
		const previewSwitch = $('#previewSwitch')
		previewSwitch.click(() => {
			if (localStorage.getItem('previewSwitch') == 'true') {
				localStorage.setItem('previewSwitch', 'false')
				window.location.reload()
			} else if (localStorage.getItem('previewSwitch') == 'false') {
				localStorage.setItem('previewSwitch', 'true')
				window.location.reload()
			}
		})

		// 主要播放器函式
		const loadMainPlayer = () => {
			let currentTime = 0 // 當前播放時間
			let oldVol = 0.5 // 初始化音量
			let mute = false // 靜音狀態

			let dp = null // 重置變數

			// DPlayer 參數
			dp = new DPlayer({
				container: $('#player')[0],
				theme: '#0080ff',
				autoplay: true,
				lang: 'zh-tw',
				mutex: false,
				volume: 0.5,
				video: {
					url: encoded_url,
					thumbnails:
						'//cdn.jsdelivr.net/gh/NekoChanTaiwan/NekoChan-Open-Data@1.8.6.beta2/images/fake-thumbnails.webp',
				},
				contextmenu: [
					{
						text: 'NekoChan Open Data',
						link: '//nekochan.ml/',
					},
				],
			})

			// 跳轉至 currentTime
			if (currentTime != 0) {
				dp.seek(currentTime)
			}

			// 紀錄已跳轉的時間
			dp.on('seeked', () => {
				currentTime = dp.video.currentTime
			})

			// 紀錄正在跳轉的時間
			dp.on('seeking', () => {
				currentTime = dp.video.currentTime
			})

			// 如果影片載入失敗則重新讀取
			dp.on('error', () => {
				// 紀錄載入失敗時的播放時間(如果播放時間不等於 0)
				if (dp.video.currentTime != 0) {
					currentTime = dp.video.currentTime // 紀錄載入失敗時的播放時間
				}
				loadMainPlayer()
			})

			// 影片播放完畢
			dp.on('ended', () => {
				// 退出全螢幕
				dp.fullScreen.cancel('browser')
			})

			// 播放器載入完成
			dp.on('loadedmetadata', () => {
				const seekTime = dp.video.duration / 10 // 100% / 10 = 10%
				// 鍵盤快捷鍵
				$(window).keyup((event) => {
					if (/Numpad/.test(event.code)) {
						let num = Number(event.code[6])
						dp.seek(seekTime * num) // 數字鍵跳轉
					} else if (/Digit/.test(event.code)) {
						let num = Number(event.code[5])
						dp.seek(seekTime * num) // 上排數字鍵跳轉
					} else if (/Key/.test(event.code)) {
						switch (event.code[3]) {
							case 'M': // 靜音
								if (mute == false) {
									saveOldVol()
									dp.volume(0.0, true, false)
									mute = true
									break
								} else if (mute == true) {
									dp.volume(oldVol, true, false)
									mute = false
									break
								}
							case 'X': // 下一集
								$('#rightBtn').click()
								break
							case 'Z': // 上一集
								$('#leftBtn').click()
								break
							case 'F': // 全螢幕
								$('.dplayer-icon.dplayer-full-icon').click()
								break
						}
					}
				})
			})

			// 紀錄當前音量
			const saveOldVol = () => {
				// 直接取兩值（音量）
				// 50% = 0.5
				let currentVol = `${String(
					$('.dplayer-volume-bar-wrap').attr('data-balloon')
				)}` // 假設 5%
				// console.log(`current: ${currentVol}`)
				if (currentVol[3] == '%') {
					// 100%
					oldVol = 1.0
					// console.log(`oldVol: ${oldVol}`)
				} else if (currentVol[2] == '%') {
					// 十位數
					oldVol = Number(`0.${currentVol[0]}`)
					// console.log(`oldVol: ${oldVol}`)
				} else if (currentVol[1] == '%') {
					// 個位數（無視，設定成0.1）
					oldVol = 0.1
					// console.log(`oldVol: ${oldVol}`)
				}
			}
		}
		// 第一次載入主播放器
		loadMainPlayer()

		// =================================================================================
		//						以上為主要播放器 、以下為截圖播放器
		// =================================================================================

		// 讀取截圖播放器
		const loadScreenshotPlayer = () => {
			let moveTimeSec = 0 // 移動時間(數字 - 單位: 秒)
			let oldMoveTimeSec = 0 // 上一次移動時間(數字 - 單位: 秒)
			let range = 5 // 移動時間範圍值
			let temp = null // 格式化變數

			let oldCanvas = $('#player canvas') // 舊畫布(預覽圖)
			const screenshotPlayerElement = $('#screenshotPlayer')[0]
			const barWrap = $('#player .dplayer-bar-wrap') // 進度條
			const parentNode = $('#player .dplayer-bar-preview') // 畫布(預覽圖)父節點
			screenshotPlayerElement.style.display = 'none' // 隱藏播放器

			let screenshotPlayer = null // 重置變數
			screenshotPlayer = new DPlayer({
				// 截圖播放器
				container: screenshotPlayerElement,
				autoplay: true,
				screenshot: true,
				mutex: false,
				video: {
					url: encoded_url,
				},
			})
			screenshotPlayer.volume(0, true, true)
			screenshotPlayer.speed(16) // 嘗試加速讓播放器讀取更多畫面

			// 獲取時間並轉換 函式
			let toSec = (stringTime) => {
				temp = stringTime.split(':')
				if (stringTime.length === 2) {
					// 將字符串轉換成數字(單位:秒)
					moveTimeSec = Number(temp)
				} else if (stringTime.length === 5) {
					moveTimeSec = 60 * Number(temp[0]) + Number(temp[1])
				} else if (stringTime.length === 8) {
					moveTimeSec =
						3600 * Number(temp[0]) + 60 * Number(temp[1]) + Number(temp[2])
				}
				seekScreenshotPlayer() //* 呼叫跳轉函式
			}

			// 跳轉截圖播放器 和 click 函式
			let seekScreenshotPlayer = () => {
				// 目前 range = 5
				// 跳轉截圖播放器（比click更容易觸發，因為讀取畫面有時需要時間）
				if (
					moveTimeSec > oldMoveTimeSec + (range - 3) ||
					moveTimeSec < oldMoveTimeSec - (range - 3)
				) {
					screenshotPlayer.seek(moveTimeSec) // 跳轉到 移動時間(數字 - 單位: 秒)
				}
				// 對截圖按鈕發送click(應該使用幾秒範圍，可以避免過多的click)
				if (
					moveTimeSec > oldMoveTimeSec + range ||
					moveTimeSec < oldMoveTimeSec - range
				) {
					oldCanvas = $('#player canvas')
					if (oldCanvas) {
						parentNode.remove(oldCanvas) // 移除現在的畫布(預覽圖)
					}
					$('#screenshotPlayer .dplayer-camera-icon').click() // 點擊截圖按鈕
					oldMoveTimeSec = moveTimeSec // 紀錄上一次移動時間(數字 - 單位: 秒)
				}
			}

			// 刷新 提示點位置(coding)
			// const highlight = $('#player .dplayer-highlight')
			// screenshotPlayer.on('playing', () => {
			// 	if (screenshotPlayer.video.currentTime > 1) {
			// 		dp.options.highlight[0] = {
			// 			text: '預覽圖進度',
			// 			time: screenshotPlayer.video.currentTime,
			// 		}
			// 	}
			// 	barWrap.remove(highlight) // 刪除提示點
			// 	let style = (dp.options.highlight[0].time / dp.video.duration) * 100 // 位置
			// 	barWrap.append(`<p class="dplayer-highlight" style="left: ${style}%"><spa class="dplayer-highlight-text">${dp.options.highlight[0].text}</span></p>`)
			// 	console.log(dp.options.highlight)
			// })

			// 滑鼠事件
			barWrap.mousemove(() => {
				toSec($('.dplayer-bar-time').html())
			})

			// 如果影片載入失敗則重新讀取
			screenshotPlayer.on('error', () => {
				loadScreenshotPlayer()
			})
		}

		// 當系統是電腦時 和 進度條預覽必須啟動 才使用截圖播放器
		if (
			/(WIN|Mac)/i.test(navigator.userAgent) &&
			localStorage.getItem('previewSwitch') == 'true'
		) {
			loadScreenshotPlayer() // 第一次載入截圖播放器
		}
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
	if (!window.markdownit) {
		window.location.reload()
	}
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
