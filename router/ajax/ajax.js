(function () {
    function _ajax (o) {
        var xhr = new XMLHttpRequest() || new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open('get', o.url, true);

        //ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
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
    window._ajax = _ajax;
})();
