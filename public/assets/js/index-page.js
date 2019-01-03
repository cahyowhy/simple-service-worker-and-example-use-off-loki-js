$(document).ready(function (params) {
    new SW();
    
    $("form").submit(function (event) {
        event.preventDefault();
        var username = $("input#username").val();
        var password = $("input#password").val();
        if (username && password) {
            ajaxService
                .doLogin({ username: username, password: password })
                .then(function (resp) {
                    if (resp && resp.status === "1101") {
                        COOKIE_SITE.setCookie("token", resp.data.token, 1);
                        location.href = '/users.html';
                    }
                });
        }
    });
});