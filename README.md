# Goindex 自用魔改版

**fork from [yanzai/goindex](https://github.com/yanzai/goindex)**

---

![老婆圖](https://thumbs.gfycat.com/ImpeccableMisguidedIchthyostega-max-14mb.gif)<br>
~~**老婆真可愛**~~

## 預覽
![image1](https://i.imgur.com/0Jp32GQ.png)
![image2](https://i.imgur.com/N61YgfN.png)
![image3](https://i.imgur.com/EUUAMrH.png)

## 使用 & 功能

- 本項目為個人修改使用，無考慮個人化的功能，**若有需求請自行修改。**

#### 使用：
1. 複製最新的 [index.min.js](https://github.com/NekoChanTaiwan/NekoChan-Open-Data/blob/master/index.min.js)（有時候會更新，自己注意。）至你的 Worker。
    - 注意：如果確定要使用 Basic Auth 功能，請使用 [index.js](https://github.com/NekoChanTaiwan/NekoChan-Open-Data/blob/master/index.js)。
2. version 填入 [最新的min版本](https://github.com/NekoChanTaiwan/NekoChan-Open-Data/releases)（例如：2.0.0.min）。
3. client_id, client_secret, refresh_token 和其他 [Goindex項目](https://github.com/search?q=Goindex&type=Repositories) 取得方法相同。

#### 資料夾封面：
- 在該資料夾中放入檔名為 '封面.webp' 即可。<br>
（不帶引號，檔案不會渲染至列表中，也搜尋不到。默認只會預加載 完結、連載中 資料夾的封面。）

#### 彩色資料夾：
- 本項目設定為 完結（紅色）、連載中（黃色）。

#### 播放器快捷鍵（PC）：
- **[ 上下方向鍵 ]**：加／減 音量 10%
- **[ 左右方向鍵 ]**：退／進 進度 5 秒
- **[ 數字鍵 ]**：影片進度跳轉（1=10%, 2=20%...）
- **[ M ]**：靜音、解除靜音
- **[ Z ]**：上一集
- **[ X ]**：下一集
- **[ F ]**：全螢幕、退出全螢幕

## 已知問題
- ~~在安卓系統中，播放器無法正常載入~~

## 更新內容

### 2.0.0
- 修復導航條寬度不一致的問題
- 在移動滾動條時，導航條會緊貼在上方
- 導航條的網站名稱在寬度小於 980px 時隱藏，並改變搜尋欄的寬度至最寬
- 增加導航條的搜尋欄寬度
- 針對 MKV 格式隱藏播放器
- 格式化、簡化 JS

### 1.9.9
- 開啟 嚴格模式（'use strict'）
- 修復 嚴格模式 檢測到的所有錯誤
- 簡化 JS

### 1.9.8
- 修復 在安卓系統無法正常載入播放器的問題

### 1.9.6
- 修復 上下一集因檔名有時無法顯示的問題（感謝 Horis 協助）
- 簡化 JS

### 1.9.5
- 優化 根據預覽圖切換按紐的狀態 顯示播放器預覽圖的元素（之前關閉了，卻繼續顯示黑色元素）
- 修復 DPlayer 快捷鍵 上下一集 問題
- 新增 切換上下一集時 瀏覽器網址欄會隨著改變（代表F5刷新可以正常使用），但不需重新讀取頁面。

### 1.9.4
- 優化 資料夾封面圖（實現同時預加載）
- 修改 當滑鼠游標移動至資料夾上時，顯示資料夾封面圖。

### 1.9.3
- 新增 搜尋列表支援資料夾封面圖
- 修改 當滑鼠游標移動至資料夾上 1.5 -> 1 秒時，顯示資料夾封面圖。

### 1.9.2
- 新增 當滑鼠游標移動至資料夾上 1.5 秒時，將顯示該資料夾的封面（如果有的話）。（封面檔案不會被搜尋到，以及渲染出列表中。）

### 1.9.1
- 修復 搜尋列表 資料夾不會渲染成特殊顏色的問題（例如：完結、連載）
- 修復 移動端 顯示進度條預覽圖切換按紐的問題（原本不應該顯示）
- 簡化 JS

### 1.9.0
- 新增 進度條預覽圖 切換按鈕（預設關閉）
- 隱藏 !head.md, !readme.md 檔案（可搜尋到）
- 修改 項目排序

### 1.8.9
- 新增 DPlayer 快捷鍵
    - 數字鍵（包括上排）：影片進度跳轉（1=10%, 2=20%...）,
    - M：靜音（解除靜音）,
    - Z：上一集,
    - X：下一集,
    - F：全螢幕（退出全螢幕）
- 當前路徑不會顯示檔案，只有資料夾
- 簡化 JS

### 1.8.8
- 更新 MDUI 排版、CSS
- 移除 修改時間
- 移除 不必要的 JS 函式、HTML 元素
- 壓縮 JS Worker

### 1.8.7
- DPlayer 進度條預覽圖 將只在 WIN、MAC 系統下開啟。（考慮到手機或平板用戶的網速）

### 1.8.5
- 優化 DPlayer 進度條預覽圖

### 1.8.4
- 新增 DPlayer 進度條預覽圖（感謝 Horis、mp0530 參與）

（由於是及時獲取畫面，並不像其他影音平台在上傳時就處裡好的。所以還有可優化的空間。）

### 1.8.2
- 更換 背景圖片
- 以顏色區分 連載中、完結、R18 項目

### 1.8.1
- 新增 返回頂部 按鈕
- 修正 檔案順序 不忽略資料夾的問題
- 升級 DPlayer 1.26.0

### 1.8.0
- 關閉 搜尋欄提示內容

### 1.7.9
- 新增 日文字體
- 簡化 JS、CSS
- 修改 每次讀取項目量 999 -> 100

### 1.7.8
- 新增 搜尋欄
- 移除 網址時間戳
- 修復 列表有時為空的問題（狀態碼 500）

### 1.7.2
- 在檔案圖標前方新增順序（不包括資料夾）

### 1.6.8
- 網址後方新增時間戳，確保當前頁面為最新資料
- 簡化JS

### 1.6.3.1
- 更新 背景圖片
- 新增 連結預覽圖片

### 1.6.1
- 新增 Twitter 按鈕
- 新增 重新整理 按鈕

### 1.5.7
- 新增 DPlayer 載入失敗或跳轉 發生載入失敗時，自動重新讀取並跳轉至 上一次的播放時間 或 正在跳轉時間 或 已跳轉的時間

### 1.5.1
- 修復 DPlayer 有時無法正常載入 問題

### 1.4.7
- 改寫了部分語法、以 ES6 語法壓縮檔案
- 新增 網站 icon
- 移除 Twitter 按鈕
- 移除 Donate 按鈕
- 移除 notyf 通知
- 移除 自動切換下一集
- 更新 jQuery 3.5.1
- 更新 mdui 1.0.1
- 更新 markdown-it 12.0.4
- 更新 DPlayer 1.25.1
- 修復 DPlayer影片載入失敗 問題
- 修復 console 警告的錯誤

### 1.1.7
- 新增 notyf 通知

### 1.0.7
- 影片結束後自動切換下一集（如果有的話）
- 啟用 Dplayer 截圖功能

### 1.0.0
- 新增 自訂背景
- 新增 支援繁體中文字體
- 新增 [Dplayer](https://github.com/MoePlayer/DPlayer) 播放器 [v1.25.1](https://github.com/MoePlayer/DPlayer/releases/tag/v1.25.1)
- 支援 各裝置的 播放器串流 [PotPlayer(Win)](https://potplayer.daum.net/?lang=zh_TW)、[IINA(Mac)](https://iina.io/)、[MX Player(Android)](https://play.google.com/store/apps/details?id=com.mxtech.videoplayer.ad)、[Infuse(iOS)](https://apps.apple.com/tw/app/infuse-6/id1136220934)

## 聯絡
**Discord：NekoChan#2851**

## License
[MIT](LICENSE)
