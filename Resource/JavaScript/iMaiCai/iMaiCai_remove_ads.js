let data = JSON.parse($response.body);
data.aidata_dd_resource_config?.data?.customer?.feature_src_list?.ad && delete data.aidata_dd_resource_config.data.customer.feature_src_list.ad;
$done({ body: JSON.stringify(data) });