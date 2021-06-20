
var fest = require('fest');
var fs = require("fs");
const pathNode = require("path");
var basicStruct = require("./getter-basic.js");

function get404() {
    var file = pathNode.join(__dirname, "../../templates/page404.xml");
    var data = basicStruct.getBasicStruct();
    data.page.title = "Ошибка 404 | Промышленные альпинисты компании «Альп Сервис»";
    data.page.description = "ошибка 404";
    data.page.keywords = "ошибка 404";

    return fest.render(file, data);
}

exports.get404 = get404;