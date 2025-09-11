// 2024-06-30 01:22:42
let data = JSON.parse($response.body);
// 删除查老板 - 热门老板
data.data && delete data.data;

$done({ body: JSON.stringify(data) });