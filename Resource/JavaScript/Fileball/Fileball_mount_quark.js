let url = $request.url;
let body = $request.body;

let ck =
	$persistentStore.read("quark-ck") ||
	((ck) => {
		$persistentStore.write(ck, "quark-ck");
		return ck;
	})(decodeURIComponent(body.match(/passwd=([^&]+)/)[1]));

let req = {
	url: "https://drive.quark.cn/1/clouddrive/file/sort?_fetch_total=1&_page=1&_size=100&fr=pc&pdir_fid=0&pr=ucpro",
	headers: { cookie: ck, "content-type": "application/json" },
};

!(async () => {
	switch (url.match(/(auth|entry)\.cgi$/)?.[0]) {
		case "auth.cgi":
			$done({ response: { status: 200, body: '{"success":true,"data":{"sid":""}}' } });
			break;
		case "entry.cgi":
			if (body.match("Delete&")) {
				//删除文件
				req.url = "https://drive.quark.cn/1/clouddrive/file/delete?fr=pc&pr=ucpro";
				req.body = `{"action_type":1,"exclude_fids":[],"filelist":["${body.match(/path=([^&]+)/)[1]}"]}`;
				$done(req);
			} else {
				//加载目录
				let path = body.match(/folder_path=([^&]+)/)?.[1];
				let a = path ? ((req.url = req.url.replace(/pdir_fid=0/, `pdir_fid=${path}`)), "files") : "shares";
				let items = (await http(req, "get", 1)).data.list;
				let shares = JSON.stringify(
					items.map((item) => {
						return {
							isdir: !item.file,
							path: item.fid,
							name: item.file_name,
							additional: { size: item.size },
						};
					}),
				);
				$done({
					response: { status: 200, body: `{"success":true,"data":{"total":0,"offset":0,"${a}":${shares}}}` },
				});
			}
			break;
		default:
			//加载文件
			let fids = url.match("fbdownload") ? hex2str(url.match(/dlink=%22(.*)%22/)[1]) : url.match(/path=(.*$)/)[1];
			req.url = "http://drive.quark.cn/1/clouddrive/file/download?fr=pc&pr=ucpro";
			req.body = `{"fids":["${fids}"]}`;
			let link = (await http(req, "post")).data[0].download_url.replace(/https/, "http");
			$request.url = link;
			$request.headers.cookie = ck;
			delete $request.headers.Host;
			$done($request);
             
	}
})();

function http(req, method = "get", set) {
	return new Promise((res) => {
		$httpClient[method](req, (err, resp, data) => {
			//刷新ck
			set &&
				((set = resp.headers?.["Set-Cookie"]?.split(";")[0]), set) &&
				$persistentStore.write(ck.replace(/[^;]+/, set), "quark-ck");
			res(JSON.parse(data));
		});
	});
}

function hex2str(hex) {
	var trimedStr = hex.trim();
	var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
	var len = rawStr.length;
	if (len % 2 !== 0) {
		return "";
	}
	var curCharCode;
	var resultStr = [];
	for (var i = 0; i < len; i = i + 2) {
		curCharCode = parseInt(rawStr.substr(i, 2), 16);
		resultStr.push(String.fromCharCode(curCharCode));
	}
	return resultStr.join("");
}
