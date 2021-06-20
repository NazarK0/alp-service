var JS_FILE = "getter-settings.js";

var fs = require("fs");
const pathNode = require("path");
var settings = require("../getter-settings.js");
// ----------------------------------------------------------------------------
function getBasicStruct() {
    var s = getEmptyStruct();

    // Добавление пунктов главного меню сайта.
    try {
        var jsonData = fs.readFileSync(pathNode.join(__dirname, "../../content/navigation.json"));
        var json = JSON.parse(jsonData);
        for (key in json.menu) {
            s.navigation.menu[key] = {};
            s.navigation.menu[key].url = json.menu[key].url;
            s.navigation.menu[key].name = json.menu[key].name;
            s.navigation.menu[key].title = json.menu[key].title;
        }
    } catch (err) {
        console.log(JS_FILE + "Error! File content/navigation.json loading error! " + err);
    }

    // Считывание данных основных настроек: 'main.json'.
    var ms = settings.getCurrentProfileSettings();
    if (ms.state) {
        s.modes.verification = ms.data.modes.verification;
        s.modes.counters = ms.data.modes.counters;
        //console.log(JS_FILE + " getBasicStruct(): " + s.modes);
    }

    return s;
}
// ----------------------------------------------------------------------------
function getEmptyStruct() {
    return {
        page: {
            title: "",
            h1: ""
        },
        navigation: {
            menu: {
                "main" : "/"
            }
        },
        modes: {
            verification: true,
            counters: true
        }
    };
}
// ----------------------------------------------------------------------------
exports.getBasicStruct = getBasicStruct;