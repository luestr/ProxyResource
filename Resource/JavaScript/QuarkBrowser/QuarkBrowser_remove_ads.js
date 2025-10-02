// 2024-07-14 22:55:24
var json = JSON.parse($response.body);

// 删除指定的路径
var pathsToDelete = [
    "result.cms_user_center_bussiness_banner_config", // 用户中心 - 横幅广告
    "result.cms_user_center_welfare_farm_entry_config", // 用户中心 - 芭芭农场、福利中心
    "result.cms_cloud_drive_transport_header_banner", // 云盘 - 传输页面横幅广告
    "result.qk_novel_noah_sdk_slot_bottom_banner", // 小说 - 底部横幅广告
    "result.cms_novel_bookshelf_banner", // 小说 - 书架横幅
    "result.cms_bookmarkAndHistory_banner_ad", // 书签和历史 - 横幅广告
    "result.paisou_benefit_banner", // 拍搜 - 横幅广告
    "result.novel_ad_flbanner_close", // 小说广告横幅关闭
    "result.noah_content_embed_ad_hc_vertical_scale_style", // 诺亚内容嵌入广告HC垂直扩展样式
    "result.minipg_ads_switch_quark", // 迷你PG广告开关夸克
    "result.noah_search_mid_page_ad_list", // 包含广告内容配置
    "result.noah_search_mid_ad_enable",// 诺亚搜索中广告启用
    "result.cms_web_ad_local_block_js", // CMS网站广告本地块JS
    "result.novel_paid_book_ad_density_newuser", // 小说付费书籍广告密度对新用户的影响
    "result.novel_ad_flbanner_cdtime", // 小说广告横幅CD时间
    "result.cms_sm_ad_request_handle_enable", // 启用CMS SM广告请求处理
    "result.novel_ad_space_count", // 小说广告空间计数
    "result.cms_sc_ad_request_handle_enable", // 启用CMS SC广告请求处理
    "result.noah_content_embed_ad_vertical_scale_style", // 诺亚内容嵌入广告垂直扩展风格
    "result.enable_miniframe_prefetch_ad", // 启用迷你框架预取广告
    "result.cms_camera_asset_activity_banner_list", // 广告促销横幅
    "result.idfa_auth_config", // 包含IDFA（设备标识符）相关广告内容说明
    "result.cms_cloud_drive_user_banner", // 多个横幅广告配置，如限时福利、SVIP年卡等
    "result.cms_quark_pan_scene.res_data.data[0].items[39]", // 扩容广告横幅
    "result.cms_quark_pan_scene.res_data.data[0].items[40]", // 扩容广告横幅
    "result.cms_quark_pan_scene.res_data.data[0].items[41]", // 免费投屏增强次数已用完
    "result.cms_quark_pan_scene.res_data.data[0].items[4]", // 免费投屏增强次数已用完
    "result.cms_quark_pan_scene.res_data.data[0].items[6]", // 免费投屏增强次数已用完
    "result.cms_cloud_backup_free_benefit_config", // 备用福利广告配置
    "result.camera_universal_word_result_page", // 页面广告配置
    "result.cms_quark_pan_scene.res_data.data[0].items[5]", // 视频原画备份广告横幅
    "result.cms_quark_pan_scene.res_data.data[0].items[52]", // 视频原画备份广告横幅
    "result.cms_quark_pan_scene.res_data.data[0].items[185]", // 开通SVIP一键极速上传原画视频
    "result.cms_quark_pan_scene.res_data.data[0].items[186]" // 开通网盘SVIP享无限次导出权益
];

pathsToDelete.forEach(function(path) {
    var parts = path.split('.');
    var current = json;
    for (var i = 0; i < parts.length; i++) {
        if (i === parts.length - 1) {
            delete current[parts[i]];
        } else {
            current = current[parts[i]];
            if (!current) break;
        }
    }
});

$done({ body: JSON.stringify(json) });