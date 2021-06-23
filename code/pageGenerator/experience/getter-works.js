/*
    Author: Victor Ivanov
     Created: 2016-04-26

    Программа позволяет обращаться к данным всех выполненных работ (work ids) в JSON-файле 'content/experiement/works-ids.json'.

     Схематическое представление структуры: worksMass, workElement.
     1. worksMass = [workElement, workElement, ...]
     2. workElement = {
         icon_img: "/images/experience/work-url/icon.jpg",
         url: "/experience/work-url", (NB: with '/experience')
         name: "Name",
         customer: "Customer Name",
         tags: [
            {
                url: "/experience/category-url", (NB: with '/experience')
                name: "Category Name"
            },
            ...
        ]
    };
*/

var fs = require("fs");
var basic = require("./getter-basic.js");
var categories = require("./getter-categories.js");
var customers = require("./getter-customers.js");
const pathNode = require("path");
// ----------------------------------------------------------------------------
function getWorksByIdsMass(workIdsMass) {
    //
    // Используются структуры (см. наверху): worksMass, workElement.
    var resultWorksMass = [];
    var data = getJsonData_worksIds();
    var customersData = customers.getJsonData_customersIds();
    var serviceData = categories.getJsonData_serviceIds();
    if (data !== false) {
        for (var i in workIdsMass) {
            //console.log("==" + i + " " +workIdsMass[i]);
            var wId = workIdsMass[i];
            //console.log("==" + wId);
            var detailsData = getJsonData_workDetailsById(wId);
            var work = data.list[wId];
            var tagsMass = [];
            for (var j in work.categories) {
                //console.log("-=-=" + j + " " +work.categories[j])
                tagsMass[tagsMass.length] = {
                    url: "/experience/" + serviceData.list[work.categories[j]].url,
                    name: serviceData.list[work.categories[j]].name
                };
            }
            console.log("wId: " + wId);
            var workElement = {
                icon_img: "/images/experience/" + detailsData.work.url + "/icon.jpg",
                url: "/experience/" + detailsData.work.url,
                name: detailsData.work.name,
                customer: customersData.list[work.customer].name,
                tags: tagsMass
            };
            resultWorksMass[resultWorksMass.length] = workElement;
        }
    }
    return resultWorksMass;
}
// ----------------------------------------------------------------------------
function getWorksByCategoriesMass(categoriesMass) {
    // Запрашиваются все работы, чьи теги совпадают (хотябы одним тегом) с массивом 'categoriesMass'.
    // Функция возвращает массив worksMass (массив из структур workElement).
    //
    // Используются структуры (см. наверху): worksMass, workElement.
    var resultWorksMass = [];
    var data = getJsonData_worksIds();
    if (data !== false) {
        var worksIdsMass = [];
        for (var i in data.list) {
            var work = data.list[i];
            if (matchInTheArrays(categoriesMass, work.categories)) {
                worksIdsMass[worksIdsMass.length] = i;
            }
        }
        resultWorksMass = getWorksByIdsMass(worksIdsMass);
    }
    return resultWorksMass;
}
// ----------------------------------------------------------------------------
function matchInTheArrays(mass1, mass2) {
    var result = false;
    for (var i in mass1) {
        for (var j in mass2) {
            if (mass1[i] == mass2[j]) {
                result = true;
                return result;
            }
        }
    }
    return result;
}
// ----------------------------------------------------------------------------
function getPageNameById(id) {
    var result = "";
    var data = getJsonData_workDetailsById(id);
    if (data !== false) {
        try {
            result = data.work.name;
        } catch(err) {
            result = "";
            console.log("getter-works.js: getPageNameById(): cannot read id=[" + id + "]");
        }
    }
    return result;
}
// ----------------------------------------------------------------------------
function getPageUrlById(id) {
    var result = "";
    var data = getJsonData_workDetailsById(id);
    if (data !== false) {
        try {
            result = data.work.url;
        } catch(err) {
            result = "";
            console.log("getter-works.js: getPageUrlById(): cannot read id=[" + id + "]");
        }
    }
    return result;
}

// ----------------------------------------------------------------------------
function getTextBlock(id) {
    var result = "";
    var details = getJsonData_workDetailsById(id);
    if (details !== false && details.work["text_block"] != undefined) {
        try {
            result = fs.readFileSync(pathNode.join(__dirname, "../../../content/experience/works/" + id + "/" + details.work["text_block"]));
        } catch(err) {
            result = "";
        }
    }
    return result;
}
// ----------------------------------------------------------------------------
function getDefaultWorksIds() {
    var result = [];
    var json = getJsonData_worksIds();
    if (json !== false) {
        result = json["default_recommended"];
    }
    return result;
}
// ----------------------------------------------------------------------------
function getRecommendedWorksIdsById(id) {
    var result = [];
    var details = getJsonData_workDetailsById(id);
    if (details !== false && details.work["recommended_works"] != undefined) {
        try {
            result = details.work["recommended_works"];
        } catch(err) {
            result = [];
        }
    }
    return result;
}
// ----------------------------------------------------------------------------
function deleteDuplicates(mass) {
    var nMass = [];
    for (var i = 0; i < mass.length; i++) {
        var state = true;
        for (var nj = 0; nj < nMass.length; nj++) {
            if (nMass[nj] == mass[i]) {
                state = false;
            }
        }
        if (state) {
            nMass[nMass.length] = mass[i];
        }
    }
    return nMass;
}
// ----------------------------------------------------------------------------
function deleteId(mass, id) {
    for (var i = 0; i < mass.length; i++) {
        if (mass[i] == id) {
            mass.splice(i, 1);
            i = 0; // Обнуление, т.к. после удаления элемента (splice) не совсем корректно увеличивать значение итератора.
        }
    }
}
// ----------------------------------------------------------------------------
function getImagesByWorkId(id) {
    var result = {};
    var details = getJsonData_workDetailsById(id);
    if (details !== false) {
        if (details.work.images !== undefined) {
            var images = details.work.images;
            result["urlpart"] = details.work.url;
            result["title"] = details.work.name;
            result["fullscreen"] = images.fullscreen.dir;
            result["thumbnails"] = images.fullscreen.dir;

            var mass = [];
            var imgList = images.fullscreen.list;
            for (var i in imgList) {
                /*var thumb = images.thumbnails.list[i];
                if (thumb == undefined) {
                    thumb = ""
                }*/
                mass[mass.length] = imgList[i];
            }
            result["list"] = mass;
        }
    } else {
        console.log("getter-works.js: getImagesByWorkId(): id=[" + id + "]");
    }
    return result;
}
// ----------------------------------------------------------------------------
function getCategoriesMassByWorkId(id) {
    var result = [];
    var json = getJsonData_worksIds();
    var el = json.list[id];
    if (el !== undefined) {
        result = el.categories;
    }
    if (result == undefined) {
        result = [];
    }
    return result;
}
// ----------------------------------------------------------------------------
function getJsonData_worksIdsNew() {
    // Возвращается структура данных с идентификаторами всех выполненных работ, помеченных как новые.
    var file = pathNode.join(__dirname, "../../../content/experience/works-ids-new.json");
    return basic.getJsonData(file);
}
// ----------------------------------------------------------------------------
function getJsonData_worksIds() {
    // Возвращается структура данных с идентификаторами всех выполненных работ.
    var file = pathNode.join(__dirname, "../../../content/experience/works-ids.json");
    return basic.getJsonData(file);
}
// ----------------------------------------------------------------------------
function getJsonData_workDetailsById(workId) {
    // Возвращается структура данных с детализацией конкретной выполненной работы (workId).
    var file = pathNode.join(__dirname, "../../../content/experience/works/" + workId + "/work-details.json");
    return basic.getJsonData(file);
}
// ----------------------------------------------------------------------------
exports.getWorksByIdsMass = getWorksByIdsMass;
exports.getWorksByCategoriesMass = getWorksByCategoriesMass;
exports.getPageNameById = getPageNameById;
exports.getPageUrlById = getPageUrlById;
exports.getTextBlock = getTextBlock;
exports.getDefaultWorksIds = getDefaultWorksIds;
exports.getRecommendedWorksIdsById = getRecommendedWorksIdsById;
exports.deleteDuplicates = deleteDuplicates;
exports.deleteId = deleteId;
exports.getImagesByWorkId = getImagesByWorkId;
exports.getCategoriesMassByWorkId = getCategoriesMassByWorkId;
exports.getJsonData_worksIds = getJsonData_worksIds;
exports.getJsonData_worksIdsNew = getJsonData_worksIdsNew;
exports.getJsonData_workDetailsById = getJsonData_workDetailsById;
