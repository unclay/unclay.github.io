define(function(require, exports, module) {
    exports.getSiteUrl = function(type) {
        switch (type) {
            case "api":
                return (function() {
                    return window.location.href.indexOf("unclay.com") >= 0 ? "http://api.unclay.com": 
                            window.location.href.indexOf("home.com") >= 0 ? "http://api.home.com": "http://localhost:8012";
                }());
                break;
            case "source":
                return (function() {
                    return window.location.href.indexOf("unclay.com") >= 0 ? "http://source.unclay.com": 
                            window.location.href.indexOf("home.com") >= 0 ? "http://source.home.com": "http://localhost:8011";
                }());
                break;
            default:
                console.error("getSiteUrl参数不能为空");
        }
    }
});
