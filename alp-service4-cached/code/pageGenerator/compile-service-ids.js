/*
    Author: Victor Ivanov <victorivanov.spb@gmail.com>
    Created: 2016-04-26

    Предварительная обработка данных в ключевом файле 'content/service-ids.json'
 */

var fs = require("fs");
const pathNode = require("path");
// ----------------------------------------------------------------------------
function compileParents() {
    var file = pathNode.join(__dirname, "../content/service-ids.json");
    try {
        var jsonServiceIds = JSON.parse(
            fs.readFileSync(file)
        );
    } catch (err) {
        console.log("compile-service-ids.js: compileParents(): ERROR! Cannot open file: " + file);
        return false;
    }

    var parents = [];
    calcParents(jsonServiceIds, jsonServiceIds, parents);
    var fName = pathNode.join(__dirname, "../content/service-ids-compiled.json");
    fs.writeFileSync(fName, JSON.stringify(jsonServiceIds, null, 4));
    return true;
}
// ----------------------------------------------------------------------------
function compileChildren() {
    var file = "../content/service-ids-compiled.json";
    try {
        var jsonServiceIds = JSON.parse(
            fs.readFileSync(file)
        );
    } catch (err) {
        console.log("compile-service-ids.js: compileChildren(): ERROR! Cannot open file: " + file);
        return false;
    }

    calcChildren(jsonServiceIds, jsonServiceIds);
    var fName = "../content/service-ids-compiled.json";
    fs.writeFileSync(fName, JSON.stringify(jsonServiceIds, null, 4));
    return true;
}
// ----------------------------------------------------------------------------
function calcParents(jsonData, curr, parents) {
    jsonData.list[curr.id]["_parents"] = parents.slice(0); // массив клонируется
    //console.log(parents.length + " " + parents);
    parents[parents.length] = curr.id;
    for (var i in curr.children) {
        calcParents(jsonData, curr.children[i], parents);
    }
    parents.pop();
}
// ----------------------------------------------------------------------------
function calcChildren(jsonData, curr)
{
    var children = [];
    for (var i in curr.children) {
        children[children.length] = curr.children[i].id;
    }
    jsonData.list[curr.id]["_children"] = children.slice(0);

    for (var i in curr.children) {
        calcChildren(jsonData, curr.children[i]);
    }
}
// ----------------------------------------------------------------------------
// Выполнение сборки/компиляции данных.
function initCompilers() {
    var result = 0;
    if (compileParents() == false) {
        result++;
    }
    if (compileChildren() == false) {
        result++;
   }
    return result;
}
// ----------------------------------------------------------------------------
exports.initCompilers = initCompilers;
//exports.compileChildren = compileChildren;