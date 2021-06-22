/*
    Getter: servicelist

    Author: Victor Ivanov <victorivanov.spb@gmail.com>
    Created: 2016-03-31

    Fixed:
    - result v.1 (readme.txt 2016-04-13)

    Getter, возвращающий массив элементов из service-ids.json и price-urls.json,
    притом, только элементов с атрибутом 'state' со значением 'enable'.
 */

var fs = require("fs");

// ----------------------------------------------------------------------------
// Выдаётся массив структур result (см. readme.txt от 13.04.2016).
// Полученные данные непосредственно используются в выводе на страницах сайта.
function getServiceListStruct() {
    var sourceList = ["root"];
    try {
        var jsonService = JSON.parse(
            fs.readFileSync("../content/service-ids.json")
        );
        var jsonPrice = JSON.parse(
            fs.readFileSync("../content/ceny/price-lists.json")
        );
    } catch (err) {
        console.log("getter-servicelist.js: getServiceListStruct(): ERROR! Cannot open files.");
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

    var mass = [];
    for (var i in sourceList) {
        var e = getServiceElementData(jsonService, jsonPrice, sourceList[i]);
        if (e !== false) {
            mass[mass.length] = e;
        }
        //mass[mass.length] = getServiceElementData(jsonService, jsonPrice, sourceList[i]);
    }
    return mass;
}

// ----------------------------------------------------------------------------
// Выдаётся массив с идентификаторами дочерних элементов.
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

// ----------------------------------------------------------------------------

function getServiceElementData(service, price, id) {
    // Структура result зафиксирована (см. readme.txt от 13.04.2016).
    var result = {
        icon: "",
        name: "",
        url: "",
        price_name: "",
        price_url: "",
        children: []
    };
    if (service.list[id].display == "disable") {
        return false;
    }
    //console.log(service.list[id].name);
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
        result.price_url = "/ceny/" + p.price_url;
    }

    var idMass = getElementChildren(service, id);
    if (idMass !== false) {
        for (var i in idMass) {
            // idMass[i] - идентификатор (например, "krov-zh-metal")
            if (service.list[idMass[i]].state == "enable") {
                result.children[result.children.length] = service.list[idMass[i]].name;
            }
        }
    }

    return result;
}

exports.getServiceListStruct = getServiceListStruct;