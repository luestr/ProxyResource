/*
脚本引用 https://raw.githubusercontent.com/RuCu6/QuanX/main/Scripts/break/caixin.js
*/
// 2024-07-16 20:00

var url = $request.url;
const isQuanX = typeof $task !== "undefined";

if (url.includes("/gg.caixin.com/s")) {
  // 开屏广告
  let body = $response.body;
  if (body === undefined) {
    $done({});
  } else {
    body = body
      .replace(/"showfrequency":\d+/g, '"showfrequency":0')
      .replace(/"showintval":\d+/g, '"showintval":0')
      .replace(/"showcycle":\d+/g, '"showcycle":604800')
      .replace(/"intval":\d+/g, '"intval":0')
      .replace(/"sday":"[^"]*"/g, '"sday":"2090-12-31 00:00:00"')
      .replace(/"eday":"[^"]*"/g, '"eday":"2090-12-31 23:59:59"')
      .replace(/"banner":/g, "ban0:");
    $done({ body });
  }
} else {
  if (!$response) $done({});
  if (!$response.body) $done({});
  let obj = JSON.parse($response.body);
  if (url.includes("/api/dataplus/columns")) {
    // 首页-数据通
    const items = ["buttonColor", "buttonText", "buyUrl", "descText"];
    if (obj?.data?.length > 0) {
      for (let item of obj.data) {
        for (let i of items) {
          delete item[i];
        }
      }
    }
  } else if (url.includes("/articlev5/")) {
    // 文章底部-相关阅读
    if (obj?.data?.relatarticle?.length > 0) {
      obj.data.relatarticle = [];
    }
  } else if (url.includes("/caixinapp/appinfo")) {
    // 文章详情页
    if (obj?.data?.articlePromotionList?.length > 0) {
      // 文章底部推广图
      obj.data.articlePromotionList = [];
    }
  } else if (url.includes("/channelv5/list")) {
    // 首页-顶部分类列表
    delete obj.data.ios_ad_513;
    delete obj.data.android_ad_513;
  } else if (url.includes("/fm/index/list")) {
    // 首页-财新fm
    const items = ["androidAdList", "headlines", "iosAdList"];
    if (obj?.data) {
      for (let i of items) {
        if (obj?.data?.[i]?.length > 0) {
          obj.data[i] = [];
        }
      }
    }
  } else if (url.includes("/index_page_v5")) {
    // 首页-信息流
    delete obj.data.ios_ad_513;
    delete obj.data.android_ad_513;
    if (obj?.data?.list?.length > 0) {
      obj.data.list = obj.data.list.filter((i) => !["金融我闻", "财新数据通"]?.includes(i?.channel_name));
    }
  } else if (url.includes("/search/getkeyword")) {
    // 搜索框填充词
    if (obj?.data?.keys?.length > 0) {
      obj.data.keys = [];
    }
  }
  $done({ body: JSON.stringify(obj) });
}