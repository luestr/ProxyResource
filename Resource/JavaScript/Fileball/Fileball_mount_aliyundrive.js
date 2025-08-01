//阿里云挂载魔改surge版 ，原作者Chosen Ome
var url = $request.url;
//console.log(url);
var accessToken = $persistentStore.read("ali_access_token") ?? "";
var driveId = $persistentStore.read("ali_drive_id") ?? "";

var headers = {
	Referer: "https://www.aliyundrive.com/",
	"User-Agent":
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
	"Content-Type": "application/json",
};
var myResponse = {
	status: 200,
};
var obj = {};

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

function http(req) {
	return new Promise((res) => {
		$httpClient.post(req, (err, resp, data) => {
			res(JSON.parse(data));
		});
	});
}

!(async () => {
	if (url.indexOf("/webapi/auth.cgi") != -1) {
		// 登录接口，替换为刷新refresh token
		const body = $request.body;
		const password = body.match(/passwd=([^&]*)/)[1];
		const refreshToken = $persistentStore.read("ali_refresh_token") ?? password;
		const data = {
			refresh_token: refreshToken,
			grant_type: "refresh_token",
		};
		const req = {
			url: "https://auth.aliyundrive.com/v2/account/token",
			headers: headers,
			body: JSON.stringify(data),
		};

		const json = await http(req);

		if (json.refresh_token && json.access_token && json.default_drive_id) {
			$persistentStore.write(json.refresh_token, "ali_refresh_token");
			$persistentStore.write(json.access_token, "ali_access_token");
			$persistentStore.write(json.default_drive_id, "ali_drive_id");
			obj = {
				success: true,
				data: {
					sid: json.access_token,
				},
			};
			myResponse.body = JSON.stringify(obj);

			$done({ response: myResponse });
		}
	} else if (url.match(/entry\.cgi$/)) {
		const body = $request.body;
		if (typeof body === "string") {
			// 当前的请求为加载目录
			if (body.indexOf("list_share") != -1 || body.indexOf("method=list") != -1) {
				headers.authorization = "Bearer " + accessToken;
				const parentId =
					body.match(/folder_path=([^&]*)/) === null ? "root" : body.match(/folder_path=([^&]*)/)[1];
				var isRootFolder = parentId === "root";
				const data = {
					drive_id: driveId,
					fields: "*",
					parent_file_id: parentId,
					limit: 200,
				};
				const req = {
					url: "https://api.aliyundrive.com/v2/file/list",
					headers: headers,
					body: JSON.stringify(data),
				};

				const items = (await http(req)).items;
				var files = [];
				items.forEach(function (item) {
					const file = {
						isdir: item.type === "folder",
						path: item.file_id,
						name: item.name,
						additional: {
							size: item.size,
						},
					};
					files.push(file);
				});
				const result = isRootFolder
					? {
							total: 0,
							offset: 0,
							shares: files,
					  }
					: {
							total: 0,
							offset: 0,
							files: files,
					  };
				obj = {
					success: true,
					data: result,
				};
				myResponse.body = JSON.stringify(obj);
				$done({ response: myResponse });
			}
		}
	}else{
	const fileid =
	url.match("fbdownload") ?
hex2str( url.match(/dlink=%22(.*)%22/)[1] ) : url.match(/path=(.*$)/)[1];
	const body = {
			drive_id: driveId,
			expire_sec: 14400,
			file_id: fileid,
		};
		headers.authorization = "Bearer " + accessToken;
		const req = {
			url: "https://api.aliyundrive.com/v2/file/get_download_url",
			headers: headers,
			body: JSON.stringify(body),
		};
		const link = (await http(req)).url;
		
		$done({ response: { status: 302, headers: { Location: link } } });
}
})();