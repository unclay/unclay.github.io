---
title: 搭建一个无依赖性的ajax-jsonp
date: 2017.04.10
tags:
 - javascript
---

公司部分内部组件、模块需要调用接口restful_api，但由于某些原因可能不想为了使用ajax而去引用类似jquery之类的插件。于是打算写个适合自己，方便自己去调用接口；这里只提供方法，需要的可自行调整成适合自己的。
<!--more-->


## JSONP方式拿数据

> jsonp在服务器端默认回调函数设置为callback  
> jsonp在服务器端返回的数据通过callback.error_code字段判断正常与否  
> 基本说明已在代码里，不做额外说明

```js
/*
 * Get data from interface by jsonp method
 * @param url {string} 
 * @param query {object}
 * @param cb_success {function}
 * @param cb_fail {function}
 * @param cb_error {function}
 */
function getJsonp(url, query, cb_success, cb_fail, cb_error){
  var _query = '';
  var script = doc.createElement('script');
  // 处理非object的查询参数
  query = Object.prototype.toString.call(query) === '[object Object]' ? query : {};
  // 服务器默认的回调接口函数
  window.callback = function(data){
    if( data.error_code === 0 ){
      cb_success && cb_success(data);
    } else {
      cb_fail && cb_fail(data);
    }
  }
  // 接口访问异常处理
  script.onerror = function(){
    cb_error && cb_error();
  }
  // 拼接接口参数到地址里
  _query = '?t=1';
  for( var i in query ){
    _query += ('&' + i + '=' + query[i]);
  }
  script.src = url + _query;
  body.appendChild(script);
}
```

以上提供5个参数调用接口

+ url                api接口的地址，只允许jsonp，通过get方式调接口  
+ query           接口查询参数  
+ cb_success 正常接收数据，接口返回正常消息  
+ cb_fail         正常接收数据，接口返回异常消息  
+ cb_error      接口异常，访问不到接口，可能403、403、500之类（一般不用）

通过以上方式调用一个接口时可以正常访问，然后同时调用两个以上的接口，会造成callback回调接口只能调用同个业务逻辑的回调，造成数据混乱，所以应该每次都动态配置回调函数  

> 假设先跟服务器端约定自定义回调函数参数名为__c，可修改为：

```js
function getJsonp(url, query, cb_success, cb_fail, cb_error){
  var _query = '';
  var script = doc.createElement('script');
  query = Object.prototype.toString.call(query) === '[object Object]' ? query : {};
  // 不同的地方
  // 以时间当作动态函数名（还有其他各种方式）
  var timestamp = new Date().getTime();
  var callbackName = 'callback_' + timestamp;
  window[callbackName] = function(data){
    if( data.error_code === 0 ){
      cb_success && cb_success(data);
    } else {
      cb_fail && cb_fail(data);
    }
    // 请求接口结束后，清除无用回调函数及其页面script元素
    delete window[callbackName];
    document.body.removeChild( doc.querySelector('#' + callbackName) );
  }
  script.id = callbackName;
  // 启用服务端的回调函数名自定义
  _query = '?__c=' + callbackName;
  for( var i in query ){
    _query += ('&' + i + '=' + query[i]);
  }
  // 不同的地方
  script.onerror = function(){
    cb_error && cb_error();
    delete window[callbackName];
    document.body.removeChild( doc.querySelector('#' + callbackName) );
  }
  script.src = url + _query;
  body.appendChild(script);
}
```

通过以上方式即可动态生成回调函数，而且多个接口直接不回互相影响  
（极端情况下，可能两个接口请求时间一样）

```js
// 极端方法
var callbackName = 'callback_' + timestamp;  // 换成
var callbackName = pathName + '_' + timestamp; // 把api路径转为回调函数名
```

其中pathName如：

```js
// url
http://127.0.0.1/api/divio/user.jsonp
// pathName可设为
api_divio_user_timestamp
```

其他方式自行脑补吧～

## 使用方法
```js
getJsonp('/api/user.jsonp', {
  page: 1,
  limit: 10
}, function(data){
  // 接口正常接收，数据操作也正常
}, function(data){
  // 接口正常接收，数据操作异常
}, function(){
  // 接口请求失败，403、404、500、502等等
});
```