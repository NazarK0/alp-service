/*



 */

var fest = require('fest');
var fs = require("fs");
var basicStruct = require("./getter-basic.js");
var navtableStruct = require("./getter-navtable.js");
var servicelistStruct = require("./getter-servicelist.js");

function getPage() {
    var file = "../templates/index.xml";
    var data = basicStruct.getBasicStruct();
    var nt = navtableStruct.getNavtableStruct();
    if (nt !== false) {
        data["navtable"] = nt;
    }
    data["servicelist"] = servicelistStruct.getServiceListStruct();
    data.page.title = "Промышленные альпинисты в Санкт-Петербурге и Ленинградской области | Компания «Альп-Сервис»";
    data.page.h1 = "Промышленные альпинисты в Санкт-Петербурге";

    return fest.render(file, data); //fest.render(templateFile, JSON.parse(jsonData));
}

exports.getPage = getPage;