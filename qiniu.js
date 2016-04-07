'use strict';
var qiniu = require('qiniu');

var co = require('co');
var thunkify = require('thunkify');
var fs = require('fs');
var path = require('path');

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = '6Pdy-xSflb1yG59sz-KZEb2EYsE8IJCyO45UhCMc';
qiniu.conf.SECRET_KEY = 'atJWuH-P_MScJs-XZyX2emsO4GJmwy95tP7bmGC5';


//要上传的空间
let bucket = 'source';

//上传到七牛后保存的文件名
let key = 'common/js/vue123.js';

//构建上传策略函数
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}

const C_dirs = 'admin common demo moe'.split(' ');

function loop(path, cb){
	co(function *(){
		let stat = yield thunkify(fs.stat)(path);
		if( stat.size === 0 ){
			cb(null, yield thunkify(fs.readdir)(path));
		} else {
			cb(null, [path]);
		}
	}).catch(cb);
}
function loopPath(paths, cb){
	co(function *(){
		let statics = [];
		let __paths = [];
		for(let item of paths){
			let dirs = yield thunkify(fs.readdir)(item);
			for(let filepath of dirs){
				let stat = yield thunkify(fs.stat)(path.join(item, filepath));
				if( stat.isFile() ){
					statics.push(path.join(item, filepath));
				} else {
					__paths.push(path.join(item, filepath));
				}
			}
		}
		if( __paths.length > 0 ) statics = statics.concat( yield thunkify(loopPath)(__paths) );
		cb(null, statics);
	}).catch(cb);
}

//调用uploadFile上传
// uploadFile(token, key, filePath);
co(function *(){

	for(let i=0; i<C_dirs.length; i++){
		C_dirs[i] = path.join(__dirname, C_dirs[i]);
	}
	// console.log( C_dirs );
	let paths = yield thunkify(loopPath)(C_dirs);
	for(let item of paths){
		let key = item.replace(__dirname + '\\', '').replace(/\\/gi, '/');
		let token = uptoken(bucket, key);
		var extra = new qiniu.io.PutExtra();
		var ret = (yield thunkify(qiniu.io.putFile)(token, key, item, extra))[0];
	}
	// var dirs = yield thunkify(fs.stat)('./common.qq');
	// console.log(dirs);
	
}).catch(function(err){
	console.log(err);
});
