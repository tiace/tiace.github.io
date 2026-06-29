const SYNC_KEY = "toprio_current"

function makeSearchBar(current) {
  const el = document.createElement("div")
  el.id = "toprio-search-bar"
  el.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 12px;
    background: #f1f3f4;
    border-radius: 4px;
    font-family: Google Sans, Roboto, sans-serif;
    font-size: 13px;
    color: #202124;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
  `

  const dot = document.createElement("span")
  dot.style.cssText = "width:8px; height:8px; border-radius:50%; background:#1a73e8; flex-shrink:0;"

  const label = document.createElement("span")
  label.style.cssText = "overflow:hidden; text-overflow:ellipsis;"
  label.textContent = current.name

  el.appendChild(dot)
  el.appendChild(label)
  el.addEventListener("click", () => {
    window.open("https://tiace.github.io/", "_blank")
  })
  return el
}

function injectSearch(current) {
  if (document.getElementById("toprio-search-bar")) return

  const tabs = document.getElementById("hdtb-sc") ?? document.querySelector("[role=navigation]")
  if (!tabs) return

  const bar = makeSearchBar(current)
  bar.style.marginLeft = "auto"

  const row = tabs.querySelector("div") ?? tabs
  row.style.display = "flex"
  row.style.alignItems = "center"
  row.appendChild(bar)
}

function remove() {
  document.getElementById("toprio-search-bar")?.remove()
}

function inject(current) {
  if (!current || location.pathname !== "/search") return
  injectSearch(current)
}

chrome.storage.local.get(SYNC_KEY, (result) => {
  inject(result[SYNC_KEY])
})

chrome.storage.onChanged.addListener((changes) => {
  if (!(SYNC_KEY in changes)) return
  const current = changes[SYNC_KEY].newValue
  remove()
  if (current) inject(current)
})

// SPA遷移対応
let lastHref = location.href
new MutationObserver(() => {
  if (location.href === lastHref) return
  lastHref = location.href
  remove()
  chrome.storage.local.get(SYNC_KEY, (result) => {
    inject(result[SYNC_KEY])
  })
}).observe(document.body, { childList: true, subtree: true })
