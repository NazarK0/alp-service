/*
    Код скопирован из раздела 'experience': getter-basic.js

*/

var fs = require("fs");
const pathNode = require('path');
// ----------------------------------------------------------------------------
function getJsonData(file) {
    var result = false;
    try {
        result = JSON.parse(
            fs.readFileSync(pathNode.resolve(file))
        );
    } catch (err) {
        console.log("getter-basic.js: getJsonData(): ERROR! Cannot open file: " + pathNode.resolve(file));
        result = false;
    }
    return result; // Если возвращется тип boolean, то функция завершилась с ошибкой.
}
// ----------------------------------------------------------------------------
exports.getJsonData = getJsonData;