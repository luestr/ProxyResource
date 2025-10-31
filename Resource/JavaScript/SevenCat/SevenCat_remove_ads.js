/*
引用地址
*/
// 2023-12-12 11:00

const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("/user/my-center")) {
  // 我的页面
  if (obj?.data?.user_area?.vip_info) {
    // 开通会员卡片
    obj.data.user_area.vip_info = {};
  }
  if (obj?.data?.func_area?.length > 0) {
    let newFuncs = [];
    for (let func of obj.data.func_area) {
      if (["ads", "banner"]?.includes(func?.type)) {
        continue;
      } else {
        newFuncs.push(func);
      }
    }
    obj.data.func_area = newFuncs;
  }
} else {
  $done({});
}

$done({ body: JSON.stringify(obj) });
