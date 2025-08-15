// 2024-07-17 00:14:28
let obj = JSON.parse($response.body);

// 删除广告参数
const pathsToDelete = [
    "data.REWARD_AD_PLACES",
    "data.SPLASH_SWING_OPEN",
    "data.REWARD_AD_PHOTO_EDITOR",
    "data.REWARD_AD_PAG_EDITOR",
    "data.AD_PRICE_SHOW",
    "data.AD_SCREEN_WAKEUP_TIME",
    "data.REWARD_AD_CUTOUT_NUM",
    "data.AD_HOME_ENTER_POP_COUNT",
    "data.SHARE_BANNER", // 横幅
    "data.AD_MENU_SELECTIONS", // 广告反馈
    "data.ME_TAB.ANNOUNCEMENT", // 清朗·网络戾气整治”专项行动
    "data.ME_TAB.MEMBERSHIP", // 我的页面横幅
    "data.ME_TAB.MEMBERSHIP2" // 我的页面横幅
];

// 遍历并删除指定路径
pathsToDelete.forEach(path => {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length; i++) {
        if (i === parts.length - 1) {
            delete current[parts[i]];
        } else {
            current = current[parts[i]];
            if (!current) break;
        }
    }
});

$done({ body: JSON.stringify(obj) });