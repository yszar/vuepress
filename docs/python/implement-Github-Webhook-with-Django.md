---
title: 用Django实现Github Webhook
date: 2020-08-09
sidebar: 'auto'
tags:
  - python
  - github
  - django
categories:
  - Python
publish: true
---
> Webhooks 用中文翻译即网络钩子，以 GitHub 为例，当你向 Github 向发送 push 或 pull 等请求事件时，会触发指定的 URL，一般是向 URL 发送 POST 请求，我们收到 POST 请求就可以根据不同的事件进行相应的处理。

<!-- more -->

下面我们的例子演示了利用 `Github Webhooks` 将 `Hexo` 部署到 VPS。

# 创建 Webhook
创建 webhook 项目
```shell
$ django-admin startproject webhook
```
创建 core app
```shell
$ django-admin startapp core
```
项目 urls.py
```py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
]
```

core/urls.py
```py
from django.urls import path
from . import views

urlpatterns = [
    path('webhook', views.webhook, name='webhook'),
]
```
在 Github 项目右侧的 `Settings` 中找到 `Webhooks`，填入你上面定义的外网链接，Secret 暂时留空，其他设置见下图，然后点击 Add Webhook。

![](https://oss.tangjiuyang.com/2019/12/30/15776407068706.jpg)


`core/views.py` 先写一个简单的小例子。

`csrf_exempt` 装饰器表示不需要 csrf 认证，我们这里使用的密钥认证，稍后再说。
```py
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def webhook(request):
    return HttpResponse('pong')
```
将服务端在 VPS 上运行起来，这里推荐使用 Pycharm 的 SSH Interpreter 的，方便远程调试。
[SSH Interpreter设置传送门](http://localhost:4000/Python/pycharm-remote-synchronization-settings-ssh-interpreter.html)
注意：需要将运行 IP 改成 `0.0.0.0`，同时要向 `settings.py` 中的 `ALLOWED_HOSTS` 列表添加你的 VPS 主机名。

我们在 Github Webhook 上主动发送请求测试下，查看响应，得到的是预期的 `pong`。

![](https://oss.tangjiuyang.com/2019/12/30/15776426446826.jpg)


# 保证 Webhook的安全
## IP 白名单
此刻任何人在浏览器或者其他地方都可以直接访问该链接

![](https://oss.tangjiuyang.com/2019/12/30/15776426837621.jpg)

然而我们只想接收来自 Github 的请求，其他的理都不想理，因此我们可以建立 Github 白名单，只允许白名单的 IP 访问。幸而 Github 已经提供了所有最新的服务器 IP。通过 https://api.github.com/meta 就可以查看到。

要获取用户的 IP，可以从请求头下手。

* `REMOTE_ADDR` 该请求头记录了 TCP 连接地址，但是如果用户使用了代理，就变成了代理 IP。所以一般先看 `HTTP_X_FORWARDED_FOR`。
* `HTTP_X_FORWARDED_FOR` 该请求头记录了依次转发的每个服务的 IP，一般情况下，第一个就是客户端的真实地址。但是这个属性可以篡改，所以也不一定可信。
因此单纯通过 HTTP 请求来获取真实的 IP，是不现实的，不过大多数情况下是准确的，所以我们不过多考虑其他复杂的因素。

```py
def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
```
但是 Github 提供的 meta API 返回的是一个 IP 网段，我们还需要借助 `ipaddress` 模块进行判断。

判断一个 IP 在不在某个网段中，如下：

```py
In [1]: from ipaddress import ip_address, ip_network

In [2]: ip_address('185.199.108.233') in ip_network('185.199.108.0/22')
Out[2]: True

In [3]: ip_address('185.199.129.15') in ip_network('185.199.108.0/22')
Out[3]: False
```

`core/views.py` 继续改进如下

```py
from django.http import HttpResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
import requests
from ipaddress import ip_address, ip_network


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@csrf_exempt
def webhook(request):
    client_ip = get_client_ip(request)
    print(client_ip)
    whitelist = requests.get('https://api.github.com/meta').json()['hooks']

    for network in whitelist:
        if ip_address(client_ip) in ip_network(network):
            break
    else:
        return HttpResponseForbidden('你没有权限访问！')
    return HttpResponse('pong')
```


用 Github 测试成功

![](https://oss.tangjiuyang.com/2019/12/30/15776428863934.jpg)



用浏览器测试，已经被阻止了

![](https://oss.tangjiuyang.com/2019/12/30/15776429000755.jpg)



但是速度有点慢，因为每次访问都有从 API 去获取白名单，因此我将其放到 `settings.py` 中，只在每次启动时获取一次。

```py
IP_WHITELIST = requests.get('https://api.github.com/meta').json()['hooks']

```

```py
from django.conf import settings

...

@csrf_exempt
def webhook(request):
    client_ip = get_client_ip(request)

    for network in settings.IP_WHITELIST:
        if ip_address(client_ip) in ip_network(network):
            break
    else:
        return HttpResponseForbidden('你没有权限访问！')
    return HttpResponse('pong')
```
## 密钥 Token
仅仅是限制 IP 还不够安全，我们还要采用 token 校验。

我们先生成一个随机字符串，Django 内置的加密模块就有。
```py
In [4]: from django.utils.crypto import get_random_string

In [5]: get_random_string(50)
Out[5]: '9IPDq6yjYcBe7jyvgZfzQtAHfU3jF9DAixsEiACM4OlsrzIYzM'
```

填写到 `settings.py`，注意不要将其泄露，因此我们的所有加密都基于此密钥。如果要上传到一些公开的仓库中，建议用 Django-environ 将其存到 `.env` 中并加入到 `.gitignore` 中。

```py
GITHUB_WEBHOOK_KEY = '9IPDq6yjYcBe7jyvgZfzQtAHfU3jF9DAixsEiACM4OlsrzIYzM'
```

将该密钥同时填写到 `Github Webhooks` 中，点击 Update webhook。

![](https://oss.tangjiuyang.com/2019/12/30/15776431184422.jpg)

Github Webhook 将每次请求称为 Delivery，Delivery 的请求头格式如下：

* X-GitHub-Event 事件类型，例如 ping
* X-GitHub-Delivery 此次 Delivery 的 GUID 唯一标识，例如 52d21780-4e19-11e9-9085-ded6652d231c
* X-Hub-Signature 签名，例如 sha1=c1c05b438b13a46ba7a9c914a3e1852a4b8713a6
这里就要用到 `X-Hub-Signature` 签名，其实现原理很简单，采用的是对称加密，用的 HMAC 加密方式，哈希算法是 `sha1`，key 是上面填写的 `secret`，加密内容为 body 部分，得到的加密字符串是十六进制的。

`core/views.py` 继续改进如下：

```py
from django.http import HttpResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from ipaddress import ip_address, ip_network
import hmac


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@csrf_exempt
def webhook(request):
    client_ip = get_client_ip(request)

    for network in settings.IP_WHITELIST:
        if ip_address(client_ip) in ip_network(network):
            break
    else:
        return HttpResponseForbidden('你没有权限访问！')

    header_signature = request.META.get('HTTP_X_HUB_SIGNATURE')
    if header_signature is None:
        return HttpResponseForbidden('你没有权限访问！')

    hash_type, signature = header_signature.split('=')
    if hash_type != 'sha1':
        return HttpResponseForbidden('不支持的加密方式', status=501)

    mac = hmac.new(settings.GITHUB_WEBHOOK_KEY.encode('utf-8'), request.body, hash_type).hexdigest()
    if not hmac.compare_digest(mac, signature):
        return HttpResponseForbidden('你没有权限访问！')

    return HttpResponse('pong')
```
注意上面 `hmac.compare_digest(a, b)` 的结果和 `a == b` 一模一样，用于校验字符串。那为什么还要用这个函数呢？网上几乎查询不到相关资料，Python 官方文档写的也太简单晦涩了，直到看到 https://news.ycombinator.com/item?id=11119154 这个帖子才知道了原因。因为 a == b 在判断字符串是否相等时，如果第一个字符不相等，就立即返回 `False`，正常的算法都是要求越快越好，这也是理所当然的，但是 `hmac.compare_digest(a, b)` 会从头到尾判断，这样反而降低了运算速度。那为什么要这么做呢？

原来破解有一种思想叫做时序攻击 `timing attack`，如果用 `a == b`，会大大减少破解时间，相当于降低破解难度，而 `hmac.compare_digest(a, b)` 在一定程度上防御了时序攻击。

当然 Django 也内置了类似功能：`django.utils.crypto.constant_time_compare`，内部就是调用的 `hmac.compare_digest`

可以看看知乎上的讨论：如何通俗地解释时序攻击

## 只允许 `POST` 请求
这又是一种限制

```py
import hmac
from ipaddress import ip_address, ip_network

from django.conf import settings
from django.http import HttpResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

...

@require_POST
@csrf_exempt
def webhook(request):
    ...
    return HttpResponse('pong')
    ```
    
# 处理 Github 事件
上面已经提到过这个请求头 `X-GitHub-Event`，有哪些事件类型，建议参考 [Event Types & Payloads](https://developer.github.com/v3/activity/events/types/#event-types--payloads)。

在这里考虑到只部署博客，我们只接受 push 事件。然后利用子进程进行 `git pull` 操作。

先在服务器的 `Home` 目录下克隆博客的静态页面，

```shell
$ git clone https://github.com/yszar/yszar.github.io blog
```
然后配置好 `caddy` 或 `nginx`，这里不讲怎么配置 Web 服务器。

最终代码如下：

```py
import hmac
from ipaddress import ip_address, ip_network

from django.conf import settings
from django.http import HttpResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import subprocess


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def sync_blog():
    cwd = '/home/ubuntu/blog'
    subprocess.run('git pull'.split(), cwd=cwd)
    subprocess.run('git reset --hard origin/master'.split(), cwd=cwd)


@require_POST
@csrf_exempt
def webhook(request):
    client_ip = get_client_ip(request)

    for network in settings.IP_WHITELIST:
        if ip_address(client_ip) in ip_network(network):
            break
    else:
        return HttpResponseForbidden('你没有权限访问！')

    header_signature = request.META.get('HTTP_X_HUB_SIGNATURE')
    if header_signature is None:
        return HttpResponseForbidden('你没有权限访问！')

    hash_type, signature = header_signature.split('=')
    if hash_type != 'sha1':
        return HttpResponseForbidden('不支持的加密方式', status=501)

    mac = hmac.new(settings.GITHUB_WEBHOOK_KEY.encode('utf-8'), request.body, hash_type).hexdigest()
    if not hmac.compare_digest(mac, signature):
        return HttpResponseForbidden('你没有权限访问！')

    event = request.META.get('HTTP_X_GITHUB_EVENT', 'ping')
    if event == 'ping':
        return HttpResponse('pong')
    if event == 'push':
        sync_blog()

    return HttpResponse(status=204)
    ```
以后每次在本地推送博客到 Github 后，VPS 的内容也跟着更新。

```shell
$ hexo d
```
