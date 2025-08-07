// 2024-07-18 21:07:11
const url = $request.url;
const body = $response.body;

if (!body) $done({});

let obj = JSON.parse(body);

if (url.includes("/app/config/")) {
    delete obj.data.vip_subscribe_switch;
}

$done({ body: JSON.stringify(obj) });