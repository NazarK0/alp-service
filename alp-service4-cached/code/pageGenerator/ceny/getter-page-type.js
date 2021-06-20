/*
    Author: Victor Ivanov
    Created: 2016-05-09

    Программный код позволяет по данным JSON-файлов определить тип запрашиваемой страницы (переменная element)
    в разделе 'ceny'.
 */

var fs = require("fs");
// ----------------------------------------------------------------------------
// Функция checkPageType определяет тип запрашиваемой страницы, пользуясь частью URL-строки (переменная element),
// а также по данным JSON-файла:
//   - price-urls-compiled.json
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
        var id = getIdByUrl(element);
        if (id !== undefined) {
            result.type = "pricelist";
            result.id = id;
        }
    }
    return result;
}
// ----------------------------------------------------------------------------
function getIdByUrl(element) {
    var file = "../content/ceny/price-urls-compiled.json";
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