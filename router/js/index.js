
    router
        .set({
            templateUrl: 'html/template01.html',
            rUrl: '/template01'
        })
        .set({
            templateUrl: 'html/template02.html',
            rUrl: '/template02'
        })
        .set({
            templateUrl: 'html/template03.html',
            rUrl: '/03'
        })
        .set({
            template: '123456',
            rUrl: '/04'
        });

    router.otherwise('/template01');

    router.callback('/template01', function (params) {
        var oDiv = document.getElementById('d');
        if (!oDiv) appendDiv();

        var goto02 = document.getElementById('go02');
        goto02.onclick = function () {
            router.path('/template02',{obj:'234'});
        };
    });

    router.callback('/template02', function (params) {
        var goto03 = document.getElementById('goto03');
        var goto01 = document.getElementById('goto01');
        goto01.onclick = function () {
            router.path('/template01');
        };

        goto03.onclick = function () {
            router.path('/03',null);
        };
    });

    router.callback('/03', function (params) {
    });

    router.callback('/04', function (params) {
    });

    router.beforeEach(function (to,from) {
        console.log(to, from);
    });
    router.afterEach(function (to,from) {
        console.log(to, from);
    });



    function appendDiv() {
        var oDiv = document.createElement('div');

        oDiv.id = 'd';
        oDiv.innerHTML = '34567890';
        oDiv.style.backgroundColor = '#aaa';
        oDiv.style.height= '60px';
        oDiv.style.lineHeight = '60px';
        router.content.appendChild(oDiv);
    }