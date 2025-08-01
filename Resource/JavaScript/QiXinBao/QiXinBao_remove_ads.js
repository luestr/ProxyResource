// 2024-07-10 15:50:37
var json = JSON.parse($response.body);

// 移除个性化推荐信息流
if (json.data) {
    json.data = {};
}

$done({ body: JSON.stringify(json) });