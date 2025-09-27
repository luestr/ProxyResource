// 2024-07-17 18:20:06
let url = $request.url;
try {
    let obj = JSON.parse($response.body);

    // 删除首页 - 左上角以旧换新
    if (/\/news_v\d+(?:\.\d+){2}\/news\/homenavigation/.test(url)) {
        delete obj.result.leftops;
    }

    // 删除社区广场 - 广告轮播图
    if (/\/club_v\d+(?:\.\d+){2}\/club\/index\/businessv\d+/.test(url)) {
        delete obj.result.bannerlist;
    }

    // 删除选车 - 直播浮窗
    if (url.includes("/carstreaming/selectcarportal/reclist")) {
        delete obj.result.liveinfo;
    }
    
    // 删除我的页面 - 移除添加我的爱车领券
    if (/\/platform\/carserver\/carcard\/mycardv\d+/.test(url)) {
      delete obj.result.nocartext;
  }

    // 删除我的页面 - 热门活动
    if (/\/platform\/carserver\/carcard\/cards/.test(url)) {
      delete obj.result.list[0];
  }

    // 遍历关键词删除
    function removeItemsWithKeywords(objc, keyword) {
        var otherlist = objc["result"]["otherlist"]
        if (Array.isArray(otherlist)) {
          otherlist = otherlist.filter(function(ol) {
            var lists = ol["list"]
            if (Array.isArray(lists)) {
              for (let index in lists) {
                var item = lists[index]
                if (item["title"] === keyword) {
                  return false
                }
              }
            }
            return true
          });
        }
        objc["result"]["otherlist"] = otherlist
        return objc
    }

    // 选车 - 新车报价页面直播内容
    if (url.includes("/carstreaming/selectcarportal/seriestopwithtagscard")) {
        obj = removeItemsWithKeywords(obj, "直播中");
        obj = removeItemsWithKeywords(obj, "报价中");
    }

    // 删除二手车 - 竖版轮播图
    if (/\/apic\/v\d+\/gethomepagefeed/.test(url)) {
        obj = removeItemsWithKeywords(obj, "车抵贷");
    }

    // 精简精选服务、全部服务
    if (/\/platform\/carserver\/((usercenter\/getservicecards)|(carcard\/allcard))/.test(url)) {
        obj = removeItemsWithKeywords(obj, "低息借钱");
        obj = removeItemsWithKeywords(obj, "分期购车");
        obj = removeItemsWithKeywords(obj, "车主贷");
        obj = removeItemsWithKeywords(obj, "测贷款额度");
        obj = removeItemsWithKeywords(obj, "测贷款额");
    }

    console.log(JSON.stringify(obj))
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    console.error(e);
    $done({ body: $response.body });
}