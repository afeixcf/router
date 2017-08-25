
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

    router.controller('/template01', function (params) {
        console.log('01:' + params);
        console.log(params);
        var goto02 = document.getElementById('go02');
        goto02.onclick = function () {
            router.path('/template02',{obj:'234'});
        };
    });

    router.controller('/template02', function (params) {
        console.log('02:' + params);
        console.log(params);
        var goto03 = document.getElementById('goto03');
        var goto01 = document.getElementById('goto01');
        goto01.onclick = function () {
            router.path('/template01');
        };

        goto03.onclick = function () {
            router.path('/03');
        };
    });

    router.controller('/03', function (params) {
        console.log('03:' + params);
        console.log(params);
    });

    router.controller('/04', function (params) {
        console.log('04:' + params);
        console.log(params);
    });