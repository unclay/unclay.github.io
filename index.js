var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/') );
app.listen(1122, function(){
	console.log('listen to 1222');
});