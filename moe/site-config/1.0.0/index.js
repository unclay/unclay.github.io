define(function(require, exports, module) {
    exports.getSiteUrl = function(type) {
        switch (type) {
            case "api":
                return (function() {
                    return window.location.href.indexOf("unclay.com") >= 0 ? "http://api.unclay.com": "http://localhost:8012";
                }());
                break;
            default:
                console.error("getSiteUrl参数不能为空");
        }
    }
});
