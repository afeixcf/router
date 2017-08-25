(function () {
    function Router(o) {
        o = o || {};
        this.content = o.content || document.getElementById('routerContent');
        this.allUrl = [];
        this.options = {};
        this.fn = {};
        this.cache = {};

        var router = this;
        // window.addEventListener('popstate', function (e) {
        //     var curUrl = window.location.hash.substring(1);
        //     if (!curUrl || router.allUrl.indexOf(curUrl) == '-1') {
        //         curUrl = router.otherwiseUrl;
        //         router.path(curUrl, router.getOptions(curUrl), true);
        //     }
        //     if (history.state) {
        //         var state = e.state;
        //         console.log(state);
        //         router.back(state.rUrl, router.getOptions(curUrl));
        //     }
        // });

        window.addEventListener('hashchange',function (e) {
            var curUrl = window.location.hash.substring(1);
            if (!curUrl || router.allUrl.indexOf(curUrl) == '-1') {
                curUrl = router.otherwiseUrl;
                router.path(curUrl, router.getOptions(curUrl), true);
            }
            router.back(curUrl, router.getOptions(curUrl));
        })
    }

    Router.prototype.set = function (o) {
        this.allUrl.push(o.rUrl);
        this.options[o.rUrl] = o;
        return this;
    };

    Router.prototype.path = function (rUrl, options, bool) {
        var router = this;
        var o = options || {};
        o.rUrl = rUrl;
        router.curUrl = rUrl;
        router.options[rUrl] = o = extend(router.options[rUrl], o);

        // $.ajax({
        //    url: router.options[rUrl].templateUrl,
        //    dataType: 'text',
        //    type: 'get',
        //    success: function (text) {
        //        bool ? window.history.replaceState(o, '', '#' + rUrl) : window.history.pushState(o, '', '#' + rUrl);
        //        router.content.innerHTML = text;
        //        router.fn[rUrl](o);
        //    }
        // });

        var _fn = function (text) {
            bool ? window.history.replaceState(o, '', '#' + rUrl) : window.history.pushState(o, '', '#' + rUrl);
            router.content.innerHTML = text;

            router.fn[rUrl](o);
        };
        if (router.cache[router.options[rUrl].templateUrl]) {
            _fn(router.cache[router.options[rUrl].templateUrl]);
        } else if (router.options[rUrl].template) {
            _fn(router.options[rUrl].template);
        }else {
            _ajax({
                url: router.options[rUrl].templateUrl,
                success: function (text) {
                    router.cache[router.options[rUrl].templateUrl] = text;
                    _fn(text);
                }
            });
        }
    };

    Router.prototype.back = function (rUrl, options) {
        var router = this;
        var o = options || {};
        o.rUrl = rUrl;
        router.curUrl = rUrl;
        router.options[rUrl] = o = extend(router.options[rUrl], o);

        // $.ajax({
        //    url: router.options[rUrl].templateUrl,
        //    dataType: 'text',
        //    type: 'get',
        //    success: function (text) {
        //        router.content.innerHTML = text;
        //        router.fn[rUrl](o);
        //    }
        // });

        var _fn = function (text) {
            router.content.innerHTML = text;
            router.fn[rUrl](o);
        };

        if (router.cache[router.options[rUrl].templateUrl]) {
            _fn(router.cache[router.options[rUrl].templateUrl]);
        } else if(router.options[rUrl].template) {
            _fn(router.options[rUrl].template);
        }else {
            _ajax({
                url: router.options[rUrl].templateUrl,
                success: function (text) {
                    router.content.innerHTML = text;
                    router.fn[rUrl](o);
                }
            });
        }
    };

    Router.prototype.otherwise = function (rUrl) {
        this.otherwiseUrl = rUrl;
        if (this.allUrl.indexOf(rUrl) != '-1' && this.allUrl.indexOf(window.location.hash.substring(1)) == '-1') {
            this.path(rUrl, undefined, true);
        }
    };


    Router.prototype.controller = function (url, fn) {
        var curUrl = window.location.hash.substring(1);
        this.fn[url] = fn;

        if (url === curUrl) {
            this.path(curUrl, undefined, true);
        }
    };

    Router.prototype.getOptions = function (url) {
        return this.options[url];
    };

    function extend(a, b) {
        var x;
        for (x in b) {
            a[x] = b[x];
        }
        return a;
    }

    function _ajax (o) {
        var xhr = new XMLHttpRequest() || new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open('get', o.url, true);

        xhr.send();
        xhr.onreadystatechange = function (e) {
            if(xhr.readyState==4){
                if ((xhr.status>=200 && xhr.status<300) || xhr.status==304) {
                    o.success(xhr.responseText);
                }else{
                    o.error(xhr.responseText);
                }
            }
        }
    }


    window.Router = Router;
    window.router = new Router();
})();

