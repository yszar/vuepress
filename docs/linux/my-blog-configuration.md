---
title: 本博客服务器所有配置
date: 2020-08-08
sidebar: 'auto'
categories:
 - Linux
tags:
 - Linux
publish: true
---
> 之前的博客种种原因下线了，最终还是打算重新建立博客，记录一些东西，帮助自己的同时，也希望能帮助到他人。

<!-- more -->

## 服务器相关信息
* 系统：`Ubuntu 18.04.3 LTS`
* 服务商：阿里云-香港

## 安装ZSH
### 安装
ZSH 已经被收录到了 Ubuntu 18.04 LTS 的官方软件包存储库中，安装起来也非常容易。使用如下命令就可以直接安装：
```shell
apt update
apt install zsh
wget --no-check-certificate https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh
chsh -s /bin/zsh #将默认的shell从bash改为zsh
reboot
```

### 为ZSH安装Powerline和Powerline字体
「Powerline」是 ZSH Shell 的状态行插件，「Powerline 字体」也允许 ZSH 在 Shell 中使用不同的图标和符号。而「Powerline」和「Powerline 字体」也可以在 Ubuntu 18.04 LTS 的官方软件包存储库中找到。

您可以运行以下命令在 Ubuntu 18.04 LTS 上安装「Powerline」和「Powerline 字体」：

```shell
apt install powerline fonts-powerline
```

### 安装ZSH Powerlevel9k美化主题
Powerlevel9k 是用于 ZSH 美化的一个非常酷的主题，您可以运行以下命令在 Ubuntu 18.04 LTS 系统中安装 Powerlevel9k ZSH 主题：
```shell
apt install zsh-theme-powerlevel9k
```
装好之后执行以下命令在 Ubuntu 18.04 LTS 上启用 Powerlevel9k ZSH 主题：
```shell
echo "source /usr/share/powerlevel9k/powerlevel9k.zsh-theme" >> ~/.zshrc 
```
![Powerlevel9k样式](media/15772914852653/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-12-26%20%E4%B8%8A%E5%8D%881.08.31.png)

#### powerlevel9k配置

默认配置参考官方说明：
https://github.com/bhilburn/powerlevel9k/wiki/Stylizing-Your-Prompt
官方推荐的各种用户配置（带各种截图）：
https://github.com/bhilburn/powerlevel9k/wiki/Show-Off-Your-Config
```shell
# ==== Theme Settings ====
# PowerLevel9k
# 左侧栏目显示的要素（指定的关键字参考官网）
POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(os_icon context dir vcs)
# 右侧栏目显示的要素
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(status root_indicator background_jobs time virtualenv)
#新起一行显示命令 (推荐！极其方便）
POWERLEVEL9K_PROMPT_ON_NEWLINE=true
#右侧状态栏与命令在同一行
POWERLEVEL9K_RPROMPT_ON_NEWLINE=true
#缩短目录层级
POWERLEVEL9K_SHORTEN_DIR_LENGTH=1
#缩短目录策略：隐藏上层目录中间的字
#POWERLEVEL9K_SHORTEN_STRATEGY="truncate_middle"
#添加连接上下连接箭头更方便查看
POWERLEVEL9K_MULTILINE_FIRST_PROMPT_PREFIX="↱"
POWERLEVEL9K_MULTILINE_LAST_PROMPT_PREFIX="↳ "
# 新的命令与上面的命令隔开一行
#POWERLEVEL9K_PROMPT_ADD_NEWLINE=true
# Git仓库状态的色彩指定
POWERLEVEL9K_VCS_CLEAN_FOREGROUND='blue'
POWERLEVEL9K_VCS_CLEAN_BACKGROUND='black'
POWERLEVEL9K_VCS_UNTRACKED_FOREGROUND='yellow'
POWERLEVEL9K_VCS_UNTRACKED_BACKGROUND='black'
POWERLEVEL9K_VCS_MODIFIED_FOREGROUND='red'
POWERLEVEL9K_VCS_MODIFIED_BACKGROUND='black'
```
#### Python的Virtualenv和Pipenv虚拟环境显示问题
一般命令行里，进入虚拟环境的shell时会显示如(venv) ~$这样的。
但是安装这个主题后，默认是没有的。
你必须手动设置添加才行。

方法是：
在`POWERLEVEL9K_LEFT_PROMPT_ELEMENTS`或者`POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS`中添加`virtualenv`要素，就能够显示了。
如：
```shell
POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(os_icon context dir vcs virtualenv)
```
![](media/15772914852653/15772944514627.jpg)

显示主机型号图标问题
像这种显示当前主机（如Mac）图标和Git图标的问题，是需要字体支持的。

![](media/15772914852653/15772946318224.jpg)

默认是不开启的，必须要在~/.zshrc中指定使用这种方式显示：

#### 字体设定 (注意，字体设定必须放在主题之前）
```shell
POWERLEVEL9K_MODE='nerdfont-complete'
```
#### 主题设定
```shell
ZSH_THEME="powerlevel9k/powerlevel9k"
```
上面的字体模式可选的有：
```
nerdfont-complete
awesome-fontconfig
awesome-patched
```
根据你的情况来尝试，因为不是每个都能完美无乱码显示出来。

### 在ZSH Shell上启用语法高亮显示
ZSH 有一个名为 ZSH Syntax Highlighting 的语法高亮显示插件，使用它可以突出显示 ZSH Shell 中的命令。 您可以使用如下命令进行安装：
```shell
apt install zsh-syntax-highlighting
```
安装好之后使用如下命令以启用 ZSH Syntax Highlighting 插件：
```shell
echo "source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ~/.zshrc
```

## 安装nginx
### 安装依赖
我的 VPS 系统是 Ubuntu 18.04.3 LTS，如果你使用的是其它发行版，与包管理有关的命令请自行调整。

首先安装依赖库和编译要用到的工具：
```shell
apt-get install build-essential libpcre3 libpcre3-dev zlib1g-dev unzip git
```

### 获取必要组件
#### nginx-ct
`nginx-ct` 模块用于启用 `Certificate Transparency` 功能。直接从 `github` 上获取源码：
```shell
wget -O nginx-ct.zip -c https://github.com/grahamedgecombe/nginx-ct/archive/v1.3.2.zip
unzip nginx-ct.zip
```

#### ngx_brotli
本站支持 Google 开发的 `Brotli` 压缩格式，它通过内置分析大量网页得出的字典，实现了更高的压缩比率，同时几乎不影响压缩 / 解压速度。

获取 `ngx_brotli` 源码：

```BASH
git clone https://github.com/google/ngx_brotli.git
cd ngx_brotli

git submodule update --init

cd ../
```

#### OpenSSL
为了支持 `TLS 1.3 final`，需要使用 `OpenSSL 1.1.1` 正式版：

```BASH
wget -c  https://github.com/openssl/openssl/archive/OpenSSL_1_1_1.tar.gz
tar xzf OpenSSL_1_1_1.tar.gz
mv openssl-OpenSSL_1_1_1 openssl
```

### 编译并安装 Nginx

接着就可以获取 `Nginx` 源码，编译并安装：

```BASH
wget -c http://nginx.org/download/nginx-1.15.2.tar.gz
tar zxf nginx-1.15.2.tar.gz

cd nginx-1.15.2

./configure --add-module=../ngx_brotli --with-openssl=../openssl --with-openssl-opt='enable-tls1_3 enable-weak-ssl-ciphers' --with-http_v2_module --with-http_ssl_module --with-http_gzip_static_module

make
make install
```

`enable-tls1_3` 是让 OpenSSL 支持 TLS 1.3 的关键选项；而 `enable-weak-ssl-ciphers` 的作用是让 OpenSSL 继续支持 3DES 等不安全的 Cipher Suite，如果你打算继续支持 IE8，才需要加上这个选项。

除了 `http_v2` 和 `http_ssl` 这两个 HTTP/2 必备模块之外，我还额外启用了 `http_gzip_static`，需要启用哪些模块需要根据自己实际情况来决定。

以上步骤会把 Nginx 装到 `/usr/local/nginx/` 目录，如需更改路径可以在 configure 时指定。

### WEB 站点配置
在 Nginx 的站点配置中，以下两个参数需要修改：
```
ssl_protocols              TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # 增加 TLSv1.3
ssl_ciphers                TLS13-AES-256-GCM-SHA384:TLS13-CHACHA20-POLY1305-SHA256:TLS13-AES-128-GCM-SHA256:TLS13-AES-128-CCM-8-SHA256:TLS13-AES-128-CCM-SHA256:EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+ECDSA+AES128:EECDH+aRSA+AES128:RSA+AES128:EECDH+ECDSA+AES256:EECDH+aRSA+AES256:RSA+AES256:EECDH+ECDSA+3DES:EECDH+aRSA+3DES:RSA+3DES:!MD5;
```
包含 `TLS13` 是 TLS 1.3 新增的 Cipher Suite，加在最前面即可；如果你不打算继续支持 IE8，可以去掉包含 `3DES` 的 Cipher Suite。

本博客完整的 Nginx 配置，请点击这里查看。

### 验证是否支持 TLS 1.3
目前最新版 Chrome 和 Firefox 都支持 TLS 1.3，但需要手动开启：

Chrome，将 `chrome://flags/` 中的 `Maximum TLS version enabled` 改为 `TLS 1.3`（Chrome 62 中需要将 TLS 1.3 改为 `Enabled (Draft)`；
Firefox，将 `about:config` 中的 `security.tls.version.max` 改为 `4`；

>  [Qualys SSL Labs's SSL Server Test](https://www.ssllabs.com/ssltest/index.html) 也支持验证服务端是否支持 TLS 1.3，非常方便，继续推荐。

### 管理脚本与自启动
为了方便管理 Nginx 服务，再创建一个管理脚本：

```shell
vim /etc/init.d/nginx
```
输入以下内容：

```BASH
#! /bin/sh

### BEGIN INIT INFO
# Provides:          nginx
# Required-Start:    $all
# Required-Stop:     $all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts the nginx web server
# Description:       starts nginx using start-stop-daemon
### END INIT INFO

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
DAEMON=/usr/local/nginx/sbin/nginx
NAME=nginx
DESC=nginx

test -x $DAEMON || exit 0

# Include nginx defaults if available
if [ -f /etc/default/nginx ] ; then
  . /etc/default/nginx
fi

set -e

. /lib/lsb/init-functions

case "$1" in
  start)
    echo -n "Starting $DESC: "
    start-stop-daemon --start --quiet --pidfile /usr/local/nginx/logs/$NAME.pid \
        --exec $DAEMON -- $DAEMON_OPTS || true
    echo "$NAME."
    ;;
  stop)
    echo -n "Stopping $DESC: "
    start-stop-daemon --stop --quiet --pidfile /usr/local/nginx/logs/$NAME.pid \
        --exec $DAEMON || true
    echo "$NAME."
    ;;
  restart|force-reload)
    echo -n "Restarting $DESC: "
    start-stop-daemon --stop --quiet --pidfile \
        /usr/local/nginx/logs/$NAME.pid --exec $DAEMON || true
    sleep 1
    start-stop-daemon --start --quiet --pidfile \
        /usr/local/nginx/logs/$NAME.pid --exec $DAEMON -- $DAEMON_OPTS || true
    echo "$NAME."
    ;;
  reload)
    echo -n "Reloading $DESC configuration: "
    start-stop-daemon --stop --signal HUP --quiet --pidfile /usr/local/nginx/logs/$NAME.pid \
        --exec $DAEMON || true
    echo "$NAME."
    ;;
  status)
    status_of_proc -p /usr/local/nginx/logs/$NAME.pid "$DAEMON" nginx && exit 0 || exit $?
    ;;
  *)
    N=/etc/init.d/$NAME
    echo "Usage: $N {start|stop|restart|reload|force-reload|status}" >&2
    exit 1
    ;;
esac

exit 0
```
增加执行权限：
```shell
chmod a+x /etc/init.d/nginx
```

现在管理 Nginx 只需使用以下命令即可：
```shell
service nginx start|stop|restart|reload
```
如果遇到以下错误
```shell
Failed to start nginx.service: Unit nginx.service not found.
```
解决方法：
在`/lib/systemd/system`创建`nginx.service`
内容如下：
```ini
[Unit]
Description=The NGINX HTTP and reverse proxy server
After=syslog.target network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
PIDFile=/usr/local/nginx/logs/nginx.pid
ExecStartPre=/usr/bin/nginx -t
ExecStart=/usr/bin/nginx
ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```
并将nginx可执行文件拷贝至`/usr/bin/`。

如果要开机自动启动 Nginx，请执行以下命令：
```shell
update-rc.d -f nginx defaults
```