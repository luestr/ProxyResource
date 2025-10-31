/*
2025-05-18 01:29:34
by 可莉
*/

(() => {
    if (typeof $response === 'undefined' || !$response?.body) {
        console.log('无响应体或$response未定义');
        return $done({});
    }
    
    let modified = false;
    let body;
    
    try {
        body = JSON.parse($response.body);
    } catch (e) {
        console.log(`JSON解析失败: ${e.message}`);
        return $done({});
    }

    if (Array.isArray(body?.media)) {
        const originalLength = body.media.length;
        body.media = body.media.filter(item => {
            if (item && typeof item === 'object' && 'type' in item) {
                return item.type !== 'video';
            }
            return true;
        });
        modified = originalLength !== body.media.length;
        
        if (modified) {
            console.log(`移除了 ${originalLength - body.media.length} 条视频内容`);
        }
    }

    $done(modified ? {
        body: JSON.stringify(body),
    } : {});
})();