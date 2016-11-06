$(function () {
    var goto01 = $('#goto01');

    router
        .set({
            templateUrl: 'html/template01.html',
            rUrl: '/template01'
        })
        .set({
            templateUrl: 'html/template02.html',
            rUrl: '/template02'
        });

    router.otherwise('/template01');

    router.controller('/template01', function () {
        $('#go02').click(function () {
            router.path('/template02');
        });

        $('#goIndex').click(function () {
            //router.path('');
        });
    });

    router.controller('/template02', function () {
        $('#goto01').click(function () {
            router.path('/template01');
        });

    });

});