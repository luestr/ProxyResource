// 2024-07-17 20:09:28
const url = $request.url;
const body = $response.body;

if (!body) $done({});

let obj = JSON.parse(body);

const pathRegex = /\/ocean\/v\d\/tab\/list_v\d/;
const namesToRemove = ["AI帮唱", "长相思2", "K歌", "小说", "游戏"];

if (pathRegex.test(url)) {
    function removeParentIfNameMatches(obj) {
        if (typeof obj === 'object' && obj !== null) {
            for (let key in obj) {
                if (obj[key] && typeof obj[key] === 'object') {
                    if (namesToRemove.includes(obj[key].name)) {
                        delete obj[key];
                    } else {
                        removeParentIfNameMatches(obj[key]);
                    }
                }
            }
        }
    }

    removeParentIfNameMatches(obj);
}

$done({ body: JSON.stringify(obj) });
