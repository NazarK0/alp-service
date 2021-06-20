/*
    Author: Victor Ivanov <victorivanov.spb@gmail.com>
    Created: 2016-04-21

    Собираются в отдельный файл (content/experience/works/categories-urls-compiled.json) адреса всех категорий,
    представленных в разделе 'Опыт работ'.

    Программа просматривает все категории в файле 'content/service-ids.json' и выбирает только те категории,
    у которых атрибут 'state' равняется значению 'enable'.

    Значения атрибута 'display' во внимание не принимаются.
 */

var fs = require("fs");

function compileUrls() {
    try {
        var jsonServiceIds = JSON.parse(
            fs.readFileSync("../content/service-ids.json")
        );
    } catch (err) {
        console.log("ERROR! compile-categories-urls.js - Cannot open file: service-ids.json");
        return false;
    }

    // Программа просматривает все категории в файле 'content/service-ids.json'
    // и выбирает только те категории, у которых атрибут 'state' равняется значению 'enable'.
    // Корневая категория пропускается вне зависимости от атрибута 'state', т.к. в программе
    // page-experience.js  она обрабатывается отдельно.
    var result = {};
    for (var i in jsonServiceIds.list) {
        if (i == "root") {
            continue;
        }
        if (jsonServiceIds.list[i].state == "enable") {
            result[jsonServiceIds.list[i].url] = i;
        }
    }

    var fName = "../content/experience/categories-urls-compiled.json";
    var jsonCategoriesUrls = JSON.parse(
        fs.readFileSync(fName)
    );
    jsonCategoriesUrls.list = result;
    fs.writeFileSync(fName, JSON.stringify(jsonCategoriesUrls, null, 4));
}

exports.compileUrls = compileUrls;