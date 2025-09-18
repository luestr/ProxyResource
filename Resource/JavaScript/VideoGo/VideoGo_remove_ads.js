// 2024-07-09 17:30:04
if ($request.url.includes("/valueadded/operation/config/master/station")) {
    var json = JSON.parse($response.body);

    // 删除 - 健康咨询
    if (json.stationInfo && json.stationInfo.groupList && json.stationInfo.groupList[1] && json.stationInfo.groupList[1].serviceList && json.stationInfo.groupList[1].serviceList[9]) {
        delete json.stationInfo.groupList[1].serviceList[9];
    }

    // 删除 - 保险服务
    if (json.stationInfo && json.stationInfo.groupList && json.stationInfo.groupList[1] && json.stationInfo.groupList[1].serviceList && json.stationInfo.groupList[1].serviceList[10]) {
        delete json.stationInfo.groupList[1].serviceList[10];
    }

    $done({ body: JSON.stringify(json) });
} else {
    $done({ body: $response.body });
}