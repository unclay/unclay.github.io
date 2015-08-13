define(function(require, exports, module){
	var $ = require("jquery");
	var Handlebars = require("handlebarser/1.3.0/index");
	var Config = require("site-config/1.0.0/index");

	var G_pageType = window.location.href.match(/admin(\/\w*)+/g)[0];

	if( G_pageType === "admin/note" ){
		$.ajax({
			url: Config.getSiteUrl("api")+"/api/v1/note",
			type: "GET",
			data: {},
			success: function(data){
				console.log( $("#JS_tbody").html() );
				console.log( $("#JS_tbody_tpl").html() );
				var tpl = $("#JS_tbody_tpl").html();
				$("#JS_tbody").html( Handlebars.compile(tpl, { noEscape: true })(data.data.list) );
				console.log( Handlebars.compile(tpl, { noEscape: true })(data.data.list) );
				console.log(data.data.list);
			},
			error: function(data){
				console.log(data);
			}
		})
	}
});