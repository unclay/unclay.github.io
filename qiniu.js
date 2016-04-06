var qiniu = require('qiniu');

var co = require('co');
var thunkify = require('thunkify');
var fs = require('fs');

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = '6Pdy-xSflb1yG59sz-KZEb2EYsE8IJCyO45UhCMc';
qiniu.conf.SECRET_KEY = 'atJWuH-P_MScJs-XZyX2emsO4GJmwy95tP7bmGC5';


//要上传的空间
bucket = 'source';

//上传到七牛后保存的文件名
key = 'common/js/vue123.js';

//构建上传策略函数
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}

//生成上传 Token
token = uptoken(bucket, key);

//要上传文件的本地路径
filePath = './common/js/vue.js'

//调用uploadFile上传
// uploadFile(token, key, filePath);
co(function *(){
	var dirs = yield thunkify(fs)

	var extra = new qiniu.io.PutExtra();
	var ret = (yield thunkify(qiniu.io.putFile)(token, key, filePath, extra))[0];
	 console.log(ret.hash, ret.key, ret.persistentId);
}).catch(function(err){
	console.log(err);
});
