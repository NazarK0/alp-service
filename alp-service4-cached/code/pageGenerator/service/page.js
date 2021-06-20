/*
    Author: Victor Ivanov
    Created: 2016-05-10

    pageGenerator/service
    page.js - роутер страниц раздела: 'alp-service.ru/service'

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
var servicelist = require("../getter-servicelist.js");
var works = require("../experience/getter-works.js");
var categories = require("../experience/getter-categories.js");
var pricelists = require("../ceny/getter-pricelists.js");
// ----------------------------------------------------------------------------

function getPage(element) {
    var result = {
        html: "",
        code: 404,
        url: ""
    };

    var file = "../templates/service/service-page-root.xml";
    var data = basicStruct.getBasicStruct();

    var type = (element == "") ? "root" : "page";
    switch (type) {
        case "root":
            file = "../templates/service/service-page-root.xml";
            data = basicStruct.getBasicStruct();
            data["breadcrumbs"] = getPageBreadcrumbs("root");

            data.page.title = "Высотные работы. Услуги промышленных альпинистов в Санкт-Петербурге | Промышленные альпинисты компании «Альп-Сервис»";
            data.page.h1 = "Высотные работы. Услуги компании «Альп-Сервис»";

            data["servicelist"] = servicelist.getServiceListStruct();
            data["servicelist"].shift();

            result.code = 200;
            result.html = fest.render(file, data);
            break;

        case "page":
            data = basicStruct.getBasicStruct();
            data["breadcrumbs"] = getPageBreadcrumbs("root");

            switch(element) {
                case "krovelnye-raboty":
                    completePageData(data, "krov");
                    result.code = 200;
                    result.html = fest.render("../templates/service/service-page-krov.xml", data);
                    break;

                case "fasadnye-raboty":
                    completePageData(data, "fasad");
                    result.code = 200;
                    result.html = fest.render("../templates/service/service-page-fasad.xml", data);
                    break;

                case "germetizaciya":
                    completePageData(data, "germ");
                    result.code = 200;
                    result.html = fest.render("../templates/service/service-page-germ.xml", data);
                    break;

                case "montazhnye-raboty":
                    completePageData(data, "mont");
                    result.code = 200;
                    result.html = fest.render("../templates/service/service-page-mont.xml", data);
                    break;

                case "demontazhnye-raboty":
                    completePageData(data, "demont");
                    result.code = 200;
                    result.html = fest.render("../templates/service/service-page-demont.xml", data);
                    break;

                case "dopolnitelnye-raboty":
                    completePageData(data, "dop");
                    result.code = 200;
                    result.html = fest.render("../templates/service/service-page-dop.xml", data);
                    break;

                case "vysotnyj-klining":
                    completePageData(data, "clean");
                    result.code = 200;
                    result.html = fest.render("../templates/service/service-page-clean.xml", data);
                    break;

                case "uborka-snega":
                    completePageData(data, "clean-sneg");
                    result.code = 200;
                    result.html = fest.render("../templates/service/service-page-clean-sneg.xml", data);
                    break;

                case "mojka-okon-i-fasadov":
                    completePageData(data, "clean-mojka");
                    result.code = 200;
                    result.html = fest.render("../templates/service/service-page-clean-mojka.xml", data);
                    break;

                case "obespylivanie":
                    completePageData(data, "clean-obesp");
                    result.code = 200;
                    result.html = fest.render("../templates/service/service-page-clean-obesp.xml", data);
                    break;

                case "poslestroitelnaya-chistka":
                    completePageData(data, "clean-posle");
                    result.code = 200;
                    result.html = fest.render("../templates/service/service-page-clean-posle.xml", data);
                    break;

                default:
                    break;
            }
            break;

    }

    return result;
}
// ----------------------------------------------------------------------------
function completePageData(data, id) {
    data["breadcrumbs"] = getPageBreadcrumbs("page", id);

    data.page["children"] = categories.getCategoryChildren(id);

    var m = [id];
    data.page["works"] = works.getWorksByCategoriesMass(m);

    var name = categories.getPageNameById(id);
    data.page.title = name + "в Санкт-Петербурге | Промышленные альпинисты компании «Альп-Сервис»";
    data.page.h1 = name;

    data.page["cena"] = pricelists.getPricelistById(id);
}
// ----------------------------------------------------------------------------
function getPageBreadcrumbs(type, id) {
    var b = [];
    b = breadcrumbs.getBasic();
    breadcrumbs.checkDelimiters(b);
    if (type == "root" || type == "page" ) {
        breadcrumbs.addBreadcrumb(b, "/service", "Услуги", "Все услуги промышленных альпинистов в Санкт-Петербурге");
        breadcrumbs.checkDelimiters(b);
    }
    if (type == "page") {

        var info = categories.getCategoriesBreadcrumbs(id);
        breadcrumbs.addBreadcrumb(b, "/service/" + info[info.length - 1].url, info[info.length - 1].name, info[info.length - 1].name + " | Опыт работ компании «Альп-Сервис»");
        breadcrumbs.checkDelimiters(b);
        //var el = pricelists.getPricelistById(id);
        //breadcrumbs.addBreadcrumb(b, "/ceny/" + el.url, el.name, el.title + " | Цены на высотные работы компании «Альп-Сервис»");
        //breadcrumbs.addBreadcrumb(b, "/service/" + "bla-bla-bla", "NAME", "TITLE" + " | Промышленные альпинисты в Санкт-Петербурге");
        //breadcrumbs.checkDelimiters(b);
    }
    return b;
}
// ----------------------------------------------------------------------------
exports.getPage = getPage;