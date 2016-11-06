(function () {
    function Router() {
        this.content = $('.routerContent');
        this.allUrl = [''];

        var router = this;
        window.addEventListener('popstate', function (e) {
            var curUrl = window.location.hash.substring(1);
            if (router.allUrl.indexOf(curUrl)=='-1'){
                curUrl = router.otherwiseUrl;
            }
            router.path(curUrl,undefined,true);
            if (history.state) {
                var state = e.state;

                router.path(state.rUrl);
                //do something(state.url, state.title);
            }
        }, false);

        //this.path(window.location.hash.substring(1));
    }

    Router.prototype.set = function (o) {
        var curUrl = window.location.hash.substring(1);
        var options = {
            templateUrl: '',
            rUrl: '',
            cache: false
        };
        options = $.extend(options, o);
        this.allUrl.push(o.rUrl);
        this[options.rUrl] = options;
        if (o.rUrl === curUrl) {
           this.path(curUrl,undefined,true);
        }
        return this;
    };

    Router.prototype.path = function (rUrl, options, bool) {
        var router = this;
        var o = {
            rUrl: rUrl
        };
        o = $.extend(o, options);
        router.curUrl = rUrl;

        $.ajax({
            url: this[rUrl].templateUrl,
            dataType: 'text',
            type: 'get',
            success: function (text) {
                bool ? window.history.replaceState(o, '', '#' + rUrl) : window.history.pushState(o, '', '#' + rUrl);
                router.content[0].innerHTML = text;
                router[rUrl].complateFunction();
            }
        });
    };

    Router.prototype.otherwise = function (rUrl) {
        this.otherwiseUrl = rUrl;
        if (this.allUrl.indexOf(rUrl) != '-1' && this.allUrl.indexOf(window.location.hash.substring(1)) =='-1' ) {
            this.path(rUrl,undefined,true);
        }
    };


    Router.prototype.controller = function (url, fn) {
        this[url].complateFunction = fn;
    };

    window.Router = Router;
    window.router = new Router();
})();

