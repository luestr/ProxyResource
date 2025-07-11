/*
引用地址https://raw.githubusercontent.com/RuCu6/QuanX/main/Scripts/news163.js
*/
// 2024-01-12 08:50

const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("/feed/dynamic/headline-list")) {
  // 信息流
  if (obj?.data?.items?.length > 0) {
    // 移除置顶新闻
    obj.data.items = obj.data.items.filter((i) => !(i?.tagList?.length > 0));
  }
} else if (url.includes("/nex.163.com/q")) {
  // 开屏广告
  if (obj?.ads?.length > 0) {
    obj.ads = [];
  }
} else if (url.includes("/search/hot-word")) {
  // 搜索框
  if (obj?.data?.special?.length > 0) {
    // 猜你想搜
    obj.data.special = [];
  }
  // if (obj?.data?.hotWordList?.length > 0) {
  //     热搜列表
  //   obj.data.hotWordList = [];
  // }
  if (obj?.data?.RollhotWordList?.length > 0) {
    // 搜索框填充词
    obj.data.RollhotWordList = [];
  }
} else {
  $done({});
}

$done({ body: JSON.stringify(obj) });