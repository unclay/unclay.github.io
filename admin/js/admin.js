define(function(require, exports, module){
	Date.prototype.Format = function(fmt) {
		var week = ['日','一','二','三','四','五','六'];
		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"A": this.getHours() < 12 ? "上午" : "下午", //上下午
			"W": week[parseInt(this.getDay(),10)], // 星期
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
		 	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	}

	var $ = require("jquery");
	var Handlebars = require("handlebarser/1.3.0/index");
	var Config = require("site-config/1.0.0/index");
	var Url = require("url/1.2.0/url");

	var url = new Url(window.location.href);
	Handlebars.registerHelper("format", function(timestamp, format){
		return new Date(timestamp*1000).Format(format);
	});
	Handlebars.registerHelper("getStatus", function(status){
		return status === 1 ? "启用": "停用";
	});
	Handlebars.registerHelper("getImg", function(filename){
		return Config.getSiteUrl("www")+"/thumbnail/"+filename;
	});
	Handlebars.registerHelper("getTImg", function(filename){
		return Config.getSiteUrl("www")+"/t_thumbnail/"+filename;
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
	Handlebars.registerHelper("getFirstByArray", function(arr, key){
		return !!arr[0] ? (!!key ? arr[0][key] : arr[0]) : '';
	});

	var G_pageType = window.location.href.match(/admin(\/\w*)+/g)[0];

	function getTag(cb, op){
		$.ajax({
			url: Config.getSiteUrl("www")+"/api/tag",
			type: "GET",
			data: op || {},
			success: function(data){
				if( data.code === 0 ) {
					cb && cb(data);
				} else {
					console.error(data);
				}
				
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
                url: Config.getSiteUrl("www")+"/api/file",
                type: "POST",
                data: thumbnailForm,
                contentType: false,
                processData: false,
                success: function(data){
                    console.log(data);
                    if( data.code === 0 ){
                    	$("#JS_thumbnail").val(data.data.filename);
                    	$("#JS_img_thumbnail").attr("src", Config.getSiteUrl("www")+"/thumbnail/"+data.data.filename).show();
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

	function setNotePic(){
		$("#JS_fileNotePic").on("change", function(){
            var thumbnailForm = new FormData();
            thumbnailForm.append("file",$(this)[0].files[0]);
            thumbnailForm.append("place", "note");
            //thumbnailForm.append("id", );
            $.ajax({
                cache: false,
                url: Config.getSiteUrl("www")+"/api/file",
                type: "POST",
                data: thumbnailForm,
                contentType: false,
                processData: false,
                success: function(data){
                    console.log(data);
                    
                },
                error: function(data){
                    console.log(data);
                }
            });
        });
	}

	function Thumbnail(opt){
		this.container = $("#"+opt.id);
		this.container.on("click", function(e){
			$.ajax({
				url: Config.getSiteUrl("www")+"/api/file",
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
		var pager = new PagerView('JS_pagerview');
		pager.item = 3;
		pager.index = 1;
		pager.style = ["首页", "<", ">", "尾页"];
        pager.preHtml = function() {
            if (pager.index == pager.pageCount) return '<div class="pageview-main">';
            else return '<a class="pageview-box pageview-top-next" href="javascript:///' + (parseInt(pager.index) + 1) + '">下一页<span>&gt;</span></a><div class="pageview-main">';
        }
        pager.appendHtml = function() {
            if (pager.pageCount > 1) {
                var str = '';
                str += '<input type="text" id="pageInput" value="1" class="pageview-box pageview-input"/>';
                str += '<a id="pageTrue" href="javascript:///1"><span class="pageview-box pageview-true">跳转</span></a>';
                str += "</div>";
                return str;
            } else return "</div>";
        };
        pager.appendFn = function() {
            var self = this;
            var pi = document.getElementById("pageInput");
            var pt = document.getElementById("pageTrue");
            if (pi) {
                pi.onkeyup = function() {
                    var val = this.value;
                    val = val.replace(/[^0-9]/g, ''); // 去除非数字
                    val = val.replace(/^0*/g, ''); // 首位不能为0
                    val = val > self.pageCount ? self.pageCount : val; // 不能大于总页数
                    this.value = val;
                    pt.href = "javascript:///" + val; // 设置点击页面地址
                }
                pi.onblur = function() {
                    var val = this.value;
                    val = val == '' ? 1 : val; // 首位不能为空
                    this.value = val;
                    pt.href = "javascript:///" + val;
                }
            }

        };
		pager.onclick = function(index) {
		    getNoteByApi(function(data){
		    	var tpl = $("#JS_tbody_tpl").html();
		    	$("#JS_tbody").html( Handlebars.compile(tpl, { noEscape: true })(data.data.list) );
		    });
		};
		function getNoteByApi(cb){
			$.ajax({
				url: Config.getSiteUrl("www")+"/api/note",
				type: "GET",
				data: {
					limit: pager.item,
					page: pager.index,
					tag: $('.search-sort').val()
				},
				success: function(data){
					if( data.code === 0 ){
						cb && cb(data);
					} else {
						console.error(data);
					}
				},
				error: function(data){
					console.log(data);
				}
			});
		}

		
		getNoteByApi(function(data){
			var tpl = $("#JS_tbody_tpl").html();
			$("#JS_tbody").html( Handlebars.compile(tpl, { noEscape: true })(data.data.list) );
			pager.itemCount = data.data.count;
	        pager.render();
		});

		getTag(function(data){

			var list = data.data.list;
			var options = '<option value="">全部</option>';
			for(var i=0; i<list.length; i++){
				options += '<option value="' + list[i].name + '">' + list[i].name + '</option>'
			}
			$('.search-sort').html( options );
			$('.search-sort').on('change', function(){
				getNoteByApi(function(data){
					pager.itemCount = data.data.count;
					pager.index = 1;
			        pager.render();
					var tpl = $("#JS_tbody_tpl").html();
					$("#JS_tbody").html( Handlebars.compile(tpl, { noEscape: true })(data.data.list) );
				});
			});
		});
		
		
        
        
	}

	exports.noteInsert = function(){
		new Thumbnail({ id: "JS_select_thumbnail" });
		getTag(function(data){
			$("#JS_tag").html( Handlebars.compile("{{setTag temp this}}", { noEscape: true })(data.data.list) );
		});
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
				tag: tag
			};
			$.ajax({
				url: Config.getSiteUrl("www")+"/api/note",
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
			url: Config.getSiteUrl("www")+"/api/note/" + url.getParam("id"),
			type: "GET",
			data: {},
			success: function(data){
				getTag(function(tag){
					console.log(tag);
					data.data.arrTag = tag.data.list;
					var tpl = $("#JS_form_tpl").html();
					$("#JS_form").html( Handlebars.compile(tpl, { noEscape: true })(data.data) );
					setEventNoteUpdate();
					setThumbnail();
					setNotePic();
					setEventCommon();
					new Thumbnail({ id: "JS_select_thumbnail" });
				});
			},
			error: function(data){
				$("#JS_form").html(JSON.stringify(data));
				console.log(data);
			}
		});

		function setEventCommon(){
			$("#JS_openUrl").on("click", function(){
				window.open( Config.getSiteUrl("www") + "/note/" + $("#JS_seoUrl").val() );
			});
		}
		
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
					url: Config.getSiteUrl("www")+"/api/note",
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
			url: Config.getSiteUrl("www")+"/api/tag",
			type: "GET",
			data: {
				status: "0,1",
				limit: 100
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
					url: Config.getSiteUrl("www")+"/api/tag",
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
					url: Config.getSiteUrl("www")+"/api/tag",
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
				url: Config.getSiteUrl("www")+"/api/tag",
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
	exports.layout = function(){
		$.ajax({
			url: Config.getSiteUrl("www")+"/api/member",
			type: "GET",
			data: {},
			xhrFields: {
				withCredentials:true
			},
			success: function(data){
				if( data.code == 0 ){
					$("#JS_username").html(data.data.showname);
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}
	function PagerView(id) {
        var self = this;
        this.id = id; // 接受分页渲染的id
        this.wrap = null; // document.getElementById(id),获取id对象;
        this.index = 1; // 当前页数，从1开始
        this.item = 10; // 单页记录数
        this.itemCount = 0; // 总记录数
        this.maxButtons = 6; // 最大分页按钮数
        this.pageCount = 0; // 总页数
        this.style = ["首页", "上一页", "下一页", "尾页"]; // 自定义分页按钮文案
        this.classList = [
            "pageview-box", "pageview-a", "pageview-span",
            "pageview-homepage", "pageview-pre",
            "pageview-next", "pageview-endpage"
        ]; // 自定义分页样式的类名class，pageview-box按钮初始化样式，pageview-a按钮可以点击样式，pageview-span按钮不可点击样式
        /* 
         * 外部onclick，处理实际需求事件
         */
        this.onclick = function(index) {};
        /**
         * 内部onclick，处理分页的渲染
         */
        this._onclick = function(index) {
            self.index = index;
            self.onclick(index);
            self.render();
        };
        /**
         * 额外叠加html代码和js代码
         */
        this.preHtml = function() {
            return "";
        }
        this.appendHtml = function() {
            return "";
        }
        this.appendFn = function() {
            return "";
        }
        /**
         * 分页逻辑计算层
         */
        this.calc = function() {
            self.pageCount = parseInt(Math.ceil(self.itemCount / self.item));
            self.index = parseInt(self.index);
            self.index = self.index < 1 ? 1 : self.index; // 防止页数少于1
            self.index = self.index > self.pageCount ? self.pageCount : self.index; // 防止页数大于总页数

            for (var i = 0; i < self.classList.length; i++) {
                self.classList[i] = " " + self.classList[i] + " ";
            }
        };
        /**
         * 分页渲染层
         */
        this.render = function() {
            if (self.id != 'undefined') {
                self.wrap = document.getElementById(self.id);
            }
            self.calc();
            var html = self.preHtml();
            var leftIndex = Math.max(1, self.index - Math.floor(parseInt(self.maxButtons - 1) / 2));
            var rightIndex = Math.min(self.pageCount, leftIndex + self.maxButtons - 1);
            leftIndex = Math.max(1, rightIndex - self.maxButtons + 1);
            if (self.pageCount > 1) {
                if (self.index != 1) {
                    html += '<a class="' + self.classList[0] + self.classList[1] + self.classList[3] + '" href="javascript:///1">' + self.style[0] + '</a>' + '<a class="' + self.classList[0] + self.classList[1] + self.classList[4] + '" href="javascript:///' + (self.index - 1) + '">' + self.style[1] + '</a>';
                    if (leftIndex > 1) {
                        html += '<a class="' + self.classList[0] + self.classList[1] + '" href="javascript:///1">1...</a>';
                    }
                } else {
                    html += '<span class="' + self.classList[0] + self.classList[2] + self.classList[3] + '">' + self.style[0] + '</span>' +
                        '<span class="' + self.classList[0] + self.classList[2] + self.classList[4] + '">' + self.style[1] + '</span>';
                }
            }
            if (self.pageCount > 1) {
                for (var i = leftIndex; i <= rightIndex; i++) {
                    if (i == self.index) html += '<span class="' + self.classList[0] + self.classList[2] + ' on">' + i + '</span>';
                    else html += '<a class="' + self.classList[0] + self.classList[1] + '" href="javascript:///' + i + '">' + i + '</a>';
                }
            }
            if (self.pageCount > 1) {
                if (self.index != self.pageCount) {
                    if (rightIndex < self.pageCount) {
                        html += '<a class="' + self.classList[0] + self.classList[1] + '" href="javascript:///' + self.pageCount + '">...' + self.pageCount + '</a>';
                    }
                    html += '<a class="' + self.classList[0] + self.classList[1] + self.classList[5] + '" href="javascript:///' + (self.index + 1) + '">' + self.style[2] + '</a>' +
                        '<a class="' + self.classList[0] + self.classList[1] + self.classList[6] + '" href="javascript:///' + self.pageCount + '">' + self.style[3] + '</a>';
                } else {
                    html += '<span class="' + self.classList[0] + self.classList[2] + self.classList[5] + '">' + self.style[2] + '</span>' +
                        '<span class="' + self.classList[0] + self.classList[2] + self.classList[6] + '">' + self.style[3] + '</span>';
                }
            }
            self.wrap.innerHTML = html + self.appendHtml();
            var a_list = self.wrap.getElementsByTagName('a');
            for (var i in a_list) {
                a_list[i].onclick = function() {
                    var index = this.getAttribute('href');
                    if (index != "undefined" && index != "" && index.substr(0, 14) == "javascript:///") {
                        index = this.getAttribute('href').replace('javascript:///', '');
                        self._onclick(index);
                    }
                }
                self.appendFn();
            }
        };
    };
});