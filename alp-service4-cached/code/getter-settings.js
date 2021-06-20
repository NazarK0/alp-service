/*
    Author: Victor Ivanov
    Created: 2016-05-11


    jsonSettings = {
        server : {
            port: 80
        },
        modes : {
            verification: true
            counters: true
        }
    }

*/
var fs = require("fs");
const pathNode = require('path');
var JS_FILE = pathNode.join(__dirname, "getter-settings.js");
var CONF_FILE = pathNode.join(__dirname, "../code-settings/main.json");


// ----------------------------------------------------------------------------
function getSettings(profile) {
    // Функция возвращает JSON-данные профиля с именем в переменной-параметре profile.
    var result = {
        state: false,
        stateComment: "",
        data: {}
    };
    var settings = getEmptySettings();


    var j = getJsonData(CONF_FILE);
    if (j !== false) {
        //console.log("----" + profile);
        var jProfileData = j.profiles[profile];
        if (jProfileData !== undefined) {
            var dataErrors = [];
            // Сбор данных осуществляется "блоками", названия которых записываются в список list.
            // Алгоритм для каждого блока един:
            //   1. По имени запрашивается JSON-подструктура;
            //   2. Функцией getCheckData проверятся содержимое;
            //   3. Если обнаружена ошибка, то записывается в массив dataErrors (для последующей обработки)
            //   4. После прохождения всего списка list начинается обработка массива dataErrors...
            var list = ["server", "modes"];
            for (var i in list) {
                var el = list[i];
                var d = getCheckedData(el, jProfileData);
                if (d !== false) {
                    settings[el] = d;
                } else {
                    dataErrors[dataErrors.length] = el;
                }
            }
            if (dataErrors.length == 0) {
                result.data = settings; // JSON-данные передаются дальше только при нуле ошибок.
                result.state = true;
                result.stateComment = "ok";
            } else {
                result.state = false;
                result.stateComment = "profile data error: "; //'web-server'";
                for (var i in dataErrors) {
                    result.stateComment += "[" + dataErrors[i] + "] ";
                }
            }
        } else {
            result.stateComment = "no profile data";
        }

    } else {
        //console.log(JS_FILE + "getSettings(profile): Error! Cannot read settings file.")
        result.stateComment = "no file";
    }
    return result;
}
// ----------------------------------------------------------------------------
function getCurrentProfileSettings() {
    // Функция возвращает JSON-данные текущего профиля ('current-profile').
    var currProfile = getCurrentProfileName();
    return getSettings(currProfile);
}
// ----------------------------------------------------------------------------
function getCheckedData(name, json) {
    var result = false;
    var j = json[name];
    if (j !== undefined) {
        switch (name) {
            case "server":
                if (typeof j.port === "number" && j.port > 1) {
                    result = j;
                }
                break;
            case "modes":
                if (typeof j.verification === "boolean" && typeof j.counters === "boolean") {
                    result = j;
                }
                break;
            default:
                result = false;
        }
    }
    return result;
}
// ----------------------------------------------------------------------------
function setProfileName(name) {
    var result = false;
    var j = getJsonData(CONF_FILE);
    if (j !== false) {
        if (j.profiles[name] !== undefined) {
            j.settings["current-profile"] = name;
            fs.writeFileSync(CONF_FILE, JSON.stringify(j, null, 4));
            result = true;
        }
    }
    return result;
}
// ----------------------------------------------------------------------------
function getCurrentProfileName() {
    var result = undefined;
    var j = getJsonData(CONF_FILE);
    if (j !== false) {
        result = j.settings["current-profile"];
    }
    return result;
}
// ----------------------------------------------------------------------------
function getJsonData(file) {
    var result = false;
    try {
        result = JSON.parse(
            fs.readFileSync(file)
        );
    } catch (err) {
        console.log(JS_FILE + " getJsonFile(): ERROR! Cannot open file: '" + file + "'");
        result = false;
    }
    return result; // Если возвращется тип boolean, то функция завершилась с ошибкой.
}
// ----------------------------------------------------------------------------
function getEmptySettings() {
    return {
        server: {
            port: undefined
        },
        modes: {
            verification: undefined,
            counters: undefined
        }
    };
}
// ----------------------------------------------------------------------------
exports.getSettings = getSettings;
exports.getCurrentProfileSettings = getCurrentProfileSettings;
exports.setProfileName = setProfileName;

/*
var r = getSettings();
console.log(JS_FILE + " " + r);
*/