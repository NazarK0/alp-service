fs = require("fs")
const pathNode = require('path');

function getBasicStruct() {
    var mass = {
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

    // Добавление пунктов главного меню сайта.
    try {
        var jsonData = fs.readFileSync(pathNode.join(__dirname, "../../content/navigation.json"));
        var json = JSON.parse(jsonData);
        for (key in json.menu) {
            mass.navigation.menu[key] = {};
            mass.navigation.menu[key].url = json.menu[key].url;
            mass.navigation.menu[key].name = json.menu[key].name;
            mass.navigation.menu[key].title = json.menu[key].title;
        }
    } catch (err) {
        console.log("ERROR! File content/navigation.json loading error! " + err);
    }

    // Добавление таблицы с навигацией на главной странице сайта.
    try {
        var jsonData = fs.readFileSync(pathNode.join(__dirname,"../content/navtable.json"));
        var json = JSON.parse(jsonData);
        mass["navtable"] = json.navtable;
        //console.log(mass.navtable);
    } catch (err) {
        console.log("ERROR! File content/navtable.json loading error! " + err);
    }

    return mass;
}

exports.getBasicStruct = getBasicStruct;