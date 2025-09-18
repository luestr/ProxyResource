// 2024-07-14 04:48:43
var json = JSON.parse($response.body);

if (json.data && json.data.moduleInfos && Array.isArray(json.data.moduleInfos) && json.data.moduleInfos.length > 1) {
    delete json.data.moduleInfos[1]; // 章末推荐书籍
}

if (json.data && json.data.props && json.data.props["x-dependencies"] && Array.isArray(json.data.props["x-dependencies"])) {
    delete json.data.props["x-dependencies"][0]; // 书城横幅
}

$done({ body: JSON.stringify(json) });