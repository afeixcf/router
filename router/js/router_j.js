(function () {
    function Router() {
        this.content = document.getElementById('routerContent');
        this.allUrl = [];
        this.options = {};
        this.fn = {};

        var router = this;
        window.addEventListener('popstate', function (e) {
            var curUrl = window.location.hash.substring(1);
            if (!curUrl || router.allUrl.indexOf(curUrl) == '-1') {
                curUrl = router.otherwiseUrl;
                router.path(curUrl, router.getOptions(curUrl), true);
            }
            if (history.state) {
                var state = e.state;

                router.back(state.rUrl, router.getOptions(curUrl));
            }
        }, false);
    }

    Router.prototype.set = function (o) {
        var curUrl = window.location.hash.substring(1);
        this.allUrl.push(o.rUrl);
        this.options[o.rUrl] = o;
        if (o.rUrl === curUrl) {
            this.path(curUrl, undefined, true);
        }
        return this;
    };

    Router.prototype.path = function (rUrl, options, bool) {
        var router = this;
        var o = options || {};
        o.rUrl = rUrl;
        router.curUrl = rUrl;
        router.options[rUrl] = o = extend(router.options[rUrl], o);

        //$.ajax({
        //    url: router.options[rUrl].templateUrl,
        //    dataType: 'text',
        //    type: 'get',
        //    success: function (text) {
        //        bool ? window.history.replaceState(o, '', '#' + rUrl) : window.history.pushState(o, '', '#' + rUrl);
        //        router.content.innerHTML = text;
        //        router.fn[rUrl](o);
        //    }
        //});
        _ajax({
            url: router.options[rUrl].templateUrl,
            success: function (text) {
                bool ? window.history.replaceState(o, '', '#' + rUrl) : window.history.pushState(o, '', '#' + rUrl);
                router.content.innerHTML = text;
                router.fn[rUrl](o);
            }
        });
    };

    Router.prototype.back = function (rUrl, options) {
        var router = this;
        var o = options || {};
        o.rUrl = rUrl;
        router.curUrl = rUrl;
        router.options[rUrl] = o = extend(router.options[rUrl], o);

        //$.ajax({
        //    url: router.options[rUrl].templateUrl,
        //    dataType: 'text',
        //    type: 'get',
        //    success: function (text) {
        //        router.content.innerHTML = text;
        //        router.fn[rUrl](o);
        //    }
        //});

        _ajax({
            url: router.options[rUrl].templateUrl,
            success: function (text) {
                router.content.innerHTML = text;
                router.fn[rUrl](o);
            }
        });
    };

    Router.prototype.otherwise = function (rUrl) {
        this.otherwiseUrl = rUrl;
        if (this.allUrl.indexOf(rUrl) != '-1' && this.allUrl.indexOf(window.location.hash.substring(1)) == '-1') {
            this.path(rUrl, undefined, true);
        }
    };


    Router.prototype.controller = function (url, fn) {
        this.fn[url] = fn;
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

    window.Router = Router;
    window.router = new Router();
})();

