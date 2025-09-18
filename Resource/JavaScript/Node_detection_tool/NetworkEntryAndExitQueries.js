// 脚本引用 https://raw.githubusercontent.com/xream/scripts/main/surge/modules/network-info/net-lsp-x.js
const NAME = 'network-info'
const $ = new Env(NAME)

let arg
if (typeof $argument != 'undefined') {
  arg = Object.fromEntries($argument.split('&').map(item => item.split('=')))
} else {
  arg = {}
}
$.log(`传入的 $argument: ${$.toStr(arg)}`)
// if (typeof $loon === 'string') {
//   // const build = $loon.match(/\(\s*?(\d+)\s*?\)\s*?$/)?.[1]
//   // $.log(`当前 Loon Build: ${build}`)
//   $.log(`当前版本: ${$loon}`)
// }

arg = { ...arg, ...$.getjson(NAME, {}) }

$.log(`从持久化存储读取参数后: ${$.toStr(arg)}`)

if (typeof $environment !== 'undefined' && $.lodash_get($environment, 'executor') === 'event-network') {
  $.log(`QX 事件脚本不能带参 修正运行环境`)
  $.lodash_set(arg, 'TYPE', 'EVENT')
}

if (!isInteraction() && !isRequest() && !isTile() && !isPanel()) {
  $.log(`参数为空 非可交互操作, 非请求, 非面板的情况下, 修正运行环境`)
  $.lodash_set(arg, 'TYPE', 'EVENT')
}

if (isRequest()) {
  // $.log($.toStr($request))
  arg = { ...arg, ...parseQueryString($request.url) }
  $.log(`从请求后读取参数后: ${$.toStr(arg)}`)
}

const keya = 'spe'
const keyb = 'ge'
const keyc = 'pin'
const keyd = 'gan'
const keye = 'pi'
const keyf = 'ob'
const keyg = 'qi'
const keyh = 'xin'
const bay = 'edtest'

let result = {}
let proxy_policy = ''
let title = ''
let content = ''
!(async () => {
  if ($.lodash_get(arg, 'TYPE') === 'EVENT') {
    const eventDelay = parseFloat($.lodash_get(arg, 'EVENT_DELAY') || 3)
    $.log(`网络变化, 等待 ${eventDelay} 秒后开始查询`)
    if (eventDelay) {
      await $.wait(1000 * eventDelay)
    }
  }
  if (isTile()) {
    await notify('入口落地查询', '面板', '开始查询')
  }

  let SSID = ''
  let LAN = ''
  let LAN_IPv4 = ''
  let LAN_IPv6 = ''
  if (typeof $network !== 'undefined') {
    $.log($.toStr($network))
    const v4 = $.lodash_get($network, 'v4.primaryAddress')
    const v6 = $.lodash_get($network, 'v6.primaryAddress')
    if ($.lodash_get(arg, 'SSID') == 1) {
      SSID = $.lodash_get($network, 'wifi.ssid')
    }
    if (v4 && $.lodash_get(arg, 'LAN') == 1) {
      LAN_IPv4 = v4
    }
    if (v6 && $.lodash_get(arg, 'LAN') == 1 && $.lodash_get(arg, 'IPv6') == 1) {
      LAN_IPv6 = v6
    }
  } else if (typeof $config !== 'undefined') {
    try {
      let conf = $config.getConfig()
      $.log(conf)
      conf = JSON.parse(conf)
      if ($.lodash_get(arg, 'SSID') == 1) {
        SSID = $.lodash_get(conf, 'ssid')
      }
    } catch (e) {}
  } else if (typeof $environment !== 'undefined') {
    try {
      $.log($.toStr($environment))
      const version = $.lodash_get($environment, 'version')
      const os = version?.split(' ')?.[0]
      // QX 上 macOS/iOS 不一致
      if (os !== 'macOS' && $.lodash_get(arg, 'SSID') == 1) {
        SSID = $.lodash_get($environment, 'ssid')
      } else if (os === 'macOS' && $.lodash_get(arg, 'LAN') == 1) {
        LAN_IPv4 = $.lodash_get($environment, 'ssid')
      }
    } catch (e) {}
  }
  if (LAN_IPv4 || LAN_IPv6) {
    LAN = ['LAN:', LAN_IPv4, maskIP(LAN_IPv6)].filter(i => i).join(' ')
  }
  if (LAN) {
    LAN = `${LAN}\n\n`
  }
  if (SSID) {
    SSID = `SSID: ${SSID}\n\n`
  } else {
    SSID = ''
  }
  let { PROXIES = [] } = await getProxies()
  let [
    { CN_IP = '', CN_INFO = '', CN_POLICY = '' } = {},
    { PROXY_IP = '', PROXY_INFO = '', PROXY_PRIVACY = '', PROXY_POLICY = '', ENTRANCE_IP = '' } = {},
    { CN_IPv6 = '' } = {},
    { PROXY_IPv6 = '' } = {},
  ] = await Promise.all(
    $.lodash_get(arg, 'IPv6') == 1
      ? [getDirectRequestInfo({ PROXIES }), getProxyRequestInfo({ PROXIES }), getDirectInfoIPv6(), getProxyInfoIPv6()]
      : [getDirectRequestInfo({ PROXIES }), getProxyRequestInfo({ PROXIES })]
  )
  let continueFlag = true
  if ($.lodash_get(arg, 'TYPE') === 'EVENT') {
    const lastNetworkInfoEvent = $.getjson('lastNetworkInfoEvent')
    if (
      CN_IP !== $.lodash_get(lastNetworkInfoEvent, 'CN_IP') ||
      CN_IPv6 !== $.lodash_get(lastNetworkInfoEvent, 'CN_IPv6') ||
      PROXY_IP !== $.lodash_get(lastNetworkInfoEvent, 'PROXY_IP') ||
      PROXY_IPv6 !== $.lodash_get(lastNetworkInfoEvent, 'PROXY_IPv6')
    ) {
      // 有任何一项不同 都继续
      $.setjson({ CN_IP, PROXY_IP, CN_IPv6, PROXY_IPv6 }, 'lastNetworkInfoEvent')
    } else {
      // 否则 直接结束
      $.log('入口落地查询未发生变化, 不继续')
      continueFlag = false
    }
  }
  if (continueFlag) {
    if ($.lodash_get(arg, 'PRIVACY') == '1' && PROXY_PRIVACY) {
      PROXY_PRIVACY = `\n${PROXY_PRIVACY}`
    }
    let ENTRANCE = ''
    if (ENTRANCE_IP) {
      const { IP: resolvedIP } = await resolveDomain(ENTRANCE_IP)
      if (resolvedIP) {
        $.log(`入口域名解析: ${ENTRANCE_IP} ➟ ${resolvedIP}`)
        ENTRANCE_IP = resolvedIP
      }
    }
    if (ENTRANCE_IP && ENTRANCE_IP !== PROXY_IP) {
      const entranceDelay = parseFloat($.lodash_get(arg, 'ENTRANCE_DELAY') || 0)
      $.log(`入口: ${ENTRANCE_IP} 与落地 IP: ${PROXY_IP} 不一致, 等待 ${entranceDelay} 秒后查询入口`)
      if (entranceDelay) {
        await $.wait(1000 * entranceDelay)
      }
      let [{ CN_INFO: ENTRANCE_INFO1 = '', isCN = false } = {}, { PROXY_INFO: ENTRANCE_INFO2 = '' } = {}] =
        await Promise.all([
          getDirectInfo(ENTRANCE_IP, $.lodash_get(arg, 'DOMESTIC_IPv4')),
          getProxyInfo(ENTRANCE_IP, $.lodash_get(arg, 'LANDING_IPv4')),
        ])
      // 国内接口的国外 IP 解析过于离谱 排除掉
      if (ENTRANCE_INFO1 && isCN) {
        ENTRANCE = `入口: ${maskIP(ENTRANCE_IP) || '-'}\n${maskAddr(ENTRANCE_INFO1)}`
      }
      if (ENTRANCE_INFO2) {
        if (ENTRANCE) {
          ENTRANCE = `${ENTRANCE.replace(/^(.*?):/gim, '$1¹:')}\n${maskAddr(
            ENTRANCE_INFO2.replace(/^(.*?):/gim, '$1²:')
          )}`
        } else {
          ENTRANCE = `入口: ${maskIP(ENTRANCE_IP) || '-'}\n${maskAddr(ENTRANCE_INFO2)}`
        }
      }
    }
    if (ENTRANCE) {
      ENTRANCE = `${ENTRANCE}\n\n`
    }

    if (CN_IPv6 && isIPv6(CN_IPv6) && $.lodash_get(arg, 'IPv6') == 1) {
      CN_IPv6 = `\n${maskIP(CN_IPv6)}`
    } else {
      CN_IPv6 = ''
    }
    if (PROXY_IPv6 && isIPv6(PROXY_IPv6) && $.lodash_get(arg, 'IPv6') == 1) {
      PROXY_IPv6 = `\n${maskIP(PROXY_IPv6)}`
    } else {
      PROXY_IPv6 = ''
    }
    if ($.isSurge() || $.isStash()) {
      if (CN_POLICY === 'DIRECT') {
        CN_POLICY = ``
      } else {
        CN_POLICY = `策略: ${maskAddr(CN_POLICY) || '-'}\n`
      }
    }

    if (CN_INFO) {
      CN_INFO = `\n${CN_INFO}`
    }
    const policy_prefix = $.isQuanX() || $.isLoon() ? '节点: ' : '代理策略: '
    if (PROXY_POLICY === 'DIRECT') {
      PROXY_POLICY = `${policy_prefix}直连`
    } else if (PROXY_POLICY) {
      PROXY_POLICY = `${policy_prefix}${maskAddr(PROXY_POLICY) || '-'}`
    } else {
      PROXY_POLICY = ''
    }
    if (PROXY_POLICY) {
      proxy_policy = PROXY_POLICY
    } else {
      proxy_policy = ''
    }

    if (PROXY_INFO) {
      PROXY_INFO = `\n${PROXY_INFO}`
    }
    title = `${PROXY_POLICY}`
    content = `${SSID}${LAN}${CN_POLICY}IP: ${maskIP(CN_IP) || '-'}${CN_IPv6}${maskAddr(
      CN_INFO
    )}\n\n${ENTRANCE}落地 IP: ${maskIP(PROXY_IP) || '-'}${PROXY_IPv6}${maskAddr(PROXY_INFO)}${PROXY_PRIVACY}`
    if (!isInteraction()) {
      content = `${content}\n执行时间: ${new Date().toTimeString().split(' ')[0]}`
    }

    title = title || '入口落地查询'
    if (isTile()) {
      await notify('入口落地查询', '面板', '查询完成')
    } else if (!isPanel()) {
      if ($.lodash_get(arg, 'TYPE') === 'EVENT') {
        await notify(
          `🄳 ${maskIP(CN_IP) || '-'} 🅿 ${maskIP(PROXY_IP) || '-'}`.replace(/\n+/g, '\n').replace(/\ +/g, ' ').trim(),
          `${maskAddr(CN_INFO.replace(/(位置|运营商).*?:/g, '').replace(/\n/g, ' '))}`
            .replace(/\n+/g, '\n')
            .replace(/\ +/g, ' ')
            .trim(),
          `${maskAddr(PROXY_INFO.replace(/(位置|运营商).*?:/g, '').replace(/\n/g, ' '))}${
            CN_IPv6 ? `\n🄳 ${CN_IPv6.replace(/\n+/g, '')}` : ''
          }${PROXY_IPv6 ? `\n🅿 ${PROXY_IPv6.replace(/\n+/g, '')}` : ''}${SSID ? `\n${SSID}` : '\n'}${LAN}`
            .replace(/\n+/g, '\n')
            .replace(/\ +/g, ' ')
            .trim()
        )
      } else {
        await notify('入口落地查询', title, content)
      }
    }
  }
})()
  .catch(async e => {
    $.logErr(e)
    $.logErr($.toStr(e))
    const msg = `${$.lodash_get(e, 'message') || $.lodash_get(e, 'error') || e}`
    title = `❌`
    content = msg
    await notify('入口落地查询', title, content)
  })
  .finally(async () => {
    if (isRequest()) {
      result = {
        response: {
          status: 200,
          body: JSON.stringify(
            {
              title,
              content,
            },
            null,
            2
          ),
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          },
        },
      }
    } else {
      result = { title, content, ...arg }
    }
    $.log($.toStr(result))
    if (isInteraction()) {
      const html = `<div style="font-family: -apple-system; font-size: large">${`\n${content}${
        proxy_policy ? `\n\n${proxy_policy.replace(/^(.*?:\s*)(.*)$/, '$1<span style="color: #467fcf">$2</span>')}` : ''
      }`
        .replace(/^(.*?):/gim, '<span style="font-weight: bold">$1</span>:')
        .replace(/\n/g, '<br/>')}</div>`
      // $.log(html)
      $.done({
        title: '入口落地查询',
        htmlMessage: html,
      })
    } else {
      $.done(result)
    }
  })

async function getEntranceInfo() {
  let IP = ''
  let POLICY = ''
  if (isInteraction()) {
    try {
      if ($.isQuanX()) {
        const nodeName = $environment.params
        const { ret, error } = await $configuration.sendMessage({ action: 'get_server_description', content: nodeName })
        if (error) throw new Error(error)
        // $.log(JSON.stringify(ret, null, 2))
        const proxy = Object.values(ret)[0]
        // $.log(proxy)
        IP = proxy.match(/.+?\s*?=\s*?(.+?):\d+\s*?,.+/)[1]
        POLICY = nodeName
      } else if ($.isLoon()) {
        IP = $.lodash_get($environment, 'params.nodeInfo.address')
        POLICY = $.lodash_get($environment, 'params.node')
      }
    } catch (e) {
      $.logErr(`获取入口信息 发生错误: ${e.message || e}`)
      $.logErr(e)
      $.logErr($.toStr(e))
    }
  }
  return { IP, POLICY }
}
async function getDirectRequestInfo({ PROXIES = [] } = {}) {
  const { CN_IP, CN_INFO } = await getDirectInfo(undefined, $.lodash_get(arg, 'DOMESTIC_IPv4'))
  const { POLICY } = await getRequestInfo(
    new RegExp(
      `cip\\.cc|for${keyb}\\.${keya}${bay}\\.cn|rmb\\.${keyc}${keyd}\\.com\\.cn|api-v3\\.${keya}${bay}\\.cn|ipservice\\.ws\\.126\\.net|api\\.bilibili\\.com|api\\.live\\.bilibili\\.com|myip\\.ipip\\.net|ip\\.ip233\\.cn|ua${keye}\\.wo${keyf}x\\.cn|ip\\.im|ips\\.market\\.alicloudapi\\.com|api\\.ip\\.plus|appc\.${keyg}${keyh}\.com`
    ),
    PROXIES
  )
  return { CN_IP, CN_INFO, CN_POLICY: POLICY }
}
async function getProxyRequestInfo({ PROXIES = [] } = {}) {
  const { PROXY_IP, PROXY_INFO, PROXY_PRIVACY } = await getProxyInfo(undefined, $.lodash_get(arg, 'LANDING_IPv4'))
  let result
  if ($.isSurge() || $.isStash()) {
    result = await getRequestInfo(/ipinfo\.io|ip-score\.com|ipwhois\.app|ip-api\.com|api-ipv4\.ip\.sb/, PROXIES)
  } else if ($.isQuanX() || $.isLoon()) {
    result = await getEntranceInfo()
  }
  return {
    PROXY_IP,
    PROXY_INFO,
    PROXY_PRIVACY,
    PROXY_POLICY: $.lodash_get(result, 'POLICY'),
    ENTRANCE_IP: $.lodash_get(result, 'IP'),
  }
}
async function getRequestInfo(regexp, PROXIES = []) {
  let POLICY = ''
  let IP = ''

  try {
    if ($.isSurge()) {
      const { requests } = await httpAPI('/v1/requests/recent', 'GET')
      const request = requests.slice(0, 10).find(i => regexp.test(i.URL))
      // $.log('recent request', $.toStr(request))
      POLICY = request.policyName
      if (/\(Proxy\)/.test(request.remoteAddress)) {
        IP = request.remoteAddress.replace(/\s*\(Proxy\)\s*/, '')
      }
    } else if ($.isStash()) {
      const res = await $.http.get({
        url: `http://127.0.0.1:9090/connections`,
      })

      let body = String($.lodash_get(res, 'body') || $.lodash_get(res, 'rawBody'))
      try {
        body = JSON.parse(body)
      } catch (e) {}
      const connections = $.lodash_get(body, 'connections') || []

      const connection =
        connections.slice(0, 10).find(i => {
          const dest = $.lodash_get(i, 'metadata.host') || $.lodash_get(i, 'metadata.destinationIP')
          return regexp.test(dest)
        }) || {}
      const chain = $.lodash_get(connection, 'metadata.chain') || []
      const proxy = chain[0]
      POLICY = proxy // chain.reverse().join(' ➟ ')
      IP = PROXIES?.[proxy]?.match(/^(.*?):\d+$/)?.[1]
    }
  } catch (e) {
    $.logErr(`从最近请求中获取 ${regexp} 发生错误: ${e.message || e}`)
    $.logErr(e)
    $.logErr($.toStr(e))
  }

  return {
    POLICY,
    IP,
  }
}
async function getDirectInfo(ip, provider) {
  let CN_IP
  let CN_INFO
  let isCN
  const msg = `使用 ${provider || 'pingan'} 查询 ${ip ? ip : '分流'} 信息`
  if (provider == 'cip') {
    try {
      const res = await http({
        url: `http://cip.cc/${ip ? encodeURIComponent(ip) : ''}`,
        headers: { 'User-Agent': 'curl/7.16.3 (powerpc-apple-darwin9.0) libcurl/7.16.3' },
      })
      let body = String($.lodash_get(res, 'body'))
      const addr = body.match(/地址\s*(:|：)\s*(.*)/)[2]
      isCN = addr.includes('中国')
      CN_IP = ip || body.match(/IP\s*(:|：)\s*(.*?)\s/)[2]
      CN_INFO = [
        ['位置:', isCN ? getflag('CN') : undefined, addr.replace(/中国\s*/, '') || ''].filter(i => i).join(' '),
        ['运营商:', body.match(/运营商\s*(:|：)\s*(.*)/)[2].replace(/中国\s*/, '') || ''].filter(i => i).join(' '),
      ]
        .filter(i => i)
        .join('\n')
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  } else if (!ip && provider == 'qixin') {
    try {
      const res = await http({
        url: `https://appc.${keyg}${keyh}.com/v4/general/getAreaByIP`,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.14',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      try {
        body = JSON.parse(body)
      } catch (e) {}
      const countryCode = $.lodash_get(body, 'data.code')
      isCN = countryCode === 'CN'
      CN_IP = $.lodash_get(body, 'data.clientIp')
      CN_INFO = [
        [
          '位置:',
          getflag(countryCode),
          $.lodash_get(body, 'data.provinceName'),
          $.lodash_get(body, 'data.cityName'),
          $.lodash_get(body, 'data.districtName'),
        ]
          .filter(i => i)
          .join(' '),
        ['运营商:', $.lodash_get(body, 'data.owner')].filter(i => i).join(' '),
      ]
        .filter(i => i)
        .join('\n')
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  } else if (!ip && provider == 'ipip') {
    try {
      const res = await http({
        url: `https://myip.ipip.net/json`,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.14',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      try {
        body = JSON.parse(body)
      } catch (e) {}
      isCN = $.lodash_get(body, 'data.location.0') === '中国'
      CN_IP = $.lodash_get(body, 'data.ip')
      CN_INFO = [
        [
          '位置:',
          isCN ? getflag('CN') : undefined,
          $.lodash_get(body, 'data.location.0'),
          $.lodash_get(body, 'data.location.1'),
          $.lodash_get(body, 'data.location.2'),
        ]
          .filter(i => i)
          .join(' '),
        ['运营商:', $.lodash_get(body, 'data.location.4')].filter(i => i).join(' '),
      ]
        .filter(i => i)
        .join('\n')
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  } else if (!ip && provider == 'bilibili') {
    try {
      const res = await http({
        url: `https://api.bilibili.com/x/web-interface/zone`,
        // url: `https://api.live.bilibili.com/ip_service/v1/ip_service/get_ip_addr`,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.14',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      try {
        body = JSON.parse(body)
      } catch (e) {}

      isCN = $.lodash_get(body, 'data.country') === '中国'
      CN_IP = $.lodash_get(body, 'data.addr')
      CN_INFO = [
        [
          '位置:',
          isCN ? getflag('CN') : undefined,
          $.lodash_get(body, 'data.country'),
          $.lodash_get(body, 'data.province'),
          $.lodash_get(body, 'data.city'),
        ]
          .filter(i => i)
          .join(' '),
        ['运营商:', $.lodash_get(body, 'data.isp')].filter(i => i).join(' '),
      ]
        .filter(i => i)
        .join('\n')
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  } else if (!ip && provider == '126') {
    try {
      const res = await http({
        url: `https://ipservice.ws.126.net/locate/api/getLocByIp`,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.14',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      try {
        body = JSON.parse(body)
      } catch (e) {}

      const countryCode = $.lodash_get(body, 'result.countrySymbol')
      isCN = countryCode === 'CN'
      CN_IP = $.lodash_get(body, 'result.ip')
      CN_INFO = [
        [
          '位置:',
          getflag(countryCode),
          $.lodash_get(body, 'result.country'),
          $.lodash_get(body, 'result.province'),
          $.lodash_get(body, 'result.city'),
        ]
          .filter(i => i)
          .join(' '),
        ['运营商:', $.lodash_get(body, 'result.operator')].filter(i => i).join(' '),
      ]
        .filter(i => i)
        .join('\n')
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  } else if (!ip && provider == 'ip233') {
    try {
      const res = await http({
        url: `https://ip.ip233.cn/ip`,
        headers: {
          Referer: 'https://ip233.cn/',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      try {
        body = JSON.parse(body)
      } catch (e) {}

      const countryCode = $.lodash_get(body, 'country')
      isCN = countryCode === 'CN'
      CN_IP = $.lodash_get(body, 'ip')
      CN_INFO = CN_INFO = [
        ['位置:', getflag(countryCode), $.lodash_get(body, 'desc').replace(/中国\s*/, '')].filter(i => i).join(' '),
        $.lodash_get(arg, 'ORG') == 1
          ? ['组织:', $.lodash_get(body, 'org') || '-'].filter(i => i).join(' ')
          : undefined,
      ]
        .filter(i => i)
        .join('\n')
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  } else if (provider == 'muhan') {
    try {
      const res = await http({
        url: `https://ua${keye}.wo${keyf}x.cn/app/ip-location`,
        params: { ip },
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      try {
        body = JSON.parse(body)
      } catch (e) {}

      const countryCode = $.lodash_get(body, 'data.showapi_res_body.en_name_short')
      isCN = countryCode === 'CN'
      CN_IP = ip || $.lodash_get(body, 'data.showapi_res_body.ip')
      CN_INFO = [
        [
          '位置:',
          getflag(countryCode),
          $.lodash_get(body, 'data.showapi_res_body.country').replace(/\s*中国\s*/, ''),
          $.lodash_get(body, 'data.showapi_res_body.region'),
          $.lodash_get(body, 'data.showapi_res_body.city'),
          $.lodash_get(body, 'data.showapi_res_body.county'),
        ]
          .filter(i => i)
          .join(' '),
        ['运营商:', $.lodash_get(body, 'data.showapi_res_body.isp') || '-'].filter(i => i).join(' '),
      ]
        .filter(i => i)
        .join('\n')
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  } else if (provider == 'ipim') {
    try {
      const res = await ipim(ip)
      isCN = $.lodash_get(res, 'isCN')
      CN_IP = $.lodash_get(res, 'IP')
      CN_INFO = $.lodash_get(res, 'INFO')
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  } else if (provider == 'ali') {
    try {
      let APPCODE = $.lodash_get(arg, 'DOMESTIC_IPv4_KEY')
      if (!APPCODE) throw new Error('请在 DOMESTIC_IPv4_KEY 填写阿里云 IP 接口的 APPCODE')
      APPCODE = APPCODE.split(/,|，/)
        .map(i => i.trim())
        .filter(i => i)
      APPCODE = APPCODE[Math.floor(Math.random() * APPCODE.length)]
      if (APPCODE.length > 1) {
        $.log(`随机使用阿里云 IP 接口的 APPCODE: ${APPCODE}`)
      }
      let ali_ip = ip
      if (!ali_ip) {
        $.log('阿里云接口需要 IP. 未提供 IP, 先使用默认 IP 查询')
        const res = await getDirectInfo()
        ali_ip = $.lodash_get(res, 'CN_IP')
        if (!ali_ip) throw new Error('阿里云接口需要 IP. 未提供 IP, 使用默认 IP 查询失败')
      }
      const res = await ali(ali_ip, APPCODE)
      isCN = $.lodash_get(res, 'isCN')
      CN_IP = $.lodash_get(res, 'IP')
      CN_INFO = $.lodash_get(res, 'INFO')
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  } else if (ip && provider == 'spcn') {
    try {
      const res = await http({
        url: `https://api-v3.${keya}${bay}.cn/ip`,
        params: { ip },
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.14',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      try {
        body = JSON.parse(body)
      } catch (e) {}
      const countryCode = $.lodash_get(body, 'data.countryCode')
      isCN = countryCode === 'CN'
      CN_IP = ip || $.lodash_get(body, 'data.ip')
      CN_INFO = [
        [
          '位置:',
          getflag(countryCode),
          $.lodash_get(body, 'data.country').replace(/\s*中国\s*/, ''),
          $.lodash_get(body, 'data.province'),
          $.lodash_get(body, 'data.city'),
          $.lodash_get(body, 'data.district'),
        ]
          .filter(i => i)
          .join(' '),
        ['运营商:', $.lodash_get(body, 'data.operator') || $.lodash_get(body, 'data.isp') || '-']
          .filter(i => i)
          .join(' '),
      ]
        .filter(i => i)
        .join('\n')
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  } else {
    try {
      const res = await http({
        url: `https://rmb.${keyc}${keyd}.com.cn/itam/mas/linden/ip/request`,
        params: { ip },
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      try {
        body = JSON.parse(body)
      } catch (e) {}

      const countryCode = $.lodash_get(body, 'data.countryIsoCode')
      isCN = countryCode === 'CN'
      CN_IP = ip || $.lodash_get(body, 'data.ip')
      CN_INFO = [
        [
          '位置:',
          getflag(countryCode),
          $.lodash_get(body, 'data.country').replace(/\s*中国\s*/, ''),
          $.lodash_get(body, 'data.region'),
          $.lodash_get(body, 'data.city'),
        ]
          .filter(i => i)
          .join(' '),
        ['运营商:', $.lodash_get(body, 'data.isp') || '-'].filter(i => i).join(' '),
        $.lodash_get(arg, 'ORG') == 1
          ? ['组织:', $.lodash_get(body, 'org') || '-'].filter(i => i).join(' ')
          : undefined,
      ]
        .filter(i => i)
        .join('\n')
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  }
  return { CN_IP, CN_INFO: simplifyAddr(CN_INFO), isCN }
}
async function getDirectInfoIPv6() {
  let CN_IPv6
  const msg = `使用 ${$.lodash_get(arg, 'DOMESTIC_IPv6') || 'ddnspod'} 查询 IPv6 分流信息`
  if ($.lodash_get(arg, 'DOMESTIC_IPv6') == 'neu6') {
    try {
      const res = await http({
        url: `https://speed.neu6.edu.cn/getIP.php`,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.14',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      CN_IPv6 = body.trim()
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  } else {
    try {
      const res = await http({
        url: `https://ipv6.ddnspod.com`,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.14',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      CN_IPv6 = body.trim()
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  }
  return { CN_IPv6 }
}
async function getProxyInfo(ip, provider) {
  let PROXY_IP
  let PROXY_INFO
  let PROXY_PRIVACY

  const msg = `使用 ${provider || 'ipapi'} 查询 ${ip ? ip : '分流'} 信息`

  if (provider == 'ipinfo') {
    try {
      const res = await http({
        ...(ip ? {} : getNodeOpt()),

        url: `https://ipinfo.io/widget/${ip ? encodeURIComponent(ip) : ''}`,
        headers: {
          Referer: 'https://ipinfo.io/',
          'User-Agent':
            'Mozilla/5.0 (iPhone CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/109.0.0.0',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      try {
        body = JSON.parse(body)
      } catch (e) {}
      PROXY_IP = ip || $.lodash_get(body, 'ip')
      const companyType = $.lodash_get(body, 'company.type')
      const asnType = $.lodash_get(body, 'asn.type')
      PROXY_INFO = [
        ['位置:', getflag(body.country), body.country.replace(/\s*中国\s*/, ''), body.region, body.city]
          .filter(i => i)
          .join(' '),
        [
          '运营商:',
          $.lodash_get(body, 'company.name') || $.lodash_get(body, 'asn.name') || '-',
          companyType ? ` | ${companyType}` : '',
        ]
          .filter(i => i)
          .join(' '),
        $.lodash_get(arg, 'ORG') == 1
          ? [
              '组织:',
              $.lodash_get(body, 'asn.name') || $.lodash_get(body, 'org') || '-',
              asnType ? ` | ${asnType}` : '',
            ]
              .filter(i => i)
              .join(' ')
          : undefined,
        $.lodash_get(arg, 'ASN') == 1
          ? ['ASN:', $.lodash_get(body, 'asn.asn') || '-'].filter(i => i).join(' ')
          : undefined,
      ]
        .filter(i => i)
        .join('\n')
      if (!ip && $.lodash_get(arg, 'PRIVACY') == '1') {
        const privacyObj = $.lodash_get(body, 'privacy') || {}
        let privacy = []
        const privacyMap = {
          true: '✓',
          false: '✗',
          '': '-',
        }
        Object.keys(privacyObj).forEach(key => {
          privacy.push(`${key.toUpperCase()}: ${privacyMap[privacyObj[key]]}`)
        })
        if (privacy.length > 0) {
          PROXY_PRIVACY = `隐私安全:\n${privacy.join('\n')}`
        } else {
          PROXY_PRIVACY = `隐私安全: -`
        }
      }
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  } else if (provider == 'ipscore') {
    try {
      const res = await http({
        ...(ip ? {} : getNodeOpt()),

        url: `https://ip-score.com/json`,
        params: { ip },
        headers: {
          'User-Agent':
            'Mozilla/5.0 (iPhone CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/109.0.0.0',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      try {
        body = JSON.parse(body)
      } catch (e) {}
      PROXY_IP = ip || $.lodash_get(body, 'ip')
      PROXY_INFO = [
        [
          '位置¹:',
          getflag($.lodash_get(body, 'geoip1.countrycode')),
          $.lodash_get(body, 'geoip1.country'),
          $.lodash_get(body, 'geoip1.region'),
          $.lodash_get(body, 'geoip1.city'),
        ]
          .filter(i => i)
          .join(' '),
        [
          '位置²:',
          getflag($.lodash_get(body, 'geoip2.countrycode')),
          $.lodash_get(body, 'geoip2.country'),
          $.lodash_get(body, 'geoip2.region'),
          $.lodash_get(body, 'geoip2.city'),
        ]
          .filter(i => i)
          .join(' '),
        ['运营商:', body.isp || body.org || body.asn].filter(i => i).join(' '),
      ]
        .filter(i => i)
        .join('\n')
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  } else if (provider == 'ipsb') {
    try {
      const res = await http({
        ...(ip ? {} : getNodeOpt()),

        url: `https://api-ipv4.ip.sb/geoip${ip ? `/${encodeURIComponent(ip)}` : ''}`,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (iPhone CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/109.0.0.0',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      try {
        body = JSON.parse(body)
      } catch (e) {}
      PROXY_IP = ip || $.lodash_get(body, 'ip')
      PROXY_INFO = [
        [
          '位置:',
          getflag($.lodash_get(body, 'country_code')),
          $.lodash_get(body, 'country'),
          $.lodash_get(body, 'region'),
          $.lodash_get(body, 'city'),
        ]
          .filter(i => i)
          .join(' '),

        ['运营商:', body.isp || body.organization].filter(i => i).join(' '),
        $.lodash_get(arg, 'ORG') == 1
          ? ['组织:', $.lodash_get(body, 'asn_organization') || '-'].filter(i => i).join(' ')
          : undefined,

        $.lodash_get(arg, 'ASN') == 1 ? ['ASN:', $.lodash_get(body, 'asn') || '-'].filter(i => i).join(' ') : undefined,
      ]
        .filter(i => i)
        .join('\n')
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  } else if (provider == 'ipwhois') {
    try {
      const res = await http({
        ...(ip ? {} : getNodeOpt()),

        url: `https://ipwhois.app/widget.php`,
        params: {
          lang: 'zh-CN',
          ip,
        },
        headers: {
          Host: 'ipwhois.app',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0',
          Accept: '*/*',
          'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
          'Accept-Encoding': 'gzip, deflate, br',
          Origin: 'https://ipwhois.io',
          Connection: 'keep-alive',
          Referer: 'https://ipwhois.io/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      try {
        body = JSON.parse(body)
      } catch (e) {}

      PROXY_IP = ip || $.lodash_get(body, 'ip')
      PROXY_INFO = [
        ['位置:', getflag(body.country_code), body.country.replace(/\s*中国\s*/, ''), body.region, body.city]
          .filter(i => i)
          .join(' '),
        ['运营商:', $.lodash_get(body, 'connection.isp') || '-'].filter(i => i).join(' '),
        $.lodash_get(arg, 'ORG') == 1
          ? ['组织:', $.lodash_get(body, 'connection.org') || '-'].filter(i => i).join(' ')
          : undefined,

        $.lodash_get(arg, 'ASN') == 1
          ? ['ASN:', $.lodash_get(body, 'connection.asn') || '-'].filter(i => i).join(' ')
          : undefined,
      ]
        .filter(i => i)
        .join('\n')
      if (!ip && $.lodash_get(arg, 'PRIVACY') == 1) {
        const securityMap = {
          true: '✓',
          false: '✗',
          '': '-',
        }
        const securityObj = $.lodash_get(body, 'security') || {}
        let security = []
        Object.keys(securityObj).forEach(key => {
          security.push(`${key.toUpperCase()}: ${securityMap[securityObj[key]]}`)
        })
        if (security.length > 0) {
          PROXY_PRIVACY = `隐私安全:\n${security.join('\n')}`
        } else {
          PROXY_PRIVACY = `隐私安全: -`
        }
      }
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  } else {
    try {
      const p = ip ? `/${encodeURIComponent(ip)}` : ''
      const res = await http({
        ...(ip ? {} : getNodeOpt()),

        url: `http://ip-api.com/json${p}?lang=zh-CN`,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (iPhone CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/109.0.0.0',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      try {
        body = JSON.parse(body)
      } catch (e) {}
      PROXY_IP = ip || $.lodash_get(body, 'query')
      PROXY_INFO = [
        [
          '位置:',
          getflag(body.countryCode),
          body.country.replace(/\s*中国\s*/, ''),
          body.regionName ? body.regionName.split(/\s+or\s+/)[0] : body.regionName,
          body.city,
        ]
          .filter(i => i)
          .join(' '),
        ['运营商:', body.isp || body.org || body.as].filter(i => i).join(' '),
        $.lodash_get(arg, 'ORG') == 1
          ? ['组织:', $.lodash_get(body, 'org') || '-'].filter(i => i).join(' ')
          : undefined,

        $.lodash_get(arg, 'ASN') == 1 ? ['ASN:', $.lodash_get(body, 'as') || '-'].filter(i => i).join(' ') : undefined,
      ]
        .filter(i => i)
        .join('\n')
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  }

  return { PROXY_IP, PROXY_INFO: simplifyAddr(PROXY_INFO), PROXY_PRIVACY }
}
async function getProxyInfoIPv6(ip) {
  let PROXY_IPv6
  const msg = `使用 ${$.lodash_get(arg, 'LANDING_IPv6') || 'ipsb'} 查询 IPv6 分流信息`
  if ($.lodash_get(arg, 'LANDING_IPv6') == 'ident') {
    try {
      const res = await http({
        ...(ip ? {} : getNodeOpt()),

        url: `https://v6.ident.me`,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.14',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      PROXY_IPv6 = body.trim()
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  } else if ($.lodash_get(arg, 'LANDING_IPv6') == 'ipify') {
    try {
      const res = await http({
        ...(ip ? {} : getNodeOpt()),

        url: `https://api6.ipify.org`,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.14',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      PROXY_IPv6 = body.trim()
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  } else {
    try {
      const res = await http({
        ...(ip ? {} : getNodeOpt()),

        url: `https://api-ipv6.ip.sb/ip`,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.14',
        },
      })
      let body = String($.lodash_get(res, 'body'))
      PROXY_IPv6 = body.trim()
    } catch (e) {
      $.logErr(`${msg} 发生错误: ${e.message || e}`)
    }
  }

  return { PROXY_IPv6 }
}
async function ipim(ip) {
  let isCN
  let IP
  let INFO
  const res = await http({
    url: `https://ip.im/${ip ? encodeURIComponent(ip) : 'info'}`,
    headers: { 'User-Agent': 'curl/7.16.3 (powerpc-apple-darwin9.0) libcurl/7.16.3' },
  })
  let body = String($.lodash_get(res, 'body'))
  IP = body.match(/(^|\s+)Ip\s*(:|：)\s*(.*)/m)?.[3]
  const country = body.match(/(^|\s+)Country\s*(:|：)\s*(.*)/m)?.[3]
  const province =
    body.match(/(^|\s+)Province\s*(:|：)\s*(.*)/m)?.[3] || body.match(/(^|\s+)Region\s*(:|：)\s*(.*)/m)?.[3]
  const city = body.match(/(^|\s+)City\s*(:|：)\s*(.*)/m)?.[3]
  const district = body.match(/(^|\s+)Districts\s*(:|：)\s*(.*)/m)?.[3]
  const isp = body.match(/(^|\s+)Isp\s*(:|：)\s*(.*)/m)?.[3]
  const org = body.match(/(^|\s+)Org\s*(:|：)\s*(.*)/m)?.[3]

  isCN = country.includes('中国')

  INFO = [
    ['位置:', isCN ? getflag('CN') : getflag(country), country, province, city, district].filter(i => i).join(' '),
    ['运营商:', isp || '-'].filter(i => i).join(' '),
    $.lodash_get(arg, 'ORG') == 1 ? ['组织:', org || '-'].filter(i => i).join(' ') : undefined,
  ]
    .filter(i => i)
    .join('\n')
  return { IP, INFO, isCN }
}
async function ali(ip, key) {
  let isCN
  let IP
  let INFO
  const res = await http({
    url: `https://ips.market.alicloudapi.com/iplocaltion`,
    params: { ip },
    headers: { authorization: `APPCODE ${key}` },
  })
  let body = String($.lodash_get(res, 'body'))
  try {
    body = JSON.parse(body)
  } catch (e) {}

  IP = $.lodash_get(body, 'ip')
  const countryCode = $.lodash_get(body, 'result.en_short')
  isCN = countryCode === 'CN'

  INFO = [
    [
      '位置:',
      getflag(countryCode),
      $.lodash_get(body, 'result.nation').replace(/中国\s*/, ''),
      $.lodash_get(body, 'result.province'),
      $.lodash_get(body, 'result.city'),
      $.lodash_get(body, 'result.district'),
    ]
      .filter(i => i)
      .join(' '),
  ]
    .filter(i => i)
    .join('\n')
  return { IP, INFO, isCN }
}
function simplifyAddr(addr) {
  if (!addr) return ''
  return addr
    .split(/\n/)
    .map(i => Array.from(new Set(i.split(/\ +/))).join(' '))
    .join('\n')
}
function maskAddr(addr) {
  if (!addr) return ''
  if ($.lodash_get(arg, 'MASK') == 1) {
    let result = ''
    const parts = addr.split(' ')

    if (parts.length >= 3) {
      // 如果有两个或更多的空格，按空格分组后将中间的部分替换为"*"
      result = [parts[0], '*', parts[parts.length - 1]].join(' ')
    } else {
      // 如果空格少于2个，将字符串三等分，将中间的部分替换为"*"
      const third = Math.floor(addr.length / 3)
      result = addr.substring(0, third) + '*'.repeat(third) + addr.substring(2 * third)
    }
    return result
  } else {
    return addr
  }
}
function maskIP(ip) {
  if (!ip) return ''
  if ($.lodash_get(arg, 'MASK') == 1) {
    let result = ''
    if (ip.includes('.')) {
      // IPv4
      let parts = ip.split('.')
      result = [...parts.slice(0, 2), '*', '*'].join('.')
    } else {
      // IPv6
      let parts = ip.split(':')
      result = [...parts.slice(0, 4), '*', '*', '*', '*'].join(':')
    }
    return result
  } else {
    return ip
  }
}

function getflag(e) {
  if ($.lodash_get(arg, 'FLAG', 1) == 1) {
    try {
      const t = e
        .toUpperCase()
        .split('')
        .map(e => 127397 + e.charCodeAt())
      // return String.fromCodePoint(...t).replace(/🇹🇼/g, '🇨🇳');
      return String.fromCodePoint(...t).replace(/🇹🇼/g, '🇼🇸')
    } catch (e) {
      return ''
    }
  } else {
    return ''
  }
}
// 参数 与其他脚本逻辑一致
function parseQueryString(url) {
  const queryString = url.split('?')[1] // 获取查询字符串部分
  const regex = /([^=&]+)=([^&]*)/g // 匹配键值对的正则表达式
  const params = {}
  let match

  while ((match = regex.exec(queryString))) {
    const key = decodeURIComponent(match[1]) // 解码键
    const value = decodeURIComponent(match[2]) // 解码值
    params[key] = value // 将键值对添加到对象中
  }

  return params
}
const DOMAIN_RESOLVERS = {
  google: async function (domain, type) {
    const resp = await http({
      url: `https://8.8.4.4/resolve`,
      params: {
        name: domain,
        type: type === 'IPv6' ? 'AAAA' : 'A',
      },
      headers: {
        accept: 'application/dns-json',
      },
    })
    const body = JSON.parse(resp.body)
    if (body['Status'] !== 0) {
      throw new Error(`Status is ${body['Status']}`)
    }
    const answers = body['Answer']
    if (answers.length === 0) {
      throw new Error('域名解析无结果')
    }
    return answers[answers.length - 1].data
  },

  cf: async function (domain, type) {
    const resp = await http({
      url: `https://1.0.0.1/dns-query`,
      params: {
        name: domain,
        type: type === 'IPv6' ? 'AAAA' : 'A',
      },
      headers: {
        accept: 'application/dns-json',
      },
    })
    const body = JSON.parse(resp.body)
    if (body['Status'] !== 0) {
      throw new Error(`Status is ${body['Status']}`)
    }
    const answers = body['Answer']
    if (answers.length === 0) {
      throw new Error('域名解析无结果')
    }
    return answers[answers.length - 1].data
  },
  ali: async function (domain, type) {
    const resp = await http({
      url: `http://223.6.6.6/resolve`,
      params: {
        edns_client_subnet: '223.6.6.6/24',
        name: domain,
        short: 1,
        type: type === 'IPv6' ? 'AAAA' : 'A',
      },
      headers: {
        accept: 'application/dns-json',
      },
    })
    const answers = JSON.parse(resp.body)
    if (answers.length === 0) {
      throw new Error('域名解析无结果')
    }
    return answers[answers.length - 1]
  },
  tencent: async function (domain, type) {
    const resp = await http({
      url: `http://119.28.28.28/d`,
      params: {
        ip: '119.28.28.28',
        dn: domain,
        type: type === 'IPv6' ? 'AAAA' : 'A',
      },
      headers: {
        accept: 'application/dns-json',
      },
    })
    const answers = resp.body.split(';').map(i => i.split(',')[0])
    if (answers.length === 0 || String(answers) === '0') {
      throw new Error('域名解析无结果')
    }
    return answers[answers.length - 1]
  },
}
async function resolveDomain(domain) {
  let IPv4
  let IPv6
  if (isIPv4(domain)) {
    IPv4 = domain
  } else if (isIPv6(domain)) {
    IPv6 = domain
  } else {
    let resolverName = $.lodash_get(arg, 'DNS') || 'ali'
    let resolver = DOMAIN_RESOLVERS[resolverName]
    if (!resolver) {
      resolverName = 'ali'
      resolver = DOMAIN_RESOLVERS[resolverName]
    }
    const msg = `使用 ${resolverName} 解析域名 ${domain}`
    const res = await Promise.all([
      (async () => {
        try {
          return await resolver(domain, 'IPv4')
        } catch (e) {
          // $.logErr(`${msg} 发生错误: ${e.message || e}`)
        }
      })(),
      (async () => {
        try {
          return await resolver(domain, 'IPv6')
        } catch (e) {
          // $.logErr(`${msg} 发生错误: ${e.message || e}`)
        }
      })(),
    ])
    const [v4, v6] = res

    if (isIPv4(v4)) {
      IPv4 = v4
    } else {
      $.logErr(`${msg} 解析 IPv4 失败`)
    }
    if (isIPv6(v6)) {
      IPv6 = v6
    } else {
      $.logErr(`${msg} 解析 IPv6 失败`)
    }
  }
  return { IP: IPv4 || IPv6, IPv4, IPv6 }
}
// source: https://stackoverflow.com/a/36760050
const IPV4_REGEX = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/

// source: https://ihateregex.io/expr/ipv6/
const IPV6_REGEX =
  /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/

function isIPv4(ip) {
  return IPV4_REGEX.test(ip)
}

function isIPv6(ip) {
  return IPV6_REGEX.test(ip)
}
function isIP(ip) {
  return isIPv4(ip) || isIPv6(ip)
}
async function getProxies() {
  let PROXIES = []
  if ($.isStash()) {
    try {
      const res = await $.http.get({
        url: `http://127.0.0.1:9090/providers/proxies`,
      })
      let body = String($.lodash_get(res, 'body') || $.lodash_get(res, 'rawBody'))
      try {
        body = JSON.parse(body)
      } catch (e) {}

      // $.log(JSON.stringify(body, null, 2))
      PROXIES = Object.values(body.providers)
        .map(i => i.proxies)
        .flat()
        .reduce((obj, i) => {
          obj[i.name] = i.address
          return obj
        }, {})
    } catch (e) {
      $.logErr(e)
      $.logErr($.toStr(e))
    }
  }
  return { PROXIES }
}
async function httpAPI(path = '/v1/requests/recent', method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    $httpAPI(method, path, body, result => {
      resolve(result)
    })
  })
}
function isRequest() {
  return typeof $request !== 'undefined'
}
function isPanel() {
  return $.isSurge() && typeof $input != 'undefined' && $.lodash_get($input, 'purpose') === 'panel'
}
function isTile() {
  return (
    $.isStash() &&
    ((typeof $script != 'undefined' && $.lodash_get($script, 'type') === 'tile') ||
      $.lodash_get(arg, 'TYPE') === 'TILE')
  )
}
function isInteraction() {
  return (
    ($.isQuanX() &&
      typeof $environment != 'undefined' &&
      $.lodash_get($environment, 'executor') === 'event-interaction') ||
    ($.isLoon() && typeof $environment != 'undefined' && $.lodash_get($environment, 'params.node'))
  )
}
function getNodeOpt() {
  let opt = {}
  if (isInteraction()) {
    if ($.isQuanX()) {
      opt = {
        opts: {
          policy: $environment.params,
        },
      }
    } else if ($.isLoon()) {
      opt = {
        node: $environment.params.node,
      }
    }
  }
  return opt
}
// 请求
async function http(opt = {}) {
  const TIMEOUT = parseFloat(opt.timeout || $.lodash_get(arg, 'TIMEOUT') || 5)
  const RETRIES = parseFloat(opt.retries || $.lodash_get(arg, 'RETRIES') || 1)
  const RETRY_DELAY = parseFloat(opt.retry_delay || $.lodash_get(arg, 'RETRY_DELAY') || 1)

  let timeout = TIMEOUT + 1
  timeout = $.isSurge() ? timeout : timeout * 1000

  let count = 0
  const fn = async () => {
    try {
      if (TIMEOUT) {
        // Surge, Loon, Stash 默认为 5 秒
        return await Promise.race([
          $.http.get({ ...opt, timeout }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('HTTP TIMEOUT')), TIMEOUT * 1000)),
        ])
      }
      return await $.http.get(opt)
    } catch (e) {
      if (count < RETRIES) {
        count++
        $.log(`第 ${count} 次请求失败: ${e.message || e}, 等待 ${RETRY_DELAY}s 后重试`)
        await $.wait(RETRY_DELAY * 1000)
        return await fn()
      }
    }
  }
  return await fn()
}
// 通知
async function notify(title, subt, desc, opts) {
  if ($.lodash_get(arg, 'TYPE') === 'EVENT' || $.lodash_get(arg, 'notify') == 1) {
    $.msg(title, subt, desc, opts)
  } else {
    $.log('🔕', title, subt, desc, opts)
  }
}

// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,a)=>{s.call(this,t,(t,s,r)=>{t?a(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const a=this.getdata(t);if(a)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,a)=>e(a))})}runScript(t,e){return new Promise(s=>{let a=this.getdata("@chavy_boxjs_userCfgs.httpapi");a=a?a.replace(/\n/g,"").trim():a;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[i,o]=a.split("@"),n={url:`http://${o}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":i,Accept:"*/*"},timeout:r};this.post(n,(t,e,a)=>s(a))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e);if(!s&&!a)return{};{const a=s?t:e;try{return JSON.parse(this.fs.readFileSync(a))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):a?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const a=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of a)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,a)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[a+1])>>0==+e[a+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,a]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,a,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,a,r]=/^@(.*?)\.(.*?)$/.exec(e),i=this.getval(a),o=a?"null"===i?null:i||"{}":"{}";try{const e=JSON.parse(o);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),a)}catch(e){const i={};this.lodash_set(i,r,t),s=this.setval(JSON.stringify(i),a)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:a,statusCode:r,headers:i,rawBody:o}=t,n=s.decode(o,this.encoding);e(null,{status:a,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:a,response:r}=t;e(a,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let a=require("iconv-lite");this.initGotEnv(t);const{url:r,...i}=t;this.got[s](r,i).then(t=>{const{statusCode:s,statusCode:r,headers:i,rawBody:o}=t,n=a.decode(o,this.encoding);e(null,{status:s,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:s,response:r}=t;e(s,r,r&&a.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let a={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in a)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[e]:("00"+a[e]).substr((""+a[e]).length)));return t}queryStr(t){let e="";for(const s in t){let a=t[s];null!=a&&""!==a&&("object"==typeof a&&(a=JSON.stringify(a)),e+=`${s}=${a}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",a="",r){const i=t=>{switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{let e=t.url||t.openUrl||t["open-url"];return{url:e}}case"Loon":{let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}case"Quantumult X":{let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,a=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":a}}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,a,i(r));break;case"Quantumult X":$notify(e,s,a,i(r));break;case"Node.js":}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),a&&t.push(a),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,t.stack)}}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}