// 2024-07-19 09:51:31
const url = $request.url;
var newBody = {}

const processResponse = (regex, filterFunc) => {
    if (regex.test(url)) {
        let obj = JSON.parse($response.body);
        console.log($response.body)
        filterFunc(obj);
        console.log(JSON.stringify(obj))
        newBody = { body: JSON.stringify(obj) }
    }
};

const filterNewcomerAndMall = obj => {
    if (obj.data && obj.data.home_type) {
        obj.data.home_type = obj.data.home_type.filter(item => item.name !== "新人" && item.name !== "新作"); // 首页标签
    }
    if (obj.data && obj.data.home_feed) {
        obj.data.home_feed = obj.data.home_feed.filter(item => item.name !== "商城"); // 首页标签
    }
};

const filterNoTraffic = obj => {
    if (obj.data && obj.data.confs) {
        obj.data.confs = obj.data.confs.filter(item => item.title !== "漫画商城" && item.title !== "超漫俱乐部" && item.title !== "看漫免流量"); // 我的页面
    }
};

// const filterNovelBanners = obj => {
//     if (obj.data && obj.data.banners) {
//         delete obj.data.banners; // 小说列表横幅 - 删除会导致小说列表为空
//     }
// };

processResponse(/\/twirp\/comic\.v\d\.Comic\/GetClassPageAllTabs/, filterNewcomerAndMall);
processResponse(/\/twirp\/user\.v\d\.User\/UCenterConf/, filterNoTraffic);
// processResponse(/\/twirp\/novel\.v\d\.Home\/Home/, filterNovelBanners);

$done(newBody);