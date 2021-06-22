/*
    Author: Victor Ivanov <victorivanov.spb@gmail.com>
    Created: 2016-03-31

    Getter, возвращающий массив с JSON-данными навигационной таблицы 3x3 (navtable) для главной страницы сайта.
    Если в процессе сбора данных возникает непреодолимая сложность, то метод getNavtableStruct() вместо массива
    возвращает значение false.
 */

fs = require("fs")
const pathNode = require('path');

function getNavtableStruct() {
    var result = [];
    // Добавление таблицы с навигацией на главной странице сайта.
    try {
        var jsonData = fs.readFileSync(pathNode.join(__dirname, "../../content/navtable.json"));
        var json = JSON.parse(jsonData);
        result = json.navtable;
    } catch (err) {
        console.log("ERROR! File content/navtable.json loading error! " + err);
        result = false;
    }
    return result;
}

exports.getNavtableStruct = getNavtableStruct;