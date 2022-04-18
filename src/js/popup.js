;(_ => {
    /*** Init */
    const validURL = str => {
        var pattern = new RegExp('^https?:(\\/\\/)?' +
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
          '((\\d{1,3}\\.){3}\\d{1,3}))' +
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
          '(\\?[;&a-z\\d%_.~+=-]*)?' +
          '(\\#[-a-z\\d_]*)?$', 'i')
        return !!pattern.test(str)
    }, reconfig = url => {
        let parser = document.createElement('a'), result = ''
        if (Boolean(url)) {
            parser.href = url
            result = `${parser.protocol}${parser.href.split(/:\/\//)[1]}`
        }
        return result
    }

    const respMsg = document.querySelector('[resp]'),
    overhaul = document.querySelector('[overhaul]'),
    rurlState = document.querySelector('#rurl > state'),
    clickableElems = document.querySelectorAll('[clickable]')

    let timeout = null

    /*** Storage */
    chrome.storage.sync.get(res => {
        if (!!res.rurl) {
            rurlState.setAttribute('style', '--state-color: hsl(0, 0%, 87%)')
            overhaul.value = res.rurl
        }
    })

    /*** RURL Input */
    overhaul.addEventListener('input', e => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            let value = reconfig(e.target.value)
            if (validURL(value)) {
                rurlState.setAttribute('style', '--state-color: hsl(0, 0%, 87%)')
                chrome.storage.sync.set({ rurl: value })
                console.info('%c+ RURL synced successfully', [
                    ['padding',          '0.15em 0.43em'                   ].join(':'),
                    ['color',            'hsl(34, 26%, 40%)'               ].join(':'),
                    ['background-color', 'hsl(222, 8%, 85%)'               ].join(':'),
                    ['box-shadow',       '0 3px 1em hsl(220, 6%, 74%, 28%)'].join(':'),
                    ['border-radius',    '4px'                             ].join(':'),
                ].join(';'))
            } else if (value === '') {
                rurlState.setAttribute('style', '--state-color: hsl(348, 37%, 61%)')
                chrome.storage.sync.set({ rurl: null })
                console.info('%c- RURL removed', [
                    ['padding',          '0.15em 0.43em'                   ].join(':'),
                    ['color',            'hsl(353, 5%, 33%)'               ].join(':'),
                    ['background-color', 'hsl(222, 8%, 85%)'               ].join(':'),
                    ['box-shadow',       '0 3px 1em hsl(220, 6%, 74%, 28%)'].join(':'),
                    ['border-radius',    '4px'                             ].join(':'),
                ].join(';'))
            } else {
                rurlState.setAttribute('style', '--state-color: hsl(351, 62%, 53%)')
                console.info('%c! The url is invalid or malformed', [
                    ['padding',          '0.15em 0.43em'                   ].join(':'),
                    ['color',            'hsl(40, 97%, 55%)'               ].join(':'),
                    ['background-color', 'hsl(50, 94%, 16%)'               ].join(':'),
                    ['box-shadow',       '0 3px 1em hsl(220, 6%, 74%, 28%)'].join(':'),
                    ['border',           '1px solid hsl(50, 96%, 22%)'     ].join(':'),
                    ['border-radius',    '4px'                             ].join(':'),
                ].join(';'))
            }
        }, 510)
    })

    /*** Help Message */
    let clickableElemValues = Object.values(clickableElems)
    for (let i = 0; i < clickableElemValues.length; i++) {
        let elem = clickableElemValues[i],
        elemTag = elem.tagName.toUpperCase()
        if (elemTag === 'HELP') {
            var msg = elem.getAttribute('send')
            elem.addEventListener('click', e => {
                if (respMsg) {
                    respMsg.textContent = msg
                    respMsg.setAttribute('nvn', '!')
                }
            })
            elem.setAttribute('send', '{?=>>...}')
        }
    }
})()