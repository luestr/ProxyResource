/*
脚本引用https://raw.githubusercontent.com/RuCu6/QuanX/main/Scripts/adsense.js
*/
// 2023-02-11 22:30

const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

// 广告联盟-穿山甲
if (
  url.includes("api-access.pangolin-sdk-toutiao.com/api/ad/union/sdk") ||
  url.includes("is.snssdk.com/api/ad/union/sdk")
) {
  if (obj.message) {
    obj = {
      request_id: "F5617E54-3FF4-4052-9B09-4227D09B5105",
      status_code: 20001,
      reason: 112,
      desc: "该代码位请求量过大且消耗过低，因此填充率控制在10%以内，该策略每日生效，如果当天该代码位的消耗上涨或请求量小于5000，则次日不会命中该策略"
    };
  }
} else if (url.includes("open.e.kuaishou.com")) {
  // 广告联盟-快手联盟
  if (obj.result === 1) {
    obj.result = 40003;
  }
} else if (url.includes("mi.gdt.qq.com")) {
  // 广告联盟-优量汇
  if ("ret" in obj) {
    if (obj.ret === 0) obj.ret = 102006;
  }
}

$done({ body: JSON.stringify(obj) });
