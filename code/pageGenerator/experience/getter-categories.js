/*
    Author: Victor Ivanov
    Created: 2016-04-26

    Программа позволяет обращаться к данным идентификаторов всех услуг (service ids) в JSON-файле 'content/service-ids.json'.

    Схематическое представление формируемых структур: resultMass, elementMassForBlock, childrenMass, element.
    1. resultMass = [block, block, ...]
    2. block = {categoryName, childrenMass}
    3. childrenMass = [element, element, ...]
    4. element = {
        url: "/experience/url", (NB: with '/experience')
        title: "Title",
        class: (categoryChildrenMass[i] == markedChildName) ? "marked" : "",
        name: "Name"
    }



 */

var fs = require("fs");
const pathNode = require('path');
var basic = require("./getter-basic.js");
// ----------------------------------------------------------------------------
function getBlockForRootPage(markedId) {
    //
    // Используются структуры (см. наверху): resultMass, block, childrenMass, element.
    var resultMass = [];
    var data = getJsonData_serviceIds();
    if (data !== false) {
        var rcIds = getRootCategoriesIds(data);
        var block = {
            category: data.list.root.name,
            children: getBlockChildren(data, rcIds, markedId)
        };
        resultMass[resultMass.length] = block;
    }
    return resultMass;
}
// ----------------------------------------------------------------------------
function getBlockForPage(id, markedId) {
    //
    //
    var block = {};
    var data = getJsonData_serviceIds();
    if (data !== false) {
        var mass = data.list[id]["_children"];
        //console.log("gbfp " + mass);
        block = {
            category: data.list[id].name,
            children: getBlockChildren(data, mass, markedId)
        };
    }
    return block;
}
// ----------------------------------------------------------------------------
function getBlocksForPageById(id) {
    //
    //
    var resultMass = [];
    var data = getJsonData_serviceIds();
    var block;
    if (data !== false) {
        var ch = data.list[id]["_parents"];
        //console.log(id + " " + ch);
        for (var i = 0; i < ch.length; i++) {
            var m = ch[i + 1];
            //console.log(typeof m);
            if (typeof m == "undefined") { //!!!!!!!!!!!!
                m = id;
            }

            if (ch[i] == "root") {
                var b = getBlockForRootPage(m);
                block = b[0];
            } else {
                if (data.list[ch[i]].state == "enable") {
                    block = getBlockForPage(ch[i], m);
                }
            }
            resultMass[resultMass.length] = block;
        }
        ch = data.list[id]["_children"];
        if (ch.length > 0) {
            if (checkChildrenIsEnabled(data, id)) { //data.list[id].state == "enable") {
                block = getBlockForPage(id, "");
                resultMass[resultMass.length] = block;
            }
        }

    }
    return resultMass;
}
// ----------------------------------------------------------------------------
function checkChildrenIsEnabled(data, id) {

    var result = false;
    var ch = data.list[id]["_children"];
    //console.log("check " + id + " " + ch);
    for (var i in ch) {
        //console.log("check " + data.list[ch[i]].name + " " + data.list[ch[i]].state);
        if (data.list[ch[i]].state == "enable") {
            result = true;
        }
    }
    //console.log("CHECK=" + result + " " + id + " " + ch);
    return result;
}
// ----------------------------------------------------------------------------
function getCategoriesForRootPage() {
    //
    //
    var result = [];
    var data = getJsonData_serviceIds();
    if (data !== false) {
        result = getRootCategoriesIds(data);
    }
    return result;
}
// ----------------------------------------------------------------------------
function getCategoriesBreadcrumbs(id) {
    var result = [];
    var data = getJsonData_serviceIds();
    if (data !== false) {
        var parents = data.list[id]["_parents"];
        for (var i in parents) {
            //console.log("_" + parents[i]);
            result[result.length] = {
                name: data.list[parents[i]].name,
                url: data.list[parents[i]].url
            };
        }
        result[result.length] = {
            name: data.list[id].name,
            url: data.list[id].url
        };
    }
    //console.log(result);
    return result;
}
// ----------------------------------------------------------------------------
function getPageNameById(id) {
    var result = "";
    var data = getJsonData_serviceIds();
    if (data !== false) {
        try {
            result = data.list[id].name;
        } catch(err) {
            result = "";
            console.log("getter-categories.js: getPageNameById(): cannot read id=[" + id + "]");
        }
    }
    return result;
}
// ----------------------------------------------------------------------------
function getRootCategoriesIds(data) {
    var resultIds = [];
    if (data.id == "root") {
        for (var i in data.children) {
            resultIds[resultIds.length] = data.children[i].id;
        }
    }
    return resultIds;
}
// ----------------------------------------------------------------------------
function getBlockChildren(data, categories, markedId) {
    var b = [];
    for (var i in categories) {
        var c = data.list[categories[i]];
        if (c !== undefined) {
            //console.log("gbc " + c.name + " " + c.state);
            if (c.state == "enable") {
                b[b.length] = {
                    url: "/experience/" + c.url,
                    title: c.name,
                    class: (categories[i] == markedId) ? "marked" : "",
                    name: c.name
                };
            }
        } else {
            console.log("getter-categories.js: getBlockChildren(): undefined category with id=[" + categories[i] + "]");
        }
    }
    return b;
}
// ----------------------------------------------------------------------------
function getPageUrlPartById(id) {
    var result = "";
    var json = getJsonData_serviceIds();
    if (json != false) {
        result = json.list[id].url;
    }
    return result;
}
// ----------------------------------------------------------------------------
// Функции "заплатки":
//   - getPageUrlPartById_onlyRoot()
//   - getRootUrlPartById()
//   - checkId()
// Подробности: см. в файле 'readme.txt' (2016-05-09/2016-05-10)
function getPageUrlPartById_onlyRoots(id) {
    var result1 = getRootUrlPartById(id);
    var result2 = getPageUrlPartById(id);
    if (result1 == result2) {
        result2 = "";
    } else {
        result2 = "#" + result2;
    }
    return result1 + result2;
}
function getRootUrlPartById(id) {
    var json = getJsonData_serviceIds();
    if (json != false) {
        var parents = json.list["root"]["_children"];
        parents = parents.concat(json.list["clean"]["_children"]);
        //console.log(parents);

        var last = "root";
        var mass = json.list[id]["_parents"];
        mass[mass.length] = id;
        for (var i in mass) {
            if (checkId(parents, mass[i])) {
                last = mass[i];
            }
        }
        return json.list[last].url;
    }
    console.log("getter-categories.js: getRootUrlPartById(): Error!");
    return "";
}
function checkId(mass, id) {
    var result = false;
    for (var i in mass) {
        if (mass[i] == id) {
            result = true;
        }
    }
    return result;
}
// ----------------------------------------------------------------------------
function getCategoryChildren(id) {
    // result = massive [ el1, el2, ... ]
    // el1 = { name: "", description: "" }

    var result = [];
    var json = getJsonData_serviceIds();
    if (json != false) {
        var massIds = json.list[id]["_children"];
        for (var i in massIds) {
            var el = {
                name: json.list[massIds[i]].name,
                description: json.list[massIds[i]].name
            };
            result[result.length] = el;
        }
    }
    return result;
}
// ----------------------------------------------------------------------------
function getJsonData_serviceIds() {
    // Возвращается структура данных со всеми идентификаторами предоставляемых услуг.
    var file = pathNode.join(__dirname, "../../../content/service-ids-compiled.json");
    return basic.getJsonData(file);
}
// ----------------------------------------------------------------------------
exports.getBlockForRootPage = getBlockForRootPage;
exports.getJsonData_serviceIds = getJsonData_serviceIds;
exports.getCategoriesForRootPage = getCategoriesForRootPage;
exports.getCategoriesBreadcrumbs = getCategoriesBreadcrumbs;
exports.getPageNameById = getPageNameById;
exports.getBlocksForPageById = getBlocksForPageById;
exports.getPageUrlPartById = getPageUrlPartById;
exports.getPageUrlPartById_onlyRoots = getPageUrlPartById_onlyRoots;
exports.getCategoryChildren = getCategoryChildren;