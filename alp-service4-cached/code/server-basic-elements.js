/*
    Author: Victor Ivanov
    Created: 2016-05-15

    Элементы веб-сервера, присутствующие в любой сборке (как 'dev', так и 'prod').
*/
var JS_FILE = "server-basic-elements.js";
// ----------------------------------------------------------------------------
var fs = require("fs");
var express = require('express');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var sessionID = require("./session-helper.js");
// ----------------------------------------------------------------------------
function getApp() {
    var app = express();
    app.use(cookieParser()); // must use cookieParser before expressSession
    app.use(expressSession({ secret: sessionID.makeID() }));
    app.use(bodyParser());
    app.use("/images", express.static('../static/images'));
    app.use("/styles", express.static('../static/styles'));
    app.use("/scripts", express.static('../static/scripts'));
    app.get('/favicon.ico', function(request, response){
        response.writeHead(200, {"Content-Type": "image/x-icon"});
        var img = fs.readFileSync('../static/images/favicon.ico');
        response.end(img, 'binary');
    });
    app.get('/robots.txt', function(request, response){
        response.writeHead(200, {"Content-Type": "text/plain"});
        var txt = fs.readFileSync('../compiled-data/robots.txt');
        response.write(txt);
        response.end();
    });
    app.get('/sitemap.xml', function(request, response){
        response.writeHead(200, {"Content-Type": "text/xml"});
        var txt = fs.readFileSync('../compiled-data/sitemap.xml');
        response.write(txt);
        response.end();
    });
    return app;
}
// ----------------------------------------------------------------------------
function getFile(fileName) {
    var result = false;
    try {
        result = JSON.parse(
            fs.readFileSync(fileName)
        );
    } catch (err) {
        result = false;
    }
    return result;
}
// ----------------------------------------------------------------------------
exports.getApp = getApp;
exports.getFile = getFile;
