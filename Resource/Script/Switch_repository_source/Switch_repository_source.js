/*
Loon专用
2024-04-21 01:29:51
*/
let githubPrefix = "https://raw.githubusercontent.com/luestr/ProxyResource/main"
let gitlabPrefix = "https://raw.githubusercontent.com/luestr/ProxyResource/main"
let gitbucketPrefix = "https://bitbucket.org/luestr/proxyresource/raw/main"

//1: gitbucket 2.gitlab 3.github
let changeTo = $persistentStore.read("仓库源")

var url = $request.url
var headers = $request.headers
delete headers.host
delete headers.Host

if (changeTo == "Bitbucket - 四网直连") {
    headers["host"] = "bitbucket.org"
} else if (changeTo == "GitLab - 电信联通直连") {
    headers["host"] = "gitlab.com"
} else if (changeTo == "GitHub - 访问不畅") {
    headers["host"] = "raw.githubusercontent.com"
}

if (url.startsWith(githubPrefix)) {
    if (changeTo == "Bitbucket - 四网直连") {
        url = url.replace(githubPrefix,gitbucketPrefix)
    } else if (changeTo == "GitLab - 电信联通直连") {
        url = url.replace(githubPrefix,gitlabPrefix)
    }
} else if (url.startsWith(gitlabPrefix)) {
    if (changeTo == "Bitbucket - 四网直连") {
        url = url.replace(gitlabPrefix,gitbucketPrefix)
    } else if (changeTo == "GitHub - 访问不畅") {
        url = url.replace(gitlabPrefix,githubPrefix)
    }
} else if (url.startsWith(gitbucketPrefix)) {
    if (changeTo == "GitLab - 电信联通直连") {
        url = url.replace(gitbucketPrefix,gitlabPrefix)
    } else if (changeTo == "GitHub - 访问不畅") {
        url = url.replace(gitbucketPrefix,githubPrefix)
    }
}

$done({url:url,headers:headers})