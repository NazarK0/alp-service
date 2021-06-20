/*
    Author: Victor Ivanov
    Created: 2016-05-10

    pageGenerator/contacts
    page.js - роутер страниц раздела: 'alp-service.ru/contacts'

    var result = {
        html: "",
        code: 404,
        url: ""
    };
 */

var fest = require('fest');
var fs = require("fs");
var basicStruct = require("../getter-basic.js");
var breadcrumbs = require("../getter-breadcrumbs.js");
// ----------------------------------------------------------------------------
function getPage(element) {
    var result = {
        html: "",
        code: 404,
        url: ""
    };

    var file = "";
    var data = {};

    switch(element) {
        case "":
            file = "../templates/contacts/contacts-page-root.xml";
            data = basicStruct.getBasicStruct();
            data["breadcrumbs"] = getPageBreadcrumbsForRootPage();

            data.page.title = "Контактная информация | Промышленные альпинисты компании «Альп-Сервис»";
            data.page.h1 = "Контактная информация";

            result.code = 200;
            result.html = fest.render(file, data);
            break;

        default:
            break;
    }
    return result;
}
// ----------------------------------------------------------------------------
function getPageBreadcrumbsForRootPage() {
    var b = [];
    b = breadcrumbs.getBasic();
    breadcrumbs.checkDelimiters(b);

    breadcrumbs.addBreadcrumb(b, "/contacts", "Контакты", "Контактная информация");
    breadcrumbs.checkDelimiters(b);
    return b;
}
// ----------------------------------------------------------------------------
function initCompilers() {
    return 0;
}
// ----------------------------------------------------------------------------
exports.getPage = getPage;
exports.initCompilers = initCompilers;