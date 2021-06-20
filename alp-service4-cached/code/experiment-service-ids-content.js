/**
 *  Created by Victor Ivanov <victorivanov.spb@gmail.com>
 *
 *  Эксперименты по использованию данных из файла content/service-ids.json
 *
 * */

var express = require('express');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var fest = require("fest");
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


app.get('/', function(request, response) {
    var file = "../templates/experiment-service-ids-content.xml";
    var json = {
        page: {
            title: "",
            h1: ""
        },
        mass : [],
        modes: {
            verification: false,
            counters: false
        }
    };
    json.page.title ="Page Title";
    json.page.h1 = "Список всех доступных услуг (Service-IDs)";

    try {
        var mass = [];
        var j = JSON.parse(fs.readFileSync("../content/service-ids.json"));
        printElement(mass, j.list, j, "", 1);
        json.mass = mass;
        //console.log(mass);
    } catch (err) {
        console.log("ERROR! File content/service-ids.json loading error! " + err);
    }

    //console.log(json.mass);

    var html = fest.render(file, json); //fest.render(templateFile, JSON.parse(jsonData));
    response.send(html);
});

app.listen(8080);

function printElement(result, jlist, element, tab, num) {
    if (element.id != "root") {
        //console.log("ddd " + jlist[element.id].name);

        var el = {
            num: num + ". ",
            tab: "" + tab + " ",
            id: element.id,
            name: "",
            url: "",
            short_name: ""
        };

        try {
            el.name = jlist[element.id].name;
        } catch (err) {
            el.name = "ERR";
        } try {
            el.url = jlist[element.id].url;
        } catch (err) {
            el.url = "ERR";
        } try {
            el.short_name = jlist[element.id].short;
        } catch (err) {
            el.short_name = "ERR";
        }

        result[result.length] = el;

    //console.log("[" + tab + "]");
        num += ".";
    } else {
        num = "";
    }
    for (key in element.children) {
        printElement(result, jlist, element.children[key], tab + " ** ", num + (parseInt(key) + 1))
    }
}