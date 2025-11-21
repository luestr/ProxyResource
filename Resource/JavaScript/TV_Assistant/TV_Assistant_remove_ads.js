// 2024-07-11 01:56:32
var json = JSON.parse($response.body);

// 删除底栏视频标签
if (json.data && Array.isArray(json.data) && json.data.length > 1) {
    json.data[1] = {};
}

$done({ body: JSON.stringify(json) });