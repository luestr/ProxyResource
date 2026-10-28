## 插件介绍
将Quantumult X重写、Surge模块、Quantumult X规则、Stash规则和Clash的规则转换为Loon能识别的格式，仅支持来自GitHub和GitLab的远程资源。

## 使用说明
Quantumult X重写需要在地址末尾加上qx

Surge模块需要在地址末尾加上sg

在规则集链接末尾加上r_parser.list

## 参数说明
### 重写转换 
**n=** 修改名字+简介，名字和简介以“+”相连，可缺省名字或简介

**y=** 根据关键词保留相关重写（即去掉注释）多关键词以“+”分隔

**x=** 根据关键词排除相关重写（即添加注释）多关键词以“+”分隔

**i=** 关闭随机插件图标（仅需传入i=即可，仅Loon需要此参数）

**del=** 从转换结果中剔除被注释的重写（仅需传入del=即可）

**hnadd=** 添加MITM主机名，多主机名以","分隔

**hndel=** 从已有MITM主机名中删除主机名，多主机名以","分隔（需要传入完整主机名）

**jsc=** 根据关键词为脚本启用脚本转换（多关键词以"+"分隔，主要用途 将使用了QX独有API的脚本转换为通用脚本，**谨慎开启，大部分脚本本身就通用，无差别启用，只会徒增功耗**）

在链接后加“?”使用参数，不同参数用“&”连接。

示例 https://raw.githubusercontent.com/chengkongyiban/Surge/main/modules/bilibili.sgmodule?n=B站去广告+bilibili&y=魔改皮肤+Region&x=upos+简体字幕

### 规则集转换
**y=** 根据关键词保留相关规则（即去掉注释）多关键词以"+"分隔

**x=** 根据关键词排除相关规则（即去掉注释）多关键词以"+"分隔

**nore=** 为IP规则开启不解析域名（即no-resolve参数，仅需传入nore=）

示例 https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/filter/fenliu.listr_parser.list?x=baidu+jd&nore=

## 关于需要开启binary-mode的脚本说明
因为Quantumult X重写中对此类脚本没有特殊标记，仅能靠脚本名判断。如Maasea的YouTube去广告脚本没有以proto.js结尾，故转换后不会正确识别并开启，surge的可以正确识别并开启。

## 鸣谢
原创[@小白脸](tg://user?id=414317162)

修改[@chengkongyiban](https://github.com/chengkongyiban)

感谢[@xream](https://github.com/xream)提供的[replace-header.js](https://github.com/xream/scripts/raw/main/surge/modules/replace-header/index.js)、[echo-response.js](https://github.com/xream/scripts/raw/main/surge/modules/echo-response/index.js)和[script-converter.js](https://raw.githubusercontent.com/xream/scripts/main/surge/modules/script-converter/script-converter.js)。

感谢[@mieqq](https://github.com/mieqq)提供的[replace-body.js](https://github.com/mieqq/mieqq/raw/master/replace-body.js)
插件图标用的[@Keikinn](https://github.com/Keikinn)的[StickerOnScreen](https://github.com/KeiKinn/StickerOnScreen)项目，感谢！