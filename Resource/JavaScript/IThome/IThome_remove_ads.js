// 2025-10-09 22:29:11

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

    // 获取参数值
    const removeAllBanners = $argument?.removeAllBanners !== undefined ? $argument.removeAllBanners : true;
    const removePinnedArticles = $argument?.removePinnedArticles !== undefined ? $argument.removePinnedArticles : true;
    
    // 移除全部横幅
    const removeAllBannersFunc = () => {
        if (!removeAllBanners) return;
        
        if (Array.isArray(body?.data?.list)) {
            const originalLength = body.data.list.length;
            body.data.list = body.data.list.filter(item => 
                item.feedType !== 10002
            );
            modified ||= (originalLength !== body.data.list.length);
        }
    };
    
    // 移除置顶文章
    const removePinnedArticlesFunc = () => {
        if (!removePinnedArticles) return;
        
        if (Array.isArray(body?.data?.list)) {
            const originalLength = body.data.list.length;
            body.data.list = body.data.list.filter(item => 
                item.feedType !== 10003
            );
            modified ||= (originalLength !== body.data.list.length);
        }
    };
    
    // 移除横幅广告
    const removeBannerAdsFunc = () => {
        if (!Array.isArray(body?.data?.list)) return;
        
        body.data.list.forEach(item => {
            if (item.feedContent?.focusNewsData && Array.isArray(item.feedContent.focusNewsData)) {
                const originalLength = item.feedContent.focusNewsData.length;
                item.feedContent.focusNewsData = item.feedContent.focusNewsData.filter(ad => 
                    !ad.isAd
                );
                modified ||= (originalLength !== item.feedContent.focusNewsData.length);
            }
        });
    };
    
    // 移除信息流广告（合并：flag===2 或 feedType===10004，任一满足即移除）
    const removeFeedAdsFunc = () => {
        if (!Array.isArray(body?.data?.list)) return;
        
        const originalLength = body.data.list.length;
        body.data.list = body.data.list.filter(item => 
            !(item.feedContent?.flag === 2 || item.feedType === 10004)
        );
        modified ||= (originalLength !== body.data.list.length);
    };
    
    // 执行所有过滤函数
    removeAllBannersFunc();
    removePinnedArticlesFunc();
    removeBannerAdsFunc();
    removeFeedAdsFunc();
    
    // 仅在修改时重新序列化
    $done(modified ? {
        body: JSON.stringify(body),
    } : {});
})();