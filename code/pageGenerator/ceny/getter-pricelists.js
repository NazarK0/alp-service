/*
    Author: Victor Ivanov
    Created: 2016-05-09
*/

fs = require("fs");
const pathNode = require('path');
basic = require("./getter-basic.js");
const update_PriceData = require('../../contentGenerator/ceny/price-updater'); 
// ----------------------------------------------------------------------------
function getPricelists() {
    var fileName = pathNode.join(__dirname, "../../../content/ceny/price-lists.json");
    var json = basic.getJsonData(fileName);

    var result = [];
    if (json !== false) {
        for (var i in json.list) {
            var el = json.list[i];
            if (i !== "root") {
                result[result.length] = {
                    name:   el["price_name_ceny"],
                    title:  el["price_title"],
                    url:    "/ceny/" + el["price_url"]
                };
            }
        }
    }
    return result;
}
// ----------------------------------------------------------------------------
/*
    result = {
        name:
        title:
        url:
    }
*/
function getPricelistById(id) {
    var fileName = pathNode.join(__dirname,"../../../content/ceny/price-lists.json");
    var json = basic.getJsonData(fileName);

    var result = undefined;
    if (json !== false) {
        var el = json.list[id];
        if (el !== undefined) {
            result = {
                name:   el["price_name_ceny"],
                title:  el["price_title"],
                url:    "/ceny/" + el["price_url"]
            };
        }
    }
    if (result == undefined) {
        result = {
            name: "",
            title: "",
            url: ""
        };
    }
    return result;
}
// ----------------------------------------------------------------------------
function getPricelistData(id) {
    update_PriceData();
    var fileName = pathNode.join(__dirname, "../../../content/ceny/price-data-compiled.json");
    var json = basic.getJsonData(fileName);

    var result = [];
    if (json !== false) {
        var list = json.list;
        var unit = json.unit;
        for (var i in list) {
            console.log(id + " " + list[i].pricelists);
            if (checkMass(list[i].pricelists, id)) {
                result[result.length] = {
                    name: list[i].name,
                    unit: list[i].unit, //unit[ list[i].unit ],
                    price: list[i]["price_value"]
                };
            }
        }
    }
    return result;
}
// ----------------------------------------------------------------------------
function checkMass(mass, value) {
    for (var i in mass) {
        console.log("  " + value+ " " + mass[i]);
        if (mass[i] == value) {
            return true;
        }
    }
    return false;
}
// ----------------------------------------------------------------------------
exports.getPricelists = getPricelists;
exports.getPricelistById = getPricelistById;
exports.getPricelistData = getPricelistData;