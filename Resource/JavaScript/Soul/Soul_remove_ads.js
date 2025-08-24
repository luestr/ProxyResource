/*
脚本引用 https://raw.githubusercontent.com/RuCu6/Loon/main/Scripts/soul.js
*/
// 2024-10-15 10:20

const url = $request.url;
if (!$response || !$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("/chat/limitInfo")) {
  // 私聊限制
  if (obj?.data?.limit) {
    obj.data.limit = false;
  }
} else if (url.includes("/v6/planet/config")) {
  const gamesToRemove = ["异世界回响", "狼人魅影", "梦想海岛王", "幻想星球", "爆弹喵", "星球实验室", "兴趣群组", "群聊派对"];
  if (obj?.data?.gameInfo?.gameCards?.length > 0) {
    obj.data.gameInfo.gameCards = obj.data.gameInfo.gameCards.filter((card) => !gamesToRemove.includes(card.title));
  }
  if (obj.data?.coreCards?.length > 0) {
    obj.data.coreCards = obj.data.coreCards.filter((card) => !gamesToRemove.includes(card.title));
    obj.data.coreCards.forEach((card) => {
      if (card?.secondCards?.length > 0) {
        card.secondCards = card.secondCards.filter((sc) => !gamesToRemove.includes(sc.title));
      }
    });
    obj.data.coreCards = obj.data.coreCards.map((card) => {
      if (card.style === 2) {
        card.style = 1;
      }
      return card;
    });
  }
} else if (url.includes("/homepage/diamond/position/info")) {
  if (obj?.data?.length > 0) {
    obj.data = obj.data.filter((item) => !["GIFT_WALL", "PET_PLANET", "SHOP"]?.includes(item.code));
  }
} else if (url.includes("/chatroom/chatClassifyRoomList")) {
  if (obj?.data?.roomList?.length > 0) {
    obj.data.roomList = [];
  }
} else if (url.includes("/post/recSquare/subTabs")) {
  if (obj?.data?.length > 0) {
    obj.data = obj.data.filter((item) => [2, 6, 7].includes(item.tabType));
  }
}

$done({ body: JSON.stringify(obj) });