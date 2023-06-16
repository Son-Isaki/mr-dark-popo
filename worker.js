var Version = "1.0.0";

chrome.storage.local.get("version", function(result) {
    if (result.ver != Version) {
        init();
    }
});

function init() {
    chrome.storage.local.set({"version": Version});
}