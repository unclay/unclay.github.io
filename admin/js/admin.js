define(function(require, exports, module){
	var $ = require("jquery");
	var Handlebars = require("handlebarser/1.3.0/index");
	var Config = require("site-config/1.0.0/index");
	var Url = require("url/1.2.0/url");

	var url = new Url(window.location.href);

	var G_pageType = window.location.href.match(/admin(\/\w*)+/g)[0];

	if( G_pageType === "admin/note" ){
		$.ajax({
			url: Config.getSiteUrl("api")+"/api/v1/note",
			type: "GET",
			data: {},
			success: function(data){
				var tpl = $("#JS_tbody_tpl").html();
				$("#JS_tbody").html( Handlebars.compile(tpl, { noEscape: true })(data.data.list) );
			},
			error: function(data){
				console.log(data);
			}
		})
	} else if( G_pageType === "admin/note/insert" ){
		$("#JS_submit").on("click", function(e){
			var json = {
				title: $("#JS_title").val(),
				intro: $("#JS_intro").val(),
				content: $("#JS_content").val(),
				thumbnail: $("#JS_file_thumbnail").val(),
				seo_title: $("#JS_seoTitle").val(),
				seo_keyword: $("#JS_seoKeyword").val(),
				seo_description: $("#JS_seoDescription").val(),
				seo_url: $("#JS_seoUrl").val()
			};
			console.log(json);
			$.ajax({
				url: Config.getSiteUrl("api")+"/api/v1/note",
				type: "POST",
				data: json,
				xhrFields: {
					withCredentials:true
				},
				success: function(data){
					if( data.code == 0 ){
						alert("新增成功");
						window.location.href = "/admin/note/update.wcl/?id="+data.data._id;
					} else {
						alert(JSON.stringify(data.message));
					}
				},
				error: function(data){
					console.log(data);
				}
			});
			e.preventDefault();
		});
	} else if( G_pageType === "admin/note/update" ){
		$.ajax({
			url: Config.getSiteUrl("api")+"/api/v1/note/" + url.getParam("id"),
			type: "GET",
			data: {},
			success: function(data){
				var tpl = $("#JS_form_tpl").html();
				$("#JS_form").html( Handlebars.compile(tpl, { noEscape: true })(data.data) );
				setEventSubmit();
			},
			error: function(data){
				console.log(data);
			}
		});
		
		function setEventSubmit(){
			$("#JS_submit").on("click", function(e){
				var json = {
					title: $("#JS_title").val(),
					intro: $("#JS_intro").val(),
					content: $("#JS_content").val(),
					thumbnail: $("#JS_file_thumbnail").val(),
					seo_title: $("#JS_seoTitle").val(),
					seo_keywords: $("#JS_seoKeywords").val(),
					seo_description: $("#JS_seoDescription").val(),
					seo_url: $("#JS_seoUrl").val()
				};
				console.log(json);
				$.ajax({
					url: Config.getSiteUrl("api")+"/api/v1/note",
					type: "POST",
					data: json,
					xhrFields: {
						withCredentials:true
					},
					success: function(data){
						console.log(data);
					},
					error: function(data){
						console.log(data);
					}
				});
				e.preventDefault();
			});
		}
	}
});