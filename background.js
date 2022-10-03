video_objs = [];

function logRequest(requestDetails) {
    var url = requestDetails.url;
    if (url.includes("a.mp4") && url.includes(".ts")) {
		var url2 = url.replace('hls/','')
		var url3 = url2.substring(0, url2.lastIndexOf('/'));
        var newUrl = true;
        for (const obj of video_objs) {
            if (obj.url === url3) {
                newUrl = false;
                break;
            }
        }
        if (newUrl) {
            browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
                var video = {
                    "url" : url3,
                    "title" : tabs[0].title
                }
                video_objs.push(video);
            });
        }
    }
}

function download() {
    if (video_objs.length === 0) {
        return;
    }
    const total_downloads_num = video_objs.length;
    while (video_objs.length > 0) {
        var video = video_objs.pop();
        browser.downloads.download({
            url : video.url,
            filename : video.title.replace(/[/\\?%*:|"<>]/g, '-').concat("-"+(total_downloads_num-video_objs.length)).concat(".mp4")
        })
    }
}

console.log("UBC Kaltura Canvas downloader is running.");
browser.webRequest.onBeforeRequest.addListener(logRequest, {
    urls: ["*://*.ubc.ca/*"],
});

browser.browserAction.onClicked.addListener(download);