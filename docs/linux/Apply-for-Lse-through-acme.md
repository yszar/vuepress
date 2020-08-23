---
title: 通过acme.sh申请Let's
tags:
- linux
- 服务器
- ssl
- nginx
categories:
- Linux
date: 2020-08-12
sidebar: 'auto'
publish: true
---
Let's Encrypt 已经可以申请通配符证书了，详细通过 acme.sh 申请 Let’s Encrypt 证书的请移步《Linux 下使用 acme.sh 申请和管理 Let’s Encrypt 证书》，我是已经有了 Let’s Encrypt 证书的情况下删除证书重新申请通配符证书的，不过方法都大同小异。在这次申请 Let’s Encrypt 通配符证书的时候也遇到一些问题，现在将申请的过程及问题解决办法记录下来分享给大家，以便大家参考。

<!-- more -->

## 申请 Let’s Encrypt通配符证书步骤
### 升级 acme.sh
```shell
acme.sh –upgrade
```
PS：我升级总是失败，但是升级失败的情况好像也能申请到通配符证书，如果到第 5 步失败的话，就是升级 acme.sh 失败导致，实在不行就放弃通配符证书，改回原来的域名证书。所以想要申请通配符证书需要慎重。

如何通过`acme.sh`申请Let’s Encrypt通配符证书？ - 第2张 - boke112联盟(boke112.com)

2、查看证书列表

acme.sh --list
3、删除证书

acme.sh remove Main_Domain(证书的主域名，上述证书列表中可看见)
4、获取 Aliyun 域名 API 的密钥，在阿里云官网登录的情况下点击https://ak-console.aliyun.com/#/accesskey即可看到自己的密钥，没有就直接创建一个即可。非阿里云的请移步《如何使用 DNS API》查阅相对应的 API 的办法。

5、获得密钥之后分别输入以下命令

export Ali_Key="sdfsdfsdfljlbjkljlkjsdfoiwje"
export Ali_Secret="jlsdflanljkljlfdsaklkjflsa"
acme.sh --issue --dns dns_ali -d yigujin.cn -d *.yigujin.cn –force
记得修改以上的域名为自己的域名哦
6、获取通配符证书之后，把证书复制到另一个地方待用

acme.sh --installcert -d yigujin.cn -d *.yigujin.cn \
--key-file  /etc/nginx/ssl/yigujin.cn.key  \
--fullchain-file /etc/nginx/ssl/yigujin.cn.cer \
--reloadcmd  "service nginx force-reload"
记得修改以上的域名为自己的域名，存放证书的路径也要自行修改哦。
申请 Let’s Encrypt通配符证书遇到一个问题
不知道是不是因为升级 acme.sh 失败的缘故还是什么问题，我申请得到的通配符证书复制到指定位置存放之后，.cer 文件只有域名的证书内容，而无 ca 证书的内容，所以就会出现两个问题：

1、在服务器显示：nginx：[warn] “ssl_stapling” ignored,issuer certificate not found 的警告信息。

如何通过acme.sh申请Let’s Encrypt通配符证书？ - 第3张 - boke112联盟(boke112.com)

2、在https://myssl.com/检测得到的等级从 A+变成了 B。

其实以上两个问题都是同一个原因导致的，就是我们通过以下命令：

--fullchain-file /etc/nginx/ssl/yigujin.cn.cer \
所得到的 yigujin.cn.cer 证书里面根本就没有 CA 的证书的，而同样的方法申请非通配符的证书，cer 文件里面都含有 CA 证书，这个目前还不知道是什么原因导致。

既然知道了原因，那么解决办法就有两个，一个是放弃通配符证书，另一个就是人工添加 CA 证书。这里重点介绍人工添加 CA 证书的办法。

1、复制 CA 证书到位置

acme.sh --installcert -d yigujin.cn -d *.yigujin.cn \
--key-file  /etc/nginx/ssl /yigujin.cn.key  \
--fullchain-file /etc/nginx/ssl /yigujin.cn.cer \
--ca-file /etc/nginx/ssl/yigujin.cn.ca.cer \
--reloadcmd  "service nginx force-reload"
2、在服务器配置文件中找到以下代码：

ssl_certificate /etc/nginx/ssl/yigujin.cn.cer;
ssl_certificate_key  /etc/nginx/ssl/yigujin.cn.key;
在下方添加 CA 证书

ssl_trusted_certificate /etc/nginx/ssl/yigujin.cn.ca.cer;
不想在配置文件中添加一天 CA 证书命令的户，好像是可以直接把 CA 证书的内容添加到 yigujin.cn.cer 证书的后面保存也能解决问题。


 
3、平滑重启 nginx 后，警告信息 nginx：[warn] “ssl_stapling” ignored,issuer certificate not found 已经消失不见了。

4、将 yigujin.cn.cer 和 yigujin.cn.ca.cer 的内容合二为一，其实就是以前的 cer 证书，我们需要将这些内容添加到相应的 CDN 证书中，要不然会说证书链不完整。360 网站卫士的就是把这两个内容合成一个 CRT 文件上传。

总结
我申请 Let’s Encrypt 通配符证书所遇到的问题不知道是个案还是什么，不过本文所列举的问题及解决办法都是真实发生的，目前我的懿古今和 boke112 导航已经使用上了 Let’s Encrypt 通配符证书，运行一切良好。如果你在申请 Let’s Encrypt 通配符证书也遇到相类似的问题，你可以试着按照我的办法去解决看看。申请 Let’s Encrypt 证书（非通配符证书）不会遇到证书链不完整的情况，也不需要人工合成证书。
