// 2024-08-18 00:53:34
const url = $request.url;
let obj = JSON.parse($response.body);

if (url.includes("/maimai/feed/v5/focus_feed?")) {
    if (obj.feeds && Array.isArray(obj.feeds)) {
        obj.feeds = obj.feeds.filter(feed => !feed.newAdStyle);
    }
} else if (url.includes("/maimai/gossip/v3/gossip_detail_comment?")) {
    if (obj.comments && obj.comments.lst && Array.isArray(obj.comments.lst)) {
        obj.comments.lst = obj.comments.lst.filter(comment => !comment.newAdStyle);
    }
} else if (url.includes("/maimai/feed/v6/feed_detail_comment?")) {
    if (obj.lst && Array.isArray(obj.lst)) {
        obj.lst = obj.lst.filter(item => !item.newAdStyle);
    }
}

$done({ body: JSON.stringify(obj) });