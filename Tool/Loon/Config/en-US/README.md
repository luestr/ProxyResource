### Configuration Instructions

Applicable Software: [Loon](https://apps.apple.com/app/loon/id1373567447)

Configuration Author: [可莉🅥](https://t.me/iKeLee)

Update Date: Refer to the configuration file

Applicable Version: Latest version on App Store

### Importing Configuration

##### Clicking the link below will immediately start importing the configuration file and ask if you really want to import it. Please confirm before importing.

##### You should back up your current configuration file before importing: click [Configuration] → [Export] → [Save to "Files"]


### Inventory of Configuration Files

[Auto-Select config](loon://import?sub=https://raw.githubusercontent.com/luestr/ProxyResource/main/Tool/Loon/Config/Loon_Auto-Select_Configuration_By_iKeLee.conf) - This configuration file automatically selects the node with the lowest network latency, eliminating the need for manual intervention. The entire process is fully automated.

[Advanced config](loon://import?sub=https://raw.githubusercontent.com/luestr/ProxyResource/main/Tool/Loon/Config/Loon_Advanced_Configuration_By_iKeLee.conf) - This configuration file enables you to automatically select the node with the lowest network latency, eliminating the need for manual intervention. The entire process is fully automated. When connected to a router equipped with a transparent proxy, your Loon will establish connections using the "DIRECT" policy, allowing direct access to restricted websites through your router. Conversely, when using other networks, access to these websites will be achieved through Loon's own proxy mode. This prevents potential double-proxy situations that might arise when connected to a router already employing a transparent proxy.

[Manual node selection config](loon://import?sub=https://raw.githubusercontent.com/luestr/ProxyResource/main/Tool/Loon/Config/Loon_Selection_Configuration_By_iKeLee.conf) - This configuration file requires you to manually select the desired proxy server. It does not automatically switch servers if a failure occurs, so your intervention is needed to choose an available alternative.

[Simple config](loon://import?sub=https://raw.githubusercontent.com/luestr/ProxyResource/main/Tool/Loon/Config/Loon_Simple_Configuration_By_iKeLee.conf) - This configuration file is designed for simplicity, featuring a single policy group. Its straightforward nature allows for effortless setup and immediate usability.

[Basic config](loon://import?sub=https://raw.githubusercontent.com/luestr/ProxyResource/main/Tool/Loon/Config/Loon_Basic_Configuration_By_iKeLee.conf) - This configuration file can serve as a foundation for creating your own custom configurations. It doesn't include any policy groups and is primarily intended for troubleshooting errors in your own configurations and as a starting point for building your personalized setup.

[tvOS config](loon://import?sub=https://raw.githubusercontent.com/luestr/ProxyResource/main/Tool/Loon/Config/Loon_tvOS_Configuration_By_iKeLee.conf) - This configuration file is specifically designed for tvOS. Some policy groups will automatically select the proxy server with the lowest network latency, while others require you to manually choose a server.

### Usage Instructions

1. After importing the configuration, please [switch to automatic flow mode](https://www.nsloon.com/openloon/flowmodel=filter).

2. Go to the [Configuration] interface and turn on the switches for [Script], [Rewrite], and [MitM].

3. Install and trust the certificate.

4. Add your subscription.

5. Turn on Loon and start surfing! 