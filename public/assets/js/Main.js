var ajaxService = {};
var COOKIE_SITE = {};
var ENV = {};
var MAIN_DB = new loki("try-in-mem-js.db", { autosave: true });
var MAIN_DB_USER;
var IS_ONLINE = navigator.onLine;

MAIN_DB.loadDatabase({}, () => {
  MAIN_DB_USER = MAIN_DB.getCollection("users");
  if (!MAIN_DB_USER) {
    MAIN_DB_USER = MAIN_DB.addCollection("users");
  }
});

ENV.BASE_URL = "http://icofr.greenlabs.or.id:9999/";
ENV.LOGIN_API = ENV.BASE_URL + "do-login/";
ENV.USER_API = ENV.BASE_URL + "users/";
ENV = Object.freeze(ENV);

ajaxService.service = function(url, type, param) {
  return new Promise(function(resolve, reject) {
    var newUrl =
      type === "GET" && Object.keys(param).length
        ? ajaxService.buildUrl(url, param)
        : url;

    var headers = {
      "Content-Type": "application/json"
    };

    if (COOKIE_SITE.getCookie("token")) {
      headers["Authorization"] = COOKIE_SITE.getCookie("token");
    }

    var ajaxOptions = {
      type: type,
      url: newUrl,
      contentType: "application/json",
      headers: headers,
      success: function(response) {
        resolve(response);
      },
      error: function(err) {
        reject(err);
      }
    };

    if (type !== "GET" && Object.keys(param).length) {
      ajaxOptions.data = JSON.stringify(param);
    }

    $.ajax(ajaxOptions);
  });
};

ajaxService.buildUrl = function(url, param) {
  if (url && param) {
    Object.keys(param).forEach(function(key, index) {
      if (index === 0) {
        url += "?" + key + "=" + param[key];
      } else {
        url += "&" + key + "=" + param[key];
      }
    });
  }

  return url;
};

ajaxService.doLogin = function(param) {
  return ajaxService.service(ENV.LOGIN_API, "POST", param);
};

ajaxService.findUsers = function(param) {
  return ajaxService.service(ENV.USER_API, "GET", param);
};

COOKIE_SITE.getCookie = function(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

COOKIE_SITE.setCookie = function(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};
