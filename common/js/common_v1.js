define(function(require, exports, module){
	var $ = require("jquery");
	var Config = require("site-config/1.0.0/index");
	require("./blocksit.min.js");

	exports.note = function(){
		$.ajax({
			url: Config.getSiteUrl("api")+"/api/v1/note",
			type: "GET",
			data: {},
			success: function(data){
				console.log(data);
			},
			error: function(data){
				console.log(data);
			}
		})
		$('#JS_note').BlocksIt({
			numOfCol: 3,
			offsetX: 8,
			offsetY: 10
		});
	}
});