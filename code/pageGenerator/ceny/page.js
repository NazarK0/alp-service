/*
    Author: Victor Ivanov
    Created: 2016-05-09

    pageGenerator/ceny
    page.js - роутер страниц раздела: 'alp-service.ru/ceny'

    var result = {
        html: "",
        code: 404,
        url: ""
    };
*/

var fest = require('fest');
var fs = require("fs");
var pageChecker = require("./getter-page-type.js");
var compilerPriceUrls = require("./compile-price-urls.js");
var basicStruct = require("../getter-basic.js");
var breadcrumbs = require("../getter-breadcrumbs.js");
var pricelists = require("./getter-pricelists.js");
//var defaultPage = require("../page-default.js");
 // ----------------------------------------------------------------------------
function getPage(element) {
    var result = {
        html: "",
        code: 404,
        url: ""
    };

    var file = "";
    var data = {};
    var answer = pageChecker.checkPageType(element);
    //console.log("ceny: getPage(): " + answer.type + ", " + answer.id);

    switch (answer.type) {
        case "root":
            file = "../templates/ceny/ceny-page-root.xml";
            data = basicStruct.getBasicStruct();
            data["breadcrumbs"] = getPageBreadcrumbs(answer.type, answer.id);

            data.page.title = "Виды работ и цены на все высотные работы в Санкт-Петербурге | Промышленные альпинисты компании «Альп-Сервис»";
            data.page.h1 = "Цены на все виды высотных работ";

            data["pricelists"] = pricelists.getPricelists();

            result.code = 200;
            result.html = fest.render(file, data);
            break;

        case "pricelist":
            file = "../templates/ceny/ceny-page-pricelist.xml";
            data = basicStruct.getBasicStruct();
            data["breadcrumbs"] = getPageBreadcrumbs(answer.type, answer.id);

            var el = pricelists.getPricelistById(answer.id);
            data.page.title = el.title;
            data.page.h1 = el.name;

            data["pricelistdata"] = pricelists.getPricelistData(answer.id);
            console.log(data.pricelistdata.length);

            result.code = 200;
            result.html = fest.render(file, data);
            break;

        case "unknown":
        default:
            break;

    }

    return result;
}
// ----------------------------------------------------------------------------
// Выполнение сборки/компиляции данных для страниц раздела.
function initCompilers() {
    var result = 0;
    if (compilerPriceUrls.compileUrls() == false) {
        result++;
    }
    return result;
}
// ----------------------------------------------------------------------------
function getPageBreadcrumbs(type, id) {
    var b = [];
    b = breadcrumbs.getBasic();
    breadcrumbs.checkDelimiters(b);
    if (type == "root" || type == "pricelist" ) {
        breadcrumbs.addBreadcrumb(b, "/ceny", "Цены на все виды высотных работ", "Цены на все виды высотных работ в Санкт-Петербурге");
        breadcrumbs.checkDelimiters(b);
    }
    if (type == "pricelist") {
        var el = pricelists.getPricelistById(id);
        breadcrumbs.addBreadcrumb(b, "/ceny/" + el.url, el.name, el.title + " | Цены на высотные работы компании «Альп-Сервис»");
        breadcrumbs.checkDelimiters(b);
    }
    return b;
}
// ----------------------------------------------------------------------------
exports.initCompilers = initCompilers;
exports.getPage = getPage;
