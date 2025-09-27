// 2024-08-16 18:28:28
const url = $request.url;
if (url.includes("/index/plaza-flow?")) {
    let obj = JSON.parse($response.body);
    if (obj.data && obj.data.contents && Array.isArray(obj.data.contents)) {
        obj.data.contents = obj.data.contents.filter(item => item.type !== 4);
    }
    $done({ body: JSON.stringify(obj) });
} else {
    $done({});
}
