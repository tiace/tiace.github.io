// Toprioページ上で localStorage の状態を読み取り、chrome.storage.local に同期する

const STORAGE_KEY = "toprio:v1"
const SYNC_KEY = "toprio_current"

function sync() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const state = raw ? JSON.parse(raw) : null
    chrome.storage.local.set({ [SYNC_KEY]: state?.current ?? null })
  } catch {
    // パース失敗時は何もしない
  }
}

sync()

// storageイベントで他タブからの変更を検知
window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEY) sync()
})

// ページ内操作（同一タブ）に対応するためポーリングで補完
setInterval(sync, 2000)
