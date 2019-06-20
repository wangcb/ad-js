;(function(undefined) {
    "use strict"
    var _global;
    var xhr = null;
    if(window.XMLHttpRequest) {
    	xhr = new XMLHttpRequest();
    }else {
    	xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    /*
    * 原生js实现Ajax
    */
    function oAjax(params) {
        params = params || {};
        params.data = params.data || {};
        var _json = params.jsonp ? jsonp(params): json(params); // 判断是json还是jsonp
        function json(params) { // 普通请求
            params.type = (params.type || 'GET').toUpperCase(); // 设置请求默认类型
            var urlData = formatParams(params.data); // 对数据进行格式化
            var headers = params.headers || {};
            if (params.type === 'GET') {
                xhr.open(params.type, params.url + '?' + urlData, true);
                setHeaders(xhr, headers);
                xhr.send(null);
            } else {
                xhr.open(params.type, params.url, true);
                setHeaders(xhr, headers);
                xhr.send(JSON.stringify(params.data));
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    var status = xhr.status;
                    if (status >= 200 && status < 300) {
                        var response = '';
                        var type = xhr.getResponseHeader('Content-Type');
                        if (type.indexOf('xml') !== -1 && xhr.responseXML) { // xml格式
                            response = xhr.responseXML;
                        } else if (type.indexOf('application/json') !== -1) { // JSON格式
                            response = JSON.parse(xhr.responseText);
                        } else {
                            response = xhr.responseText; // 字符串格式
                        }
                        params.success && params.success(response);
                    } else {
                        params.error && params.error(status);
                    }
                }
            }
        }
        function jsonp(params) {
            var callbackName = ('jsonp_' + Math.random()).replace(".", ""); // 回调函数名
            var head = document.getElementById(params.data.container);
            delete  params.data.container;
            params.data['callback'] = callbackName;
            var data = formatParams(params.data);
            var script = document.createElement('script');
            script.src = params.url + '?' + data; // 设置src的时候才开始向后台请求数据
            head.appendChild(script);

            // 创建jsonp函数，成功后自动让success函数调用，在自动删除
            window[callbackName] = function (json) { // 设置回调，获取后台数据后才执行
                clearTimeout(script.timer);
                window[callbackName] = null;
                params.success && params.success(json);
            };
            if (params.time) { // 限定时间
                script.timer = setTimeout(function () {
                    window[callbackName] = null;
                    params.error && params.error({
                        message: '超时'
                    })
                }, params.time)
            }

        }
        function formatParams(data) {
            // 使用 encodeURIComponent 对 URI的某部分编码
            var arr = [];
            for (var key in data) {
                arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            }
            // 添加随机数，防止缓存
            return arr.join('&');
        }
        function random() {
            return Math.floor(Math.random() * 10000 + 500);
        }
        function setHeaders(xhr, headers) {
            for (var key in headers) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }
    }
    var yzad = {
        push: function(opts){
        	var w = opts.size[0].toString().indexOf('%') != -1 ? opts.size[0] : opts.size[0] + 'px';
        	var h = opts.size[1].toString().indexOf('%') != -1 ? opts.size[1] : opts.size[1] + 'px';
        	oAjax({
        		url:'http://www.123.com.cn/ad.html',
        	    jsonp: '_adplus',
        	    data:{code:opts.code,container:opts.container},
        	    success:function(res) {
        	    	//console.log(res);
        	    	if(res.length == 0) return;
        	    	var content = '';
        	    	for(var i = 0; i< res.length; i++){
        	    		content += '<a target="_blank" href="'+res[i]['url']+'"><img src="'+res[i]["src"]+'" width="'+w+'" height="'+h+'"/></a>';
        	    	}
        	    	content += '<div style="position: absolute;font-size: 14px;bottom: 0;right:0;background: rgba(0,0,0,.3);height: 14px;line-height: 14px;color: #fff;padding: 0px 4px;width:30px">广告</div>';
        	    	document.getElementById(opts.container).innerHTML = '<iframe id="'+opts.code+'" align="center,center" src="about:blank" style="border:0;vertical-align:bottom;margin:0;width:'+w+';height:'+h+'"></iframe>'
        	    	var iframe = document.getElementById(opts.code);
        	    	var doc = document.all ? iframe.contentWindow.document : iframe.contentDocument;
        	    	doc.open();
        	    	doc.write(content);
        	    	doc.body.style.margin=0;
        	    	doc.body.style.padding=0;
        	    	doc.body.style.position='relative';
        	    	doc.body.style.overflow = 'hidden';
        	    	doc.close();
        	    },
        	});
        },
    }

    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = yzad;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return yzad;});
    } else {
        !('yzad' in _global) && (_global.yzad = yzad);
    }
}());