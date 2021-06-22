/*
    Author: Victor Ivanov
    Created: 2016-05-02

    Программа-конвертер для преобразования выполненных работ из старого списка.

    experience/experience-works-old.json
    old-images-info.json

*/

var fs = require("fs");
const pathNode = require("path");
// ----------------------------------------------------------------------------
function convert() {

    // var result = {};

    var worksIds = getWorksIds();
    var worksOld = getWorksOld();
    var imagesInfo = getImagesInfo();

    var w = worksOld.works;
    for (var i in w) {
        if (findId(worksIds, w[i].id) == false) {

            var nId = w[i].id;
            var nM = w[i]["new_categories"];
            var nC = w[i].customer;

            worksIds[nId] = {
                customer: nC,
                categories: nM
            };

            //console.log("" + nId);
            var path = pathNode.join(__dirname, "../../../content/experience/works/");
            if (checkDirIsNotExist(path, nId)) {
                console.log("convert(): checkDirIsNotExist: " + nId);

                // Create Directory
                if (!fs.existsSync(path + nId)){
                    fs.mkdirSync(path + nId);
                }

                var img = imagesInfo["images-info"][i];
                if (img == undefined) {
                    console.log("img undefined: " + i);
                }
                var details = {
                    _id: nId,
                    work: {
                        url: i,
                        name: w[i].name,
                        images: img,
                        icon: "icon.jpg"
                    }
                };

                var data = JSON.stringify(details, null, 4);
                fs.writeFileSync(path + nId + "/work-details.json", data, "utf-8");
            }

            var data = JSON.stringify(worksIds, null, 4);
            fs.writeFileSync(pathNode.join(__dirname, "../../../content/experience/works-ids.json", data, "utf-8"));

        }
    }
}
// ----------------------------------------------------------------------------
function getWorksIds() {
    var json = false;
    var fName = "works-ids.json";
    try {
        json = JSON.parse(
            fs.readFileSync("../../../content/experience/" + fName)
        );
    } catch (err) {
        console.log("ERROR! Cannot open file: " + fName);
        json =  false;
    }
    if (json != false) {
        console.log("getWorksIds(): " + fName);
    }
    return json;
}
// ----------------------------------------------------------------------------
function getWorksOld() {
    var json = false;
    var fName = "experience-works-old.json";
    try {
        json = JSON.parse(
            fs.readFileSync("../../../content/experience/" + fName)
        );
    } catch (err) {
        console.log("ERROR! Cannot open file: " + fName);
        json =  false;
    }
    if (json != false) {
        console.log("getWorksOld(): " + fName);
    }
    return json
        ;
}
// ----------------------------------------------------------------------------
function getImagesInfo() {
    var json = false;
    var fName = "old-images-info.json";
    try {
        json = JSON.parse(
            fs.readFileSync("../../../content/experience/" + fName)
        );
    } catch (err) {
        console.log("ERROR! Cannot open file: " + fName);
        json =  false;
    }
    if (json != false) {
        console.log("getImagesInfo(): " + fName);
    }
    return json;
}
// ----------------------------------------------------------------------------
function findId(worksIds, id) {
    var result = false;
    var w = worksIds.list;
    for (var i in w) {
        if (i == id) {
            result = true;
        }
    }
    return result;
}
// ----------------------------------------------------------------------------
function checkDirIsNotExist(path, id) {
    var result = false;
    try {
        console.log("checkDirIsNotExist(): " + path + " " + id);
        // Query the entry
        stats = fs.lstatSync(path + id);
        if (stats.isDirectory() || stats.isFile()) {
            result = false;
        }
    }
    catch (e) {
        console.log("err");

        result = true;
    }
    return result;
}


convert();