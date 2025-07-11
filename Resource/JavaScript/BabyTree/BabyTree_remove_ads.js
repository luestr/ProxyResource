/*
脚本引用https://raw.githubusercontent.com/RuCu6/QuanX/main/Scripts/babytree.js
*/
// 2023-11-22 19:25

const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("/app_index/get_app_tab")) {
  // 底部tab
  if (obj?.data?.selected_list?.length > 0) {
    obj.data.selected_list = obj.data.selected_list.filter((i) => !["购物", "商城"]?.includes(i?.name));
  }
} else if (url.includes("/bafconfigcenter_intf/config/get")) {
  // 整体配置
  const items = [
    "pregnancy__find_group_guide_image_url", // 加入的圈子
    "pregnancy__home_left_icon", // 直播图标
    "pregnancy__home_left_icon_new", // 直播图标
    "pregnancy__home_left_icon_static", // 直播图标
    "pregnancy__video_white_list" // 宝宝视频
  ];
  if (obj?.data) {
    for (let i of items) {
      if (obj?.data?.[i]) {
        obj.data[i] = "";
      }
    }
  }
} else if (url.includes("/cms_column/get_column_list")) {
  // tab配置
  if (obj?.data?.list?.length > 0) {
    let newLists = [];
    for (let item of obj.data.list) {
      if (item?.data_source_list?.length > 0) {
        let newDatas = [];
        for (let i of item.data_source_list) {
          // 首页顶部tab
          if (i?.tab_name?.includes("精品秒杀")) {
            continue;
          } else {
            newDatas.push(i);
          }
        }
        item.data_source_list = newDatas;
      }
      if (["225", "226", "238", "239"]?.includes(item?.id)) {
        // 我的页面模块
        // 225我的福利 226banner轮播图 238美囤商城 239会员进群
        continue;
      }
      newLists.push(item);
    }
    obj.data.list = newLists;
  }
} else if (url.includes("/feeds/get_index_feeds_list")) {
  // 首页信息流
  if (obj?.data?.list?.length > 0) {
    obj.data.list = obj.data.list.filter(
      (i) => ["发表了", "提问了"]?.includes(i?.action_desc) && !i?.hasOwnProperty("seeding_goods_info")
    );
  }
} else if (url.includes("/mobile_search_new/search_index")) {
  // 搜索列表
  if (obj?.data?.find_search) {
    // 搜索发现
    delete obj.data.find_search;
  }
} else if (url.includes("/user/get_user_info")) {
  // 我的页面
  if (obj?.data?.video_show) {
    // 顶部婴儿视频
    delete obj.data.video_show;
  }
}

$done({ body: JSON.stringify(obj) });
