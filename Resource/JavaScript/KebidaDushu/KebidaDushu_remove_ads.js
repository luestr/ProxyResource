// 脚本引用 https://raw.githubusercontent.com/Yuheng0101/X/main/Scripts/FanShu/No_Ads.js
// https://www.npmjs.com/package/base-64
// prettier-ignore
const base64=(()=>{var r=function(r){this.message=r};(r.prototype=new Error).name="InvalidCharacterError";var t=function(t){throw new r(t)},e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=/[\t\n\f\r ]/g;return{encode:function(r){r=String(r),/[^\0-\xFF]/.test(r)&&t("The string to be encoded contains characters outside of the Latin1 range.");for(var a,n,c,o,h=r.length%3,d="",i=-1,A=r.length-h;++i<A;)a=r.charCodeAt(i)<<16,n=r.charCodeAt(++i)<<8,c=r.charCodeAt(++i),d+=e.charAt((o=a+n+c)>>18&63)+e.charAt(o>>12&63)+e.charAt(o>>6&63)+e.charAt(63&o);return 2==h?(a=r.charCodeAt(i)<<8,n=r.charCodeAt(++i),d+=e.charAt((o=a+n)>>10)+e.charAt(o>>4&63)+e.charAt(o<<2&63)+"="):1==h&&(o=r.charCodeAt(i),d+=e.charAt(o>>2)+e.charAt(o<<4&63)+"=="),d},decode:function(r){var n=(r=String(r).replace(a,"")).length;n%4==0&&(n=(r=r.replace(/==?$/,"")).length),(n%4==1||/[^+a-zA-Z0-9/]/.test(r))&&t("Invalid character: the string to be decoded is not correctly encoded.");for(var c,o,h=0,d="",i=-1;++i<n;)o=e.indexOf(r.charAt(i)),c=h%4?64*c+o:o,h++%4&&(d+=String.fromCharCode(255&c>>(-2*h&6)));return d},version:"1.0.0"}})();
// https://www.npmjs.com/package/utf8
// prettier-ignore
const utf8=(()=>{var r,n,t,o=String.fromCharCode;function e(r){for(var n,t,o=[],e=0,i=r.length;e<i;)(n=r.charCodeAt(e++))>=55296&&n<=56319&&e<i?56320==(64512&(t=r.charCodeAt(e++)))?o.push(((1023&n)<<10)+(1023&t)+65536):(o.push(n),e--):o.push(n);return o}function i(r){if(r>=55296&&r<=57343)throw Error("Lone surrogate U+"+r.toString(16).toUpperCase()+" is not a scalar value")}function u(r,n){return o(r>>n&63|128)}function f(r){if(!(4294967168&r))return o(r);var n="";return 4294965248&r?4294901760&r?4292870144&r||(n=o(r>>18&7|240),n+=u(r,12),n+=u(r,6)):(i(r),n=o(r>>12&15|224),n+=u(r,6)):n=o(r>>6&31|192),n+=o(63&r|128)}function a(){if(t>=n)throw Error("Invalid byte index");var o=255&r[t];if(t++,128==(192&o))return 63&o;throw Error("Invalid continuation byte")}function c(){var o,e;if(t>n)throw Error("Invalid byte index");if(t==n)return!1;if(o=255&r[t],t++,!(128&o))return o;if(192==(224&o)){if((e=(31&o)<<6|a())>=128)return e;throw Error("Invalid continuation byte")}if(224==(240&o)){if((e=(15&o)<<12|a()<<6|a())>=2048)return i(e),e;throw Error("Invalid continuation byte")}if(240==(248&o)&&(e=(7&o)<<18|a()<<12|a()<<6|a())>=65536&&e<=1114111)return e;throw Error("Invalid UTF-8 detected")}return{version:"3.0.0",encode:function(r){for(var n=e(r),t=n.length,o=-1,i="";++o<t;)i+=f(n[o]);return i},decode:function(i){r=e(i),n=r.length,t=0;for(var u,f=[];!1!==(u=c());)f.push(u);return function(r){for(var n,t=r.length,e=-1,i="";++e<t;)(n=r[e])>65535&&(i+=o((n-=65536)>>>10&1023|55296),n=56320|1023&n),i+=o(n);return i}(f)}}})();
// ------------------------------------------------------------
const Pathname = /^(?:https?:\/\/)?[^\/]+(\/[^?#]*)?/.exec($request.url)?.[1];
const Status = $response.status ?? $request.statusCode;
if (Status !== 200) {
    console.log("非 200 状态码‼️ ‼️" + Status);
    $done({});
}
const EncryptionOrNot =
    `${$response.headers["reqentryption"] ?? $response.headers["reqEntryption"]}`.toLowerCase() ===
    "base64";
// ------------------------------------------------------------
const Home_Category_Selection = [
    // "mainBusiness", // 金刚位 - 菜单
    "rankAlgorithm", // 榜单
    "newReport", // 近期新书
    "editorRecommend", // 编辑推荐
    "book", // 讲书
    "singleBookList", // 书单
    "course" // 课程
];
const Book_Category_Selection = [
    "newBooks", // 本周新书
    "studyHistory", // 最近在学
    "recommendBookList", // 书单推荐
    "speakers", // 主讲人
    "recommendBook", // 专属推荐
    "algorithmRecom" // 算法推荐
];
const User_Setting_Selection = [
    // "227", // 帆书企业版 - 展示[企业版]
    // "141", // 邀请好友页（邀请有礼） - 展示[邀请有礼]
    // "148", // 组队读书 - 展示[组队读书]
    // "153", // web页面 - 展示[职业福利]
    // "216", // 我的-更多服务页面 - 展示[更多服务]
    // "228" // 签到任务中心页 - 展示[大学生福利]
];
// ------------------------------------------------------------
let Decode_Body = jsonParse(
    EncryptionOrNot ? utf8.decode(base64.decode($response.body)) : $response.body,
    null
);
if (Decode_Body === null) {
    console.log("响应体解析失败‼️" + $response.body);
    $done({});
}
// ------------------------------------------------------------
// console.log(jsonStr(Decode_Body, null, 2));
// 课程菜单优化
if (Pathname.includes("/chief-orch/home/bookPortal/v105/category")) {
    const headCategories = Decode_Body.data.headCategories;
    Decode_Body.data.headCategories = headCategories.filter((item) => {
        return item.code !== "web";
    });
}
// 各页面banner
if (Pathname.includes("/abtest-front/banner-modular/get")) {
    if (Decode_Body?.data?.banners?.length) {
        console.log(
            `[Banner] - [${Decode_Body.data?.moduleCode}] - [${Decode_Body.data?.planName}] - 移除`
        );
        Decode_Body.data.banners = [];
    }
}
// 听书首页优化
if (Pathname.includes("/resource-orchestration-system/book/channel/v100/info")) {
    Decode_Body.data.moduleList.forEach((item) => {
        if (Book_Category_Selection.includes(item.moduleCode)) {
            console.log(`${item.moduleCode} - [${item.moduleName}] - 保留`);
            item.showFlag = true;
        } else {
            console.log(`${item.moduleCode} - [${item.moduleName}] - 移除`);
            item.showFlag = false;
        }
    });
}
// 个人信息页优化
if (Pathname.includes("/fs-member/user/profile/v100/detail")) {
    Decode_Body.data.vipInfos = [];
}
// 首页优化
if (Pathname.includes("/chief-orch/home/bookPortal/v111/forApp")) {
    const modules = Decode_Body.data.modules;
    Decode_Body.data.modules = modules.filter((item) => {
        return Home_Category_Selection.includes(item.moduleCode);
    });
}
// 个人设置项优化
if (Pathname.includes("/sns-orchestration-system/homePage/api/v100/myPage")) {
    Decode_Body.data.vipConfig.vipConfigs = [];
    Decode_Body.data.serviceCenter.services = Decode_Body.data.serviceCenter?.services?.filter(
        (item) => {
            return User_Setting_Selection.includes(item.linkId);
        }
    );
}
// 会员任务去除
if (Pathname.includes("/task-orchestration/taskCenter/api/v101/taskList")) {
    Decode_Body.data.taskInfoList = [];
}
// 听书页优化
if (Pathname.includes("/resource-orchestration-system/book/v101/content")) {
    if (Decode_Body.data?.bookComponent) {
        for (const item of Decode_Body.data.bookComponent) {
            if (item.hasOwnProperty("compBanner")) {
                delete item.compBanner;
            }
        }
    }
}
// 听书页下方横幅
if (Pathname.includes("/user-orchestration/user/api/v101/ceiltip")) {
    Decode_Body.data = true;
}
// ------------------------------------------------------------
$done({
    body: EncryptionOrNot ? base64.encode(utf8.encode(jsonStr(Decode_Body))) : jsonStr(Decode_Body)
});

function jsonParse(json, defaultValue) {
    try {
        return JSON.parse(`${json}`);
    } catch {
        return defaultValue ?? json;
    }
}
function jsonStr(json, ...args) {
    if (typeof json === "string") return json;
    try {
        return JSON.stringify(json, ...args);
    } catch {
        return json;
    }
}