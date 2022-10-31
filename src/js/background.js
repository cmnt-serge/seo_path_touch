chrome.webNavigation.onCompleted.addListener(({tabId, url}) => {
    chrome.permissions.contains({
        permissions: ['scripting'],
        origins: ['https://www.dofus-touch-map.com/']
    }, (granted) => {
        if (granted) {
            chrome.scripting.executeScript({
                target: {tabId},
                files: ['src/js/main.js']
            });
            /*chrome.scripting.executeScript({
                target: {tabId},
                func: function(){
                    let script = this.document.createElement('script');
                    script.type = 'text/javascript';
                    console.log(script)
                    script.src = chrome.runtime.getURL('src/js/main.js')
                    this.document.querySelector('head').insertAdjacentElement('afterbegin', script);

                    console.log(this)
                }
            })*/
            chrome.scripting.insertCSS({
                target: {tabId},
                files: ['src/css/bootstrap.min.css', 'src/css/main.css']
            })
        } else {
            console.log('I CANTTTT')
        }
    });
}, {url: [{urlContains: 'dofus-touch-map.com'}]})

/*
//Event de click sur le bouton dans la barre
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['src/js/alert.js'],
    });
})

// Tentative de brider l'extension à une famille d'URL
chrome.runtime.onInstalled.addListener((e) => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: {urlContains: 'dofus-touch-map.com'}
                    })
                ],
                actions: [new chrome.declarativeContent.ShowAction()]
            }
        ]);
    });
})
*/