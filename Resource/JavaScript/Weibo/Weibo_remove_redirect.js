/*
引用地址：https://raw.githubusercontent.com/RuCu6/QuanX/main/Scripts/weibo.js
*/
// 2023-08-29 21:50
const weibor = /https?:\/\/weibo\.cn\/sinaurl\?(.*&)?(u|toasturl|goto)=(.*?)(&.*)?$/;
const weibor2 = /https:\/\/shop\.sc\.weibo\.com\/h5\/jump\/error\?(.*&)?url=(.*)/;

const oldurl = $request.url;
let newurl = "";
if (oldurl.indexOf("weibo.cn/sinaurl") !== -1) {
    newurl = decodeURIComponent(weibor.exec(oldurl)[3]);
} else if (oldurl.indexOf("shop.sc.weibo.com/h5/jump/error") !== -1) {
    newurl = decodeURIComponent(weibor2.exec(oldurl)[2]);
}

newurl = newurl.indexOf("http") == 0 ? newurl : "http://" + newurl;
const isQuanX = typeof $notify != "undefined";
const isLoon = typeof $loon != "undefined";
const newstatus = isQuanX ? "HTTP/1.1 302 Temporary Redirect" : 302;
const noredirect = isLoon
  ? { status: newstatus, body: "loon", headers: { Location: newurl } }
  : { status: newstatus, headers: { Location: newurl } };

let resp = isQuanX ? noredirect : { response: noredirect };
resp = typeof $response != "undefined" ? noredirect : resp;
$done(resp);