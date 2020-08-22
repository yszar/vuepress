---
title: Ubuntu 编译安装 Python3.8.0
date: 2020-08-09
sidebar: 'auto'
publish: true
categories:
 - Linux
 - Python
tags:
 - Linux
 - Python
---
> 如果你想体验一下，请用虚拟机（感受一下就行，别当真。
> 仅测试Ubuntu
<!-- more -->


## 新特性
整体来说，有三点特别需要注意一下

## 海象运算符
### python3.7

```python
a = '123'
if len(a):
print(1)
```

### python3.8

```python
if (b := len(a)):
print(1)
```

> **整体这样理解**

> 优先执行短赋值（借鉴golang）右边的代码
> 将右边的代码执行结果赋值给左边变量
> 再执行if判断

展示张图片

![](https://img-blog.csdnimg.cn/20190517190032161.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyMzQ2NDE0,size_16,color_FFFFFF,t_70)

### 编译字节码可以单独指定存放位置
说白了可以通过设置环境变量 `PYTHONPYCACHEPREFIX`来指定这个生成路径，你也可以在代码中使用 `sys.pycache_prefix`来获取这个生成路径

最直接的作用就是分发Python代码的时候可以只分发编译字节码包，从而一定程度上提高了Python的安全性（可能）


在Python3.8之前，`finally` 中加 `continue` 语句是不合法的。

![](http://mweb-tangjiuyang-com.oss-cn-beijing.aliyuncs.com/2019/12/25/15772765508044.jpg)

Python3.8之后这个限制被移除了。

![](http://mweb-tangjiuyang-com.oss-cn-beijing.aliyuncs.com/2019/12/25/15772765993531.jpg)

执行结果如下

![](http://mweb-tangjiuyang-com.oss-cn-beijing.aliyuncs.com/2019/12/25/15772766129872.jpg)

更多细节，[Python3.8.0a4官方文档](https://docs.python.org/3.8/whatsnew/3.8.html)

在ubuntu1804之后python3.7存在，暂不替换（不设置软连接）。

python3.8下载（支持Linux，Windows，Mac）


```shell
wget https://www.python.org/ftp/python/3.8.0/Python-3.8.0a4.tar.xz
```

### 安装
#### 先决条件（这样可以避免两个个报错）

```shell
apt-get install zlib* -y
apt-get install libffi-dev -y
unxz Python-3.8.0a4.tar.xz
tar -zxvf Python-3.8.0a4

# 解压Python-3.8.0a4.tar.xz包时，这里推荐手动提取，这样可以省去两条命令。如果python是在一个文件夹下，请确认非root用户拥有该文件夹的全县（递归）
chown -R [非root]:[非root] Python-3.8.0a4

./configure --prefix=/usr/local/python3 --with-ssl
```

如果是Centos系统，安装报错均可在网上查阅到
```shell
zipimport.ZipImportError: can't decompress data; zlib not available
...
make: *** [Makefile:1168：install] 错误 
#权限问题，需要非root用户拥有解压好的python文件夹权限。
```
```shell
apt-get install libffi-dev -y
# 这条命令在解决 ModuleNotFoundError: No module named '_ctypes'无模块问题
```
出现以下，便是安装完成了！
```shell
Collecting setuptools
Collecting pip
Installing collected packages: setuptools, pip
Successfully installed pip-19.0.3 setuptools-40.8.0
```

最后，可以自己编写代码来感受一下`python3.8`的一些特别之处！