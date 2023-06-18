chrome.management.getSelf().then((extension) => {
    console.log('extension', extension);
    chrome.storage.local.set({'version': extension.version});
});