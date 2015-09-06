define(function(require, exports, module){
	var $ = require("jquery");
	var Handlebars = require("handlebarser/1.3.0/index");
	var Config = require("site-config/1.0.0/index");
	var Url = require("url/1.2.0/url");

	var url = new Url(window.location.href);
	Handlebars.registerHelper("getStatus", function(status){
		return status === 1 ? "启用": "停用";
	});
	Handlebars.registerHelper("getImg", function(filename){
		return Config.getSiteUrl("api")+"/thumbnail/"+filename;
	});
	Handlebars.registerHelper("getTImg", function(filename){
		return Config.getSiteUrl("api")+"/t_thumbnail/"+filename;
	});
	Handlebars.registerHelper("setTag", function(tag, arr){
		var html = '';
		var checked = '';
		tag = tag || [];
		for(var i=0; i<arr.length; i++){
			if( tag.length == 0 ){
				checked = i == 0 ? "checked": "";
				html += '<label for="tag'+arr[i]._id+'"><input type="checkbox" name="tag'+arr[i]._id+'" id="tag'+arr[i]._id+'" value="'+arr[i]._id+'" '+ checked +' />' + arr[i].name + '</label>';
			} else {
				checked = "";
				for(var j=0; j<tag.length; j++){
					if( tag[j] == arr[i]._id ){
						checked = "checked";
						break;
					}
				}
				html += '<label for="tag'+arr[i]._id+'"><input type="checkbox" name="tag'+arr[i]._id+'" id="tag'+arr[i]._id+'" value="'+arr[i]._id+'" '+ checked +' />' + arr[i].name + '</label>';
			}
		}
		return html;
	});

	var G_pageType = window.location.href.match(/admin(\/\w*)+/g)[0];

	function getValueTag(cb, op){
		$.ajax({
			url: Config.getSiteUrl("api")+"/api/v1/tag",
			type: "GET",
			data: op || {},
			success: function(data){
				cb && cb(data);
			},
			error: function(data){
				console.log(data);
			}
		});
	};
	function setThumbnail(){
		$("#JS_btn_thumbnail").on("click", function(){
            var thumbnailForm = new FormData();
            thumbnailForm.append("file",$("#JS_file_thumbnail")[0].files[0]);
            thumbnailForm.append("place", "thumbnail");
            //thumbnailForm.append("id", );
            $.ajax({
                cache: false,
                url: Config.getSiteUrl("api")+"/api/v1/file",
                type: "POST",
                data: thumbnailForm,
                contentType: false,
                processData: false,
                success: function(data){
                    console.log(data);
                    if( data.code === 0 ){
                    	$("#JS_thumbnail").val(data.data.filename);
                    	$("#JS_img_thumbnail").attr("src", Config.getSiteUrl("api")+"/thumbnail/"+data.data.filename).show();
                    } else {
                    	alert( data.message );
                    }
                },
                error: function(data){
                    console.log(data);
                }
            });
        });
	};

	function Thumbnail(opt){
		this.container = $("#"+opt.id);
		this.container.on("click", function(e){
			$.ajax({
				url: Config.getSiteUrl("api")+"/api/v1/file",
				type: "GET",
				data: {},
				success: function(data){
					if( data.code === 0 ){
						$("body").append( Handlebars.compile($("#JS_thumbnailShade_tpl").html(), { noEscape: true })(data.data.list) );
						$(".thumbnail-shade-i").on("click", function(){
							$("#JS_thumbnailShade").remove();
						});
						$(".thumbnail-shade-box img").on("click", function(){
							$(this).addClass("active").siblings().removeClass("active");
						});
						$(".btn-sure").on("click", function(){
							var $img = $(".thumbnail-shade-box img.active");
							if( $img.length > 0 ){
								$("#JS_thumbnail").val($img.attr("data-name"));
								$("#JS_img_thumbnail").attr("src", $img.attr("src").replace("t_thumbnail", "thumbnail")).show();
								$("#JS_thumbnailShade").remove();
							} else $("#JS_thumbnailShade").remove();
						});
						opt.click && opt.click(e, data);
					} else alert(data.message);
				},
				error: function(data){
					console.log(data);
				}
			});
		});
	}

	exports.note = function(){
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
		});
	}

	exports.noteInsert = function(){
		new Thumbnail({ id: "JS_select_thumbnail" });
		getValueTag(function(data){
			$("#JS_tag").html( Handlebars.compile("{{setTag temp this}}", { noEscape: true })(data.data.list) );
		});
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
		setThumbnail();
	}
	exports.noteUpdate = function(){
		$.ajax({
			url: Config.getSiteUrl("api")+"/api/v1/note/" + url.getParam("id"),
			type: "GET",
			data: {},
			success: function(data){
				getValueTag(function(tag){
					console.log(tag);
					data.data.arrTag = tag.data.list;
					var tpl = $("#JS_form_tpl").html();
					$("#JS_form").html( Handlebars.compile(tpl, { noEscape: true })(data.data) );
					setEventNoteUpdate();
					setThumbnail();
					new Thumbnail({ id: "JS_select_thumbnail" });
				});
				
			},
			error: function(data){
				$("#JS_form").html(JSON.stringify(data));
				console.log(data);
			}
		});
		
		function setEventNoteUpdate(){
			$("#JS_submit").on("click", function(e){
				var $chk = $("#JS_tag input[type=checkbox]:checked");
				var tag = [];
				for(var i=0; i<$chk.length; i++){
					tag.push($chk.eq(i).val());
				}
				var json = {
					title: $("#JS_title").val(),
					intro: $("#JS_intro").val(),
					content: $("#JS_content").val(),
					thumbnail: $("#JS_thumbnail").val(),
					seo_title: $("#JS_seoTitle").val(),
					seo_keywords: $("#JS_seoKeywords").val(),
					seo_description: $("#JS_seoDescription").val(),
					seo_url: $("#JS_seoUrl").val(),
					_id: url.getParam("id"),
					tag: tag
				};
				console.log(json);
				$.ajax({
					url: Config.getSiteUrl("api")+"/api/v1/note",
					type: "PUT",
					data: json,
					xhrFields: {
						withCredentials:true
					},
					success: function(data){
						if( data.code === 0 ){
							alert("更新成功");
						} else {
							alert(data.message);
						}
					},
					error: function(data){
						console.log(data);
					}
				});
				e.preventDefault();
			});
		}
	}
	exports.tag = function(){
		$.ajax({
			url: Config.getSiteUrl("api")+"/api/v1/tag",
			type: "GET",
			data: {
				status: "0,1"
			},
			success: function(data){
				var tpl = $("#JS_tbody_tpl").html();
				$("#JS_tbody").html( Handlebars.compile(tpl, { noEscape: true })(data.data.list) );
				setEventTagUpdate();
			},
			error: function(data){
				console.log(data);
			}
		});
		function setEventTagUpdate(){
			$(".update-btn, .abled-btn").on("click", function(e){
				var _this = this;
				var $tr = $(_this).parents("tr");
				var status = $(_this).attr("data-type");
				console.log( status, $(_this).attr("data-type") );
				var json = {
					_id: $tr.find("input[name=_id]").val()
				};
				if( status == 0 ){
					json.status = 1;
				} else if( status == 1 ){
					json.status = 0;
				} else {
					json = {
						name: $tr.find("input[name=name]").val(),
						alias: $tr.find("input[name=alias]").val(),
						desc: $tr.find("input[name=desc]").val(),
						_id: $tr.find("input[name=_id]").val(),
						serial: $tr.find("input[name=serial]").val()
					};
				}
				$.ajax({
					url: Config.getSiteUrl("api")+"/api/v1/tag",
					type: "PUT",
					data: json,
					success: function(data){
						if( data.code === 0 ){
							if( status < 2 ){
								alert("更新成功");
								window.location.href = "/admin/tag.wcl";
							} 
							else alert("更新成功");
						} else {
							alert(data.message);
						}
					},
					error: function(data){
						console.log(data);
					}
				});
				e.preventDefault();
			});
			$(".del-btn").on("click", function(e){
				var $tr = $(this).parents("tr");
				if( !$tr.find("input[name=allcheckbox]").attr("checked") ){
					alert("必须先勾选要删除的项才能删除~");
					return false;
				}
				var json = {
					_id: $tr.find("input[name=_id]").val()
				};
				$.ajax({
					url: Config.getSiteUrl("api")+"/api/v1/tag",
					type: "DELETE",
					data: json,
					success: function(data){
						if( data.code === 0 ){
							alert("删除成功");
							$tr.remove();
						} else {
							alert(data.message);
						}
					},
					error: function(data){
						console.log(data);
					}
				});
				e.preventDefault();
			});
		}
		$("#JS_submit").on("click", function(e){
			var json = {
				name: $("#JS_name").val(),
				alias: $("#JS_alias").val(),
				desc: $("#JS_desc").val(),
				type: "tag"
			};
			$.ajax({
				url: Config.getSiteUrl("api")+"/api/v1/tag",
				type: "POST",
				data: json,
				xhrFields: {
					withCredentials:true
				},
				success: function(data){
					if( data.code == 0 ){
						alert("新增成功");
						window.location.href = "/admin/tag.wcl";
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
	}

	if( G_pageType === "admin/note" ){
		
	} else if( G_pageType === "admin/note/insert" ){
		
	} else if( G_pageType === "admin/note/update" ){
		
		
	} else if( G_pageType === "admin/tag" ){
		
	}
});