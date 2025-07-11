// 2024-07-26 19:09:38
const url = $request.url;
let obj = JSON.parse($response.body);

// 删除匹配卡横幅
if (url.includes("/lover/productList")) {
    delete obj.data.topBannerImg;
    delete obj.data.topBannerIndex;
    delete obj.data.topBannerLink;
}

// 删除密友横幅
if (url.includes("/friends/closeFriend/home")) {
    delete obj.data.banner;
}

// 删除娱乐页面横幅和悬浮窗配置
if (url.includes("/party/config")) {
    delete obj.data.newUserTaskConfig; // 新用户任务配置
    delete obj.data.partyActivityList; // 娱乐页面浮窗
    delete obj.data.partyBannerIndex; // 娱乐页面横幅
    delete obj.data.partyListBanner; // 娱乐页面横幅
    delete obj.data.partyTopBanner; // 娱乐页面横幅
}

// 删除广场搜索填充词
if (url.includes("/post/fetchSearchRecommend")) {
    if (obj.data && obj.data.list) {
        obj.data.list = [];
    }
}

$done({ body: JSON.stringify(obj) });