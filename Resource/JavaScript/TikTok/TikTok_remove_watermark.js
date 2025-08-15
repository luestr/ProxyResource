var watermark = (data) => {
	try {
		let body = JSON.parse(data);
		if (body.data) body.data = Follow(body.data);
		if (body.aweme_list) body.aweme_list = Feed(body.aweme_list);
		if (body.aweme_detail) body.aweme_detail = Share(body.aweme_detail);
		if (body.aweme_details) body.aweme_details = Feed(body.aweme_details);
		$done({ body: JSON.stringify(body) });
	} catch (err) {
		console.log("替换异常\n" + err);
		$done({});
	}
}

watermark($response.body);

function Follow(data) {
	if (data && data.length > 0) {
		for (let i in data) {
			if (data[i].aweme.video) download_list(data[i].aweme);
		}
	}
	return data;
}

function Feed(aweme_list) {
	if (aweme_list && aweme_list.length > 0) {
		aweme_list = aweme_list.filter(i => !(i.is_ads === true));
		for (let i in aweme_list) {
			if (aweme_list[i].video) {
				download_list(aweme_list[i]);
			}
		}
	}
	return aweme_list;
}

function Share(aweme_detail) {
	if (aweme_detail.video) download_list(aweme_detail);
	return aweme_detail;
}

function download_list(list) {
	list.prevent_download = false;
	list.status.reviewed = 1;
	list.video_control.allow_download = true;
	list.video_control.prevent_download_type = 0;
	delete list.video.misc_download_addrs;
	list.video.download_addr = list.video.play_addr;
	list.video.has_watermark = false;
	list.video.download_suffix_logo_addr = list.video.play_addr;
	list.aweme_acl.download_general.mute = false;
	if (list.aweme_acl.download_general.extra) {
		delete list.aweme_acl.download_general.extra;
		list.aweme_acl.download_general.code = 0;
		list.aweme_acl.download_general.show_type = 2;
		list.aweme_acl.download_general.transcode = 3;
		list.aweme_acl.download_mask_panel = list.aweme_acl.download_general;
		list.aweme_acl.share_general = list.aweme_acl.download_general;
	}
	if (list.image_post_info && list.image_post_info.images) {
		for (let i in list.image_post_info.images) {
			list.image_post_info.images[i].owner_watermark_image.url_list = list.image_post_info.images[i].display_image.url_list;
			list.image_post_info.images[i].user_watermark_image.url_list = list.image_post_info.images[i].thumbnail.url_list;
		}
		list.without_watermark = true;
	}
	return list;
}