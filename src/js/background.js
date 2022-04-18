chrome.runtime.onInstalled.addListener(_ => {
    chrome.storage.sync.set({ rurl: null })
})

chrome.runtime.onStartup.addListener(_ => {
    chrome.storage.sync.get(s => {
        chrome.tabs.query({}, t => {
            if (t.length === 1 && /:\/\/newtab/.test(t[0].url)) {
                chrome.tabs.update(t[0].id, { url: s.rurl })
            }
        })
    })
})