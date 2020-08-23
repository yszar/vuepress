---
title: 利用 github actions 将 vuepress 部署到 github pages
date: 2020-8-23
sidebar: 'auto'
categories:
 - 前端
tags:
 - 前端
 - github
 - vuepress
 - github pages
publish: true
---
## 前言
Vuepress 用来做 wiki 说明和博客是很方便的，但是每次我们更新本地 .md 文章都要 build 一次并且提交上去太麻烦了，所以可以利用 github actions 自动帮我们做这步 build 和提交的工作。

<!--more-->

## 方法
### 建立 workflow
先进入项目 action ：
![在这里插入图片描述](https://oss.tangjiuyang.com/20200624042526170.png)
建一个新的 workflow 模板：
在这里插入图片描述
每一个 workflow 都是一个 yml 格式的文件，里面写入 action 要做什么，这次我们使用的 workflow 脚本内容如下：

```yml
name: Publish page

on:
  push:
    branches:
      - master

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v2 # If you're using actions/checkout@v2 you must set persist-credentials to false in most cases for the deployment to work correctly.
        with:
          persist-credentials: false

      - name: Install and Build 🔧 # This example project is built using npm and outputs the result to the 'build' folder. Replace with the commands required to build your project, or remove this step entirely if your site is pre-built.
        run: |
          yarn install
          yarn run build
      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@releases/v3
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          BRANCH: gh-pages # The branch the action should deploy to.
          FOLDER: docs/.vuepress/dist # The folder the action should deploy.

```



#### 详解 actions 内容

其中

```yml
on:
  push:
    branches:
      - master
```

这部分代表监听每一次到 master 分支的 push ，有一次 push 就会执行一次 actions 。

```yml
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
```

这部分是具体要做什么工作（jobs），一个名为 `build-and-deploy` 的工作需要在 ubuntu-latest 环境中运行，这是因为后文 actions 脚本是在 ubuntu 编写的，所以要求环境使用 ubuntu 。

```yaml
- name: Checkout 🛎️
  uses: actions/checkout@v2 # If you're using actions/checkout@v2 you must set persist-credentials to false in most cases for the deployment to work correctly.
  with:
    persist-credentials: false
1234
```

之后加载一个能获取源码的 actions 命令。

```yaml
- name: Install and Build 🔧 # This example project is built using npm and outputs the result to the 'build' folder. Replace with the commands required to build your project, or remove this step entirely if your site is pre-built.
  run: |
    yarn install
    yarn run build
1234
```

之后进行 build ，如果你是 npm 那就写成：

```yml
	npm install
	npm run build
12
```

↓ 最后提交到 gh-pages 分支上：

```yaml
- name: Deploy 🚀
  uses: JamesIves/github-pages-deploy-action@releases/v3
  with:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    BRANCH: gh-pages # The branch the action should deploy to.
    FOLDER: docs/.vuepress/dist # The folder the action should deploy.
123456
```

在 workflow 文档流里我们可以用 `${{ secrets.GITHUB_TOKEN }}` 做权限认证，是一个默认存在的变量，并不需要我们去添加 `ACCESS_TOKEN` ，当然你也可以自己添加自己的 token 到项目的 secrets 里并使用。

`FOLDER` 是 build 之后生成的代码位置，如果你是 vue 、react 等项目可能在根目录 build 文件夹下，那就写成 build 。

#### workflow 文件位置

保存之后，workflow 文件会自动保存到项目根目录的 `.github/workflow` 文件夹内：
![在这里插入图片描述](https://oss.tangjiuyang.com/article_pic20200624044556326.png)

### 使用

保存 workflow 的 yml 文件的时候就会默认执行一次 actions 功能，可以到 actions 选项卡查看是否执行成功，如果失败，请自行检查哪里搞错了。

### 其他

不懂 github actions 的可以简单看一下 [阮一峰](http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html) 的教程，但是里面有部分地方因为脚本版本更新选项改变了，需要注意。

几个可能用到的：

- github action 市场：[市场地址](https://github.com/marketplace?type=actions)
  （在市场搜索后，可以直接使用别人的，或者发布自己的，在本例中我们就使用了 checkout 和 github-pages-deploy-action 两个别人发布的脚本）
- github-pages-deploy-action 地址：[Deploy to GitHub Pages](https://github.com/marketplace/actions/deploy-to-github-pages)
  （关注该脚本情况，未来可能有其他优化和支持选项）