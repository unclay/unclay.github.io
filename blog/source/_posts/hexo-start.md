---
title: 开始使用Hexo
date: 2017-07-25
tags:
 - hexo
categories:
 - lab
---
本站基于Hexo，写文章前需要先安装Hexo。（文档格式是Markdown）
<!--more-->

## Hexo使用

### 全局安装

``` bash
$ npm install hexo-cli -g
```
详情：[Hexo](https://hexo.io/)


### 本地预览

``` bash
$ hexo server
```
详情：[Hexo Server](https://hexo.io/docs/server.html)


### 创建文章

``` bash
$ hexo new "your note name"
```
新建的文章位于 `/source/_post` 下面
详情：[Hexo Writing](https://hexo.io/docs/writing.html)


### 编译静态文件

``` bash
$ hexo generate
```
此操作是在服务器操作，本地无需提交 `public` 静态文件。
详情：[Hexo Generate](https://hexo.io/docs/generating.html)


### 发布文章

把自己的 `markdown` 文件 `push` 上版本库即可，其他交由服务器去拉取并编译静态文件..

