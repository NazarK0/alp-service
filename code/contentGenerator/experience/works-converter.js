
var fs = require("fs");
const pathNode = require("path");

// ----------------------------------------------------------------------------

// В файле 'content/experience/experience-works-old.json' нужно переконвертировать категории.
// В старой версии адреса всех катеогорий были равны идентификаторам.

function covertCategories_experienceWorksOld() {
    console.log("covertCategories_experienceWorksOld(): " + __dirname);
    var result = {};
    var fName = "experience-works-old.json";
    try {
        var jsonWorksOld = JSON.parse(
            fs.readFileSync(pathNode.join(__dirname, "../../../content/experience/" + fName))
        );
    } catch (err) {
        console.log("ERROR! Cannot open file: " + fName);
        return false;
    }

    var sName = "service-ids.json";
    try {
        var jsonServiceIds = JSON.parse(
            fs.readFileSync(pathNode.join(__dirname, "../../../content/" + sName))
        );
    } catch (err) {
        console.log("ERROR! Cannot open file: " + sName);
        return false;
    }

    //console.log("test: " + jsonWorksOld.works["chistka-kryshi-ot-snega-koncertnyj-zal-mariinsky"].name);

    var oldWorks = jsonWorksOld.works;
    for (var i in oldWorks) {
        var nCategories = [];
        for (var j in oldWorks[i].categories) {
            console.log("_: " + i + " " + oldWorks[i]);

            var c = oldWorks[i].categories[j];
            console.log("c: " + c);

            var id = getServiceIdByUrl(jsonServiceIds, c);
            console.log("id: " + id);
            nCategories[nCategories.length] = id;
        }
        oldWorks[i]["new_categories"] = nCategories;
        fs.writeFileSync(pathNode.join(__dirname, "../../../content/experience/" + fName), JSON.stringify(jsonWorksOld, null, 4));

    }
}

function getServiceIdByUrl(json, url) {
    var result = "";
    for (var i in json.list) {
        //console.log("---: " + json.list[i].url + " " + url);
        if (json.list[i].url == url) {
            return i; //json.list[i].;
        }
    }
    return result;
}

covertCategories_experienceWorksOld();

// Файл 'content/experience/experience-works-old.json' нужно проверить, переконвертировать
// и записать в новый файл 'content/experience/works-ids.json'.