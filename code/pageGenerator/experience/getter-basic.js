

var fs = require("fs");
// ----------------------------------------------------------------------------
function getJsonData(file) {
    var result = false;
    try {
        result = JSON.parse(
            fs.readFileSync(file)
        );
    } catch (err) {
        console.log("getter-basic.js: getJsonData(): ERROR! Cannot open file: " + file);
        result = false;
    }
    return result; // Если возвращется тип boolean, то функция завершилась с ошибкой.
}
// ----------------------------------------------------------------------------
exports.getJsonData = getJsonData;