/*



 */

var fest = require('fest');
var fs = require("fs");
var basicStruct = require("../getter-basic.js");
var defaultPage = require("../page-default.js");
var breadcrumbs = require("../getter-breadcrumbs.js");

function getPage(element) {
    var file = "";
    var data = {};
    switch (element) {
        case "":
            file = "../templates/partners/partners-list.xml";
            data = basicStruct.getBasicStruct();
            data["breadcrumbs"] = breadcrumbs.getBasic();
            breadcrumbs.checkDelimiters(data["breadcrumbs"]);
            breadcrumbs.addBreadcrumb(data["breadcrumbs"], "/partners", "Наши партнёры", "Партнёры компании «Альп-Сервис»");
            breadcrumbs.checkDelimiters(data["breadcrumbs"]);
            data.page.title = "Партнёры компании «Альп-Сервис»";
            data.page.h1 = "Наши партнёры";
            return fest.render(file, data);

        case "peterburgskaya-nedvizhimost":
            file = "../templates/partners/partners-company-pn.xml";
            data = basicStruct.getBasicStruct();
            data.page.title = "«Петербургская недвижимость» — партнёр компании «Альп Сервис»";
            data.page.h1 = "Компания «Петербургская недвижимость»";
            data["breadcrumbs"] = breadcrumbs.getBasic();
            breadcrumbs.addBreadcrumb(data["breadcrumbs"], "/partners", "Наши партнёры", "Партнёры компании «Альп-Сервис»");
            breadcrumbs.addBreadcrumb(data["breadcrumbs"], "/partners/peterburgskaya-nedvizhimost", data.page.h1, data.page.title);
            breadcrumbs.checkDelimiters(data["breadcrumbs"]);
            return fest.render(file, data);

        default:
            return defaultPage.get404();
    }
}

function getPageCode(element) {
    console.log("page-partners.js: getPageCode(): [" + element + "]");
    switch (element) {
        case "":
        case "peterburgskaya-nedvizhimost":
            return 200;

        default:
            return 404;
    }
}

exports.getPage = getPage;
exports.getPageCode = getPageCode;