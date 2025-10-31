// 2024-07-10 10:53:30
var url = $request.url;
var body = $response.body;

if (url.includes("/api/mobile/index.php?module=basicdata&type=app_onoff")) {
    var banner = JSON.parse(body);

    // 删除我的页面横幅
    delete banner.Variables.data.xinren;

    var pathsToClear = [
        // 删除发帖界面评选推广
        "goodhotel",
        "goodhotel_txt",
        "goodthread",
        "goodthread_txt",
        // 删除我的页面横幅广告
        "homeinns_already_joined",
        "homeinns_entry",
        "homeinns_entry_banner",
        "homeinns_entry_url"
    ];

    pathsToClear.forEach(function(path) {
        if (banner.Variables && banner.Variables.data && banner.Variables.data[path]) {
            banner.Variables.data[path] = {};
        }
    });

    $done({ body: JSON.stringify(banner) });
} else if (url.includes("/api/mobile/index.php?module=plugin&id=k_misign:sign")) {
    var sign_adv = JSON.parse(body);

    // 删除签到弹窗广告
    if (sign_adv.Variables && sign_adv.Variables.data && sign_adv.Variables.data.adv) {
        delete sign_adv.Variables.data.adv;
    }

    $done({ body: JSON.stringify(sign_adv) });
} else if (url.includes("/api/mobile/index.php?version=5")) {
    var section_adv = JSON.parse(body);

    // 删除会员说版块广告
    if (section_adv.Variables && section_adv.Variables.data && Array.isArray(section_adv.Variables.data)) {
        section_adv.Variables.data.forEach(function(item) {
            if (item.adv) {
                item.adv = {};
            }
        });
    }

    $done({ body: JSON.stringify(section_adv) });
} else {
    $done({ body: body });
}