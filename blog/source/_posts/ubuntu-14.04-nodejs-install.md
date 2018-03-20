---
title: Ubuntu14.04安装最新版nodejs
date: 2017.05.10
tags:
 - ubuntu
 - nodejs
---
最近公司服务器因为某些原因，导致服务器环境需要全部重新部署，安装nodejs又忘了，记录下，方便下次使用。
<!--more-->


## 安装最新版nodejs
##### 更新ubuntu软件源
    sudo apt-get update
    sudo apt-get install -y python-software-properties software-properties-common
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
##### 安装nodejs
    sudo apt-get install nodejs
##### 更新npm的包镜像源，方便快速下载
    sudo npm config set registry https://registry.npm.taobao.org
    sudo npm config list
##### 全局安装n管理器(用于管理nodejs版本)
    sudo npm install n -g
##### 安装最新的nodejs（stable版本）
    sudo n stable
    sudo node -v

## QA
##### Q: 更新软件源出现-找不到对应的KEY
    // error code
    W: There is no public key available for the following key IDs:
    8B48AD6246925553
    W: Failed to fetch http://mirrors.aliyuncs.com/ubuntu/dists/precise/Release.gpg  Could not connect to mirrors.aliyuncs.com:80 (10.143.34.200), connection timed out

    // A：resolve: add key
    gpg --keyserver keyserver.ubuntu.com --recv-keys 8B48AD6246925553
    gpg -a --export 8B48AD6246925553 | sudo apt-key add -

#### Q: aliyun、163等其他软件源一直出现下载失败
    // error code
    W: Failed to fetch http://mirrors.163.com/ubuntu/dists/precise/Release.gpg  Could not connect to mirrors.163.com:80 (123.58.173.106). - connect (111: Connection refused)
    W: Failed to fetch http://mirrors.163.com/ubuntu/dists/precise-security/Release.gpg  Unable to connect to mirrors.163.com:http:
    W: Failed to fetch http://mirrors.163.com/ubuntu/dists/precise-updates/Release.gpg  Unable to connect to mirrors.163.com:http:
    W: Failed to fetch http://mirrors.163.com/ubuntu/dists/precise-proposed/Release.gpg  Unable to connect to mirrors.163.com:http:
    W: Failed to fetch http://mirrors.163.com/ubuntu/dists/precise-backports/Release.gpg  Unable to connect to mirrors.163.com:http:
    W: Some index files failed to download. They have been ignored, or old ones used instead.

    // A: 部分网络问题，下载失败，尝试换成官方源，虽然比较慢，但是能下载
    // resolve：修改apt文件  /etc/apt/sources.list（注意备份）
    # Ubuntu官方
    deb http://cn.archive.ubuntu.com/ubuntu/ trusty main restricted universe multiverse
    deb http://cn.archive.ubuntu.com/ubuntu/ trusty-security main restricted universe multiverse
    deb http://cn.archive.ubuntu.com/ubuntu/ trusty-updates main restricted universe multiverse
    deb http://cn.archive.ubuntu.com/ubuntu/ trusty-backports main restricted universe multiverse
    deb http://cn.archive.ubuntu.com/ubuntu/ trusty-proposed main restricted universe multiverse
    deb-src http://cn.archive.ubuntu.com/ubuntu/ trusty main restricted universe multiverse
    deb-src http://cn.archive.ubuntu.com/ubuntu/ trusty-security main restricted universe multiverse
    deb-src http://cn.archive.ubuntu.com/ubuntu/ trusty-updates main restricted universe multiverse
    deb-src http://cn.archive.ubuntu.com/ubuntu/ trusty-backports main restricted universe multiverse
    deb-src http://cn.archive.ubuntu.com/ubuntu/ trusty-proposed main restricted universe multiverse

#### Q: sudo make编译nodejs失败
    make[1]: *** [/home/software/node-v7.8.0/out/Release/obj.target/v8_libplatform/deps/v8/src/libplatform/default-platform.o] Error 1
    make[1]: Leaving directory `/home/software/node-v7.8.0/out'
    make: *** [node] Error 2

    // A: gcc版本太低，需要把gcc升级到4.8以上

## ubuntu软件源
修改/etc/apt/sources.list为以下软件源（改前请备份）
163和里面在部分网络下会一直下载失败，可以改回官方源下载
##### 源列表
[http://wiki.ubuntu.org.cn/模板:14.04source](http://wiki.ubuntu.org.cn/模板:14.04source)
##### Ubuntu官方
    deb http://cn.archive.ubuntu.com/ubuntu/ trusty main restricted universe multiverse
    deb http://cn.archive.ubuntu.com/ubuntu/ trusty-security main restricted universe multiverse
    deb http://cn.archive.ubuntu.com/ubuntu/ trusty-updates main restricted universe multiverse
    deb http://cn.archive.ubuntu.com/ubuntu/ trusty-backports main restricted universe multiverse
    deb http://cn.archive.ubuntu.com/ubuntu/ trusty-proposed main restricted universe multiverse
    deb-src http://cn.archive.ubuntu.com/ubuntu/ trusty main restricted universe multiverse
    deb-src http://cn.archive.ubuntu.com/ubuntu/ trusty-security main restricted universe multiverse
    deb-src http://cn.archive.ubuntu.com/ubuntu/ trusty-updates main restricted universe multiverse
    deb-src http://cn.archive.ubuntu.com/ubuntu/ trusty-backports main restricted universe multiverse
    deb-src http://cn.archive.ubuntu.com/ubuntu/ trusty-proposed main restricted universe multiverse
    
##### 163软件源
    deb http://mirrors.163.com/ubuntu/ precise main restricted universe multiverse
    deb http://mirrors.163.com/ubuntu/ precise-security main restricted universe multiverse
    deb http://mirrors.163.com/ubuntu/ precise-updates main restricted universe multiverse
    deb http://mirrors.163.com/ubuntu/ precise-proposed main restricted universe multiverse
    deb http://mirrors.163.com/ubuntu/ precise-backports main restricted universe multiverse
    deb-src http://mirrors.163.com/ubuntu/ precise main restricted universe multiverse
    deb-src http://mirrors.163.com/ubuntu/ precise-security main restricted universe multiverse
    deb-src http://mirrors.163.com/ubuntu/ precise-updates main restricted universe multiverse
    deb-src http://mirrors.163.com/ubuntu/ precise-proposed main restricted universe multiverse
    deb-src http://mirrors.163.com/ubuntu/ precise-backports main restricted universe multiverse

##### aliyun软件源
    deb http://mirrors.aliyun.com/ubuntu/ precise main restricted universe multiverse
    deb http://mirrors.aliyun.com/ubuntu/ precise-security main restricted universe multiverse
    deb http://mirrors.aliyun.com/ubuntu/ precise-updates main restricted universe multiverse
    deb http://mirrors.aliyun.com/ubuntu/ precise-proposed main restricted universe multiverse
    deb http://mirrors.aliyun.com/ubuntu/ precise-backports main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ precise main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ precise-security main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ precise-updates main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ precise-proposed main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ precise-backports main restricted universe multiverse

    deb http://mirrors.aliyuncs.com/ubuntu/ precise main restricted universe multiverse
    deb http://mirrors.aliyuncs.com/ubuntu/ precise-security main restricted universe multiverse
    deb http://mirrors.aliyuncs.com/ubuntu/ precise-updates main restricted universe multiverse
    deb http://mirrors.aliyuncs.com/ubuntu/ precise-proposed main restricted universe multiverse
    deb http://mirrors.aliyuncs.com/ubuntu/ precise-backports main restricted universe multiverse
    deb-src http://mirrors.aliyuncs.com/ubuntu/ precise main restricted universe multiverse
    deb-src http://mirrors.aliyuncs.com/ubuntu/ precise-security main restricted universe multiverse
    deb-src http://mirrors.aliyuncs.com/ubuntu/ precise-updates main restricted universe multiverse
    deb-src http://mirrors.aliyuncs.com/ubuntu/ precise-proposed main restricted universe multiverse
    deb-src http://mirrors.aliyuncs.com/ubuntu/ precise-backports main restricted universe multiverse