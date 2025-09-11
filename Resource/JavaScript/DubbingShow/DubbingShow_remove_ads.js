// 2024-08-28 08:57:11
const url = $request.url;
const body = $response.body;

if (!body) $done({});

function removeDataWithKeyword(array) {
    if (Array.isArray(array)) {
        for (let i = array.length - 1; i >= 0; i--) {
            if (array[i].data && array[i].data.includes("金币哦")) {
                array.splice(i, 1);
            }
        }
    }
}

try {
    let obj = JSON.parse(body);

    if (url.includes("/Api/Film/GetConfigValue")) {
        if (obj.data && Array.isArray(obj.data)) {
            removeDataWithKeyword(obj.data);
        }
    }

    $done({ body: JSON.stringify(obj) });
} catch (e) {
    console.error("JSON parsing error:", e);
    $done({});
}
