/**
 * Created by victor on 12.03.2016.
 */

var express = require('express');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var fest = require("fest");
var fs = require("fs");
const pathNode = require("path");
var sessionHelper = require("./session-helper.js")
var structHelper = require("./struct-helper.js")

// init Express app
var app = express();
app.use(cookieParser()); // must use cookieParser before expressSession
app.use(expressSession({ secret: sessionHelper.makeID() }));
app.use(bodyParser());

// Раздача статических файлов
app.use("/images", express.static(pathNode.join(__dirname, "../static/images")));
app.use("/styles", express.static(pathNode.join(__dirname, "../static/styles")));
app.use("/scripts", express.static(pathNode.join(__dirname, "../static/scripts")));


app.get('/', function(request, response) {
    var file = "../templates/index2.xml";
    var json = structHelper.getBasicStruct();
    json.page.title ="Промышленные альпинисты в Санкт-Петербурге и Ленинградской области | Компания «Альп-Сервис»";
    json.page.h1 = "Промышленные альпинисты в Санкт-Петербурге";

    json["servicelist"] = getServiceListData();

    /*json["servicelist"] = [
        {
            icon: "icon-vse-raboty",
            name: "NAME 1",
            url: "name1.domain",
            pricename: "PRICE NAME 1",
            priceurl: "price.name1",
            children: ["name1.1", "name1.2", "name1.3"]
        },
        {
            icon: "icon-krovelnye-raboty",
            name: "KROVELNYE RABOTY",
            url: "krovelnye-raboty",
            pricename: "PRICE KROVELNYE RABOTY",
            priceurl: "price.krovelnye-raboty",
            children: ["krov.1", "krov.2", "krov.3"]
        },
        {
            icon: "icon-krovelnye-raboty",
            name: "KROVELNYE RABOTY",
            url: "krovelnye-raboty",
            pricename: "PRICE KROVELNYE RABOTY",
            priceurl: "price.krovelnye-raboty",
            children: ["krov.1", "krov.2", "krov.3"]
        },
        {
            icon: "icon-krovelnye-raboty",
            name: "KROVELNYE RABOTY",
            url: "krovelnye-raboty",
            pricename: "PRICE KROVELNYE RABOTY",
            priceurl: "price.krovelnye-raboty",
            children: ["krov.1", "krov.2", "krov.3"]
        },
        {
            icon: "icon-krovelnye-raboty",
            name: "KROVELNYE RABOTY",
            url: "krovelnye-raboty",
            pricename: "PRICE KROVELNYE RABOTY",
            priceurl: "price.krovelnye-raboty",
            children: ["krov.1", "krov.2", "krov.3"]
        },
        {
            icon: "icon-krovelnye-raboty",
            name: "KROVELNYE RABOTY",
            url: "krovelnye-raboty",
            pricename: "PRICE KROVELNYE RABOTY",
            priceurl: "price.krovelnye-raboty",
            children: ["krov.1", "krov.2", "krov.3"]
        },
        {
            icon: "icon-krovelnye-raboty",
            name: "KROVELNYE RABOTY",
            url: "krovelnye-raboty",
            pricename: "PRICE KROVELNYE RABOTY",
            priceurl: "price.krovelnye-raboty",
            children: ["krov.1", "krov.2", "krov.3"]
        }
    ];*/

    var html = fest.render(file, json); //fest.render(templateFile, JSON.parse(jsonData));
    response.send(html);
});

function defaultPage(request, response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("<html><head><title>Default Page</title></head><body><h1>Default Page</h1></body></html>");
    response.end();
}

app.get('/favicon.ico', function(request, response){
    response.writeHead(200, {"Content-Type": "image/x-icon"});
    var img = fs.readFileSync(pathNode.join(__dirname, '../static/images/favicon.ico'));
    response.end(img, 'binary');
});

app.get('*', function(request, response){
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write( pageGen.get404Page() );
    //response.write("<html><head><title>Ошибка 404</title></head><body><h1>Ошибка&nbsp;404</h1></body></html>");
    response.end();
});

app.listen(8080);

function getElementChildren(json, id) {
    if (json.id == id) {
        var mass = [];
        for (var i in json.children) {
            mass[mass.length] = json.children[i].id;
        }
        return mass;
    } else {
        for (var i in json.children) {
            var r = getElementChildren(json.children[i], id);
            if (r instanceof Array) {
                return r;
            }
        }
        return false;
    }
}
function getServiceElementData(service, price, id) {
    var result = {
        icon: "",
        name: "",
        url: "",
        price_name: "",
        price_url: "",
        children: []
    };
    result.icon = service.list[id].icon;

    if(service.list[id].short != undefined) {
        result.name = service.list[id].short;
    } else {
        result.name = service.list[id].name;
    }
    result.url = "/service/" + service.list[id].url;

    var p = price.list[id];
    if (p !== undefined) {
        result.price_name = p.price_name;
        result.price_url = p.price_url;
    }

    var idMass = getElementChildren(service, id);
    if (idMass !== false) {
        for (var i in idMass) {
            console.log(idMass[i]);
            result.children[result.children.length] = service.list[idMass[i]].name;
        }
    }

    return result;
}

function getServiceListData() {
    var sourceList = ["root"];
    try {
        var jsonService = JSON.parse(
            fs.readFileSync("../content/service-ids.json")
        );
        var jsonPrice = JSON.parse(
            fs.readFileSync("../content/price-urls.json")
        );
    } catch (err) {
        console.log("ERROR");
        return [];
    }

    var r = getElementChildren(jsonService, "root");
    if (r !== false) {
        sourceList = sourceList.concat(r);
    }
    r = getElementChildren(jsonService, "clean");
    if (r !== false) {
        sourceList = sourceList.concat(r);
    }

    var mass = []
    for (var i in sourceList) {
        mass[mass.length] = getServiceElementData(jsonService, jsonPrice, sourceList[i]);
    }
    return mass;

    /*var jsonServiceData = fs.readFileSync("../content/service-ids.json");
    var jsonService = JSON.parse(jsonServiceData);

    var jsonPriceUrlsData = fs.readFileSync("../content/price-urls.json");
    var jsonPrice = JSON.parse(jsonPriceUrlsData);

    var rootStruct = {
        icon: "icon-vse-raboty",
        name: "",
        url: "",
        pricename: "",
        priceurl: "",
        children: []
    };

    if (jsonService.id == "root") {
        //rootStruct.children = json.children;
        for (id in jsonService.children) {
            console.log("id=" + id + " " + jsonService.children[id].id);
            var str = jsonService.children[id].id;
            console.log("name=" + jsonService.list[str].name);
            rootStruct.children[rootStruct.children.length] = jsonService.list[str].name;
        }
        rootStruct.name = jsonService.list.root.name;
        rootStruct.url = "/service/" + jsonService.list.root.url
        rootStruct.icon = jsonService.list.root.icon;
    }
     return rootStruct;
    */
}