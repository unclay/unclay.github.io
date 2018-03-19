---
title: Hexo折腾记
date: 2018-03-18
tags:
 - hexo
categories:
 - lab
---

个人比较喜欢简约版的风格，
再加上爱折腾，
闲来没事就自己折腾个hexo主题。
<!--more-->

## 准备功课

本人非设计师，对于自己来设计还是压力挺大的，于是寻找自己喜欢的风格加（ju）以（wei）吸（ji）收（yong）。

参考主题：
+ <a href="https://www.haomwei.com/" target="_blank">Maupassant</a>
+ <a href="https://d2fan.com/" target="_blank">PolarBear</a>

开始前你需要了解：
+ 模板引擎
+ css预处理器
+ hexo文档

为了减少折腾成本，选了自己熟悉的<a href="http://ejs.co/">ejs</a>作为我的模板引擎，而css预处理器则选择<a href="http://lesscss.org/">less</a>。ejs是hexo预安装的插件，less非预装的，所以需要自己手动安装。

```bash
# 当前目录/blog
$ npm install hexo-renderer-less --save
```

## 目录结构

首先假设自己的项目名为blog，主题名为blog-theme

+ hexo目录 https://hexo.io/zh-cn/docs/setup.html
+ themes目录 https://hexo.io/zh-cn/docs/themes.html

```mel
blog
  ├── _config.yml
  ├── package.json
  ├── scaffolds
  ├── source
  ├   ├── _drafts
  ├   └── _posts
  ├── themes
  └      └── blog-theme

blog-theme
  ├── _config.yml 主题配置文件
  ├── languages   语言文件
  ├── layout      布局文件，页面模板
  ├── scripts     Hexo脚本
  └── source      资源文件，主题的css、js、font等
```

### 设置生效主题

##### blog/_config.yml

```yml
...
theme: hexo-blog
...
```

### 配置主题导航

##### blog-theme/_config.yml

```yml
# create time
since: 2017

# header
menu:
  Home: /
  Archives: /archives/
```

## 页面模板

### 模板前言

开始前你需要了解的模板<a href="https://hexo.io/zh-cn/docs/variables.html" target="_blank">变量</a>：
+ config blog的_config.yml文件
+ theme  blog-theme的_config.yml文件
+ <a href="https://hexo.io/zh-cn/docs/variables.html#页面变量">page</a> hexo的页面内容，包含文章信息、分页信息、分类、标签、归档等信息

由于需要公共的头尾部，需要通过layout来布局


#### 主题模板

```mel
layout
  ├── _partial 局部模板目录
  ├       ├── head.ejs head信息
  ├       ├── header.ejs 头部模板
  ├       └── footer.ejs 尾部模板
  ├── layout.ejs  布局模板壳
  └── index.ejs   首页
  └── archive.ejs 归档
```

##### layout/layout.ejs

```html
<!DOCTYPE html>
<html>
  <%- partial('_partial/head') %>
  <body>
    <container class="container">
      <%- partial('_partial/header') %>
      <main class="main">
        <%- body %>
      </main>
      <%- partial('_partial/footer') %>
    </container>
  </body>
</html>
```

##### layout/index.ejs

```html
Hello World
```

##### layout/archive.ejs

```html
Hello World
```

##### layout/_partial/head.ejs

```html
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <title><%= config.title %></title>
</head>
```

##### layout/_partial/header.ejs

```html
<header class="header">
  <div class="blog-title">
    <a href="<%- url_for() %>" class="logo"><%= config.title %></a>
  </div>
  <nav class="navbar">
    <ul class="menu">
      <% for (name in theme.menu) { %>
        <li class="menu-item">
          <a href="<%- url_for(theme.menu[name]) %>" class="menu-item-link"><%- name %></a>
        </li>
      <% } %>
    </ul>
  </nav>
</header>
```

##### layout/_partial/footer.ejs

```html
<div class="footer">
  Copyright © <%=theme.since%><% if (theme.since < new Date().getFullYear()) { %>
    <%= ' - ' + new Date().getFullYear()%>
  <% } %> <%=config.author%> | 
  Powered by <a href="https://hexo.io/" target="_blank">Hexo</a> | Theme by <a href="https://github.com/unclay/hexo-theme-eleven">Eleven</a>.
</div>
```

## 页面样式

注意：记得安装hexo-renderer-less

```mel
source/css
  ├── _partial   局部样式目录
  ├       ├── header.less 头部样式
  ├       ├── footer.less 底部样式
  ├── _var.less less变量文件
  └── style.less 入口样式文件
```

### 加载css文件

css/style.css会自动读取source/css/style.less文件，原理自己有空再看。

##### blog/layout/_partial/head.ejs

```html
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <title><%= config.title %></title>
  <%- css('css/style.css') %>
</head>
```

### 配置样式

##### source/css/_var.less

```less
@mainTextColor: rgba(0, 0, 0, 0.75);
@mainLinkColor: #368CCB;
@mainBorderColor: #eee;
```

##### source/css/style.less

```less
@import '_var';
html {
  font-size: 16px;
  box-sizing: border-box;
}

body {
  margin: 0;
  color: @mainTextColor;
}

a {
  color: @mainTextColor;
  text-decoration: none;
}
.main {
  max-width: 720px;
  margin: 40px auto 0;
}

@import '_partial/header';
@import '_partial/footer';
```

##### source/css/_partial/header.less

```less
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 0 1em;
  justify-content: space-between;
  border-bottom: 1px solid #e5e5e5;
  background: #fff;
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;

  .blog-title {
    .logo {
      font-size: 1.1em;
    }
  }

  .menu {
    margin: 0;
    padding: 0;
    font-size: .8em;

    .menu-item {
      display: inline-block;
      padding: 0 .5em;
    }

    .menu-item-link {
      display: inline-block;
      color: rgba(0, 0, 0, 0.6);
      text-decoration: none;

      &:hover {
        color: @mainLinkColor;
      }
    }
  }
}
```

##### source/css/_partial/footer.less

```less
.footer {
  margin-top: 20px;
  font-size: 0.8em;
  line-height: 3em;
  height: 3em;
  border-top: 1px solid @mainBorderColor;
  box-sizing: border-box;
  text-align: center;
  a {
    color: @mainLinkColor;
  }
}
```

## 首页排版

本人首页定位为文章列表页

### 布局模板

首页是文章聚合页，需要做分页，所以同时要新增一个分页模板

##### layout/index.ejs

```html
<section class="posts">
  <% page.posts.each(function (post) { %>
    <article class="post">
      <div class="post-title">
        <a class="post-title-link" href="<%- url_for(post.path) %>"><%= post.title %></a>
      </div>
      <div class="post-content">
        <%- post.excerpt %>
      </div>
      <div class="post-meta">
        <span class="post-time"><%- date(post.date, "YYYY-MM-DD") %></span>
      </div>
    </article>
  <% }) %>
</section>
<%- partial('_partial/paginator') %>
```

##### layout/_partial/paginator.ejs

```html
<% if (page.total > 1){ %>
  <nav class="page-nav">
    <%- paginator({
      prev_text: "&laquo;&nbsp;上一页",
      next_text: "下一页&nbsp;&raquo;",
    }) %>
  </nav>
<% } %>
```

### 布局样式

新增首页、分页样式文件

##### source/css/_partial/style.less

```less
/* 追加引入首页、分页样式 */
@import 'index';
@import '_partial/paginator';
```

##### source/css/index.less

```less
.post  {
  padding: 40px 0;
  + .post {
    border-top: 1px solid @mainBorderColor;
  }

  .post-title {
    font-size: 1.3em;
  }

  .post-meta {
    margin-top: 15px;
    font-size: 0.9em;
    color: #aaa;
  }

  .post-content {
    padding-top: 15px;
    font-size: 1em;
  }
}
```

##### source/css/_partial/paginator.less

```less
.page-nav {
  text-align: center;

  .prev {
    float: left;
  }
  .next {
    float: right;
  }
  .extend {
    &:hover {
      color: @mainLinkColor;
    }
  }

  .page-number {
    padding: 6px 10px;
    &.current {
      color: @mainLinkColor;
    }
    &:hover {
      color: @mainLinkColor;
    }
  }
}
```

### 修改文章

在hello world文章中插入查看更多分割代码，为了浏览分页效果，直接复制多十份hello world文件

##### blog/source/_post/hello-world.md

```md
---
title: Hello World
---
Welcome to [Hexo](https://hexo.io/)! This is your very first post. Check [documentation](https://hexo.io/docs/) for more info. If you get any problems when using Hexo, you can find the answer in [troubleshooting](https://hexo.io/docs/troubleshooting.html) or you can ask me on [GitHub](https://github.com/hexojs/hexo/issues).
<!-- more -->
...
```

## 归档排版

本人归档主要按年份时间线展示，同时增加按年份筛选分类

### 布局模板

##### layout/archive.ejs

```html
<section class="archive">
  <h3 class="title-archive">导航</h3>
  <ul class="archive-list">
    <a class="archive-link" href="/archives/">All</a>，
    <%- list_archives({
      type: 'yearly',
      style: 'unordered list',
      transform(post, count) {
        return post;
      }
    }) %>
  </ul> 
  <% var year%>
  <% page.posts.each(function (post) { %>
    <% post.year = date(post.date, "YYYY") %>
    <% if (year > 0 && year !== post.year) { %>
      </ul>
    <% } %>
    <% if (year !== post.year) { %>
      <% year = post.year%>
      <h3 class="title-archive"><%=post.year%></h3>
      <ul class="archive-list">
    <% } %>
        <li class="post-item">
          <span class="post-date"><%= date(post.date, "YYYY/MM/DD") %></span>&nbsp;
          <a class="post-title" href="<%- url_for(post.path) %>"><%= post.title %></a>
        </li>
    <% if (!post.next) { %>
      </ul>
    <% } %>
  <% }) %>
</section>
```

### 布局样式

新增归档样式文件

##### source/css/style.less

```less
/* 追加引入归档样式 */
@import 'archive';
```

##### source/css/archive.less

```less
.archive {
  padding-top: 20px;
  .archive-link {
    font-size: 18px;
    color: @mainLinkColor;
  }
  .archive-count {
    padding: 0 5px;
    font-size: 12px;
    &:before {
      content: '(';
    }
    &:after {
      content: ')';
    }
  }
}
.title-archive {
  font-size: 25px;
  font-weight: bold;
}
.archive-list {
  padding: 0 40px;
}
.post-item {
  line-height: 28px;
}
.post-title {
  color: @mainLinkColor;
}
```

## 写在结尾

到这里，博客主题基本成型，后面有空继续在撸个分类、标签
