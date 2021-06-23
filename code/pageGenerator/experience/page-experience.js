/*

*/
var fest = require('fest');
var fs = require("fs");
const pathNode = require('path');
var basicStruct = require("../getter-basic.js");
var defaultPage = require("../page-default.js");
var compilerWorks = require("./compile-works-urls.js");
var compilerCategories = require("./compile-categories-urls.js");
var breadcrumbs = require("../getter-breadcrumbs.js");
var customers = require("./getter-customers.js");
var categories = require("./getter-categories.js");
var works = require("./getter-works.js");
var pageChecker = require("./getter-page-type");
//var experimentData = require("./experiment-generate-data.js");


function getPage(element) {
    var file = "";
    var data = {};
    var answer = pageChecker.checkPageType(element);
    console.log("page-experience.js: getPage(): answer: type=[" + answer.type + "], id=[" + answer.id + "]");
    switch (answer.type) {
        case "root":
            file = pathNode.join(__dirname, "../../../templates/experience/experience-page-root.xml");
            data = basicStruct.getBasicStruct();
            /*data["breadcrumbs"] = breadcrumbs.getBasic();
            breadcrumbs.checkDelimiters(data["breadcrumbs"]);
            breadcrumbs.addBreadcrumb(data["breadcrumbs"], "/experience", "Опыт работ", "Опыт работ компании «Альп-Сервис»");
            breadcrumbs.checkDelimiters(data["breadcrumbs"]);*/
            data["breadcrumbs"] = getPageBreadcrumbs(answer.type, answer.id);

            data.page.title = "Опыт работ компании «Альп-Сервис»";
            data.page.h1 = "Опыт работ";

            //data.page["categories_blocks"] = experimentData.createBlocks();
            data.page["categories_blocks"] = categories.getBlockForRootPage("");

            var jwn = works.getJsonData_worksIdsNew();
            var workIdsMass =  (jwn !== false) ? jwn.list : [];
            console.log(workIdsMass, 'WORK IDS')
            //var workIdsMass = ["bc-blekrec-palaza-mont-fasadnogo-osvesheniya", "russkie-samocvety-mojka-ostekleniya-05-2015", "zhelyabova-zamena-truby", "leader-tower-vysotnaya-mojka"];
            data.page["newworks"] = works.getWorksByIdsMass(workIdsMass);

            var categoriesMass =  categories.getCategoriesForRootPage();
            data.page["works"] = works.getWorksByCategoriesMass(categoriesMass);

            var cr = customers.getCustomersStruct();
            if (cr !== false) {
                data.page.customers = cr;
            }

            //data.page["works_empty_msg"] = "Раздел находится в наполнении.";
            return fest.render(file, data);

        case "category":
            file = pathNode.join(__dirname, "../../../templates/experience/experience-page-category.xml");
            data = basicStruct.getBasicStruct();
            data["breadcrumbs"] = getPageBreadcrumbs(answer.type, answer.id);

            data.page.title = categories.getPageNameById(answer.id) + " | Опыт работ компании «Альп-Сервис»";
            data.page.h1 = categories.getPageNameById(answer.id);

            data.page["categories_blocks"] = categories.getBlocksForPageById(answer.id);

            var m = [answer.id];
            data.page["works"] = works.getWorksByCategoriesMass(m);

            return fest.render(file, data);

        case "work":
            file = pathNode.join(__dirname, "../../../templates/experience/experience-page-work.xml");
            data = basicStruct.getBasicStruct();
            data["breadcrumbs"] = getPageBreadcrumbs(answer.type, answer.id);

            data.page.title = works.getPageNameById(answer.id) + " | Опыт работ компании «Альп-Сервис»";
            data.page.h1 = works.getPageNameById(answer.id);

            // Дополнительный текстовый блок (если указан в work-details).
            data.page.text_block = works.getTextBlock(answer.id);

            // Примеры других выполненных работ.
            var mass = works.getDefaultWorksIds();
            mass = mass.concat( works.getRecommendedWorksIdsById(answer.id) );
            mass = works.deleteDuplicates(mass);
            works.deleteId(mass, answer.id);
            data.page["works"] = works.getWorksByIdsMass(mass);

            // Список с видами работ.
            var l = [];
            var m = works.getCategoriesMassByWorkId(answer.id);
            for (var i in m) {
                var el = {
                    name:   categories.getPageNameById(m[i]),
                    url:    "/service/" + categories.getPageUrlPartById_onlyRoots(m[i]) // [заплатка] Подробности: см. в файле 'readme.txt' (2016-05-09/2016-05-10)
                    //url: "/service/" + categories.getPageUrlPartById(m[i])
                };
                l[l.length] = el;
            }
            data.page["vidyrabot"] = l; //[{name: "1"},{name: "2"},{name: "3"},{name: "4"}];

            // Фотоотчёт.
            data.page["images"] = works.getImagesByWorkId(answer.id);
            //console.log(data.page.images);

            // Благодарственные письма, грамоты.
            //data.page["gramoty"] = works.getGramotyByWorkId(answer.id);

            return fest.render(file, data);

        case "redirect":
            return answer.redirect;

        case "unknown":
        default:
            return defaultPage.get404();
    }
}

function getPageCode(element) {
    var result = pageChecker.checkPageType(element);
    switch (result.type) {
        case "root":
        case "category":
        case "work":
            return 200;

        case "redirect":
            return 301;

        case "unknown":
        default:
            return 404;
    }
}
// ----------------------------------------------------------------------------
function getPageBreadcrumbs(type, id) {
    var b = [];
    b = breadcrumbs.getBasic();
    breadcrumbs.checkDelimiters(b);
    if (type == "root" || type == "category" || type == "work") {
        // Все страницы (корневая, все категории, все работы) должны иметь пункт "Опыт работы"
        breadcrumbs.addBreadcrumb(b, "/experience", "Опыт работ", "Опыт работ компании «Альп-Сервис»");
        breadcrumbs.checkDelimiters(b);
    }
    if (type == "category") {
        var info = categories.getCategoriesBreadcrumbs(id);
        info.shift(); // Корневой пункт ('root') в цепочке ссылок уже записан (см. выше).
        for (var i in info) {
            breadcrumbs.addBreadcrumb(b, "/experience/" + info[i].url, info[i].name, info[i].name + " | Опыт работ компании «Альп-Сервис»");
        }
        breadcrumbs.checkDelimiters(b);
    }
    if (type == "work") {
        breadcrumbs.addBreadcrumb(b, "/experience/" + works.getPageUrlById(id),  works.getPageNameById(id), works.getPageNameById(id) + " | Опыт работ компании «Альп-Сервис»");
        breadcrumbs.checkDelimiters(b);
    }
    return b;
}
// ----------------------------------------------------------------------------
// Выполнение сборки/компиляции данных для страниц разделов.
function initCompilers() {
    var result = 0;
    if (compilerWorks.compileUrls() == false) {
        result++;
    }
    if (compilerCategories.compileUrls() == false) {
        result++;
    }
    return result;
}
// ----------------------------------------------------------------------------

exports.initCompilers = initCompilers;
exports.getPage = getPage;
exports.getPageCode = getPageCode;