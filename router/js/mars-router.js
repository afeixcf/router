(function () {
    function Router(o) {
        o = o || {};

        this.wrap = document.querySelectorAll('[mas-wrap]')[0];
        this.allUrl = [];
        this.options = {};
        this.fn = {};
        this.cache = {};
        this.view = {
            length: 0
        };
        this.animation = o.animation;
        this.prev = '';

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
            } else {
                router.path(curUrl, router.getOptions(curUrl), true);
            }
        })
    }

    Router.prototype.set = function (o) {
        var options = {
            cache: true
        };
        this.allUrl.push(o.rUrl);
        this.options[o.rUrl] = extend(options, o);
        return this;
    };

    Router.prototype.path = function (rUrl, options, bool) {
        var router = this;
        var o = options || {};
        var from = router.options[router.curUrl];
        var to = null;

        if (router.curUrl && router.options[router.curUrl].cache) {
            router.cache[router.options[router.curUrl].rUrl] = router.content.innerHTML;
        }

        o.rUrl = rUrl;
        router.prev = router.curUrl;
        router.curUrl = rUrl;
        router.options[rUrl] = o = extend(router.options[rUrl], o);
        to = router.options[rUrl];
        if (!router.view.length || router.animation) this.add(bool);

        var _fn = function (text) {
            bool ? window.history.replaceState(o, '', '#' + rUrl) : window.history.pushState(o, '', '#' + rUrl);
            router.before && router.before(to,from);
            router.content.innerHTML = text;

            setTimeout(function () {
                router.fn[rUrl](o);
                router.after && router.after(to,from);
            }, 0);
        };
        if (router.cache[router.options[rUrl].rUrl]) {
            _fn(router.cache[router.options[rUrl].rUrl]);
        }else if (router.options[rUrl].template) {
            router.cache[router.options[rUrl].rUrl] = router.options[rUrl].template;
            _fn(router.options[rUrl].template);
        }else {
            _ajax({
                url: router.options[rUrl].templateUrl,
                success: function (text) {
                    router.cache[router.options[rUrl].rUrl] = text;
                    _fn(text);
                }
            });
        }
    };

    // Router.prototype.back = function (rUrl, options) {
    //     var router = this;
    //     var o = options || {};
    //     o.rUrl = rUrl;
    //     router.curUrl = rUrl;
    //     router.options[rUrl] = o = extend(router.options[rUrl], o);
    //
    //     var _fn = function (text) {
    //         router.content.innerHTML = text;
    //         setTimeout(function () {
    //             router.fn[rUrl](o);
    //         },0);
    //     };
    //
    //     if (router.cache[router.options[rUrl].templateUrl]) {
    //         _fn(router.cache[router.options[rUrl].templateUrl]);
    //     } else if(router.options[rUrl].template) {
    //         _fn(router.options[rUrl].template);
    //     }else {
    //         _ajax({
    //             url: router.options[rUrl].templateUrl,
    //             success: function (text) {
    //                 router.content.innerHTML = text;
    //                 router.fn[rUrl](o);
    //             }
    //         });
    //     }
    // };

    Router.prototype.otherwise = function (rUrl) {
        this.otherwiseUrl = rUrl;
        if (this.allUrl.indexOf(rUrl) != '-1' && this.allUrl.indexOf(window.location.hash.substring(1)) == '-1') {
            this.path(rUrl, undefined, true);
        }
    };


    Router.prototype.callback = function (url, fn) {
        var curUrl = window.location.hash.substring(1);
        this.fn[url] = fn;

        if (url === curUrl) {
            this.path(curUrl, undefined, true);
        }
    };

    Router.prototype.getOptions = function (url) {
        return this.options[url];
    };

    Router.prototype.add = function () {
        var router = this;
        var oDiv = null;
        if (router.curUrl && router.view[router.curUrl]) {
            oDiv = router.view[router.curUrl];
            router.content.style.tansform = 'translate3d(100%, 0, 0)';
            router.content.style.webkitTransform = 'translate3d(100%, 0, 0)';
            setTimeout(removeEle.bind(null,router.content), 400);
            router.view[router.prev] = null;
            router.content = oDiv;
        } else {
            var num = '.2';
            if (!router.view.length) num = '0';
            oDiv = document.createElement('div');
            router.view[router.curUrl] = oDiv;
            router.view.length++;
            oDiv.setAttribute('m-view','');
            oDiv.style.position = 'absolute';
            oDiv.style.left = 0;
            oDiv.style.right = 0;
            oDiv.style.backgroundColor = '#f00';
            oDiv.style.transform = 'translate3d(100%, 0, 0)';
            oDiv.style.webkitTransform = 'translate3d(100%, 0, 0)';
            oDiv.style.transition = num + 's transform ease-in';
            oDiv.style.webkitTransition = num + 's -webkit-transform ease-in';

            router.wrap.appendChild(oDiv);
            router.content = oDiv;

            setTimeout(function () {
                router.content.style.transform = 'translate3d(0, 0, 0)';
                router.content.style.webkitTransform = 'translate3d(0, 0, 0)';
                router.complete && router.complete();
            }, 100);
        }
    };

    Router.prototype.afterEach = function (fn) {
        this.after = fn;
    };
    Router.prototype.beforeEach = function (fn) {
        this.before = fn;
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
    function insertAfter(newEl, targetEl) {
        var parentEl = targetEl.parentNode;
        console.log(targetEl);
        if(parentEl.lastChild == targetEl)
        {
            parentEl.appendChild(newEl);
        }else
        {
            parentEl.insertBefore(newEl,targetEl.nextSibling);
        }
    }
    function removeEle(removeObj) {
        removeObj.parentNode.removeChild(removeObj);
    }

    // window.Router = Router;
    window.router = new Router();
})();

