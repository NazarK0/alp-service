/*
    Author: Victor Ivanov
    Created: 2016-XX-XX
    Updated: 2016-05-15

    DEV = developer
    Веб-сервер с непосредственной обработкой и загрузкой HTML-страниц.
 */
var JS_FILE = "server-dev.js";
// ----------------------------------------------------------------------------
var fs = require("fs");
var serverBasic = require("./server-basic-elements.js");
var router = require("./pageRouter.js");
var serviceIDs = require("./pageGenerator/page-service-ids.js");
var settings = require("./getter-settings.js");
// ----------------------------------------------------------------------------
var app = serverBasic.getApp();

// "/service-ids" - диагностическая страница только для DEV-сборки сервера.
app.get('/service-ids', function(request, response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(serviceIDs.getServiceIDsPage());
    response.end();
});

app.get('*', function(request, response){
    console.log("SERVER path: [" + request.path + "]");
    var answer = router.route(request.path);
    switch (answer.code) {
        case 200:
        case 404:
            response.writeHead(answer.code, {"Content-Type": "text/html"});
            response.write(answer.html);
            response.end();
            break;

        case 301:
            response.redirect(301, answer.url);
            break;
    }
});
// ----------------------------------------------------------------------------
try {
    // Установка профиля c идентификатором 'dev' в качестве текущего профиля.
    if (settings.setProfileName("dev") == false) {
        throw "Cannot set 'dev' profile.";
    }

    // Считывание JSON-данных текущего профля.
    var s = settings.getCurrentProfileSettings();
    if (s.state == false) {
        throw "Cannot get current profile.";
    }

    // Предварительная компиляция некоторых данных.
    var ec = router.initCompilers();
    if (ec > 0) {
        throw "initCompilers errors=[" + ec + "]";
    }

    // Запуск веб-сервера.
    app.listen(s.data.server.port);
    console.log(JS_FILE + " web-server is active! port=[" + s.data.server.port + "]");

} catch (err) {
    console.log(JS_FILE + " " + err);
}
// ----------------------------------------------------------------------------
