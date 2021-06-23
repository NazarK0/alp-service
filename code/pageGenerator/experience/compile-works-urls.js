/*
    Author: Victor Ivanov <victorivanov.spb@gmail.com>
    Created: 2016-04-13

    Собираются в отдельный файл (content/experience/works/works-urls-compiled.json) адреса всех работ, представленных
    в разделе 'Опыт работ'.
*/

var fs = require("fs");
const pathNode = require('path');

function compileUrls() {
    //var sourceList = ["root"];
    //console.log("[" + __dirname + "]");
    var result = {};
    try {
        var jsonWorksIds = JSON.parse(
            fs.readFileSync(pathNode(__dirname, "../../../content/experience/works-ids.json"))
        );
    } catch (err) {
        console.log("ERROR! Cannot open file: works-ids.json");
        return false;
    }

    // Структура jsonWorksIds содержит в себе данные всех представленных на сайте выполненных работах:
    //   - идентификатор каждой работы,
    //   - идентификатор заказчика работы (customer),
    //   - массив с идентификаторами видов работ, к которым можно соотнести каждую конкретную работу.
    for (var i in jsonWorksIds.list) {
        // Осуществляется проход по всем работам.
        // Притом, проверятся наличие директорий с названиями идентичными идентификаторам.
        var path = false;
        try {
            var path = pathNode.join(__dirname, '../../../content/experience/works/' + i);
            var stats = fs.lstatSync(path);
            if (stats.isDirectory() == false) {
                throw "Is not directory!";
            }
        } catch (err) {
            console.log("ERROR! Troubles with work-id=" + i + " " + err);
            path = false;
        }

        if (path !== false) {
            try {
                // У каждой работы должен быть файл с детальной информацией: 'works/{work-id}/work-details.json'.
                // Именно в этом файле находится URL работы.
                var jsonDetails = JSON.parse(
                    fs.readFileSync(path + "/work-details.json")
                );
                var url = jsonDetails.work.url;

                if (url == "") {
                    throw "Url is empty.";
                }
                if (result[url] !== undefined) {
                    throw "Trying to rewrite list entry with url=" + url;
                }
                result[url] = i;
            } catch (err) {
                console.log("ERROR! WorksUrls list. " + err)
            }
        }
    }

    var fName = "../content/experience/works-urls-compiled.json";
    var jsonWorksUrls = JSON.parse(
        fs.readFileSync(fName)
    );
    jsonWorksUrls.list = result;
    fs.writeFileSync(pathNode.resolve(fName), JSON.stringify(jsonWorksUrls, null, 4));
}

exports.compileUrls = compileUrls;

