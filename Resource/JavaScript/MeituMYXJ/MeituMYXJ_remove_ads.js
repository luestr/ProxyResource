// 2024-09-07 23:02:42
const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("/operation/home.json")) {
    // 遍历 func_list
    if (obj.response.list) {
      for (let i in obj.response.list) {
        obj.response.list[i].func_list = obj.response.list[i].func_list.filter(item => {
          return item.name !== "借钱" && item.name !== "AI剪辑";
        });
      }
    }

    // 遍历 func_bar_type
    if (obj.response.list && obj.response.list.func_bar_type) {
        obj.response.list.func_bar_type = obj.response.list.func_bar_type.filter(item => {
            return item.func_bar_type !== 8;
        });
    }
}