var AJAXSERVICE = {};
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

AJAXSERVICE.service = function (url, type, param) {
  return new Promise(function (resolve, reject) {
    var newUrl =
      type === "GET" && Object.keys(param).length
        ? AJAXSERVICE.buildUrl(url, param)
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
      success: function (response) {
        resolve(response);
      },
      error: function (err) {
        reject(err);
      }
    };

    if (type !== "GET" && Object.keys(param).length) {
      ajaxOptions.data = JSON.stringify(param);
    }

    $.ajax(ajaxOptions);
  });
};

AJAXSERVICE.buildUrl = function (url, param) {
  if (url && param) {
    Object.keys(param).forEach(function (key, index) {
      if (index === 0) {
        url += "?" + key + "=" + param[key];
      } else {
        url += "&" + key + "=" + param[key];
      }
    });
  }

  return url;
};

AJAXSERVICE.doLogin = function (param) {
  return AJAXSERVICE.service(ENV.LOGIN_API, "POST", param);
};

AJAXSERVICE.findUsers = function (param) {
  return AJAXSERVICE.service(ENV.USER_API, "GET", param);
};

COOKIE_SITE.getCookie = function (cname) {
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

COOKIE_SITE.setCookie = function (cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

const OnDocumentReady = () => {
  return new Promise((resolve) => {
    $(document).ready(function () {
      var wentOffline, wentOnline;
      const handleConnectionChange = (event) => {
        let text = "";
        if (event.type == "offline") {
          text = "You lost connection.";
          wentOffline = new Date(event.timeStamp);
        }
        if (event.type == "online") {
          wentOnline = new Date(event.timeStamp);
          text = "You were offline for " + (wentOnline - wentOffline) / 1000 + "seconds. " + "You are now back online."
        }

        let contentAlert = $('#notif-online-offline').find('.content')[0];
        if (contentAlert && contentAlert.innerHTML) {
          contentAlert.innerHTML = text;
        }

        $('#notif-online-offline').removeClass('is-hidden');
        setTimeout(() => {
          $('#notif-online-offline').addClass('is-hidden');
        }, 2000);
      }

      window.addEventListener('online', handleConnectionChange);
      window.addEventListener('offline', handleConnectionChange);

      resolve();
    });
  });
};