// 脚本引用 https://raw.githubusercontent.com/RuCu6/Loon/main/Scripts/bilibili/json.js
// 2024-11-09 15:15

const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("/x/resource/show/tab/v2")) {
  // 底部选项卡
  if (obj?.data?.bottom?.length > 0) {
    const sortLists = ["首页", "动态", "我的"];
    obj.data.bottom = obj.data.bottom
      .filter((i) => sortLists?.includes(i?.name))
      .sort((a, b) => sortLists.indexOf(a?.name) - sortLists.indexOf(b?.name));
  }
  // 首页导航栏
  if (obj?.data?.tab?.length > 0) {
    const sortLists = ["推荐", "热门", "影视", "动画", "直播"];
    obj.data.tab = obj.data.tab
      .filter((i) => sortLists?.includes(i?.name))
      .sort((a, b) => sortLists.indexOf(a?.name) - sortLists.indexOf(b?.name));
  }
  // 右上角按钮
  if (obj?.data?.top?.length > 0) {
    obj.data.top = obj.data.top.filter((i) => i?.name === "消息");
    if (obj?.data?.top?.[0]?.pos) {
      obj.data.top[0].pos = 1;
    }
  }
} else if (url.includes("/x/v2/account/mine")) {
  // 我的页面
  const del = ["ipad_upper_sections", "rework_v1", "vip_section", "vip_section_v2"];
  for (let i of del) {
    delete obj.data[i]; // 不必要项目
  }
  // iPad 我的页面
  if (obj?.data?.ipad_recommend_sections?.length > 0) {
    const itemList = [789, 790]; // 789我的关注 790我的消息 791我的钱包 792直播中心 793大会员 794我的课程 2542我的游戏
    obj.data.ipad_recommend_sections = obj.data.ipad_recommend_sections.filter((i) => itemList?.includes(i.id));
  }
  if (obj?.data?.ipad_more_sections?.length > 0) {
    const itemList = [797, 798]; // 797我的客服 798设置 1070青少年守护
    obj.data.ipad_more_sections = obj.data.ipad_more_sections.filter((i) => itemList?.includes(i.id));
  }
  // iPhone 我的页面
  if (obj?.data?.sections_v2?.length > 0) {
    let newSects = [];
    for (let item of obj.data.sections_v2) {
      if (item?.button) {
        delete item.button;
      }
      if (item?.style) {
        if (item?.style === 1 || item?.style === 2) {
          if (item?.title) {
            if (item?.title === "创作中心" || item?.title === "推荐服务") {
              continue; // 创作中心 推荐服务
            } else if (item?.title === "更多服务") {
              if (item?.title) {
                delete item.title;
              }
              if (item?.items?.length > 0) {
                let newItems = [];
                for (let i of item.items) {
                  if (/user_center\/feedback/g.test(i?.uri)) {
                    newItems.push(i); // 联系客服
                  } else if (/user_center\/setting/g.test(i?.uri)) {
                    newItems.push(i); // 设置
                  } else {
                    continue;
                  }
                }
                item.items = newItems;
              }
            }
          }
        } else {
          continue; // 其他style
        }
      }
      newSects.push(item);
    }
    obj.data.sections_v2 = newSects;
  }
  // 非会员开启本地会员标识
  if (obj?.data?.vip) {
    if (obj?.data?.vip?.status === 0) {
      obj.data.vip_type = 2;
      obj.data.vip.type = 2;
      obj.data.vip.status = 1;
      obj.data.vip.due_date = 3818419199; // Unix 时间戳 2090-12-31 23:59:59
      obj.data.vip.label = {
        path: "",
        text: "年度大会员",
        label_theme: "annual_vip",
        text_color: "#FFFFFF",
        bg_style: 1,
        bg_color: "#FB7299",
        border_color: "",
        image: "https://i0.hdslb.com/bfs/vip/8d4f8bfc713826a5412a0a27eaaac4d6b9ede1d9.png"
      };
      obj.data.vip.nickname_color = "#FB7299";
      obj.data.vip.role = 3;
    }
  }
} else if (url.includes("/x/v2/account/myinfo")) {
  // 非会员开启会员专属清晰度
  if (obj?.data?.vip) {
    if (obj?.data?.vip?.status === 0) {
      obj.data.vip.type = 2;
      obj.data.vip.status = 1;
      obj.data.vip.due_date = 3818419199; // Unix 时间戳 2090-12-31 23:59:59
      obj.data.vip.role = 3;
    }
  }
} else if (url.includes("/x/v2/feed/index")) {
  // 首页推荐信息流
  if (obj?.data?.config?.toast?.has_toast) {
    obj.data.config.toast.has_toast = false; // 首页刷新通知
  }
  if (obj?.data?.items?.length > 0) {
    // 白名单
    let newItems = [];
    for (let item of obj.data.items) {
      if (item?.goto === "av") {
        // 常规模式
        if (item?.card_goto === "av") {
          newItems.push(item);
        } else {
          continue;
        }
      } else if (item?.goto === "vertical_av") {
        // 竖屏模式
        if (item?.card_goto === "av" || item?.card_goto === "vertical_av") {
          if (item?.creative_entrance) {
            item.creative_entrance = {}; // 推荐话题搜索框
          }
          if (item?.scroll_guide) {
            item.scroll_guide = {}; // 上滑观看提示
          }
          if (item?.story_cart_icon) {
            item.story_cart_icon = {}; // 相关话题图标
          }
          newItems.push(item);
        } else {
          continue;
        }
      } else {
        continue;
      }
    }
    obj.data.items = newItems;
  }
} else if (url.includes("/x/v2/splash")) {
  // 开屏广告
  if (obj?.data) {
    const item = ["account", "event_list", "preload", "show"];
    item.forEach((i) => {
      delete obj.data[i];
    });
    if (obj?.data?.max_time) {
      obj.data.max_time = 0;
    }
    if (obj?.data?.min_interval) {
      obj.data.min_interval = 31536000;
    }
    if (obj?.data?.pull_interval) {
      obj.data.pull_interval = 31536000;
    }
    if (obj?.data?.list?.length > 0) {
      for (let i of obj.data.list) {
        i.duration = 0;
        i.enable_pre_download = false;
        i.begin_time = 3818332800; // Unix 时间戳 2090-12-31 00:00:00
        i.end_time = 3818419199; // Unix 时间戳 2090-12-31 23:59:59
      }
    }
  }
} else if (url.includes("/pgc/page/bangumi") || url.includes("/pgc/page/cinema/tab")) {
  // 观影页
  if (obj.result?.modules?.length > 0) {
    obj.result.modules.forEach((i) => {
      if (i?.style?.startsWith("banner")) {
        if (i?.items?.length > 0) {
          i.items = i.items.filter((ii) => ii?.link?.includes("play"));
        }
      } else if (i?.style?.startsWith("function")) {
        if (i?.items?.length > 0) {
          i.items = i.items.filter((ii) => ii?.blink?.startsWith("bilibili"));
        }
      } else if ([241, 1283, 1284, 1441]?.includes(i?.module_id)) {
        if (i?.items?.length > 0) {
          i.items = [];
        }
      } else if (i?.style?.startsWith("tip")) {
        if (i?.items?.length > 0) {
          i.items = [];
        }
      }
    });
  }
} else {
  $done({});
}

$done({ body: JSON.stringify(obj) });
