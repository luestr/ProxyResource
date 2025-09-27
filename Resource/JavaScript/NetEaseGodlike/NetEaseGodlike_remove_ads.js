// 2025-09-18 01:40:38
(() => {
    if (!$response?.body) return $done({});

    let modified = false;
    let body;

    try {
        body = JSON.parse($response.body);
    } catch (e) {
        console.log(`JSON解析失败: ${e.message}`);
        return $done({});
    }

    const { url } = $request;
    if (!url.includes('/v1/app/base/conf/static/start-config?os=ios')) return $done({});

    // 保留的对象
    if (Array.isArray(body?.result?.updateConfig)) {
        body.result.updateConfig = body.result.updateConfig.filter(item => {
            const moduleName = item?.module;
            const allowedModules = [
                "APP设置",
                "暴雪服务中心",
                "Lynx配置",
                "工程模式配置",
                "我页配置",
                "动态配置",
                "资源包配置",
                "北斗策略ID配置",
                "小程序通用基础配置",
                "小程序跳转",
                "聊天配置",
                "意见反馈配置",
                "我页ios充值",
                "ios升级配置",
                "大神积分",
                "圈子2.0配置",
                "大神用户基础配置",
                "分享来源",
                "语音房配置",
                "圈子配置",
                "新手引导配置"
            ];
            return allowedModules.includes(moduleName);
        });
        modified = true;
    }

    // 删除福利中心配置
    if (Array.isArray(body?.result?.updateConfig)) {
        for (const config of body.result.updateConfig) {
            if (Array.isArray(config.itemList)) {
                config.itemList = config.itemList.filter(item => 
                    !(item?.value === "welfare_centre_config")
                );
                if (config.itemList.length < config.itemList.length) modified = true;
            }
        }
    }

    // 删除游戏中心列表
    if (Array.isArray(body?.result?.gameCenterList)) {
        body.result.gameCenterList = [];
        modified = true;
    }

    // 删除APP设置中对象
    const appSettingsBlacklist = [
        "im_ai_pet",
        "privilege_center",
        "android_dns_check_list_md5",
        "android_web_scheme_white_list",
        "cbg_me_tab",
        "group_square_entrance",
        "game_download_btn_in_square",
        "welfare_video_entrance",
        "spotlight_daily_reddot",
        "game_center_switch",
        "ios_game_center_switch",
        "首页banner",
        "discovery_video_switch",
        "square_widgets",
        "feed_show_game_info_switch",
        "book_game_square_switch",
        "square_videoMode",
        "video_widget_control",
        "video_widget_cbg_blacklist",
        "video_stream_friends_avatar_show",
        "immerse_video_stream_friends_action_forbid",
        "cc_video",
        "商品推荐",
        "Android资源包",
        "Android字体资源包2",
        "banner列表",
        "看点-直播tab显示限定绑定指定圈子",
        "ad_blablabla_limit",
        "immersive_feed_exit_popup",
        "ulink_launch_ad_filter_games",
        "问问AI-跳转智能体",
        "问问AI-跳转智能体3.99以后",
        "mini_program_popup_map",
        "android_ipv6",
        "square_redbook_mode",
        "im_h5_activity_widget_url",
        "Im_Ad_Slot",
        "square_popup",
        "gamechannel_tab",
        "systemChat_first_section",
        "android_resource_check",
        "cbg_ad_switch",
        "discover_recommend_switch",
        "ios_welfare_module_switch"
    ];

    if (Array.isArray(body?.result?.updateConfig)) {
        for (const config of body.result.updateConfig) {
            if (Array.isArray(config.itemList)) {
                config.itemList = config.itemList.filter(item => 
                    !appSettingsBlacklist.includes(item?.name)
                );
                modified = true;
            }
        }
    }

    // 精简底栏标签
    if (Array.isArray(body?.result?.updateConfig)) {
        for (const config of body.result.updateConfig) {
            if (Array.isArray(config.itemList)) {
                for (const item of config.itemList) {
                    if (Array.isArray(item?.itemList)) {
                        item.itemList = item.itemList.filter(subItem => 
                            !["视频", "游戏"].includes(subItem?.name)
                        );
                    }
                }
            }
        }
    }

    $done(modified ? {
        body: JSON.stringify(body),
        headers: { ...$response.headers }
    } : {});
})();