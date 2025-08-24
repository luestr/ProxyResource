/*
Loon专用
2024-10-01 23:40:54
*/
let githubPrefix = "https://raw.githubusercontent.com/luestr/ProxyResource/main"
let gitlabPrefix = "https://kelee.one/"
let giteaPrefix = "https://gitea.com/latick/ProxyResource/raw/branch/main/"

//1: gitbucket 2.gitlab 3.github
let changeTo = $persistentStore.read("仓库源")

var url = $request.url
var headers = $request.headers
delete headers.host
delete headers.Host

if (changeTo == "Gitea - 四网直连") {
    headers["host"] = "gitea.com"
} else if (changeTo == "GitLab - 电信联通直连") {
    headers["host"] = "gitlab.com"
} else if (changeTo == "GitHub - 访问不畅") {
    headers["host"] = "raw.githubusercontent.com"
}

if (url.startsWith(githubPrefix)) {
    if (changeTo == "Gitea - 四网直连") {
        url = url.replace(githubPrefix,giteaPrefix)
    } else if (changeTo == "GitLab - 电信联通直连") {
        url = url.replace(githubPrefix,gitlabPrefix)
    }
} else if (url.startsWith(gitlabPrefix)) {
    if (changeTo == "Gitea - 四网直连") {
        url = url.replace(gitlabPrefix,giteaPrefix)
    } else if (changeTo == "GitHub - 访问不畅") {
        url = url.replace(gitlabPrefix,githubPrefix)
    }
} else if (url.startsWith(giteaPrefix)) {
    if (changeTo == "GitLab - 电信联通直连") {
        url = url.replace(giteaPrefix,gitlabPrefix)
    } else if (changeTo == "GitHub - 访问不畅") {
        url = url.replace(giteaPrefix,githubPrefix)
    }
}

$done({url:url,headers:headers})