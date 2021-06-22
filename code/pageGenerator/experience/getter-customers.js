/*
    Author: Victor Ivanov <victorivanov.spb@gmail.com>
    Created: 2016-04-21

    Getter, возвращающий массив с JSON-данными всех доступных заказчиков (customers) кроме 'na' (заказчик не указан).
    Данные используются в корневой странице раздела 'experience'.
    Если в процессе сбора данных возникает непреодолимая сложность, то метод getCustomersStruct() вместо массива
    возвращает значение false.

 */

fs = require("fs");
basic = require("./getter-basic.js");
// ----------------------------------------------------------------------------
function getCustomersStruct() {
    var result = [];
    // Добавление списка с названиями всех заказчиков.
    try {
        var json = JSON.parse(
            fs.readFileSync("../content/experience/customers-ids.json")
        );
        for (var i in json.list) {
            if (i == "na") {
                continue;
            }
            result[result.length] = {
                "name": json.list[i].name,
                "description": json.list[i].description
            };
        }
    } catch (err) {
        console.log("ERROR! File content/experience/customers-ids.json loading error! " + err);
        result = false;
    }
    return result;
}
// ----------------------------------------------------------------------------
function getJsonData_customersIds() {
    // Возвращается структура данных с идентификаторами всех заказчиков выполненных работ.
    var file = "../content/experience/customers-ids.json";
    return basic.getJsonData(file);
}
// ----------------------------------------------------------------------------
exports.getCustomersStruct = getCustomersStruct;
exports.getJsonData_customersIds = getJsonData_customersIds;