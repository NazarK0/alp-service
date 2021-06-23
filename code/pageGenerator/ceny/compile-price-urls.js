/*
    Author: Victor Ivanov <victorivanov.spb@gmail.com>
    Created: 2016-05-09

    Собираются в отдельный файл (content/ceny/price-urls-compiled.json) адреса всех прайс-листов, представленных
    в разделе 'Цены'.
 */

var fs = require("fs");
const pathNode = require('path');
// ----------------------------------------------------------------------------
function compileUrls() {
    var result = {};
    try {
        var jsonPricelists = JSON.parse(
            fs.readFileSync(pathNode.join(__dirname, "../../../content/ceny/price-lists.json"))
        );
    } catch (err) {
        console.log("compile-price-urls.js: compileUrls(): ERROR! Cannot open file: price-lists.json");
        return false;
    }

    for (var i in jsonPricelists.list) {
        var id = i;
        var url = jsonPricelists.list[i]["price_url"];

        if (result[url] == undefined) {
            result[url] = id;
        } else {
            console.log("compile-price-urls.js: compileUrls(): ERROR! Two ids have one url: id1=[" + result[url] + "], id2=[" + id + "], url=[" + url + "]");
        }
    }

    var fName = pathNode.join(__dirname, "../../../content/ceny/price-urls-compiled.json");
    var jsonPricelistsUrls = JSON.parse(
        fs.readFileSync(fName)
    );
    jsonPricelistsUrls.list = result;
    fs.writeFileSync(fName, JSON.stringify(jsonPricelistsUrls, null, 4));
}
// ----------------------------------------------------------------------------
exports.compileUrls = compileUrls;