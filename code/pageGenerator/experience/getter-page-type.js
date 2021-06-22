/*
    Author: Victor Ivanov
    Created: 2016-04-25

    Программный код позволяет по данным JSON-файлов определить тип запрашиваемой страницы (переменная element)
    в разделе 'experience'.

    Пояснения см. в файле: 'readme.txt'.
 */

var fs = require("fs");

// ----------------------------------------------------------------------------
// Функция checkPageType определяет тип запрашиваемой страницы, пользуясь частью URL-строки (переменная element),
// а также по данным трёх JSON-файлов:
//   - categories-urls-compiled.json
//   - works-urls-compiled.json
//   - works-urls-http301.json

function checkPageType(element) {
    var result = {
        type: "unknown",
        id: "",
        redirect: ""
    };
    if (typeof element !== "string") {
        result.type = "unknown";
    } else if (element == "") {
        result.type = "root";
    } else {
        var id = getCategoryId(element);
        if (id !== undefined) {
            result.type = "category";
            result.id = id;
        } else {
            id = getWorkId(element);
            if (id !== undefined) {
                result.type = "work";
                result.id = id;
            } else {
                var newUrl = getRedirectList(element);
                if (newUrl !== undefined) {
                    result.type = "redirect";
                    result.redirect = newUrl;
                }
            }
        }
    }
    return result;
}

// ----------------------------------------------------------------------------

function getCategoryId(element) {
    var file = "../content/experience/categories-urls-compiled.json";
    return getId(element, file);
}

function getWorkId(element) {
    var file = "../content/experience/works-urls-compiled.json";
    return getId(element, file);
}

function getRedirectList(element) {
    var file = "../content/experience/works-urls-http301.json";
    return getId(element, file);
}

function getId(element, file) {
    var result = undefined;
    try {
        var json = JSON.parse(
            fs.readFileSync(file)
        );
        if (typeof element == "string") {
            result = json.list[element];
        }
    } catch (err) {
        console.log("getter-page-type.js: getId(): ERROR! Cannot open file: " + file);
    }
    return result;
}

// ----------------------------------------------------------------------------

exports.checkPageType = checkPageType;