/*

    Сервер выдаёт заранее сформированные страницы (см. директорию 'compiled-data').

 */

var express = require('express');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var fs = require("fs");
const pathNode = require("path");
var sessionID = require("./session-helper.js");
//var router = require("./pageRouter.js");
var serviceIDs = require("./pageGenerator/page-service-ids.js");
var settings = require("./getter-settings.js");
// ----------------------------------------------------------------------------
var app = express();
app.use(cookieParser()); // must use cookieParser before expressSession
app.use(expressSession({ secret: sessionID.makeID() }));
app.use(bodyParser());

// Раздача статических файлов
app.use("/images", express.static(pathNode.join(__dirname, '../static/images')));
app.use("/styles", express.static(pathNode.join(__dirname, '../static/styles')));
app.use("/scripts", express.static(pathNode.join(__dirname, '../static/scripts')));

app.get('/favicon.ico', function(request, response){
    response.writeHead(200, {"Content-Type": "image/x-icon"});
    var img = fs.readFileSync(pathNode.join(__dirname, '../static/images/favicon.ico'));
    response.end(img, 'binary');
});

app.get('/robots.txt', function(request, response){
    response.writeHead(200, {"Content-Type": "text/plain"});
    var txt = fs.readFileSync(pathNode.join(__dirname, '../compiled-data/robots.txt'));
    response.write(txt);
    response.end();
});

app.get('/sitemap.xml', function(request, response){
    response.writeHead(200, {"Content-Type": "text/xml"});
    var txt = fs.readFileSync(pathNode.join(__dirname, '../compiled-data/sitemap.xml'));
    response.write(txt);
    response.end();
});


app.get('*', function(request, response){

    console.log("SERVER path: [" + request.path + "]");

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


var routes = getFile(pathNode.join(__dirname, "../compiled-data/routes-compiled.json"));
if (routes) {
    console.log("routes is ok");
    app.listen(8081);
} else {
    console.log("routes is err");
}

// ----------------------------------------------------------------------------
function getFile(fileName) {
    var result = false;
    try {
        result = JSON.parse(
            fs.readFileSync(fileName)
        );
    } catch (err) {
        //console.log("compileUrls.js: getFile(): ERROR! Cannot open file=[" + fileName + "] " + err);
        result = false;
    }
    return result;
}
// ----------------------------------------------------------------------------