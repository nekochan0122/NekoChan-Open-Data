const authConfig = {
	siteName: 'NekoChan Open Data',
	version: '',
	client_id: '',
	client_secret: '',
	refresh_token: '',
	/**
	 * 設置要顯示的多個雲端硬碟；按格式添加多個
	 * [id]: 可以是 團隊盤id、子文件夾id、或者"root"（代表個人盤根目錄）
	 * [name]: 顯示的名稱
	 * [user]: Basic Auth 的使用者名稱
	 * [pass]: Basic Auth 的密碼
	 * [protect_file_link]: Basic Auth 是否用於保護文件連結，預設值（不設置時）為 false，即不保護文件連結（方便 直鏈下載/外部播放 等）
	 * 每個盤的 Basic Auth 都可以單獨設置。Basic Auth 默認保護該盤下所有文件夾/子文件夾路徑
	 * 【注意】默認不保護文件連結，這樣可以方便 直鏈下載/外部播放
	 *       如果要保護文件連結，需要將 protect_file_link 設置為 true，此時如果要進行外部播放等操作，需要將 host 替換為 user:pass@host 的 形式
	 * 不需要 Basic Auth 的盤，保持 user 和 pass 同時為空即可。（直接不設置也可以）
	 * 【注意】對於id設置為為子文件夾id的盤將不支持搜尋功能（不影響其他盤）。
	 */
	roots: [
		{
			id: 'root',
			name: '主目錄',
			user: '',
			pass: ''
		},
	],
	/**
	 * 文件列表頁面每頁顯示的數量。【推薦設置值為 100 到 1000 之間】；
	 * 如果設置大於1000，會導致請求 drive api 時出錯；
	 * 如果設置的值過小，會導致文件列表頁面滾動條增量載入（分頁載入）失效；
	 * 此值的另一個作用是，如果目錄內文件數大於此設置值（即需要多頁展示的），將會對首次列目錄結果進行快取。
	 */
	files_list_page_size: 50,
	/**
	 * 搜索結果頁面每頁顯示的數量。【推薦設置值為 50 到 1000 之間】；
	 * 如果設置大於1000，會導致請求 drive api 時出錯；
	 * 如果設置的值過小，會導致搜索結果頁面滾動條增量載入（分頁載入）失效；
	 * 此值的大小影響搜索操作的響應速度。
	 */
	search_result_list_page_size: 50,
	// 確認有 cors 用途的可以開啟
	enable_cors_file_down: false,
	/**
	 * 上面的 basic auth 已經包含了盤內全局保護的功能。所以默認不再去認證 .password 文件內的密碼
	 * 如果在全局認證的基礎上，仍需要給某些目錄單獨進行 .password 文件內的密碼驗證的話，將此选项設置為 true
	 * 【注意】如果開啟了 .password 文件密碼驗證，每次列目錄都會額外增加查詢目錄內 .password 文件是否存在的開銷。
	 */
	enable_password_file_verify: false,
}

/**
 * web ui 設置
 */
const uiConfig = {
	main_color: 'blue',
	accent_color: 'blue',
}

/**
 * global functions
 */
const FUNCS = {
	/**
	 * 轉換成針對Google搜索詞法相對安全的搜索關鍵字
	 */
	formatSearchKeyword: function (keyword) {
		let nothing = ''
		let space = ' '
		if (!keyword) return nothing
		return keyword
			.replace(/(!=)|['"=<>/\\:]/g, nothing)
			.replace(/[,，|(){}]/g, space)
			.trim()
	},
}

/**
 * global consts
 * @type {{folder_mime_type: string, default_file_fields: string, gd_root_type: {share_drive: number, user_drive: number, sub_folder: number}}}
 */
const CONSTS = new (class {
	default_file_fields =
		'parents,id,name,mimeType,modifiedTime,createdTime,fileExtension,size'
	gd_root_type = {
		user_drive: 0,
		share_drive: 1,
		sub_folder: 2,
	}
	folder_mime_type = 'application/vnd.google-apps.folder'
})()

// gd instances
var gds = []

function html(current_drive_order = 0, model = {}) {
	return `
<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no"/>
    <meta name="description" content="NekoChan分享檔案的網站" />
    <meta property="og:title" content="NekoChan Open Data">
    <meta property="og:description" content="NekoChan分享檔案的網站">
    <meta property="og:url" content="//nekochan.ml/">
    <meta property="og:locale" content="zh-Hant-TW">
    <meta property="og:image" content="//cdn.jsdelivr.net/gh/NekoChanTaiwan/NekoChan-Open-Data@master/images/image_0.webp">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="NekoChan Open Data">
    <title>${authConfig.siteName}</title>
    <link rel="shortcut icon" href="//cdn.jsdelivr.net/gh/NekoChanTaiwan/NekoChan-Open-Data@master/images/logo.webp" type="image/x-icon" />
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/mdui/1.0.1/css/mdui.min.css" integrity="sha512-x4mi26uahzsFv2+ZklhOELAiuLt2e+hSxQ/SWbW/FuZWZJSc4Ffb33Al7SmPqXXyZieN2rNxBiDsRqAtGKsxUA==" crossorigin="anonymous" />
    <link rel="preconnect" href="//fonts.gstatic.com">
    <link href="//fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500&family=Noto+Sans+SC:wght@500&family=Noto+Sans+TC:wght@500&display=swap" rel="stylesheet">
    <style>*{font-family:'Noto Sans TC','Noto Sans JP','Noto Sans SC',serif}a{text-decoration:none}a:link{color:rgba(255,255,255,.87)}a:visited{color:rgba(255,255,255,.87)}body{margin:0;padding:0;background:url(//cdn.jsdelivr.net/gh/NekoChanTaiwan/NekoChan-Open-Data@master/images/background_3.webp);background-attachment:fixed;background-repeat:no-repeat;background-position:center center;background-size:cover}#search_bar{max-width:600px}.mdui-theme-primary-blue .mdui-color-theme{background-color:rgb(45 45 45 / 95%)!important}.mdui-appbar{padding-right:8px;padding-left:8px;margin-right:auto;margin-left:auto}.mdui-container,.mdui-textfield-input{color:rgba(255,255,255,.87);background-color:rgb(45 45 45 / 95%)}.updating{color:rgb(251 191 72 / 87%)!important}.finish{color:rgb(255 106 106 / 87%)!important}.r18{color:rgb(249 67 177 / 87%)!important}.mdui-appbar .mdui-toolbar{height:56px;font-size:1px}.mdui-toolbar>*{padding:0 6px;margin:0 2px}.mdui-toolbar>.mdui-typo-headline{padding:0 1pc 0 0}.mdui-toolbar>i{padding:0;opacity:.5}.mdui-toolbar>a:hover,a.active,a.mdui-typo-headline{opacity:1}.mdui-list-item{transition:none}.mdui-list>.th{background-color:initial}.mdui-list-item>a{width:100%;line-height:3pc}.mdui-list-item{margin:2px 0;padding:0}.mdui-toolbar>a:last-child{opacity:1}@media screen and (max-width:980px){#nav-title{display:none}#search_bar{max-width:100%}.mdui-list-item .mdui-text-right{display:none}.mdui-container{width:100%!important;margin:0}.mdui-toolbar>.mdui-typo-headline,.mdui-toolbar>a:last-child,.mdui-toolbar>i:first-child{display:block}}</style>
    <script src="//cdn.jsdelivr.net/gh/NekoChanTaiwan/NekoChan-Open-Data@master/js/jquery-3.5.1.min.js"></script>
    <script src="//cdn.jsdelivr.net/gh/NekoChanTaiwan/NekoChan-Open-Data@master/js/mdui-1.0.1.min.js"></script>
    <script src="//cdn.jsdelivr.net/gh/NekoChanTaiwan/NekoChan-Open-Data@master/js/markdown-it-12.0.4.min.js" async></script>
    <script src="//cdn.jsdelivr.net/gh/NekoChanTaiwan/NekoChan-Open-Data@master/js/DPlayer-1.26.0.min.edit.js" async></script>
    <script>
		window.drive_names = JSON.parse('${JSON.stringify(authConfig.roots.map((it) => it.name))}')
		window.MODEL = JSON.parse('${JSON.stringify(model)}')
		window.current_drive_order = ${current_drive_order}
		window.UI = JSON.parse('${JSON.stringify(uiConfig)}')
    </script>
    <script src="//cdn.jsdelivr.net/gh/NekoChanTaiwan/NekoChan-Open-Data@${authConfig.version}/app.js"></script>
</head>
<body>
</body>
</html>
`
}

addEventListener('fetch', (e) => {
	e.respondWith(handleRequest(e.request))
})

/**
 * Fetch and log a request
 * @param {Request} request
 */
async function handleRequest(request) {
	if (gds.length === 0) {
		for (let i = 0; i < authConfig.roots.length; i++) {
			const gd = new googleDrive(authConfig, i)
			await gd.init()
			gds.push(gd)
		}
		// 這個操作並行，提高效率
		let tasks = []
		gds.forEach((gd) => {
			tasks.push(gd.initRootType())
		})
		for (let task of tasks) {
			await task
		}
	}

	// 從 path 中提取 drive order
	// 並根據 drive order 獲取對應的 gd instance
	let gd,
		url = new URL(request.url),
		path = url.pathname

	/**
	 * 重定向至起始頁
	 * @returns {Response}
	 */
	function redirectToIndexPage() {
		return new Response('', {
			status: 301,
			headers: { Location: `${url.origin}/0:/` },
		})
	}

	if (path == '/') return redirectToIndexPage()
	if (path.toLowerCase() == '/favicon.ico') {
		// 後面可以找一個 favicon
		return new Response('', { status: 404 })
	}

	// 特殊命令格式
	const command_reg = /^\/(?<num>\d+):(?<command>[a-zA-Z0-9]+)$/g
	const match = command_reg.exec(path)
	if (match) {
		const num = match.groups.num
		const order = Number(num)
		if (order >= 0 && order < gds.length) {
			gd = gds[order]
		} else {
			return redirectToIndexPage()
		}
		// basic auth
		for (const r = gd.basicAuthResponse(request); r; ) return r
		const command = match.groups.command
		// 搜索
		if (command === 'search') {
			if (request.method === 'POST') {
				// 搜索結果
				return handleSearch(request, gd)
			} else {
				const params = url.searchParams
				// 搜索頁面
				return new Response(
					html(gd.order, {
						q: params.get('q') || '',
						is_search_page: true,
						root_type: gd.root_type,
					}),
					{
						status: 200,
						headers: { 'Content-Type': 'text/html; charset=utf-8' },
					}
				)
			}
		} else if (command === 'id2path' && request.method === 'POST') {
			return handleId2Path(request, gd)
		}
	}

	// 期望的 path 格式
	const common_reg = /^\/\d+:\/.*$/g
	try {
		if (!path.match(common_reg)) {
			return redirectToIndexPage()
		}
		let split = path.split('/'),
			order = Number(split[1].slice(0, -1))
		if (order >= 0 && order < gds.length) {
			gd = gds[order]
		} else {
			return redirectToIndexPage()
		}
	} catch (e) {
		return redirectToIndexPage()
	}

	// basic auth
	// for (const r = gd.basicAuthResponse(request); r;) return r;
	const basic_auth_res = gd.basicAuthResponse(request)

	path = path.replace(gd.url_path_prefix, '') || '/'
	if (request.method == 'POST') {
		return basic_auth_res || apiRequest(request, gd)
	}

	let action = url.searchParams.get('a')

	if (path.substr(-1) == '/' || action != null) {
		return (
			basic_auth_res ||
			new Response(html(gd.order, { root_type: gd.root_type }), {
				status: 200,
				headers: { 'Content-Type': 'text/html; charset=utf-8' },
			})
		)
	} else {
		if (path.split('/').pop().toLowerCase() == '.password') {
			return basic_auth_res || new Response('', { status: 404 })
		}
		let file = await gd.file(path)
		let range = request.headers.get('Range')
		const inline_down = 'true' === url.searchParams.get('inline')
		if (gd.root.protect_file_link && basic_auth_res) return basic_auth_res
		return gd.down(file.id, range, inline_down)
	}
}

async function apiRequest(request, gd) {
	let url = new URL(request.url)
	let path = url.pathname
	path = path.replace(gd.url_path_prefix, '') || '/'

	let option = { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }

	if (path.substr(-1) == '/') {
		let form = await request.formData()
		// 這樣可以提升首次列目錄時的速度。缺點是，如果password驗證失敗，也依然會產生列目錄的開銷
		let deferred_list_result = gd.list(
			path,
			form.get('page_token'),
			Number(form.get('page_index'))
		)

		// check .password file, if `enable_password_file_verify` is true
		if (authConfig['enable_password_file_verify']) {
			let password = await gd.password(path)
			// console.log("dir password", password);
			if (password && password.replace('\n', '') !== form.get('password')) {
				let html = `{"error": {"code": 401,"message": "password error."}}`
				return new Response(html, option)
			}
		}

		let list_result = await deferred_list_result
		return new Response(JSON.stringify(list_result), option)
	} else {
		let file = await gd.file(path)
		let range = request.headers.get('Range')
		return new Response(JSON.stringify(file))
	}
}

// 處理 search
async function handleSearch(request, gd) {
	const option = {
		status: 200,
		headers: { 'Access-Control-Allow-Origin': '*' },
	}
	let form = await request.formData()
	let search_result = await gd.search(
		form.get('q') || '',
		form.get('page_token'),
		Number(form.get('page_index'))
	)
	return new Response(JSON.stringify(search_result), option)
}

/**
 * 處理 id2path
 * @param request 需要 id 參數
 * @param gd
 * @returns {Promise<Response>} 【注意】如果從前台接收的id代表的項目不在目標gd盤下，那麼response會返回給前台一個空字串""
 */
async function handleId2Path(request, gd) {
	const option = {
		status: 200,
		headers: { 'Access-Control-Allow-Origin': '*' },
	}
	let form = await request.formData()
	let path = await gd.findPathById(form.get('id'))
	return new Response(path || '', option)
}

class googleDrive {
	constructor(authConfig, order) {
		// 每個盤對應一個order，對應一個gd實例
		this.order = order
		this.root = authConfig.roots[order]
		this.root.protect_file_link = this.root.protect_file_link || false
		this.url_path_prefix = `/${order}:`
		this.authConfig = authConfig
		// TODO: 這些快取的失效刷新策略，後期可以制定一下
		// path id
		this.paths = []
		// path file
		this.files = []
		// path pass
		this.passwords = []
		// id <-> path
		this.id_path_cache = {}
		this.id_path_cache[this.root['id']] = '/'
		this.paths['/'] = this.root['id']
		/*if (this.root['pass'] != "") {
      this.passwords['/'] = this.root['pass'];
    }*/
		// this.init();
	}

	/**
	 * 初次授權；然後獲取 user_drive_real_root_id
	 * @returns {Promise<void>}
	 */
	async init() {
		await this.accessToken()
		/*await (async () => {
        // 只獲取1次
        if (authConfig.user_drive_real_root_id) return;
        const root_obj = await (gds[0] || this).findItemById('root');
        if (root_obj && root_obj.id) {
            authConfig.user_drive_real_root_id = root_obj.id
        }
    })();*/
		// 等待 user_drive_real_root_id ，只獲取1次
		if (authConfig.user_drive_real_root_id) return
		const root_obj = await (gds[0] || this).findItemById('root')
		if (root_obj && root_obj.id) {
			authConfig.user_drive_real_root_id = root_obj.id
		}
	}

	/**
	 * 獲取根目錄類型，設置到 root_type
	 * @returns {Promise<void>}
	 */
	async initRootType() {
		const root_id = this.root['id']
		const types = CONSTS.gd_root_type
		if (root_id === 'root' || root_id === authConfig.user_drive_real_root_id) {
			this.root_type = types.user_drive
		} else {
			const obj = await this.getShareDriveObjById(root_id)
			this.root_type = obj ? types.share_drive : types.sub_folder
		}
	}

	/**
	 * Returns a response that requires authorization, or null
	 * @param request
	 * @returns {Response|null}
	 */
	basicAuthResponse(request) {
		const user = this.root.user || '',
			pass = this.root.pass || '',
			_401 = new Response('Unauthorized', {
				headers: {
					'WWW-Authenticate': `Basic realm="goindex:drive:${this.order}"`,
				},
				status: 401,
			})
		if (user || pass) {
			const auth = request.headers.get('Authorization')
			if (auth) {
				try {
					const [received_user, received_pass] = atob(
						auth.split(' ').pop()
					).split(':')
					return received_user === user && received_pass === pass ? null : _401
				} catch (e) {}
			}
		} else return null
		return _401
	}

	async down(id, range = '', inline = false) {
		let url = `https://www.googleapis.com/drive/v3/files/${id}?alt=media`
		let requestOption = await this.requestOption()
		requestOption.headers['Range'] = range
		let res = await fetch(url, requestOption)
		const { headers } = (res = new Response(res.body, res))
		this.authConfig.enable_cors_file_down &&
			headers.append('Access-Control-Allow-Origin', '*')
		inline === true && headers.set('Content-Disposition', 'inline')
		return res
	}

	async file(path) {
		if (typeof this.files[path] == 'undefined') {
			this.files[path] = await this._file(path)
		}
		return this.files[path]
	}

	async _file(path) {
		let arr = path.split('/')
		let name = arr.pop()
		name = decodeURIComponent(name).replace(/\'/g, "\\'")
		let dir = arr.join('/') + '/'
		// console.log(name, dir);
		let parent = await this.findPathId(dir)
		// console.log(parent);
		let url = 'https://www.googleapis.com/drive/v3/files'
		let params = { includeItemsFromAllDrives: true, supportsAllDrives: true }
		params.q = `'${parent}' in parents and name = '${name}' and trashed = false`
		params.fields =
			'files(id, name, mimeType, size ,createdTime, modifiedTime, iconLink, thumbnailLink)'
		url += '?' + this.enQuery(params)
		let requestOption = await this.requestOption()
		let response = await fetch(url, requestOption)
		let obj = await response.json()
		// console.log(obj);
		return obj.files[0]
	}

	// 通過reqeust cache 來快取
	async list(path, page_token = null, page_index = 0) {
		if (this.path_children_cache == undefined) {
			// { <path> :[ {nextPageToken:'',data:{}}, {nextPageToken:'',data:{}} ...], ...}
			this.path_children_cache = {}
		}

		if (
			this.path_children_cache[path] &&
			this.path_children_cache[path][page_index] &&
			this.path_children_cache[path][page_index].data
		) {
			let child_obj = this.path_children_cache[path][page_index]
			return {
				nextPageToken: child_obj.nextPageToken || null,
				curPageIndex: page_index,
				data: child_obj.data,
			}
		}

		let id = await this.findPathId(path)
		let result = await this._ls(id, page_token, page_index)
		let data = result.data
		// 對有多頁的，進行快取
		if (result.nextPageToken && data.files) {
			if (!Array.isArray(this.path_children_cache[path])) {
				this.path_children_cache[path] = []
			}
			this.path_children_cache[path][Number(result.curPageIndex)] = {
				nextPageToken: result.nextPageToken,
				data: data,
			}
		}

		return result
	}

	async _ls(parent, page_token = null, page_index = 0) {
		// console.log("_ls", parent);

		if (parent == undefined) {
			return null
		}
		let obj
		let params = { includeItemsFromAllDrives: true, supportsAllDrives: true }
		params.q = `'${parent}' in parents and trashed = false AND name !='.password'`
		params.orderBy = 'name_natural,folder,modifiedTime desc'
		params.fields =
			'nextPageToken, files(id, name, mimeType, size , modifiedTime)'
		params.pageSize = this.authConfig.files_list_page_size

		if (page_token) {
			params.pageToken = page_token
		}
		let url = 'https://www.googleapis.com/drive/v3/files'
		url += '?' + this.enQuery(params)
		let requestOption = await this.requestOption()
		let response = await fetch(url, requestOption)
		obj = await response.json()

		return {
			nextPageToken: obj.nextPageToken || null,
			curPageIndex: page_index,
			data: obj,
		}

		/*do {
        if (pageToken) {
            params.pageToken = pageToken;
        }
        let url = 'https://www.googleapis.com/drive/v3/files';
        url += '?' + this.enQuery(params);
        let requestOption = await this.requestOption();
        let response = await fetch(url, requestOption);
        obj = await response.json();
        files.push(...obj.files);
        pageToken = obj.nextPageToken;
    } while (pageToken);*/
	}

	async password(path) {
		if (this.passwords[path] !== undefined) {
			return this.passwords[path]
		}

		// console.log("load", path, ".password", this.passwords[path]);

		let file = await this.file(path + '.password')
		if (file == undefined) {
			this.passwords[path] = null
		} else {
			let url = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`
			let requestOption = await this.requestOption()
			let response = await this.fetch200(url, requestOption)
			this.passwords[path] = await response.text()
		}

		return this.passwords[path]
	}

	/**
	 * 通過 id 獲取 share drive 訊息
	 * @param any_id
	 * @returns {Promise<null|{id}|any>} 任何非正常情況都返回 null
	 */
	async getShareDriveObjById(any_id) {
		if (!any_id) return null
		if ('string' !== typeof any_id) return null

		let url = `https://www.googleapis.com/drive/v3/drives/${any_id}`
		let requestOption = await this.requestOption()
		let res = await fetch(url, requestOption)
		let obj = await res.json()
		if (obj && obj.id) return obj

		return null
	}

	/**
	 * 搜索
	 * @returns {Promise<{data: null, nextPageToken: null, curPageIndex: number}>}
	 */
	async search(origin_keyword, page_token = null, page_index = 0) {
		const types = CONSTS.gd_root_type
		const is_user_drive = this.root_type === types.user_drive
		const is_share_drive = this.root_type === types.share_drive

		const empty_result = {
			nextPageToken: null,
			curPageIndex: page_index,
			data: null,
		}

		if (!is_user_drive && !is_share_drive) {
			return empty_result
		}
		let keyword = FUNCS.formatSearchKeyword(origin_keyword)
		if (!keyword) {
			// 關鍵字為空，返回
			return empty_result
		}
		let words = keyword.split(/\s+/)
		let name_search_str = `name contains '${words.join(
			"' AND name contains '"
		)}'`

		// corpora 為 user 是個人盤 ，為 drive 是團隊盤。配合 driveId
		let params = {}
		if (is_user_drive) {
			params.corpora = 'user'
		}
		if (is_share_drive) {
			params.corpora = 'drive'
			params.driveId = this.root.id
			// This parameter will only be effective until June 1, 2020. Afterwards shared drive items will be included in the results.
			params.includeItemsFromAllDrives = true
			params.supportsAllDrives = true
		}
		if (page_token) {
			params.pageToken = page_token
		}
		params.q = `trashed = false AND name !='.password' AND (${name_search_str})`
		params.fields =
			'nextPageToken, files(id, name, mimeType, size , modifiedTime)'
		params.pageSize = this.authConfig.search_result_list_page_size
		params.orderBy = 'folder,name_natural,modifiedTime desc'

		let url = 'https://www.googleapis.com/drive/v3/files'
		url += '?' + this.enQuery(params)
		// console.log(params)
		let requestOption = await this.requestOption()
		let response = await fetch(url, requestOption)
		let res_obj = await response.json()

		return {
			nextPageToken: res_obj.nextPageToken || null,
			curPageIndex: page_index,
			data: res_obj,
		}
	}

	/**
	 * 一層一層的向上獲取這個文件或文件夾的上級文件夾的 file 對象。注意：會很慢！！！
	 * 最多向上尋找到當前 gd 對象的根目錄 (root id)
	 * 只考慮一條單獨的向上鏈。
	 * 【注意】如果此id代表的項目不在目標gd盤下，那麼此函數會返回null
	 *
	 * @param child_id
	 * @param contain_myself
	 * @returns {Promise<[]>}
	 */
	async findParentFilesRecursion(child_id, contain_myself = true) {
		const gd = this
		const gd_root_id = gd.root.id
		const user_drive_real_root_id = authConfig.user_drive_real_root_id
		const is_user_drive = gd.root_type === CONSTS.gd_root_type.user_drive

		// 自下向上查詢的終點目標id
		const target_top_id = is_user_drive ? user_drive_real_root_id : gd_root_id
		const fields = CONSTS.default_file_fields

		// [{},{},...]
		const parent_files = []
		let meet_top = false

		async function addItsFirstParent(file_obj) {
			if (!file_obj) return
			if (!file_obj.parents) return
			if (file_obj.parents.length < 1) return

			// ['','',...]
			let p_ids = file_obj.parents
			if (p_ids && p_ids.length > 0) {
				// its first parent
				const first_p_id = p_ids[0]
				if (first_p_id === target_top_id) {
					meet_top = true
					return
				}
				const p_file_obj = await gd.findItemById(first_p_id)
				if (p_file_obj && p_file_obj.id) {
					parent_files.push(p_file_obj)
					await addItsFirstParent(p_file_obj)
				}
			}
		}

		const child_obj = await gd.findItemById(child_id)
		if (contain_myself) {
			parent_files.push(child_obj)
		}
		await addItsFirstParent(child_obj)

		return meet_top ? parent_files : null
	}

	/**
	 * 獲取相對於本盤根目錄的path
	 * @param child_id
	 * @returns {Promise<string>} 【注意】如果此id代表的項目不在目標gd盤下，那麼此方法會返回空字串""
	 */
	async findPathById(child_id) {
		if (this.id_path_cache[child_id]) {
			return this.id_path_cache[child_id]
		}

		const p_files = await this.findParentFilesRecursion(child_id)
		if (!p_files || p_files.length < 1) return ''

		let cache = []
		// 把查出來的每一級的path和id都快取一下
		p_files.forEach((value, idx) => {
			const is_folder =
				idx === 0 ? p_files[idx].mimeType === CONSTS.folder_mime_type : true
			let path =
				'/' +
				p_files
					.slice(idx)
					.map((it) => it.name)
					.reverse()
					.join('/')
			if (is_folder) path += '/'
			cache.push({ id: p_files[idx].id, path: path })
		})

		cache.forEach((obj) => {
			this.id_path_cache[obj.id] = obj.path
			this.paths[obj.path] = obj.id
		})

		/*const is_folder = p_files[0].mimeType === CONSTS.folder_mime_type;
    let path = '/' + p_files.map(it => it.name).reverse().join('/');
    if (is_folder) path += '/';*/

		return cache[0].path
	}

	// 根據id獲取file item
	async findItemById(id) {
		const is_user_drive = this.root_type === CONSTS.gd_root_type.user_drive
		let url = `https://www.googleapis.com/drive/v3/files/${id}?fields=${
			CONSTS.default_file_fields
		}${is_user_drive ? '' : '&supportsAllDrives=true'}`
		let requestOption = await this.requestOption()
		let res = await fetch(url, requestOption)
		return await res.json()
	}

	async findPathId(path) {
		let c_path = '/'
		let c_id = this.paths[c_path]

		let arr = path.trim('/').split('/')
		for (let name of arr) {
			c_path += name + '/'

			if (typeof this.paths[c_path] == 'undefined') {
				let id = await this._findDirId(c_id, name)
				this.paths[c_path] = id
			}

			c_id = this.paths[c_path]
			if (c_id == undefined || c_id == null) {
				break
			}
		}
		// console.log(this.paths);
		return this.paths[path]
	}

	async _findDirId(parent, name) {
		name = decodeURIComponent(name).replace(/\'/g, "\\'")

		// console.log("_findDirId", parent, name);

		if (parent == undefined) {
			return null
		}

		let url = 'https://www.googleapis.com/drive/v3/files'
		let params = { includeItemsFromAllDrives: true, supportsAllDrives: true }
		params.q = `'${parent}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = '${name}'  and trashed = false`
		params.fields = 'nextPageToken, files(id, name, mimeType)'
		url += '?' + this.enQuery(params)
		let requestOption = await this.requestOption()
		let response = await fetch(url, requestOption)
		let obj = await response.json()
		if (obj.files[0] == undefined) {
			return null
		}
		return obj.files[0].id
	}

	async accessToken() {
		console.log('accessToken')
		if (
			this.authConfig.expires == undefined ||
			this.authConfig.expires < Date.now()
		) {
			const obj = await this.fetchAccessToken()
			if (obj.access_token != undefined) {
				this.authConfig.accessToken = obj.access_token
				this.authConfig.expires = Date.now() + 3500 * 1000
			}
		}
		return this.authConfig.accessToken
	}

	async fetchAccessToken() {
		console.log('fetchAccessToken')
		const url = 'https://www.googleapis.com/oauth2/v4/token'
		const headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
		}
		const post_data = {
			client_id: this.authConfig.client_id,
			client_secret: this.authConfig.client_secret,
			refresh_token: this.authConfig.refresh_token,
			grant_type: 'refresh_token',
		}

		let requestOption = {
			method: 'POST',
			headers: headers,
			body: this.enQuery(post_data),
		}

		const response = await fetch(url, requestOption)
		return await response.json()
	}

	async fetch200(url, requestOption) {
		let response
		for (let i = 0; i < 3; i++) {
			response = await fetch(url, requestOption)
			console.log(response.status)
			if (response.status != 403) {
				break
			}
			await this.sleep(800 * (i + 1))
		}
		return response
	}

	async requestOption(headers = {}, method = 'GET') {
		const accessToken = await this.accessToken()
		headers['authorization'] = 'Bearer ' + accessToken
		return { method: method, headers: headers }
	}

	enQuery(data) {
		const ret = []
		for (let d in data) {
			ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
		}
		return ret.join('&')
	}

	sleep(ms) {
		return new Promise(function (resolve, reject) {
			let i = 0
			setTimeout(function () {
				console.log('sleep' + ms)
				i++
				if (i >= 2) reject(new Error('i>=2'))
				else resolve(i)
			}, ms)
		})
	}
}

String.prototype.trim = function (char) {
	if (char) {
		return this.replace(
			new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'),
			''
		)
	}
	return this.replace(/^\s+|\s+$/g, '')
}
