/**
 *  Created by Victor Ivanov <victorivanov.spb@gmail.com>
 *
 *  Эксперименты по маршрутизации от URL-адресов к файлам с HTML-данными.
 *
 * */

var express = require('express');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var fs = require("fs");
var sessionHelper = require("./session-helper.js")

// init Express app
var app = express();
app.use(cookieParser()); // must use cookieParser before expressSession
app.use(expressSession({ secret: sessionHelper.makeID() }));
app.use(bodyParser());

// Раздача статических файлов
app.use("/images", express.static('../static/images'));
app.use("/styles", express.static('../static/styles'));
app.use("/scripts", express.static('../static/scripts'));

var routes = loadRoutes();

app.get('*', function(request, response) {
    console.log("request.path: " + request.path);
    var httpCode = 404;
    var routeLine = routes[request.path];
    try {
        // Проверку равен ли r значению undefined делать не обязательно, т.к. всё равно корректно сработает исключение.
        switch (routeLine.type) {
            case "redirect":
                response.redirect(301, routeLine.url); // HTTP 301 Moved Permanently
                break;
            case "page":
                httpCode = 200;
                var data = fs.readFileSync("../compiled-data/" + routeLine.page);
                response.writeHead(httpCode, {"Content-Type": "text/html"});
                response.write(data);
                response.end();
                break;
        }
    } catch (err) {
        httpCode = 404;
    }

    if (httpCode == 404) {
        var data = fs.readFileSync("../compiled-data/html/error404.html")
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write(data);
        response.end();
    }
});

app.listen(8080);

function loadRoutes() {
    var files = ["experiment-router.json", "service-router.json"];
    var routes = [];
    for (i in files) {
        try{
            var data = fs.readFileSync("../compiled-data/" + files[i]);
            var json = JSON.parse(data);
            for (el in json.routes) {
                routes[el] = json.routes[el];
            }
        } catch (err) {
            console.log("ERROR! Troubles with file [" + files[i] + "]");
        }
    }
    return routes;
}
