/*
    Author: Victor Ivanov <victorivanov.spb@gmail.com>
    Created: 2016-05-10
    Updated: 2016-05-15

    Production Server - Cached
    Сервер выдаёт заранее сформированные страницы (см. директорию 'compiled-data').

    Production:
     - port=8882
     - pageGenerator/getter-basic.js: getBasicStruct() have enabled modes: 'verification' and 'counters'.
     ? code/structHelper.js: getBasicStruct() ???
*/

// ----------------------------------------------------------------------------
var fs = require("fs");
const pathNode = require("path");
var settings = require("./getter-settings.js");
var serverBasic = require("./server-basic-elements.js");
// ----------------------------------------------------------------------------
var JS_FILE = pathNode.join(__dirname, "server-cached-prod.js");
var ROUTES_FILE =pathNode.join(__dirname, "../compiled-data/routes-compiled.json");

var app = serverBasic.getApp();

//
// Запрос '/router.restart' позволяет по запросу пользователя удалённо перезагружать файл с маршрутами (ROUTES_FILE)
// во время работы веб-сервера.
app.get('/router.restart', function(request, response){
    response.writeHead(200, {"Content-Type": "text/html"});
    routes = serverBasic.getFile(ROUTES_FILE);
    var state = "FAIL";
    if (routes !== undefined && routes !== false) {
        state = "OK";
    }
    response.write("<html><head><title>" + state + "</title><body><p>" + state + "</p></body></head>");
    response.end();
});
// ----------------------------------------------------------------------------
app.get('*', function(request, response){
    var red = routes.http301[request.path];
    if (red !== undefined) {
        response.redirect(301, red);
    } else {
        var a = routes.urls[request.path];
        if (a == undefined) {
            a = routes.urls[request.path + "/"];
            if (a == undefined) {
                a = routes.urls[request.path.substr(0, request.path.length - 1)];
            }
        }
        if (a !== undefined) {
            var data = fs.readFileSync(pathNode.join(__dirname, "../compiled-data/", a));
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(data);
            response.end();
        } else {
            var data = fs.readFileSync(pathNode.join(__dirname, "../compiled-data/", routes.http404));
            response.writeHead(404, {"Content-Type": "text/html"});
            response.write(data);
            response.end();
        }
    }
});
// ----------------------------------------------------------------------------
try {
    // Загрузка файла с действительными URL-адресами и переадресациями.
    var routes = serverBasic.getFile(ROUTES_FILE);
    if (routes == false) {
        throw "Cannot get routes file.";
    }

    // Установка профиля c идентификатором 'prod' в качестве текущего профиля.
    if (settings.setProfileName("prod") == false) {
        throw "Cannot set 'prod' profile.";
    }

    // Считывание JSON-данных текущего профля.
    var s = settings.getCurrentProfileSettings();
    if (s.state == false) {
        throw "Cannot get current profile.";
    }

    // Запуск веб-сервера.
    app.listen(s.data.server.port);
    console.log(JS_FILE + " web-server is active! port=[" + s.data.server.port + "]");

} catch (err) {
    console.log(JS_FILE + " " + err);
}
// ----------------------------------------------------------------------------