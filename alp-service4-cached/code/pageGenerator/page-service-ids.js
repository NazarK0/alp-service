var fest = require("fest");
var fs = require("fs");

function getServiceIDsPage() {
    var file = "../templates/experiment-service-ids-content.xml";
    var json = {
        page: {
            title: "",
            h1: ""
        },
        mass : [],
        modes: {
            verification: false,
            counters: false
        }
    };
    json.page.title ="Dev: Service IDs";
    json.page.h1 = "Список всех доступных услуг (Service-IDs)";

    try {
        var mass = [];
        var j = JSON.parse(fs.readFileSync("../content/service-ids.json"));
        printElement(mass, j.list, j, "", 1);
        json.mass = mass;
    } catch (err) {
        console.log("ERROR! File content/service-ids.json loading error! " + err);
    }

    return fest.render(file, json); //fest.render(templateFile, JSON.parse(jsonData));
}

// ----------------------------------------------------------------------------

function printElement(result, jlist, element, tab, num) {
    if (element.id != "root") {
        //console.log("ddd " + jlist[element.id].name);

        var el = {
            num: num + ". ",
            tab: "" + tab + " ",
            id: element.id,
            name: "",
            url: "",
            short_name: "",
            icon: (jlist[element.id].icon !== "") ? "+" : "",
            state: "",
            "display": ""
        };

        try {
            el.name = jlist[element.id].name;
        } catch (err) {
            el.name = "ERR";
        } try {
            el.url = jlist[element.id].url;
        } catch (err) {
            el.url = "ERR";
        } try {
            el.short_name = jlist[element.id].short;
        } catch (err) {
            el.short_name = "ERR";
        } try {
            el.state = (jlist[element.id].state == "enable") ? "ON" :
                (jlist[element.id].state == "disable") ? "X" : "ERR";
        } catch (err) {
            el.state = "disable";
        } try {
            for (var j in jlist[element.id].display) {
                el.display += jlist[element.id].display[j] + " ";
            }
        } catch (err) {
            el.display = "ERR";
        }

        result[result.length] = el;

        //console.log("[" + tab + "]");
        num += ".";
    } else {
        num = "";
    }
    for (key in element.children) {
        printElement(result, jlist, element.children[key], tab + " ** ", num + (parseInt(key) + 1))
    }
}

// ----------------------------------------------------------------------------

exports.getServiceIDsPage = getServiceIDsPage;